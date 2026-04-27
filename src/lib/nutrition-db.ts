/**
 * Base de datos nutricional basada en BEDCA (Base Española de Datos de Composición de Alimentos)
 * Fuente: https://www.bedca.net — AESAN, Ministerio de Consumo
 * Valores por 100g de porción comestible
 */

export interface BEDCAEntry {
  name: string;
  category: 'verdura' | 'fruta' | 'proteina' | 'cereal' | 'lacteo' | 'otro';
  /** Clasificación nutricional según criterios ACH / OMS */
  nutritional_class: 'saludable' | 'moderado' | 'ocasional';
  calories_per_100g: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  source: string;
  aliases: string[];
}

const BEDCA_DATABASE: BEDCAEntry[] = [
  // === VERDURAS === (todas saludable)
  { name: 'Tomate', category: 'verdura', nutritional_class: 'saludable', calories_per_100g: 22, protein_g: 1.0, carbs_g: 3.5, fat_g: 0.3, fiber_g: 1.4, source: 'BEDCA #798', aliases: ['tomates', 'tomate cherry', 'tomate pera', 'tomate frito'] },
  { name: 'Zanahoria', category: 'verdura', nutritional_class: 'saludable', calories_per_100g: 33, protein_g: 0.9, carbs_g: 7.3, fat_g: 0.2, fiber_g: 2.6, source: 'BEDCA #830', aliases: ['zanahorias'] },
  { name: 'Cebolla', category: 'verdura', nutritional_class: 'saludable', calories_per_100g: 33, protein_g: 1.2, carbs_g: 7.0, fat_g: 0.2, fiber_g: 1.4, source: 'BEDCA #645', aliases: ['cebollas', 'cebolla blanca', 'cebolla morada'] },
  { name: 'Pimiento', category: 'verdura', nutritional_class: 'saludable', calories_per_100g: 26, protein_g: 0.9, carbs_g: 5.1, fat_g: 0.2, fiber_g: 1.5, source: 'BEDCA #700', aliases: ['pimientos', 'pimiento rojo', 'pimiento verde', 'pimiento morrón'] },
  { name: 'Calabacín', category: 'verdura', nutritional_class: 'saludable', calories_per_100g: 16, protein_g: 1.2, carbs_g: 2.2, fat_g: 0.2, fiber_g: 1.0, source: 'BEDCA #618', aliases: ['calabacines'] },
  { name: 'Patata', category: 'verdura', nutritional_class: 'moderado', calories_per_100g: 73, protein_g: 2.0, carbs_g: 15.4, fat_g: 0.1, fiber_g: 2.2, source: 'BEDCA #688', aliases: ['patatas', 'papa', 'papas'] },
  { name: 'Espinacas', category: 'verdura', nutritional_class: 'saludable', calories_per_100g: 22, protein_g: 2.6, carbs_g: 1.2, fat_g: 0.3, fiber_g: 2.6, source: 'BEDCA #659', aliases: ['espinaca'] },
  { name: 'Lechuga', category: 'verdura', nutritional_class: 'saludable', calories_per_100g: 14, protein_g: 1.4, carbs_g: 1.4, fat_g: 0.2, fiber_g: 1.5, source: 'BEDCA #679', aliases: ['lechugas', 'lechuga iceberg', 'lechuga romana'] },
  { name: 'Judías verdes', category: 'verdura', nutritional_class: 'saludable', calories_per_100g: 28, protein_g: 2.4, carbs_g: 3.7, fat_g: 0.2, fiber_g: 3.2, source: 'BEDCA #672', aliases: ['judias verdes', 'vainas', 'ejotes'] },
  { name: 'Brócoli', category: 'verdura', nutritional_class: 'saludable', calories_per_100g: 30, protein_g: 3.3, carbs_g: 2.0, fat_g: 0.4, fiber_g: 3.0, source: 'BEDCA #610', aliases: ['brocoli'] },
  { name: 'Berenjena', category: 'verdura', nutritional_class: 'saludable', calories_per_100g: 20, protein_g: 1.0, carbs_g: 3.1, fat_g: 0.2, fiber_g: 2.5, source: 'BEDCA #602', aliases: ['berenjenas'] },
  { name: 'Acelgas', category: 'verdura', nutritional_class: 'saludable', calories_per_100g: 17, protein_g: 2.1, carbs_g: 0.7, fat_g: 0.2, fiber_g: 2.1, source: 'BEDCA #594', aliases: ['acelga'] },
  { name: 'Coliflor', category: 'verdura', nutritional_class: 'saludable', calories_per_100g: 22, protein_g: 2.4, carbs_g: 2.3, fat_g: 0.2, fiber_g: 2.3, source: 'BEDCA #641', aliases: ['coliflores'] },
  { name: 'Champiñones', category: 'verdura', nutritional_class: 'saludable', calories_per_100g: 24, protein_g: 2.7, carbs_g: 0.5, fat_g: 0.3, fiber_g: 2.5, source: 'BEDCA #893', aliases: ['champiñon', 'setas'] },

  // === FRUTAS ===
  { name: 'Manzana', category: 'fruta', nutritional_class: 'saludable', calories_per_100g: 50, protein_g: 0.3, carbs_g: 12.0, fat_g: 0.1, fiber_g: 2.0, source: 'BEDCA #498', aliases: ['manzanas'] },
  { name: 'Naranja', category: 'fruta', nutritional_class: 'saludable', calories_per_100g: 42, protein_g: 0.8, carbs_g: 8.9, fat_g: 0.2, fiber_g: 2.0, source: 'BEDCA #517', aliases: ['naranjas'] },
  { name: 'Plátano', category: 'fruta', nutritional_class: 'saludable', calories_per_100g: 94, protein_g: 1.2, carbs_g: 20.0, fat_g: 0.3, fiber_g: 2.5, source: 'BEDCA #535', aliases: ['platanos', 'banana', 'bananas'] },
  { name: 'Pera', category: 'fruta', nutritional_class: 'saludable', calories_per_100g: 49, protein_g: 0.4, carbs_g: 10.6, fat_g: 0.1, fiber_g: 2.3, source: 'BEDCA #530', aliases: ['peras'] },
  { name: 'Fresa', category: 'fruta', nutritional_class: 'saludable', calories_per_100g: 36, protein_g: 0.7, carbs_g: 7.0, fat_g: 0.4, fiber_g: 1.6, source: 'BEDCA #474', aliases: ['fresas', 'fresones'] },
  { name: 'Mandarina', category: 'fruta', nutritional_class: 'saludable', calories_per_100g: 40, protein_g: 0.7, carbs_g: 8.7, fat_g: 0.2, fiber_g: 1.8, source: 'BEDCA #510', aliases: ['mandarinas', 'clementina', 'clementinas'] },
  { name: 'Melocotón', category: 'fruta', nutritional_class: 'saludable', calories_per_100g: 41, protein_g: 0.7, carbs_g: 9.0, fat_g: 0.1, fiber_g: 1.9, source: 'BEDCA #512', aliases: ['melocotones', 'durazno'] },
  { name: 'Uva', category: 'fruta', nutritional_class: 'moderado', calories_per_100g: 63, protein_g: 0.6, carbs_g: 14.1, fat_g: 0.4, fiber_g: 0.9, source: 'BEDCA #552', aliases: ['uvas'] },
  { name: 'Sandía', category: 'fruta', nutritional_class: 'saludable', calories_per_100g: 28, protein_g: 0.6, carbs_g: 5.6, fat_g: 0.1, fiber_g: 0.5, source: 'BEDCA #545', aliases: ['sandia'] },
  { name: 'Melón', category: 'fruta', nutritional_class: 'saludable', calories_per_100g: 28, protein_g: 0.8, carbs_g: 6.0, fat_g: 0.1, fiber_g: 0.7, source: 'BEDCA #513', aliases: ['melones'] },

  // === PROTEÍNAS ===
  { name: 'Pollo (pechuga)', category: 'proteina', nutritional_class: 'saludable', calories_per_100g: 108, protein_g: 22.2, carbs_g: 0.0, fat_g: 2.2, fiber_g: 0, source: 'BEDCA #276', aliases: ['pollo', 'pechuga de pollo', 'pechuga'] },
  { name: 'Ternera', category: 'proteina', nutritional_class: 'moderado', calories_per_100g: 131, protein_g: 20.7, carbs_g: 0.0, fat_g: 5.4, fiber_g: 0, source: 'BEDCA #252', aliases: ['carne de ternera', 'carne de res', 'res'] },
  { name: 'Cerdo (lomo)', category: 'proteina', nutritional_class: 'moderado', calories_per_100g: 148, protein_g: 21.5, carbs_g: 0.0, fat_g: 7.0, fiber_g: 0, source: 'BEDCA #229', aliases: ['cerdo', 'lomo de cerdo', 'carne de cerdo'] },
  { name: 'Merluza', category: 'proteina', nutritional_class: 'saludable', calories_per_100g: 65, protein_g: 15.9, carbs_g: 0.0, fat_g: 0.3, fiber_g: 0, source: 'BEDCA #366', aliases: ['merluza fresca'] },
  { name: 'Sardinas', category: 'proteina', nutritional_class: 'saludable', calories_per_100g: 151, protein_g: 18.1, carbs_g: 0.0, fat_g: 8.9, fiber_g: 0, source: 'BEDCA #388', aliases: ['sardina'] },
  { name: 'Atún', category: 'proteina', nutritional_class: 'saludable', calories_per_100g: 108, protein_g: 23.0, carbs_g: 0.0, fat_g: 1.6, fiber_g: 0, source: 'BEDCA #340', aliases: ['atun', 'atún en lata', 'atun en conserva'] },
  { name: 'Huevos', category: 'proteina', nutritional_class: 'saludable', calories_per_100g: 150, protein_g: 12.5, carbs_g: 0.7, fat_g: 11.1, fiber_g: 0, source: 'BEDCA #167', aliases: ['huevo', 'huevos camperos'] },
  { name: 'Lentejas', category: 'proteina', nutritional_class: 'saludable', calories_per_100g: 336, protein_g: 23.8, carbs_g: 52.0, fat_g: 1.7, fiber_g: 11.7, source: 'BEDCA #181', aliases: ['lenteja'] },
  { name: 'Garbanzos', category: 'proteina', nutritional_class: 'saludable', calories_per_100g: 341, protein_g: 20.4, carbs_g: 49.6, fat_g: 5.5, fiber_g: 15.5, source: 'BEDCA #175', aliases: ['garbanzo'] },
  { name: 'Alubias blancas', category: 'proteina', nutritional_class: 'saludable', calories_per_100g: 293, protein_g: 21.1, carbs_g: 40.6, fat_g: 1.6, fiber_g: 15.2, source: 'BEDCA #170', aliases: ['judías blancas', 'judias blancas', 'alubias', 'frijoles', 'frijol blanco'] },
  { name: 'Tofu', category: 'proteina', nutritional_class: 'saludable', calories_per_100g: 76, protein_g: 8.1, carbs_g: 1.9, fat_g: 4.8, fiber_g: 0.3, source: 'BEDCA estimado', aliases: [] },

  // === CEREALES ===
  { name: 'Arroz blanco', category: 'cereal', nutritional_class: 'moderado', calories_per_100g: 354, protein_g: 6.7, carbs_g: 81.6, fat_g: 0.9, fiber_g: 1.4, source: 'BEDCA #99', aliases: ['arroz', 'arroz largo'] },
  { name: 'Pan integral', category: 'cereal', nutritional_class: 'saludable', calories_per_100g: 230, protein_g: 8.0, carbs_g: 44.0, fat_g: 2.5, fiber_g: 7.5, source: 'BEDCA #86', aliases: ['pan', 'pan de molde integral'] },
  { name: 'Pasta', category: 'cereal', nutritional_class: 'moderado', calories_per_100g: 350, protein_g: 12.5, carbs_g: 71.5, fat_g: 1.8, fiber_g: 3.0, source: 'BEDCA #95', aliases: ['macarrones', 'espaguetis', 'spaghetti', 'fideos'] },
  { name: 'Pan blanco', category: 'cereal', nutritional_class: 'moderado', calories_per_100g: 261, protein_g: 8.5, carbs_g: 51.5, fat_g: 1.6, fiber_g: 3.5, source: 'BEDCA #80', aliases: ['pan de barra', 'barra de pan'] },
  { name: 'Avena', category: 'cereal', nutritional_class: 'saludable', calories_per_100g: 353, protein_g: 11.7, carbs_g: 59.8, fat_g: 7.1, fiber_g: 5.6, source: 'BEDCA #70', aliases: ['copos de avena'] },
  { name: 'Cuscús', category: 'cereal', nutritional_class: 'moderado', calories_per_100g: 356, protein_g: 12.8, carbs_g: 72.4, fat_g: 1.1, fiber_g: 3.6, source: 'BEDCA estimado', aliases: ['cous cous'] },

  // === LÁCTEOS ===
  { name: 'Leche entera', category: 'lacteo', nutritional_class: 'saludable', calories_per_100g: 63, protein_g: 3.1, carbs_g: 4.7, fat_g: 3.5, fiber_g: 0, source: 'BEDCA #132', aliases: ['leche', 'leche de vaca'] },
  { name: 'Yogur natural', category: 'lacteo', nutritional_class: 'saludable', calories_per_100g: 57, protein_g: 3.3, carbs_g: 4.0, fat_g: 3.0, fiber_g: 0, source: 'BEDCA #161', aliases: ['yogur', 'yogures'] },
  { name: 'Queso fresco', category: 'lacteo', nutritional_class: 'saludable', calories_per_100g: 174, protein_g: 13.3, carbs_g: 2.5, fat_g: 12.2, fiber_g: 0, source: 'BEDCA #148', aliases: ['queso de burgos', 'queso blanco'] },
  { name: 'Queso semicurado', category: 'lacteo', nutritional_class: 'ocasional', calories_per_100g: 370, protein_g: 26.0, carbs_g: 0.5, fat_g: 29.5, fiber_g: 0, source: 'BEDCA #153', aliases: ['queso manchego', 'queso curado'] },

  // === OTROS ===
  { name: 'Aceite de oliva', category: 'otro', nutritional_class: 'saludable', calories_per_100g: 882, protein_g: 0.0, carbs_g: 0.0, fat_g: 99.9, fiber_g: 0, source: 'BEDCA #45', aliases: ['aceite', 'aceite de oliva virgen extra', 'aove'] },
  { name: 'Azúcar', category: 'otro', nutritional_class: 'ocasional', calories_per_100g: 387, protein_g: 0.0, carbs_g: 99.8, fat_g: 0.0, fiber_g: 0, source: 'BEDCA #109', aliases: ['azucar blanco'] },
  { name: 'Conserva de tomate', category: 'otro', nutritional_class: 'saludable', calories_per_100g: 30, protein_g: 1.3, carbs_g: 4.8, fat_g: 0.2, fiber_g: 1.0, source: 'BEDCA #802', aliases: ['tomate triturado', 'tomate en lata', 'salsa de tomate'] },
  { name: 'Leche evaporada', category: 'otro', nutritional_class: 'moderado', calories_per_100g: 134, protein_g: 7.0, carbs_g: 10.0, fat_g: 7.5, fiber_g: 0, source: 'BEDCA #138', aliases: [] },
];

