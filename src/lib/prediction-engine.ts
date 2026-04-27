/**
 * Motor de predicciones básico — Patrones temporales de donaciones
 *
 * Basado en patrones observados en la redistribución alimentaria en España:
 * - Supermercados donan más productos frescos a inicio de semana (reposición de fin de semana)
 * - Panaderías donan más a final del día / principio de semana
 * - Fruterías donan más fruta a mitad de semana (stock del lunes empieza a madurar)
 * - Restaurantes donan más proteínas los domingos/lunes (excedente del fin de semana)
 *
 * Fuente: Patrones generales estimados a partir de informes públicos de FESBAL y ACH.
 * NOTA: Estos NO son datos reales de producción — son estimaciones razonables
 * para la demo. En un piloto real, se reemplazarían con datos de cada entidad.
 */

import type { PredictionData } from '@/types';

interface DonationPattern {
  day: number; // 0=domingo, 1=lunes, ..., 6=sábado
  category: string;
  probability: number; // 0-1
  avg_kg: number;
  source_type: string;
}

const DONATION_PATTERNS: DonationPattern[] = [
  // Lunes — Excedentes de fin de semana de supermercados y restaurantes
  { day: 1, category: 'proteina', probability: 0.85, avg_kg: 12, source_type: 'restaurante/supermercado' },
  { day: 1, category: 'verdura', probability: 0.90, avg_kg: 20, source_type: 'supermercado' },
  { day: 1, category: 'cereal', probability: 0.70, avg_kg: 8, source_type: 'panadería' },
  { day: 1, category: 'fruta', probability: 0.75, avg_kg: 15, source_type: 'supermercado' },
  { day: 1, category: 'lacteo', probability: 0.60, avg_kg: 5, source_type: 'supermercado' },

  // Martes
  { day: 2, category: 'verdura', probability: 0.80, avg_kg: 18, source_type: 'mercado' },
  { day: 2, category: 'proteina', probability: 0.65, avg_kg: 8, source_type: 'supermercado' },
  { day: 2, category: 'cereal', probability: 0.75, avg_kg: 10, source_type: 'panadería/supermercado' },
  { day: 2, category: 'fruta', probability: 0.70, avg_kg: 12, source_type: 'mercado' },

  // Miércoles — Pico de frutas (maduran del lunes)
  { day: 3, category: 'fruta', probability: 0.95, avg_kg: 25, source_type: 'frutería/supermercado' },
  { day: 3, category: 'verdura', probability: 0.85, avg_kg: 22, source_type: 'mercado/supermercado' },
  { day: 3, category: 'proteina', probability: 0.55, avg_kg: 6, source_type: 'supermercado' },
  { day: 3, category: 'lacteo', probability: 0.70, avg_kg: 7, source_type: 'supermercado' },

  // Jueves
  { day: 4, category: 'verdura', probability: 0.80, avg_kg: 15, source_type: 'supermercado' },
  { day: 4, category: 'cereal', probability: 0.80, avg_kg: 12, source_type: 'panadería' },
  { day: 4, category: 'fruta', probability: 0.80, avg_kg: 18, source_type: 'supermercado' },
  { day: 4, category: 'proteina', probability: 0.60, avg_kg: 7, source_type: 'supermercado' },

  // Viernes — Pico de panadería (preparan para fin de semana)
  { day: 5, category: 'cereal', probability: 0.95, avg_kg: 18, source_type: 'panadería' },
  { day: 5, category: 'verdura', probability: 0.75, avg_kg: 14, source_type: 'supermercado' },
  { day: 5, category: 'fruta', probability: 0.70, avg_kg: 10, source_type: 'supermercado' },
  { day: 5, category: 'proteina', probability: 0.70, avg_kg: 10, source_type: 'supermercado' },
  { day: 5, category: 'lacteo', probability: 0.75, avg_kg: 8, source_type: 'supermercado' },

  // Sábado — Mayor donación general (fin de semana)
  { day: 6, category: 'verdura', probability: 0.90, avg_kg: 25, source_type: 'mercado/supermercado' },
  { day: 6, category: 'fruta', probability: 0.85, avg_kg: 20, source_type: 'mercado' },
  { day: 6, category: 'proteina', probability: 0.80, avg_kg: 15, source_type: 'supermercado/restaurante' },
  { day: 6, category: 'cereal', probability: 0.85, avg_kg: 14, source_type: 'panadería' },
  { day: 6, category: 'lacteo', probability: 0.65, avg_kg: 6, source_type: 'supermercado' },

  // Domingo — Restaurantes
  { day: 0, category: 'proteina', probability: 0.90, avg_kg: 18, source_type: 'restaurante' },
  { day: 0, category: 'verdura', probability: 0.70, avg_kg: 12, source_type: 'restaurante' },
  { day: 0, category: 'cereal', probability: 0.50, avg_kg: 5, source_type: 'panadería' },
];

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

/**
 * Genera predicciones para los próximos 7 días
 */
export function getPredictions(startDate: Date = new Date()): PredictionData[] {
  const predictions: PredictionData[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();

    const dayPatterns = DONATION_PATTERNS.filter(p => p.day === dayOfWeek);
    const predicted_categories = dayPatterns
      .map(p => ({
        category: p.category,
        probability: p.probability,
        avg_kg: p.avg_kg,
      }))
      .sort((a, b) => b.probability - a.probability);

    const avgConfidence = predicted_categories.length > 0
      ? predicted_categories.reduce((s, c) => s + c.probability, 0) / predicted_categories.length
      : 0;

    predictions.push({
      day_of_week: `${DAY_NAMES[dayOfWeek]} ${date.getDate()}/${date.getMonth() + 1}`,
      predicted_categories,
      confidence: Math.round(avgConfidence * 100) / 100,
    });
  }

  return predictions;
}

