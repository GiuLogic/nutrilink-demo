/**
 * Wrapper para Google Gemini API
 * Usa @google/generative-ai (SDK oficial)
 * Env var requerida: GOOGLE_API_KEY
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { lookupNutrition } from '@/lib/nutrition-db';
import type { FoodItem } from '@/types';

export interface AIRecipeRaw {
  title: string;
  description: string;
  ingredients: { item: string; amount: string; amount_g?: number }[];
  instructions: string[];
  servings: number;
  prep_time_min: number;
}

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
- Los valores nutricionales que generes serán RECALCULADOS con BEDCA, así que sé preciso con las cantidades

Responde ÚNICAMENTE con este JSON válido (sin texto adicional, sin markdown):
{
  "recipes": [
    {
      "title": "Nombre del plato",
      "description": "Descripción breve y apetecible (1-2 frases)",
      "ingredients": [{"item": "Nombre exacto", "amount": "cantidad con unidad", "amount_g": número_en_gramos}],
      "instructions": ["paso 1", "paso 2", "paso 3", "paso 4", "paso 5"],
      "servings": 4,
      "prep_time_min": número
    }
  ]
}`;
}

export async function generateWithGemini(foodItems: FoodItem[]): Promise<AIRecipeRaw[]> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_API_KEY not set');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });

  const result = await model.generateContent(buildPrompt(foodItems));
  const text = result.response.text();

  // Limpiar posibles bloques de markdown que Gemini a veces añade
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(clean);
  return parsed.recipes ?? [];
}

export function isGeminiAvailable(): boolean {
  return !!process.env.GOOGLE_API_KEY;
}
