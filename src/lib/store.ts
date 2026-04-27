import { lookupNutrition } from './nutrition-db';
import { lookupPrice, calculateMarketValue } from './price-db';
import type { FoodItem, Recipe, ImpactMetrics } from '@/types';

/**
 * Helper: crea un FoodItem con datos BEDCA y precios MAPA reales
 */
function createFoodItem(
  id: string, name: string, category: FoodItem['category'],
  quantity_kg: number, expiry_days: number
): FoodItem {
  const bedca = lookupNutrition(name);
  const price = lookupPrice(name);
  const { value_eur } = calculateMarketValue(name, quantity_kg);

  return {
    id, name, category, quantity_kg,
    expiry_date: new Date(Date.now() + expiry_days * 86400000).toISOString().split('T')[0],
    nutritional_value: bedca ? {
      calories_per_100g: bedca.calories_per_100g,
      protein_g: bedca.protein_g,
      carbs_g: bedca.carbs_g,
      fat_g: bedca.fat_g,
      fiber_g: bedca.fiber_g,
      source: bedca.source,
    } : undefined,
    market_price: price ? {
      price_eur_per_kg: price.price_eur_per_kg,
      total_value_eur: value_eur,
      trend: price.trend,
      trend_pct: price.trend_pct,
      source: price.source,
    } : undefined,
    is_active: true,
    created_at: new Date().toISOString(),
  };
}

// ====================================================================
// ESCENARIO DEMO: Banco de Alimentos de Vallecas, martes 15 de abril
// Recibe donaciones de un supermercado local y un restaurante del barrio
// ====================================================================

export const DEMO_FOOD_ITEMS: FoodItem[] = [
  // Donación supermercado Día — productos próximos a caducar
  createFoodItem('1', 'Tomates', 'verdura', 15, 3),
  createFoodItem('2', 'Arroz blanco', 'cereal', 20, 90),
  createFoodItem('3', 'Pollo (pechuga)', 'proteina', 8, 2),
  createFoodItem('4', 'Lentejas', 'proteina', 12, 180),
  createFoodItem('5', 'Zanahorias', 'verdura', 10, 7),
  createFoodItem('6', 'Pan integral', 'cereal', 5, 1),
  // Donación restaurante La Tasca
  createFoodItem('7', 'Cebolla', 'verdura', 6, 10),
  createFoodItem('8', 'Pimiento', 'verdura', 4, 4),
  createFoodItem('9', 'Patata', 'verdura', 18, 14),
  createFoodItem('10', 'Huevos', 'proteina', 3, 12),
  // Donación frutería del mercado
  createFoodItem('11', 'Manzana', 'fruta', 8, 5),
  createFoodItem('12', 'Plátano', 'fruta', 5, 2),
  createFoodItem('13', 'Naranja', 'fruta', 10, 8),
  // Lácteos del supermercado
  createFoodItem('14', 'Leche entera', 'lacteo', 12, 4),
  createFoodItem('15', 'Yogur natural', 'lacteo', 4, 3),
];

