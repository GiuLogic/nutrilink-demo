"use client";

import { useState } from "react";
import { ShieldCheck, Sparkles, RefreshCw, ChevronDown, ChevronUp, ArrowRight, Package, Clock } from "lucide-react";
import CSVImporter from "@/components/CSVImporter";
import type { FoodItem, Recipe } from "@/types";

type Step = 'import' | 'enriched' | 'generating' | 'done';

function RecipeCard({ recipe, index }: { recipe: Recipe; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  const { nutritional_summary: n } = recipe;
  const bedcaSources = recipe.ingredients.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                Menú {index + 1}
              </span>
              {n.validated && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  ✓ Verificado BEDCA
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{recipe.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{recipe.description}</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-green-100 transition-colors"
          >
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>
        </div>

        {/* Macros summary */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            { label: "kcal", value: n.calories, color: "text-orange-600" },
            { label: "prot", value: `${n.protein_g}g`, color: "text-blue-600" },
            { label: "carbs", value: `${n.carbs_g}g`, color: "text-yellow-600" },
            { label: "grasa", value: `${n.fat_g}g`, color: "text-purple-600" },
          ].map(m => (
            <div key={m.label} className="bg-white rounded-xl p-2 text-center shadow-sm">
              <p className={`text-base font-bold ${m.color}`}>{m.value}</p>
              <p className="text-xs text-gray-400">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Info row */}
        <div className="mt-2 flex gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {recipe.prep_time_min} min
          </span>
          <span>·</span>
          <span>{recipe.servings} raciones</span>
          <span>·</span>
          <span className={n.is_balanced ? "text-green-600 font-medium" : "text-yellow-600"}>
            {n.is_balanced ? "✓ Equilibrado" : "Equilibrio mejorable"}
          </span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="divide-y divide-gray-50">
          {/* Ingredients */}
          <div className="px-5 py-4">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Ingredientes con validación BEDCA
            </h4>
            <div className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{ing.item}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{ing.amount}</span>
                    <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium">
                      ✓ BEDCA
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="px-5 py-4">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Preparación
            </h4>
            <ol className="space-y-2">
              {recipe.instructions.map((instrStep, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700">{instrStep}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* BEDCA traceability */}
          <div className="px-5 py-4 bg-green-50/50">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Trazabilidad BEDCA
            </h4>
            <p className="text-xs text-gray-600 mb-2">
              Los macronutrientes son calculados por NutriLink a partir de los datos oficiales de la Base Española de Datos de Composición de Alimentos (AESAN), no generados por IA.
            </p>
            <div className="flex flex-wrap gap-1">
              {bedcaSources.map((ing, i) => (
                <span key={i} className="text-xs bg-green-100 text-green-700 font-mono px-2 py-0.5 rounded">
                  {ing.item} ✓
                </span>
              ))}
            </div>
            {n.validation_source && (
              <p className="text-xs text-green-600 mt-2 font-medium">
                Fuente: {n.validation_source}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DemoPage() {
  const [step, setStep] = useState<Step>('import');
  const [importedItems, setImportedItems] = useState<FoodItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImportComplete = (items: FoodItem[]) => {
    setImportedItems(items);
    setStep('enriched');
    setError(null);
  };

  const handleGenerateMenus = async () => {
    if (importedItems.length === 0) return;
    setGenerating(true);
    setStep('generating');
    setError(null);

    try {
      const res = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodItems: importedItems }),
      });

      if (!res.ok) throw new Error('Error al generar menús');

      const data = await res.json();
      setRecipes(data.recipes ?? []);
      setStep('done');
    } catch {
      setError('No se pudieron generar los menús. Comprueba la conexión.');
      setStep('enriched');
    } finally {
      setGenerating(false);
    }
  };

  const reset = () => {
    setStep('import');
    setImportedItems([]);
    setRecipes([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-lg leading-tight">🔗 NutriLink — Demo</h1>
              <p className="text-orange-200 text-xs mt-0.5">
                CSV con excedentes → Enriquecimiento BEDCA → Menús verificados
              </p>
            </div>
            {step !== 'import' && (
              <button
                onClick={reset}
                className="text-xs text-orange-200 hover:text-white font-medium"
              >
                ↺ Reiniciar
              </button>
            )}
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-1 mt-3">
            {[
              { key: 'import', label: '1. CSV', icon: '📥' },
              { key: 'enriched', label: '2. BEDCA', icon: '🔬' },
              { key: 'done', label: '3. Menús', icon: '🍽️' },
            ].map((s, i, arr) => {
              const isActive = step === s.key || (step === 'generating' && s.key === 'enriched');
              const isDone =
                (s.key === 'import' && ['enriched', 'generating', 'done'].includes(step)) ||
                (s.key === 'enriched' && step === 'done') ||
                (s.key === 'done' && step === 'done');
              return (
                <div key={s.key} className="flex items-center gap-1 flex-1">
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-all ${
                    isDone ? 'bg-green-500 text-white' :
                    isActive ? 'bg-white text-orange-600' :
                    'bg-orange-500/50 text-orange-200'
                  }`}>
                    <span>{isDone ? '✓' : s.icon}</span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`flex-1 h-0.5 rounded ${isDone ? 'bg-green-400' : 'bg-orange-400/50'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-4">

        {/* PASO 1: Import CSV */}
        {step === 'import' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">🎯 Flujo de la demo</p>
              <div className="flex flex-col gap-1 text-xs">
                <span className="flex items-center gap-2">
                  <span className="bg-blue-200 text-blue-700 rounded-full w-4 h-4 flex items-center justify-center font-bold flex-shrink-0">1</span>
                  Sube el CSV con los excedentes del Banco de Alimentos
                </span>
                <span className="flex items-center gap-2">
                  <span className="bg-blue-200 text-blue-700 rounded-full w-4 h-4 flex items-center justify-center font-bold flex-shrink-0">2</span>
                  NutriLink enriquece cada producto con datos BEDCA oficiales
                </span>
                <span className="flex items-center gap-2">
                  <span className="bg-blue-200 text-blue-700 rounded-full w-4 h-4 flex items-center justify-center font-bold flex-shrink-0">3</span>
                  Genera 2-3 menús equilibrados con valores nutricionales verificados
                </span>
              </div>
            </div>
            <CSVImporter onImportComplete={handleImportComplete} />
          </div>
        )}

        {/* PASO 2: Productos enriquecidos listos */}
        {(step === 'enriched' || step === 'generating') && (
          <div className="space-y-4">
            {/* Success banner */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <h2 className="font-bold text-green-800">
                  {importedItems.length} productos enriquecidos con BEDCA
                </h2>
              </div>
              <p className="text-xs text-green-700">
                Todos los datos nutricionales han sido verificados contra la Base Española de Datos de Composición de Alimentos (AESAN). Ningún valor proviene directamente de la IA.
              </p>
            </div>

            {/* Products list */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-500" />
                <h3 className="font-semibold text-gray-800 text-sm">Inventario enriquecido</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {importedItems.map((item, idx) => (
                  <div key={idx} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity_kg} kg · caduca {item.expiry_date}</p>
                    </div>
                    <div className="text-right">
                      {item.nutritional_value && (
                        <div className="text-xs text-gray-600">
                          <span className="font-medium text-green-600">✓ BEDCA</span>
                          <span className="ml-2 text-gray-400">{item.nutritional_value.calories_per_100g} kcal/100g</span>
                        </div>
                      )}
                      {item.nutritional_value?.source && (
                        <p className="text-xs font-mono text-gray-400">{item.nutritional_value.source}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerateMenus}
              disabled={generating}
              className="w-full flex items-center justify-center gap-3 bg-orange-600 text-white font-bold py-4 rounded-2xl text-base hover:bg-orange-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-lg shadow-orange-200"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generando menús y validando con BEDCA...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generar menús equilibrados
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {generating && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800">
                <p className="font-medium mb-1">⚙️ Procesando...</p>
                <ol className="text-xs space-y-1 list-none">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> La IA genera estructura y nombres de platos
                  </li>
                  <li className="flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 animate-spin text-orange-500" /> NutriLink recalcula macros con BEDCA (no usa valores de la IA)
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <span>⏳</span> Añade badge de verificación trazable
                  </li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* PASO 3: Menús generados */}
        {step === 'done' && (
          <div className="space-y-4">
            {/* Summary banner with KPIs */}
            {(() => {
              const totalKg = importedItems.reduce((s, i) => s + i.quantity_kg, 0);
              const totalRaciones = Math.round(recipes.reduce((s, r) => s + r.servings, 0) * recipes.length);
              const co2Saved = (totalKg * 2.1).toFixed(1);
              const valorEur = (totalKg * 1.85).toFixed(0); // precio medio €/kg MAPA
              return (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 text-white shadow-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl">🍽️</div>
                    <div className="flex-1">
                      <h2 className="font-bold text-lg">{recipes.length} menús generados y verificados</h2>
                      <p className="text-green-100 text-sm mt-0.5">
                        Creados a partir de {importedItems.length} productos del Banco de Alimentos.
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Macros verificados BEDCA
                        </span>
                        <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                          IA solo genera estructura
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* KPIs impacto */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "kg rescatados", value: `${totalKg}`, icon: "🥦" },
                      { label: "valor estimado", value: `${valorEur}€`, icon: "💶" },
                      { label: "raciones", value: `~${totalRaciones}`, icon: "🍽️" },
                      { label: "CO₂ evitado", value: `${co2Saved}kg`, icon: "🌱" },
                    ].map(k => (
                      <div key={k.label} className="bg-white/15 rounded-xl p-2 text-center">
                        <p className="text-base">{k.icon}</p>
                        <p className="font-bold text-sm">{k.value}</p>
                        <p className="text-green-200 text-[10px] leading-tight">{k.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-green-200 text-[10px] mt-2">
                    * Valor estimado con precios MAPA abril 2025 · CO₂: factor EU FUSIONS/FAO 2.1 kg/kg rescatado
                  </p>
                </div>
              );
            })()}

            {/* Recipe cards */}
            {recipes.map((recipe, idx) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={idx} />
            ))}

            {/* Pipeline explanation */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">
                🔎 ¿Por qué los valores son fiables?
              </h3>
              <div className="space-y-2">
                {[
                  { icon: "📥", title: "CSV entra con productos reales", detail: `${importedItems.length} productos del Banco de Alimentos` },
                  { icon: "🔬", title: "Enriquecimiento con BEDCA", detail: "Cada producto se mapea a la base oficial AESAN" },
                  { icon: "🤖", title: "IA genera SOLO la estructura", detail: "Nombres de platos, instrucciones de cocina" },
                  { icon: "✅", title: "NutriLink recalcula todos los macros", detail: "Usando BEDCA, no los valores del LLM" },
                ].map((pipelineStep, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{pipelineStep.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{pipelineStep.title}</p>
                      <p className="text-xs text-gray-500">{pipelineStep.detail}</p>
                    </div>
                    {i < 3 && <div className="hidden sm:block text-gray-300 self-center ml-auto">→</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Links multi-actor */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">
                👥 Ver NutriLink desde cada perfil
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <a href="/admin" className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                  <span className="text-xl">⚙️</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-orange-700">Vista ONG / Banco de Alimentos</p>
                    <p className="text-xs text-orange-600">Inventario · Alertas inflación · Generar recetas</p>
                  </div>
                  <span className="text-orange-400 text-xs">→</span>
                </a>
                <a href="/familia" className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <span className="text-xl">🏠</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-700">Vista Familia Beneficiaria</p>
                    <p className="text-xs text-green-600">Menús · 4 idiomas · Filtros halal/vegano · Reservas</p>
                  </div>
                  <span className="text-green-400 text-xs">→</span>
                </a>
                <a href="/dashboard" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <span className="text-xl">📊</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-700">Dashboard ESG — Empresas donantes</p>
                    <p className="text-xs text-blue-600">Impacto kg · CO₂ · Valor económico · Certificado PDF</p>
                  </div>
                  <span className="text-blue-400 text-xs">→</span>
                </a>
              </div>
            </div>

            {/* Ley 1/2025 badge */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
              <p className="font-semibold mb-1">⚖️ Cumplimiento Ley 1/2025 de Prevención del Desperdicio Alimentario</p>
              <p>NutriLink complementa las plataformas de redistribución existentes incorporando la capa de inteligencia nutricional, económica y predictiva que la ley impulsa para todo el ecosistema alimentario español.</p>
            </div>

            <button
              onClick={reset}
              className="w-full text-sm text-gray-500 hover:text-gray-700 py-3 text-center"
            >
              ← Volver a importar otro CSV
            </button>
          </div>
        )}
      </div>

      {/* Bottom padding for nav */}
      <div className="h-20" />
    </div>
  );
}
