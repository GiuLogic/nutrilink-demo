"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingUp, Leaf, Euro, Users, Heart, ShieldCheck, AlertTriangle, Brain, Calendar } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend,
} from "recharts";
import type { ImpactMetrics, PredictionData } from "@/types";
import { ESGCertificate } from "@/components/ESGCertificate";
import type { CulturalEvent } from "@/lib/prediction-engine";

const WEEK_LABELS: Record<string, string> = {
  "2026-03-30": "30 Mar",
  "2026-04-06": "6 Abr",
  "2026-04-13": "13 Abr",
};

const CATEGORY_EMOJI: Record<string, string> = {
  proteina: "🍗", verdura: "🥦", cereal: "🌾", fruta: "🍎", lacteo: "🥛",
};

const DEFICIT_COLOR: Record<string, string> = {
  sufficient: "bg-green-100 text-green-700",
  low: "bg-yellow-100 text-yellow-700",
  critical: "bg-red-100 text-red-700",
};

interface DashboardData {
  metrics: ImpactMetrics[];
  predictions: PredictionData[];
  deficits: { category: string; status: string; message: string }[];
  inflation_alerts: { food_name: string; trend_pct: number; price: number }[];
  economic_report: { total_value_eur: number; co2_saved_kg: number; source: string };
  esg_summary: {
    economic: { value: string; detail: string };
    environmental: { value: string; detail: string };
    social: { value: string; detail: string };
    legal: { value: string; detail: string };
  };
  cultural_events: CulturalEvent[];
  mercamadrid: { name: string; description: string; relevance: string; stats: { tons_per_year: number; companies: number; workers: number } };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/impacts");
      const json = await res.json();
      setData(json);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  const metrics = data?.metrics ?? [];
  const predictions = data?.predictions ?? [];
  const deficits = data?.deficits ?? [];
  const inflationAlerts = data?.inflation_alerts ?? [];
  const esg = data?.esg_summary;
  const culturalEvents = data?.cultural_events ?? [];
  const mercamadrid = data?.mercamadrid;

  const totals = metrics.reduce(
    (acc, m) => ({
      kg: acc.kg + m.kg_rescued,
      eur: acc.eur + m.economic_value_eur,
      portions: acc.portions + m.portions_generated,
      balanced: acc.balanced + m.balanced_portions,
      families: acc.families + m.families_served,
      co2: acc.co2 + m.co2_saved_kg,
    }),
    { kg: 0, eur: 0, portions: 0, balanced: 0, families: 0, co2: 0 }
  );

  const chartData = metrics.map(m => ({
    week: WEEK_LABELS[m.week_of] ?? m.week_of,
    "Kg rescatados": m.kg_rescued,
    "Raciones equilibradas": m.balanced_portions,
    "Familias servidas": m.families_served,
    "Valor (€)": m.economic_value_eur,
  }));