export const DEMO_RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: 'Arroz con Pollo y Verduras a la Cazuela',
    description: 'Un plato completo y nutritivo con excedentes del supermercado Día de Vallecas. Rico en proteínas y carbohidratos complejos.',
    ingredients: [
      { item: 'Pollo (pechuga)', amount: '400g', amount_g: 400 },
      { item: 'Arroz blanco', amount: '300g', amount_g: 300 },
      { item: 'Tomates', amount: '200g', amount_g: 200 },
      { item: 'Zanahorias', amount: '150g', amount_g: 150 },
      { item: 'Cebolla', amount: '100g', amount_g: 100 },
      { item: 'Pimiento', amount: '80g', amount_g: 80 },
    ],
    instructions: [
      'Cortar el pollo en trozos y dorar en una cazuela con un chorrito de aceite de oliva.',
      'Añadir la cebolla y el pimiento picados, sofreír 3 minutos.',
      'Incorporar los tomates troceados y las zanahorias en rodajas.',
      'Añadir el arroz, cubrir con agua caliente (el doble de volumen que el arroz).',
      'Cocinar a fuego medio 20 minutos hasta que el arroz esté tierno. Sazonar con sal y pimentón.',
    ],
    nutritional_summary: {
      // Calculado con BEDCA: Pollo 400g(432kcal) + Arroz 300g(1062kcal) + Tomate 200g(44kcal) + Zanahoria 150g(50kcal) + Cebolla 100g(33kcal) + Pimiento 80g(21kcal) = 1642kcal total / 4 = 410 por ración
      calories: 410, protein_g: 28.5, carbs_g: 62.8, fat_g: 4.2, fiber_g: 3.8,
      is_balanced: true, validated: true,
      validation_source: '6/6 ingredientes verificados con BEDCA (Base Española de Datos de Composición de Alimentos)',
    },
    dietary_tags: ['sin_gluten', 'sin_lactosa', 'sin_frutos_secos'],
    servings: 4,
    prep_time_min: 35,
    available_until: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    reservations_count: 3,
    max_reservations: 8,
    generated_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: 'r2',
    title: 'Lentejas con Verduras Estofadas',
    description: 'Guiso tradicional de legumbres rico en hierro y fibra. Ideal como fuente de proteína vegetal para toda la familia.',
    ingredients: [
      { item: 'Lentejas', amount: '300g', amount_g: 300 },
      { item: 'Patata', amount: '250g', amount_g: 250 },
      { item: 'Zanahorias', amount: '200g', amount_g: 200 },
      { item: 'Tomates', amount: '150g', amount_g: 150 },
      { item: 'Cebolla', amount: '100g', amount_g: 100 },
    ],
    instructions: [
      'Lavar las lentejas bajo el grifo y escurrir.',
      'Pelar y trocear las patatas, zanahorias y cebolla.',
      'Poner todos los ingredientes en una olla, cubrir con agua fría.',
      'Llevar a ebullición y luego cocinar a fuego lento 30-35 minutos.',
      'Añadir los tomates troceados los últimos 10 minutos. Sazonar con sal y una hoja de laurel.',
    ],
    nutritional_summary: {
      // Lentejas 300g(1008kcal) + Patata 250g(183kcal) + Zanahoria 200g(66kcal) + Tomate 150g(33kcal) + Cebolla 100g(33kcal) = 1323 / 4 = 331
      calories: 331, protein_g: 20.6, carbs_g: 54.3, fat_g: 1.8, fiber_g: 12.4,
      is_balanced: true, validated: true,
      validation_source: '5/5 ingredientes verificados con BEDCA',
    },
    dietary_tags: ['halal', 'vegetariano', 'sin_gluten', 'sin_lactosa', 'sin_frutos_secos'],
    servings: 4,
    prep_time_min: 45,
    available_until: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    reservations_count: 1,
    max_reservations: 8,
    generated_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: 'r3',
    title: 'Tortilla de Patatas con Ensalada de Tomate',
    description: 'Clásico de la cocina española que aprovecha los huevos y patatas próximos a caducar. Nutritivo y económico.',
    ingredients: [
      { item: 'Huevos', amount: '6 unidades (360g)', amount_g: 360 },
      { item: 'Patata', amount: '500g', amount_g: 500 },
      { item: 'Cebolla', amount: '150g', amount_g: 150 },
      { item: 'Tomates', amount: '200g', amount_g: 200 },
    ],
    instructions: [
      'Pelar y cortar las patatas en láminas finas. Picar la cebolla.',
      'Freír las patatas y la cebolla a fuego medio-bajo hasta que estén tiernas (15 min).',
      'Batir los huevos con sal. Mezclar con las patatas y cebolla escurridas.',
      'Cuajar la tortilla en la sartén 4 minutos por cada lado.',
      'Cortar los tomates en rodajas y aliñar con aceite y sal. Servir junto a la tortilla.',
    ],
    nutritional_summary: {
      // Huevos 360g(540kcal) + Patata 500g(365kcal) + Cebolla 150g(50kcal) + Tomate 200g(44kcal) = 999 / 3 = 333
      calories: 333, protein_g: 19.8, carbs_g: 27.5, fat_g: 15.6, fiber_g: 3.5,
      is_balanced: true, validated: true,
      validation_source: '4/4 ingredientes verificados con BEDCA',
    },
    dietary_tags: ['halal', 'vegetariano', 'sin_gluten', 'sin_lactosa', 'sin_frutos_secos'],
    servings: 3,
    prep_time_min: 30,
    available_until: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    reservations_count: 2,
    max_reservations: 6,
    generated_at: new Date().toISOString(),
    is_active: true,
  },
];

// Métricas basadas en datos realistas de un comedor comunitario con 15 ingredientes
export const DEMO_IMPACT: ImpactMetrics[] = [
  { week_of: '2026-03-30', kg_rescued: 42, economic_value_eur: 152, portions_generated: 112, balanced_portions: 98, families_served: 28, co2_saved_kg: 88 },
  { week_of: '2026-04-06', kg_rescued: 65, economic_value_eur: 237, portions_generated: 173, balanced_portions: 156, families_served: 43, co2_saved_kg: 137 },
  { week_of: '2026-04-13', kg_rescued: 140, economic_value_eur: 512, portions_generated: 384, balanced_portions: 345, families_served: 96, co2_saved_kg: 294 },
];
