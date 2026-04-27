import { NextResponse } from 'next/server';
import { DEMO_IMPACT, DEMO_FOOD_ITEMS } from '@/lib/store';
import { calculateEconomicReport, generateESGSummary } from '@/lib/economic-calculator';
import { getPredictions, predictDeficits, getCulturalEvents } from '@/lib/prediction-engine';
import { getInflationAlerts, MERCAMADRID_INFO } from '@/lib/price-db';

export async function GET() {
  const report = calculateEconomicReport(DEMO_FOOD_ITEMS);

  const categoryTotals = DEMO_FOOD_ITEMS.reduce((acc, item) => {
    const existing = acc.find(c => c.category === item.category);
    if (existing) existing.total_kg += item.quantity_kg;
    else acc.push({ category: item.category, total_kg: item.quantity_kg });
    return acc;
  }, [] as { category: string; total_kg: number }[]);

  const predictions = getPredictions();
  const deficits = predictDeficits(categoryTotals);
  const inflationAlerts = getInflationAlerts(5.0).slice(0, 5);
  const culturalEvents = getCulturalEvents();

  const totalFamilies = DEMO_IMPACT.reduce((s, m) => s + m.families_served, 0);
  const totalPortions = DEMO_IMPACT.reduce((s, m) => s + m.portions_generated, 0);
  const totalBalanced = DEMO_IMPACT.reduce((s, m) => s + m.balanced_portions, 0);
  const balancedPct = totalPortions > 0 ? Math.round((totalBalanced / totalPortions) * 100) : 0;

  const esg = generateESGSummary(report, totalFamilies, balancedPct);

  return NextResponse.json({
    metrics: DEMO_IMPACT,
    economic_report: report,
    predictions,
    deficits,
    inflation_alerts: inflationAlerts.map(a => ({
      food_name: a.name,
      trend_pct: a.trend_pct,
      price: a.price_eur_per_kg,
    })),
    esg_summary: esg,
    cultural_events: culturalEvents,
    mercamadrid: MERCAMADRID_INFO,
  });
}