/**
 * Busca un alimento en la base BEDCA por nombre (case-insensitive, fuzzy matching por aliases)
 */
export function lookupNutrition(foodName: string): BEDCAEntry | null {
  const normalized = foodName.toLowerCase().trim();

  // Exact match
  const exact = BEDCA_DATABASE.find(e => e.name.toLowerCase() === normalized);
  if (exact) return exact;

  // Alias match
  const aliasMatch = BEDCA_DATABASE.find(e =>
    e.aliases.some(a => a.toLowerCase() === normalized)
  );
  if (aliasMatch) return aliasMatch;

  // Partial match (name contains search or search contains name)
  const partial = BEDCA_DATABASE.find(e =>
    normalized.includes(e.name.toLowerCase()) || e.name.toLowerCase().includes(normalized)
  );
  if (partial) return partial;

  // Partial alias match
  const partialAlias = BEDCA_DATABASE.find(e =>
    e.aliases.some(a => normalized.includes(a.toLowerCase()) || a.toLowerCase().includes(normalized))
  );
  if (partialAlias) return partialAlias;

  return null;
}

/**
 * Busca todos los alimentos de una categoría
 */
export function getByCategory(category: BEDCAEntry['category']): BEDCAEntry[] {
  return BEDCA_DATABASE.filter(e => e.category === category);
}

/**
 * Devuelve toda la base de datos
 */
export function getAllFoods(): BEDCAEntry[] {
  return [...BEDCA_DATABASE];
}

export const BEDCA_SOURCE = 'Base Española de Datos de Composición de Alimentos (BEDCA) — AESAN, Ministerio de Consumo de España';
export const BEDCA_URL = 'https://www.bedca.net';
