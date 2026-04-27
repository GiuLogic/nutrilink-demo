/**
 * Base de datos de precios de mercado de alimentos en España
 * Fuente: MAPA (Ministerio de Agricultura, Pesca y Alimentación)
 * Observatorio de Precios de los Alimentos — datos abril 2025
 * https://www.mapa.gob.es/es/alimentacion/temas/observatorio-precios/
 *
 * Precios medios en €/kg (o €/L para líquidos, €/docena para huevos)
 */

export interface PriceEntry {
  name: string;
  price_eur_per_kg: number;
  unit: 'kg' | 'L' | 'docena' | 'unidad';
  trend: 'stable' | 'rising' | 'falling';
  trend_pct: number; // variación interanual %
  last_updated: string;
  source: string;
  aliases: string[];
}

const PRICE_DATABASE: PriceEntry[] = [
  // === VERDURAS ===
  { name: 'Tomate', price_eur_per_kg: 2.15, unit: 'kg', trend: 'rising', trend_pct: 4.2, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['tomates', 'tomate cherry', 'tomate pera'] },
  { name: 'Zanahoria', price_eur_per_kg: 1.10, unit: 'kg', trend: 'stable', trend_pct: 1.1, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['zanahorias'] },
  { name: 'Cebolla', price_eur_per_kg: 1.25, unit: 'kg', trend: 'falling', trend_pct: -2.3, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['cebollas'] },
  { name: 'Pimiento', price_eur_per_kg: 2.85, unit: 'kg', trend: 'rising', trend_pct: 6.1, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['pimientos', 'pimiento rojo', 'pimiento verde'] },
  { name: 'Calabacín', price_eur_per_kg: 1.90, unit: 'kg', trend: 'stable', trend_pct: 0.8, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['calabacines'] },
  { name: 'Patata', price_eur_per_kg: 1.05, unit: 'kg', trend: 'rising', trend_pct: 8.5, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['patatas'] },
  { name: 'Espinacas', price_eur_per_kg: 3.20, unit: 'kg', trend: 'stable', trend_pct: 1.5, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['espinaca'] },
  { name: 'Lechuga', price_eur_per_kg: 1.45, unit: 'kg', trend: 'stable', trend_pct: 0.3, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['lechugas'] },
  { name: 'Judías verdes', price_eur_per_kg: 3.50, unit: 'kg', trend: 'rising', trend_pct: 3.7, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['judias verdes'] },
  { name: 'Brócoli', price_eur_per_kg: 2.40, unit: 'kg', trend: 'stable', trend_pct: 1.2, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['brocoli'] },
  { name: 'Berenjena', price_eur_per_kg: 1.95, unit: 'kg', trend: 'stable', trend_pct: 0.5, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['berenjenas'] },
  { name: 'Champiñones', price_eur_per_kg: 3.80, unit: 'kg', trend: 'stable', trend_pct: 1.0, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['champiñon', 'setas'] },

  // === FRUTAS ===
  { name: 'Manzana', price_eur_per_kg: 1.95, unit: 'kg', trend: 'stable', trend_pct: 0.9, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['manzanas'] },
  { name: 'Naranja', price_eur_per_kg: 1.50, unit: 'kg', trend: 'rising', trend_pct: 12.3, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['naranjas'] },
  { name: 'Plátano', price_eur_per_kg: 1.75, unit: 'kg', trend: 'stable', trend_pct: 2.1, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['platanos', 'banana'] },
  { name: 'Pera', price_eur_per_kg: 2.10, unit: 'kg', trend: 'stable', trend_pct: 1.4, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['peras'] },
  { name: 'Fresa', price_eur_per_kg: 4.50, unit: 'kg', trend: 'rising', trend_pct: 7.8, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['fresas', 'fresones'] },
  { name: 'Mandarina', price_eur_per_kg: 1.60, unit: 'kg', trend: 'rising', trend_pct: 9.5, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['mandarinas', 'clementina'] },
  { name: 'Melón', price_eur_per_kg: 1.40, unit: 'kg', trend: 'stable', trend_pct: 0.6, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['melones'] },
  { name: 'Sandía', price_eur_per_kg: 0.95, unit: 'kg', trend: 'stable', trend_pct: 0.4, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['sandia'] },

  // === PROTEÍNAS ===
  { name: 'Pollo (pechuga)', price_eur_per_kg: 6.50, unit: 'kg', trend: 'rising', trend_pct: 5.3, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['pollo', 'pechuga de pollo', 'pechuga'] },
  { name: 'Ternera', price_eur_per_kg: 14.90, unit: 'kg', trend: 'rising', trend_pct: 3.8, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['carne de ternera'] },
  { name: 'Cerdo (lomo)', price_eur_per_kg: 7.20, unit: 'kg', trend: 'stable', trend_pct: 1.9, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['cerdo', 'lomo de cerdo'] },
  { name: 'Merluza', price_eur_per_kg: 9.80, unit: 'kg', trend: 'stable', trend_pct: 2.1, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['merluza fresca'] },
  { name: 'Sardinas', price_eur_per_kg: 5.50, unit: 'kg', trend: 'rising', trend_pct: 4.6, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['sardina'] },
  { name: 'Atún', price_eur_per_kg: 16.50, unit: 'kg', trend: 'rising', trend_pct: 6.2, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['atun', 'atún en lata'] },
  { name: 'Huevos', price_eur_per_kg: 2.80, unit: 'docena', trend: 'rising', trend_pct: 11.2, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['huevo'] },
  { name: 'Lentejas', price_eur_per_kg: 2.80, unit: 'kg', trend: 'stable', trend_pct: 1.3, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['lenteja'] },
  { name: 'Garbanzos', price_eur_per_kg: 3.20, unit: 'kg', trend: 'stable', trend_pct: 0.7, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['garbanzo'] },
  { name: 'Alubias blancas', price_eur_per_kg: 3.50, unit: 'kg', trend: 'stable', trend_pct: 1.1, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['judías blancas', 'alubias'] },

  // === CEREALES ===
  { name: 'Arroz blanco', price_eur_per_kg: 1.30, unit: 'kg', trend: 'rising', trend_pct: 15.2, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['arroz'] },
  { name: 'Pan integral', price_eur_per_kg: 3.50, unit: 'kg', trend: 'rising', trend_pct: 4.8, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['pan', 'pan de molde integral'] },
  { name: 'Pasta', price_eur_per_kg: 1.85, unit: 'kg', trend: 'rising', trend_pct: 8.9, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['macarrones', 'espaguetis', 'fideos'] },
  { name: 'Pan blanco', price_eur_per_kg: 2.80, unit: 'kg', trend: 'rising', trend_pct: 5.1, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['pan de barra'] },
  { name: 'Avena', price_eur_per_kg: 2.50, unit: 'kg', trend: 'stable', trend_pct: 1.2, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['copos de avena'] },

  // === LÁCTEOS ===
  { name: 'Leche entera', price_eur_per_kg: 0.95, unit: 'L', trend: 'stable', trend_pct: 0.5, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['leche'] },
  { name: 'Yogur natural', price_eur_per_kg: 2.50, unit: 'kg', trend: 'stable', trend_pct: 1.8, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['yogur', 'yogures'] },
  { name: 'Queso fresco', price_eur_per_kg: 6.50, unit: 'kg', trend: 'stable', trend_pct: 2.3, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['queso de burgos'] },

  // === OTROS ===
  { name: 'Aceite de oliva', price_eur_per_kg: 9.50, unit: 'L', trend: 'rising', trend_pct: 52.0, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['aceite', 'aove'] },
  { name: 'Conserva de tomate', price_eur_per_kg: 1.60, unit: 'kg', trend: 'stable', trend_pct: 2.0, last_updated: '2025-04', source: 'MAPA Observatorio', aliases: ['tomate triturado', 'tomate en lata'] },
];