  const balancedPct = totals.portions > 0
    ? Math.round((totals.balanced / totals.portions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white px-4 py-4 sticky top-0 z-10 shadow">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-bold text-lg leading-tight">📊 Dashboard de Impacto — NutriLink</h1>
          <p className="text-blue-200 text-xs">Métricas verificadas para empresas, ONGs y administración · Madrid 2026</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4 space-y-5">
        {/* Legal compliance banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <strong>⚖️ Ley 1/2025, de 1 de abril, de prevención de las pérdidas y el desperdicio alimentario:</strong> Esta plataforma genera automáticamente las métricas necesarias para el reporte de cumplimiento legal y el <strong>reporting ESG</strong> de empresas donantes.
        </div>

        {/* ESG Summary for donors */}
        {esg && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" /> Informe ESG para empresas donantes
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-0 divide-x divide-y divide-gray-100">
              {[
                { icon: "💶", label: "Económico", ...esg.economic },
                { icon: "🌍", label: "Ambiental", ...esg.environmental },
                { icon: "👨‍👩‍👧‍👦", label: "Social", ...esg.social },
                { icon: "⚖️", label: "Legal", ...esg.legal },
              ].map(item => (
                <div key={item.label} className="p-4">
                  <p className="text-xs text-gray-400 mb-1">{item.icon} {item.label}</p>
                  <p className="text-lg font-bold text-gray-800">{item.value}</p>
                  <p className="text-xs text-gray-400 mt-1 leading-snug">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Impact dimensions callout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          {[
            { emoji: "💶", title: "Valor económico recuperado", desc: "Precio de mercado verificado con MAPA para informes RSC y ESG" },
            { emoji: "📈", title: "Inflación alimentaria", desc: "Monitorización de variaciones de precios en alimentos básicos" },
            { emoji: "🌍", title: "Desperdicio evitado", desc: `${totals.co2} kg CO₂ evitados (factor 2.1 kg CO₂/kg — EU FUSIONS/FAO)` },
          ].map(d => (
            <div key={d.title} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-2xl mb-1">{d.emoji}</p>
              <p className="font-semibold text-gray-700 text-xs mb-1">{d.title}</p>
              <p className="text-xs text-gray-400">{d.desc}</p>
            </div>
          ))}
        </div>

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Kg rescatados", value: `${totals.kg} kg`, icon: <Leaf className="w-5 h-5" />, color: "text-green-700", bg: "bg-green-50 border-green-200" },
              { label: "Valor económico", value: `${totals.eur.toLocaleString("es-ES")} €`, icon: <Euro className="w-5 h-5" />, color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
              { label: "Raciones generadas", value: totals.portions.toString(), icon: <TrendingUp className="w-5 h-5" />, color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
              { label: "Raciones equilibradas", value: `${balancedPct}%`, icon: <Heart className="w-5 h-5" />, color: "text-pink-700", bg: "bg-pink-50 border-pink-200" },
              { label: "Familias atendidas", value: totals.families.toString(), icon: <Users className="w-5 h-5" />, color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
              { label: "CO₂ evitado", value: `${totals.co2} kg`, icon: <Leaf className="w-5 h-5" />, color: "text-teal-700", bg: "bg-teal-50 border-teal-200" },
            ].map(kpi => (
              <div key={kpi.label} className={`rounded-2xl border p-4 ${kpi.bg}`}>
                <div className={`${kpi.color} mb-1`}>{kpi.icon}</div>
                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-tight">{kpi.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Inflation Alerts */}
        {inflationAlerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h2 className="font-semibold text-amber-800 text-sm flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4" /> Alertas de inflación alimentaria
            </h2>
            <div className="space-y-2">
              {inflationAlerts.map(a => (
                <div key={a.food_name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{a.food_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{a.price.toFixed(2)} €/kg</span>
                    <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${a.trend_pct > 15 ? 'bg-red-100 text-red-700' : a.trend_pct > 8 ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      +{a.trend_pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-amber-500 mt-3">Fuente: MAPA Observatorio de Precios · Variación interanual</p>
          </div>
        )}

        {/* Predictions */}
        {predictions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" /> Estimación de donaciones — próximos 7 días
              </h2>
            </div>
            <div className="p-4 space-y-2">
              {predictions.slice(0, 5).map(p => (
                <div key={p.day_of_week} className="flex items-center gap-3 text-sm">
                  <span className="text-xs font-medium text-gray-600 w-24">{p.day_of_week}</span>
                  <div className="flex-1 flex gap-1 flex-wrap">
                    {p.predicted_categories.slice(0, 4).map(c => (
                      <span key={c.category} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                        {CATEGORY_EMOJI[c.category] ?? '📦'} {c.avg_kg}kg ({Math.round(c.probability * 100)}%)
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
              Basado en patrones estadísticos de redistribución · Evoluciona con datos reales del centro
            </div>
          </div>
        )}

        {/* Deficit alerts */}
        {deficits.some(d => d.status !== 'sufficient') && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" /> Estado nutricional del inventario
            </h2>
            <div className="space-y-2">
              {deficits.map(d => (
                <div key={d.category} className="flex items-center gap-2 text-sm">
                  <span className="text-lg">{CATEGORY_EMOJI[d.category] ?? '📦'}</span>
                  <span className="capitalize font-medium text-gray-700 w-20">{d.category}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DEFICIT_COLOR[d.status] ?? ''}`}>
                    {d.status === 'sufficient' ? '✓ OK' : d.status === 'low' ? '⚠️ Bajo' : '🚨 Crítico'}
                  </span>
                  <span className="text-xs text-gray-400 flex-1">{d.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts */}
        {!loading && chartData.length > 0 && (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-700 mb-4 text-sm">Kg rescatados por semana</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="Kg rescatados" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-700 mb-4 text-sm">Evolución de impacto social</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="Raciones equilibradas" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Familias servidas" stroke="#9333ea" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-700 mb-4 text-sm">Valor económico del rescate (€) — Precios MAPA</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `${v} €`} />
                  <Bar dataKey="Valor (€)" fill="#d97706" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Cultural Events - Predictive Planning */}
        {culturalEvents.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" /> Calendario estacional — Planificación de demanda
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {culturalEvents.map(event => (
                <div key={event.name} className="border border-orange-100 rounded-xl p-4 bg-orange-50/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800 text-sm">{event.name}</span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                      Demanda +{event.demand_change_pct}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{event.period} · {event.impact}</p>
                  <div className="space-y-1">
                    {event.recommendations.slice(0, 2).map((rec, i) => (
                      <p key={i} className="text-xs text-gray-600 flex items-start gap-1">
                        <span className="text-green-500">✓</span> {rec}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mercamadrid Data Source */}
        {mercamadrid && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
              🏪 Fuente de datos: {mercamadrid.name}
            </h2>
            <p className="text-xs text-gray-500 mb-3">{mercamadrid.description}</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-blue-50 rounded-lg p-2">
                <p className="text-sm font-bold text-blue-700">{(mercamadrid.stats.tons_per_year / 1_000_000).toFixed(1)}M</p>
                <p className="text-[10px] text-gray-500">Toneladas/año</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-2">
                <p className="text-sm font-bold text-blue-700">{mercamadrid.stats.companies}</p>
                <p className="text-[10px] text-gray-500">Empresas</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-2">
                <p className="text-sm font-bold text-blue-700">{mercamadrid.stats.workers.toLocaleString('es-ES')}</p>
                <p className="text-[10px] text-gray-500">Trabajadores</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{mercamadrid.relevance}</p>
          </div>
        )}

        {/* ESG Certificate Download */}
        {!loading && data && (
          <ESGCertificate data={{
            entity_name: 'Banco de Alimentos de Madrid — Demo Vallecas',
            period: 'Marzo-Abril 2026',
            economic_value: `${totals.eur.toLocaleString('es-ES')} €`,
            co2_saved: `${totals.co2} kg CO₂`,
            portions: totals.portions,
            balanced_pct: balancedPct,
            families: totals.families,
            kg_rescued: totals.kg,
          }} />
        )}

        {/* Data sources */}
        <div className="bg-gray-100 rounded-xl p-4 text-xs text-gray-500 space-y-1">
          <p className="font-semibold text-gray-600">📋 Fuentes de datos verificables</p>
          <p>🥦 Datos nutricionales: <strong>BEDCA</strong> — Base Española de Datos de Composición de Alimentos (bedca.net) — AESAN, Ministerio de Consumo</p>
          <p>💶 Precios de mercado: <strong>MAPA</strong> — Observatorio de Precios de los Alimentos (mapa.gob.es) — Ministerio de Agricultura</p>
          <p>🏪 Precios mayoristas: <strong>Mercamadrid</strong> — Mayor mercado de alimentos frescos de España (mercamadrid.es)</p>
          <p>🌍 Factor CO₂: <strong>EU FUSIONS / FAO</strong> — 2.1 kg CO₂ evitados por kg de alimento rescatado</p>
          <p>📈 Predicciones: Patrones de redistribución documentados por <strong>FESBAL</strong> y <strong>Acción Contra el Hambre</strong></p>
        </div>

        {/* SDG Callout */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl p-5 text-white text-center">
          <p className="text-sm font-medium opacity-90 mb-1">Contribuyendo a los Objetivos de Desarrollo Sostenible</p>
          <div className="flex items-center justify-center gap-4 mt-2 text-2xl">
            <span title="ODS 2 - Hambre Cero">🌾</span>
            <span title="ODS 3 - Salud y Bienestar">❤️</span>
            <span title="ODS 10 - Reducción Desigualdades">⚖️</span>
            <span title="ODS 12 - Producción Responsable">♻️</span>
            <span title="ODS 13 - Acción Climática">🌍</span>
          </div>
          <p className="text-xs opacity-75 mt-2">ODS 2 · ODS 3 · ODS 10 · ODS 12 · ODS 13</p>
        </div>
      </div>
    </div>
  );
}
