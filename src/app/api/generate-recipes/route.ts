import { NextResponse } from 'next/server';
import { validateRecipeNutrition } from '@/lib/nutrition-validator';
import { lookupNutrition } from '@/lib/nutrition-db';
import type { FoodItem, Recipe } from '@/types';

// ─── Tipos compartidos ────────────────────────────────────────────────────────
interface AIRecipeRaw {
  title: string;
  description: string;
  ingredients: { item: string; amount: string; amount_g?: number }[];
  instructions: string[];
  servings: number;
  prep_time_min: number;
}

// ─── Prompt unificado ─────────────────────────────────────────────────────────
function buildPrompt(foodItems: FoodItem[]): string {
  const ingredientsList = foodItems
    .map(f => {
      const bedca = lookupNutrition(f.name);
      const nutInfo = bedca
        ? ` [BEDCA: ${bedca.calories_per_100g}kcal, ${bedca.protein_g}g prot, ${bedca.carbs_g}g carbs, ${bedca.fat_g}g grasa por 100g — ${bedca.nutritional_class}]`
        : '';
      return `- ${f.name}: ${f.quantity_kg}kg (caduca: ${f.expiry_date})${nutInfo}`;
    })
    .join('\n');

  return `Eres un nutricionista experto trabajando para una ONG de seguridad alimentaria en España.
Con los siguientes excedentes alimentarios disponibles, genera EXACTAMENTE 3 recetas equilibradas en formato JSON.

EXCEDENTES DISPONIBLES (con datos nutricionales verificados de BEDCA):
${ingredientsList}

REGLAS:
- Prioriza alimentos próximos a caducar
- Cada receta debe ser nutricionalmente equilibrada (proteínas + carbohidratos + verduras)
- Porciones para 4 personas
- Instrucciones simples y claras, cocina española tradicional
- Nombre en español
- Para cada ingrediente incluye amount_g (peso en gramos exacto que se usa)
- Los valores nutricionales que generes serán RECALCULADOS con BEDCA, no los uses directamente

Responde ÚNICAMENTE con este JSON válido (sin texto adicional, sin markdown):
{
  "recipes": [
    {
      "title": "Nombre del plato",
      "description": "Descripción breve y apetecible (1-2 frases)",
      "ingredients": [{"item": "Nombre exacto", "amount": "cantidad con unidad", "amount_g": 200}],
      "instructions": ["paso 1", "paso 2", "paso 3", "paso 4", "paso 5"],
      "servings": 4,
      "prep_time_min": 35
    }
  ]
}`;
}

// ─── Helpers para calcular macros con fallback al nutritional_value del CSV ───
function calcNutritionForIngredient(
  name: string,
  amount_g: number,
  fallbackMap: Map<string, FoodItem['nutritional_value']>
): { cal: number; prot: number; carbs: number; fat: number } {
  // 1. Intentar lookup BEDCA
  const bedca = lookupNutrition(name);
  if (bedca) {
    const f = amount_g / 100;
    return {
      cal: Math.round(bedca.calories_per_100g * f),
      prot: Math.round(bedca.protein_g * f * 10) / 10,
      carbs: Math.round(bedca.carbs_g * f * 10) / 10,
      fat: Math.round(bedca.fat_g * f * 10) / 10,
    };
  }
  // 2. Fallback: nutritional_value del CSV
  const csv = fallbackMap.get(name.toLowerCase());
  if (csv) {
    const f = amount_g / 100;
    return {
      cal: Math.round(csv.calories_per_100g * f),
      prot: Math.round((csv.protein_g ?? 0) * f * 10) / 10,
      carbs: Math.round((csv.carbs_g ?? 0) * f * 10) / 10,
      fat: Math.round((csv.fat_g ?? 0) * f * 10) / 10,
    };
  }
  return { cal: 0, prot: 0, carbs: 0, fat: 0 };
}