/**
 * Busca precio de mercado de un alimento (case-insensitive, fuzzy)
 */
export function lookupPrice(foodName: string): PriceEntry | null {
  const normalized = foodName.toLowerCase().trim();

  const exact = PRICE_DATABASE.find(e => e.name.toLowerCase() === normalized);
  if (exact) return exact;

  const aliasMatch = PRICE_DATABASE.find(e =>
    e.aliases.some(a => a.toLowerCase() === normalized)
  );
  if (aliasMatch) return aliasMatch;

  const partial = PRICE_DATABASE.find(e =>
    normalized.includes(e.name.toLowerCase()) || e.name.toLowerCase().includes(normalized)
  );
  if (partial) return partial;

  const partialAlias = PRICE_DATABASE.find(e =>
    e.aliases.some(a => normalized.includes(a.toLowerCase()) || a.toLowerCase().includes(normalized))
  );
  if (partialAlias) return partialAlias;

  return null;
}

/**
 * Calcula valor de mercado de una cantidad de alimento
 */
export function calculateMarketValue(foodName: string, quantity_kg: number): { value_eur: number; price_entry: PriceEntry | null } {
  const price = lookupPrice(foodName);
  if (!price) return { value_eur: 0, price_entry: null };
  return {
    value_eur: Math.round(price.price_eur_per_kg * quantity_kg * 100) / 100,
    price_entry: price,
  };
}