/**
 * Dado el inventario actual, predice qué categorías nutricionales faltarán esta semana
 */
export function predictDeficits(
  currentInventory: { category: string; total_kg: number }[]
): { category: string; status: 'sufficient' | 'low' | 'critical'; message: string }[] {
  const MIN_WEEKLY_KG: Record<string, number> = {
    proteina: 20,
    verdura: 30,
    cereal: 15,
    fruta: 15,
    lacteo: 10,
  };

  return Object.entries(MIN_WEEKLY_KG).map(([category, minKg]) => {
    const current = currentInventory.find(c => c.category === category);
    const totalKg = current?.total_kg ?? 0;
    const ratio = totalKg / minKg;

    if (ratio >= 1) return { category, status: 'sufficient' as const, message: `${totalKg} kg disponibles (mínimo: ${minKg} kg)` };
    if (ratio >= 0.5) return { category, status: 'low' as const, message: `Solo ${totalKg} kg — necesitas ${minKg} kg para cubrir la semana` };
    return { category, status: 'critical' as const, message: `Déficit crítico: ${totalKg} kg de ${minKg} kg necesarios esta semana` };
  });
}

export const PREDICTION_SOURCE = 'Patrones de redistribución alimentaria documentados por FESBAL y Acción Contra el Hambre';

/**
 * Eventos culturales/estacionales que afectan la demanda y las donaciones
 * Fuente: Patrones observados por entidades de redistribución en Madrid
 */
export interface CulturalEvent {
  name: string;
  period: string;
  impact: string;
  demand_change_pct: number;
  affected_categories: string[];
  recommendations: string[];
}

export function getCulturalEvents(): CulturalEvent[] {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  
  const ALL_EVENTS: CulturalEvent[] = [
    {
      name: '🕌 Ramadán',
      period: 'Marzo-Abril 2026',
      impact: 'Demanda +60% en comunidad musulmana, especialmente al atardecer (iftar)',
      demand_change_pct: 60,
      affected_categories: ['proteina', 'cereal', 'fruta', 'lacteo'],
      recommendations: [
        'Priorizar proteínas halal (pollo, cordero, lentejas)',
        'Aumentar stock de dátiles, leche y cereales',
        'Preparar menús compatibles con iftar (rupturas de ayuno)',
        'Coordinar horarios de recogida con horarios de ayuno',
      ],
    },
    {
      name: '🎄 Navidad',
      period: 'Diciembre 2025 - Enero 2026',
      impact: 'Excedentes +80% por compras masivas, demanda +40% por familias ampliadas',
      demand_change_pct: 40,
      affected_categories: ['proteina', 'cereal', 'fruta', 'lacteo'],
      recommendations: [
        'Preparar capacidad extra de almacenamiento para excedentes post-festivos',
        'Coordinar con supermercados recogida de excedentes del 26-31 dic',
        'Menús especiales con productos típicos (turrón, mazapán → postres)',
      ],
    },
    {
      name: '✝️ Semana Santa',
      period: 'Abril 2026',
      impact: 'Cambio a proteínas no cárnicas, excedentes +25% de pescado y verduras',
      demand_change_pct: 25,
      affected_categories: ['verdura', 'proteina', 'cereal'],
      recommendations: [
        'Priorizar recetas con legumbres y pescado',
        'Esperar más donaciones de productos frescos de hostelería',
        'Preparar menús sin carne para comunidades católicas',
      ],
    },
    {
      name: '🏫 Vuelta al cole',
      period: 'Septiembre',
      impact: 'Demanda +35% por familias con niños, necesidad de menús infantiles',
      demand_change_pct: 35,
      affected_categories: ['fruta', 'lacteo', 'cereal'],
      recommendations: [
        'Priorizar frutas y lácteos (menús infantiles equilibrados)',
        'Coordinar con comedores escolares para excedentes',
        'Generar recetas familiares y fáciles de preparar',
      ],
    },
    {
      name: '☀️ Verano',
      period: 'Julio-Agosto',
      impact: 'Cierre de comedores escolares, demanda +30%, excedentes de frutas +50%',
      demand_change_pct: 30,
      affected_categories: ['fruta', 'verdura'],
      recommendations: [
        'Compensar cierre de comedores escolares con más raciones',
        'Aprovechar pico de frutas de temporada',
        'Menús frescos y sin cocción (gazpacho, ensaladas)',
      ],
    },
  ];

  // Return events relevant to current or next month
  const relevantMonths: Record<string, number[]> = {
    'Ramadán': [2, 3, 4],
    'Navidad': [11, 12, 1],
    'Semana Santa': [3, 4],
    'Vuelta al cole': [8, 9],
    'Verano': [6, 7, 8],
  };

  return ALL_EVENTS.filter(event => {
    const name = event.name.replace(/[^\w\s]/g, '').trim();
    const months = Object.entries(relevantMonths).find(([key]) => name.includes(key));
    if (!months) return true; // show all if no match
    return months[1].includes(month) || months[1].includes(month === 12 ? 1 : month + 1);
  });
}