function calcRecipeNutrition(
  ingredients: { item: string; amount_g: number }[],
  servings: number,
  fallbackMap: Map<string, FoodItem['nutritional_value']>
) {
  let totalCal = 0, totalProt = 0, totalCarbs = 0, totalFat = 0, matched = 0;
  for (const ing of ingredients) {
    const n = calcNutritionForIngredient(ing.item, ing.amount_g, fallbackMap);
    if (n.cal > 0) matched++;
    totalCal += n.cal;
    totalProt += n.prot;
    totalCarbs += n.carbs;
    totalFat += n.fat;
  }
  const perServing = {
    calories: Math.round(totalCal / servings),
    protein_g: Math.round((totalProt / servings) * 10) / 10,
    carbs_g: Math.round((totalCarbs / servings) * 10) / 10,
    fat_g: Math.round((totalFat / servings) * 10) / 10,
    fiber_g: 0,
  };
  const is_balanced =
    perServing.protein_g >= 15 && perServing.carbs_g >= 30 &&
    perServing.fat_g >= 5 && perServing.fat_g <= 30 &&
    perServing.calories >= 200 && perServing.calories <= 700;
  return {
    ...perServing,
    is_balanced,
    validated: matched > 0,
    validation_source: matched > 0
      ? `${matched}/${ingredients.length} ingredientes verificados con BEDCA/inventario`
      : 'No se pudieron calcular macros',
  };
}

// ─── Mock (sin API key) ───────────────────────────────────────────────────────
function buildMockRecipes(foodItems: FoodItem[]): Recipe[] {
  const now = new Date().toISOString();
  const availableUntil = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

  // Mapa de fallback nutrición → para productos del CSV sin match BEDCA
  const fallbackMap = new Map<string, FoodItem['nutritional_value']>();
  for (const f of foodItems) {
    if (f.nutritional_value) fallbackMap.set(f.name.toLowerCase(), f.nutritional_value);
  }

  // Seleccionar mejores ingredientes para cada receta (variar combinaciones)
  const proteinas = foodItems.filter(f => f.category === 'proteina').slice(0, 2);
  const cereales = foodItems.filter(f => f.category === 'cereal').slice(0, 2);
  const verduras = foodItems.filter(f => f.category === 'verdura').slice(0, 3);
  const otros = foodItems.filter(f => !['proteina','cereal','verdura'].includes(f.category)).slice(0, 2);
  const pool = [...proteinas, ...cereales, ...verduras, ...otros];
  const all = pool.length >= 4 ? pool : foodItems.slice(0, 10);

  const toIng = (items: FoodItem[], factor: number) =>
    items.map(f => ({
      item: f.name,
      amount: `${Math.min(Math.round(f.quantity_kg * factor * 10), 350)}g`,
      amount_g: Math.min(Math.round(f.quantity_kg * factor * 10), 350),
    }));

  const mocks: AIRecipeRaw[] = [
    {
      title: 'Guiso de Legumbres y Verduras',
      description: 'Plato tradicional español rico en proteínas vegetales y fibra. Perfecto para familias numerosas.',
      ingredients: toIng(all.slice(0, 4), 8),
      instructions: [
        'Lavar y trocear todas las verduras en dados medianos.',
        'Sofreír la cebolla y el ajo en aceite de oliva hasta que estén dorados.',
        'Añadir el resto de verduras y saltear 5 minutos a fuego medio.',
        'Incorporar las legumbres y cubrir con agua o caldo. Cocinar 25 minutos.',
        'Salpimentar al gusto y servir caliente.',
      ],
      servings: 4,
      prep_time_min: 35,
    },
    {
      title: 'Arroz con Proteína y Verduras de Temporada',
      description: 'Receta equilibrada y nutritiva adaptada a los excedentes disponibles.',
      ingredients: toIng(all.slice(1, 6), 6),
      instructions: [
        'Cortar todos los ingredientes en trozos regulares.',
        'Dorar la proteína principal en aceite de oliva 8 minutos.',
        'Añadir las verduras y rehogar otros 5 minutos.',
        'Incorporar el arroz, remover bien y cubrir con el doble de agua.',
        'Cocinar a fuego medio-bajo 18 minutos. Reposar 5 minutos antes de servir.',
      ],
      servings: 4,
      prep_time_min: 40,
    },
    {
      title: 'Pasta Mediterránea con Salsa y Proteína',
      description: 'Plato rápido y completo, ideal para cocinas comunitarias con poco tiempo.',
      ingredients: toIng(all.slice(0, 5), 7),
      instructions: [
        'Cocer la pasta en abundante agua con sal según instrucciones.',
        'En paralelo, sofreír el tomate con un chorrito de aceite de oliva.',
        'Añadir la proteína elegida y las verduras troceadas finas.',
        'Escurrir la pasta y mezclar con la salsa.',
        'Servir inmediatamente con un toque de aceite de oliva virgen extra.',
      ],
      servings: 4,
      prep_time_min: 25,
    },
  ];

  return mocks.map((r, i) => {
    const ings = r.ingredients.map(ing => ({ item: ing.item, amount_g: ing.amount_g ?? 150 }));
    const nutrition = calcRecipeNutrition(ings, r.servings, fallbackMap);
    return {
      ...r,
      id: `mock-${Date.now()}-${i}`,
      nutritional_summary: nutrition,
      dietary_tags: ['sin_frutos_secos'] as const,
      available_until: availableUntil,
      reservations_count: 0,
      max_reservations: 10,
      generated_at: now,
      is_active: true,
    };
  });
}