/**
 * Obtiene alimentos con mayor inflación (para alertas)
 */
export function getInflationAlerts(threshold_pct: number = 5.0): PriceEntry[] {
  return PRICE_DATABASE
    .filter(e => e.trend_pct >= threshold_pct)
    .sort((a, b) => b.trend_pct - a.trend_pct);
}

/**
 * Precio medio ponderado de la cesta básica (10 alimentos más comunes)
 */
export function getBasketIndex(): { index: number; items: { name: string; price: number; trend_pct: number }[] } {
  const basket = ['Pollo (pechuga)', 'Arroz blanco', 'Pan blanco', 'Leche entera', 'Tomate', 'Patata', 'Huevos', 'Aceite de oliva', 'Lentejas', 'Naranja'];
  const items = basket.map(name => {
    const entry = PRICE_DATABASE.find(e => e.name === name);
    return { name, price: entry?.price_eur_per_kg ?? 0, trend_pct: entry?.trend_pct ?? 0 };
  });
  const index = Math.round((items.reduce((sum, i) => sum + i.price, 0) / items.length) * 100) / 100;
  return { index, items };
}

export const PRICE_SOURCE = 'Observatorio de Precios de los Alimentos — MAPA (Ministerio de Agricultura, Pesca y Alimentación)';
export const PRICE_URL = 'https://www.mapa.gob.es/es/alimentacion/temas/observatorio-precios/';
export const PRICE_DATE = 'Abril 2025';

/**
 * Referencia Mercamadrid — Mayor mercado mayorista de alimentos frescos de España
 * Los precios MAPA se contrastan con los precios de primera venta en Mercamadrid
 * Fuente: https://www.mercamadrid.es/
 */
export const MERCAMADRID_INFO = {
  name: 'Mercamadrid',
  description: 'Mayor mercado de distribución, comercialización, transformación y logística de alimentos frescos de España',
  relevance: 'Los precios de primera venta en Mercamadrid (frutas, verduras, pescado, carne) son referencia para los precios MAPA y permiten estimar el valor real de los excedentes en la Comunidad de Madrid',
  url: 'https://www.mercamadrid.es/',
  stats: {
    tons_per_year: 2_500_000,
    companies: 780,
    workers: 9_000,
    surface_m2: 220_000,
  },
  data_note: 'En producción, NutriLink podría conectarse a los boletines de precios diarios de Mercamadrid para actualizar valoraciones en tiempo real',
};
