/**
 * Validador nutricional — Recalcula macros de recetas usando datos BEDCA reales
 * En vez de confiar en los valores que genera el LLM, cruzamos ingredientes
 * con la base de datos española oficial de composición alimentaria.
 */

import { lookupNutrition, BEDCA_SOURCE } from './nutrition-db';

interface IngredientInput {
  item: string;
  amount: string;
  amount_g?: number;
  /** Datos nutricionales pre-calculados (del CSV) como fallback si no hay match BEDCA */
  nutrition_hint?: {
    calories_per_100g: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
}

/** Mapa nombre→nutrición para usar cuando no hay match BEDCA */
export type NutritionFallbackMap = Map<string, {
  calories_per_100g: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}>;

interface ValidatedNutrition {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  is_balanced: boolean;
  validated: boolean;
  validation_source: string;
  per_ingredient: {
    item: string;
    matched_bedca: string | null;
    amount_g: number;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  }[];
}

/**
 * Extrae gramos de un string de cantidad (ej: "400g", "1.5 kg", "200 ml")
 */
function parseAmountToGrams(amount: string): number {
  const normalized = amount.toLowerCase().trim();

  // "400g" or "400 g"
  const gMatch = normalized.match(/([\d.,]+)\s*g(?:r|ramos)?/);
  if (gMatch) return parseFloat(gMatch[1].replace(',', '.'));

  // "1.5 kg" or "1.5kg"
  const kgMatch = normalized.match(/([\d.,]+)\s*kg/);
  if (kgMatch) return parseFloat(kgMatch[1].replace(',', '.')) * 1000;

  // "200 ml" (approximate as grams for liquids)
  const mlMatch = normalized.match(/([\d.,]+)\s*ml/);
  if (mlMatch) return parseFloat(mlMatch[1].replace(',', '.'));

  // "1 L" or "1 litro"
  const lMatch = normalized.match(/([\d.,]+)\s*l(?:itro)?s?/);
  if (lMatch) return parseFloat(lMatch[1].replace(',', '.')) * 1000;

  // "2 unidades" or "3 piezas" — estimate 150g per unit
  const unitMatch = normalized.match(/([\d.,]+)\s*(?:unidad|pieza|und)/);
  if (unitMatch) return parseFloat(unitMatch[1].replace(',', '.')) * 150;

  // "1 cucharada" ~15g, "1 cucharadita" ~5g
  if (normalized.includes('cucharadita')) return 5;
  if (normalized.includes('cucharada')) return 15;

  // "al gusto", "una pizca" — negligible
  if (normalized.includes('gusto') || normalized.includes('pizca')) return 2;

  // Just a number — assume grams
  const numMatch = normalized.match(/([\d.,]+)/);
  if (numMatch) return parseFloat(numMatch[1].replace(',', '.'));

  return 100; // fallback
}

/**
 * Valida y recalcula la información nutricional de una receta usando BEDCA
 */
export function validateRecipeNutrition(
  ingredients: IngredientInput[],
  servings: number
): ValidatedNutrition {
  let totalCal = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let matchedCount = 0;

  const perIngredient = ingredients.map(ing => {
    const bedca = lookupNutrition(ing.item);
    const amount_g = ing.amount_g ?? parseAmountToGrams(ing.amount);

    if (bedca) {
      matchedCount++;
      const factor = amount_g / 100;
      const cal = Math.round(bedca.calories_per_100g * factor);
      const prot = Math.round(bedca.protein_g * factor * 10) / 10;
      const carbs = Math.round(bedca.carbs_g * factor * 10) / 10;
      const fat = Math.round(bedca.fat_g * factor * 10) / 10;
      const fiber = Math.round(bedca.fiber_g * factor * 10) / 10;

      totalCal += cal;
      totalProtein += prot;
      totalCarbs += carbs;
      totalFat += fat;
      totalFiber += fiber;

      return {
        item: ing.item,
        matched_bedca: bedca.name,
        amount_g,
        calories: cal,
        protein_g: prot,
        carbs_g: carbs,
        fat_g: fat,
      };
    }

    return {
      item: ing.item,
      matched_bedca: null,
      amount_g,
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
    };
  });

  // Per serving
  const perServing = {
    calories: Math.round(totalCal / servings),
    protein_g: Math.round((totalProtein / servings) * 10) / 10,
    carbs_g: Math.round((totalCarbs / servings) * 10) / 10,
    fat_g: Math.round((totalFat / servings) * 10) / 10,
    fiber_g: Math.round((totalFiber / servings) * 10) / 10,
  };

  // A meal is "balanced" if it has:
  // - At least 15g protein per serving
  // - At least 30g carbs per serving
  // - Between 5-25g fat per serving
  // - At least 200 kcal per serving
  const is_balanced =
    perServing.protein_g >= 15 &&
    perServing.carbs_g >= 30 &&
    perServing.fat_g >= 5 &&
    perServing.fat_g <= 30 &&
    perServing.calories >= 200 &&
    perServing.calories <= 700;

  return {
    ...perServing,
    is_balanced,
    validated: matchedCount > 0,
    validation_source: matchedCount > 0
      ? `${matchedCount}/${ingredients.length} ingredientes verificados con ${BEDCA_SOURCE}`
      : 'No se pudieron validar ingredientes con BEDCA',
    per_ingredient: perIngredient,
  };
}

/**
 * Determina si una receta es nutricionalmente adecuada para familias vulnerables
 */
export function assessNutritionalAdequacy(nutrition: ValidatedNutrition): {
  score: number; // 0-100
  warnings: string[];
  strengths: string[];
} {
  const warnings: string[] = [];
  const strengths: string[] = [];
  let score = 50;

  if (nutrition.protein_g >= 20) { strengths.push('Alto en proteínas'); score += 15; }
  else if (nutrition.protein_g >= 15) { strengths.push('Proteínas adecuadas'); score += 10; }
  else { warnings.push('Bajo en proteínas — considerar añadir legumbres o carne'); score -= 10; }

  if (nutrition.fiber_g >= 5) { strengths.push('Buena fuente de fibra'); score += 10; }

  if (nutrition.calories < 200) { warnings.push('Kcal muy bajas para una comida principal'); score -= 15; }
  else if (nutrition.calories > 700) { warnings.push('Kcal altas — ración generosa'); score -= 5; }
  else { strengths.push('Aporte calórico adecuado'); score += 10; }

  if (nutrition.fat_g > 25) { warnings.push('Alto en grasas'); score -= 5; }

  if (nutrition.validated) { strengths.push('Datos nutricionales verificados con BEDCA'); score += 15; }

  return { score: Math.max(0, Math.min(100, score)), warnings, strengths };
}