// ─── Normalizar raw recipes → Recipe[] con macros BEDCA ──────────────────────
function normalizeRecipes(rawRecipes: AIRecipeRaw[]): Recipe[] {
  const now = new Date().toISOString();
  const availableUntil = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  return rawRecipes.map((r, i) => {
    const validated = validateRecipeNutrition(r.ingredients, r.servings || 4);
    return {
      ...r,
      id: `r-${Date.now()}-${i}`,
      nutritional_summary: {
        calories: validated.calories,
        protein_g: validated.protein_g,
        carbs_g: validated.carbs_g,
        fat_g: validated.fat_g,
        fiber_g: validated.fiber_g,
        is_balanced: validated.is_balanced,
        validated: validated.validated,
        validation_source: validated.validation_source,
      },
      dietary_tags: ['sin_frutos_secos'] as const,
      available_until: availableUntil,
      reservations_count: 0,
      max_reservations: 10,
      generated_at: now,
      is_active: true,
    };
  });
}

// ─── Provider: Gemini ─────────────────────────────────────────────────────────
async function callGemini(foodItems: FoodItem[]): Promise<AIRecipeRaw[]> {
  let GoogleGenerativeAI: any;
  try {
    const mod = await import('@google/generative-ai');
    GoogleGenerativeAI = mod.GoogleGenerativeAI;
  } catch {
    throw new Error('SDK @google/generative-ai no instalado — ejecuta npm install');
  }

  const apiKey = process.env.GOOGLE_API_KEY!;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
  });

  const result = await model.generateContent(buildPrompt(foodItems));
  const text = result.response.text();
  // Limpiar posibles bloques de markdown que Gemini a veces incluye
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(clean);
  return parsed.recipes ?? [];
}

// ─── Provider: OpenAI ─────────────────────────────────────────────────────────
async function callOpenAI(foodItems: FoodItem[]): Promise<AIRecipeRaw[]> {
  const OpenAI = (await import('openai')).default;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: buildPrompt(foodItems) }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });
  const content = completion.choices[0].message.content;
  if (!content) throw new Error('Empty response from OpenAI');
  return JSON.parse(content).recipes ?? [];
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  // Leer el body UNA SOLA VEZ — si se lee dos veces Next.js devuelve error
  let foodItems: FoodItem[] = [];

  try {
    const body = await request.json();
    foodItems = body.foodItems ?? [];
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!foodItems.length) {
    return NextResponse.json({ error: 'No food items provided' }, { status: 400 });
  }

  try {
    // Selector de proveedor: Gemini → OpenAI → Mock
    const hasGemini = !!process.env.GOOGLE_API_KEY;
    const hasOpenAI = !!process.env.OPENAI_API_KEY;

    if (!hasGemini && !hasOpenAI) {
      // Sin API key → 3 recetas mock validadas con BEDCA
      return NextResponse.json({
        recipes: buildMockRecipes(foodItems),
        demo: true,
        provider: 'mock',
      });
    }

    let rawRecipes: AIRecipeRaw[];
    let provider: string;

    if (hasGemini) {
      rawRecipes = await callGemini(foodItems);
      provider = 'gemini-1.5-flash';
    } else {
      rawRecipes = await callOpenAI(foodItems);
      provider = 'gpt-4o-mini';
    }

    const recipes = normalizeRecipes(rawRecipes);
    return NextResponse.json({ recipes, demo: false, provider });

  } catch (err) {
    console.error('Error generating recipes:', err);
    // Si la llamada a la IA falla → fallback a mock con los foodItems ya leídos
    return NextResponse.json({
      recipes: buildMockRecipes(foodItems),
      demo: true,
      provider: 'mock-fallback',
      warning: 'IA temporalmente no disponible — usando recetas de demostración validadas con BEDCA',
    });
  }
}
