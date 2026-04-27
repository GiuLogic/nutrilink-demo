/**
 * Calculadora de valor económico — Calcula el valor real de mercado
 * de los excedentes alimentarios usando precios del MAPA
 */

import { lookupPrice, getInflationAlerts, getBasketIndex, calculateMarketValue, PRICE_SOURCE } from './price-db';
import type { FoodItem, InflationAlert } from '@/types';

export interface EconomicReport {
  total_value_eur: number;
  items: {
    name: string;
    quantity_kg: number;
    price_per_kg: number;
    value_eur: number;
    trend: string;
    trend_pct: number;
  }[];
  unpriced_items: string[];
  inflation_alerts: InflationAlert[];
  basket_index: { index: number; items: { name: string; price: number; trend_pct: number }[] };
  co2_saved_kg: number;
  source: string;
}

// CO₂ emission factor: ~2.1 kg CO₂ per kg of food waste avoided
// Source: EU FUSIONS project, FAO
const CO2_FACTOR_KG = 2.1;

/**
 * Calcula el informe económico completo del inventario
 */
export function calculateEconomicReport(foodItems: FoodItem[]): EconomicReport {
  const items: EconomicReport['items'] = [];
  const unpriced: string[] = [];
  let totalValue = 0;
  let totalKg = 0;

  for (const item of foodItems) {
    const { value_eur, price_entry } = calculateMarketValue(item.name, item.quantity_kg);
    totalKg += item.quantity_kg;

    if (price_entry) {
      totalValue += value_eur;
      items.push({
        name: item.name,
        quantity_kg: item.quantity_kg,
        price_per_kg: price_entry.price_eur_per_kg,
        value_eur,
        trend: price_entry.trend,
        trend_pct: price_entry.trend_pct,
      });
    } else {
      unpriced.push(item.name);
    }
  }

  const rawAlerts = getInflationAlerts(5.0);
  const inflation_alerts: InflationAlert[] = rawAlerts.slice(0, 5).map(a => ({
    food_name: a.name,
    trend_pct: a.trend_pct,
    impact: a.trend_pct > 15 ? 'high' : a.trend_pct > 8 ? 'medium' : 'low',
    message: `${a.name}: +${a.trend_pct}% interanual — ${a.trend_pct > 15 ? 'impacto crítico' : a.trend_pct > 8 ? 'impacto notable' : 'vigilar'} en poder adquisitivo de familias vulnerables`,
  }));

  return {
    total_value_eur: Math.round(totalValue * 100) / 100,
    items,
    unpriced_items: unpriced,
    inflation_alerts,
    basket_index: getBasketIndex(),
    co2_saved_kg: Math.round(totalKg * CO2_FACTOR_KG * 10) / 10,
    source: PRICE_SOURCE,
  };
}

/**
 * Genera un resumen de impacto ESG para empresas donantes
 */
export function generateESGSummary(report: EconomicReport, familiesServed: number, balancedPct: number): {
  economic: { value: string; detail: string };
  environmental: { value: string; detail: string };
  social: { value: string; detail: string };
  legal: { value: string; detail: string };
} {
  const totalKg = report.items.reduce((s, i) => s + i.quantity_kg, 0);

  return {
    economic: {
      value: `${report.total_value_eur.toLocaleString('es-ES')} €`,
      detail: `Valor de mercado de ${totalKg} kg de alimentos rescatados (fuente: ${PRICE_SOURCE})`,
    },
    environmental: {
      value: `${report.co2_saved_kg} kg CO₂`,
      detail: `Emisiones evitadas al rescatar ${totalKg} kg de alimentos del desperdicio (factor: ${CO2_FACTOR_KG} kg CO₂/kg alimento — EU FUSIONS/FAO)`,
    },
    social: {
      value: `${familiesServed} familias`,
      detail: `${balancedPct}% de las raciones generadas son nutricionalmente equilibradas (validado con BEDCA)`,
    },
    legal: {
      value: 'Ley 1/2025',
      detail: 'Métricas automáticas de cumplimiento de la Ley de prevención de pérdidas y desperdicio alimentario',
    },
  };
}
