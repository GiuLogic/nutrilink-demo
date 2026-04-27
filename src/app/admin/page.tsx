"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Sparkles, RefreshCw, CheckCircle, AlertTriangle, Package, ShieldCheck, TrendingUp } from "lucide-react";
import type { FoodItem, Recipe } from "@/types";

const CATEGORIES: FoodItem["category"][] = ["verdura", "fruta", "proteina", "cereal", "lacteo", "otro"];
const CATEGORY_EMOJI: Record<FoodItem["category"], string> = {
  verdura: "🥦", fruta: "🍎", proteina: "🍗", cereal: "🌾", lacteo: "🥛", otro: "📦",
};

const EXPIRY_COLOR = (date: string) => {
  const days = (new Date(date).getTime() - Date.now()) / 86400000;
  if (days <= 1) return "text-red-600 bg-red-50";
  if (days <= 3) return "text-orange-600 bg-orange-50";
  return "text-green-600 bg-green-50";
};

const TREND_ICON = (trend: string) => {
  if (trend === 'rising') return '📈';
  if (trend === 'falling') return '📉';
  return '➡️';
};

export default function AdminPage() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "verdura" as FoodItem["category"],
    quantity_kg: "", expiry_date: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, recipesRes] = await Promise.all([
        fetch("/api/food-items"),
        fetch("/api/recipes"),
      ]);
      const itemsData = await itemsRes.json();
      const recipesData = await recipesRes.json();
      setFoodItems(itemsData.items ?? []);
      setRecipes(recipesData.recipes ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addItem = async () => {
    if (!form.name || !form.quantity_kg || !form.expiry_date) return;
    try {
      const res = await fetch("/api/food-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity_kg: parseFloat(form.quantity_kg),
        }),
      });
      const data = await res.json();
      setFoodItems(prev => [...prev, data.item]);
      setForm({ name: "", category: "verdura", quantity_kg: "", expiry_date: "" });
      setShowForm(false);
    } catch { /* ignore */ }
  };

  const removeItem = async (id: string) => {
    await fetch("/api/food-items", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setFoodItems(prev => prev.filter(i => i.id !== id));
  };

  const generateRecipes = async () => {
    setGenerating(true);
    setGeneratedMessage(null);
    try {
      const genRes = await fetch("/api/generate-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodItems }),
      });
      const genData = await genRes.json();
      if (genData.recipes?.length) {
        await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipes: genData.recipes }),
        });
        setRecipes(prev => [...genData.recipes, ...prev]);
        const msg = genData.demo
          ? `✅ Generadas ${genData.recipes.length} recetas de demo — macros verificados con BEDCA (configura OPENAI_API_KEY para recetas reales)`
          : `✅ IA generó ${genData.recipes.length} recetas — valores nutricionales validados con BEDCA`;
        setGeneratedMessage(msg);
      }
    } catch { /* ignore */ }
    setGenerating(false);
  };

  const urgentItems = foodItems.filter(i => {
    const days = (new Date(i.expiry_date).getTime() - Date.now()) / 86400000;
    return days <= 2;
  });

  const totalValue = foodItems.reduce((s, i) => s + (i.market_price?.total_value_eur ?? 0), 0);
  const totalKg = foodItems.reduce((s, i) => s + i.quantity_kg, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-orange-600 text-white px-4 py-4 sticky top-0 z-10 shadow">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1">
            <h1 className="font-bold text-lg leading-tight">⚙️ Vista ONG — Banco de Alimentos Vallecas</h1>
            <p className="text-orange-200 text-xs">Demo: así se vería NutriLink integrado en tu sistema de gestión actual</p>
          </div>
          <button
            onClick={generateRecipes}
            disabled={generating || foodItems.length === 0}
            className="flex items-center gap-2 bg-white text-orange-600 font-semibold text-xs px-3 py-2 rounded-xl disabled:opacity-50 hover:bg-orange-50 transition-colors shadow-sm"
          >
            {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? "Generando..." : "Generar menús IA"}
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Alert generated */}
        {generatedMessage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2 text-sm text-green-800">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{generatedMessage}</p>
          </div>
        )}

        {/* Urgent alert */}
        {urgentItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-sm text-red-800">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong>¡Atención!</strong> {urgentItems.length} alimento(s) caducan en menos de 48h:
              {" "}{urgentItems.map(i => i.name).join(", ")}. Genera menús para aprovecharlos.
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Ingredientes", value: foodItems.length, color: "text-orange-600" },
            { label: "Total kg", value: `${totalKg}`, color: "text-green-600" },
            { label: "Valor mercado", value: `${totalValue.toFixed(0)}€`, color: "text-blue-600" },
            { label: "Urgentes ⚠️", value: urgentItems.length, color: "text-red-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Inventory Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-500" /> Inventario de Excedentes
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Añadir
            </button>
          </div>

          {/* Add form */}
          {showForm && (
            <div className="px-5 py-4 bg-orange-50 border-b border-orange-100 grid grid-cols-2 gap-3">
              <input
                className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="Nombre del alimento (ej: Tomates)"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as FoodItem["category"] }))}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{CATEGORY_EMOJI[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
              <input
                type="number"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder="Cantidad (kg)"
                value={form.quantity_kg}
                onChange={e => setForm(f => ({ ...f, quantity_kg: e.target.value }))}
              />
              <input
                type="date"
                className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={form.expiry_date}
                onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))}
              />
              <button
                onClick={addItem}
                className="col-span-2 bg-orange-600 text-white font-semibold py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors"
              >
                Añadir al inventario
              </button>
            </div>
          )}

          {/* Items list */}
          {loading ? (
            <div className="p-5 space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {foodItems.map(item => {
                const daysLeft = Math.ceil((new Date(item.expiry_date).getTime() - Date.now()) / 86400000);
                return (
                  <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="text-xl">{CATEGORY_EMOJI[item.category]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        <span>{item.quantity_kg} kg</span>
                        {item.market_price && (
                          <span className="text-blue-500 font-medium">{item.market_price.total_value_eur.toFixed(2)}€ {TREND_ICON(item.market_price.trend)}</span>
                        )}
                        {item.nutritional_value?.source && (
                          <span className="flex items-center gap-0.5 text-green-500" title={`Fuente: ${item.nutritional_value.source}`}>
                            <ShieldCheck className="w-3 h-3" /> BEDCA
                          </span>
                        )}
                      </div>
                      {item.nutritional_value && (
                        <div className="flex gap-2 text-xs text-gray-300 mt-0.5">
                          <span>{item.nutritional_value.calories_per_100g} kcal</span>
                          <span>{item.nutritional_value.protein_g}g prot</span>
                          <span>{item.nutritional_value.carbs_g}g carbs</span>
                          <span>{item.nutritional_value.fat_g}g grasa</span>
                          <span className="text-gray-300">/ 100g</span>
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${EXPIRY_COLOR(item.expiry_date)}`}>
                      {daysLeft <= 0 ? "Caducado" : daysLeft === 1 ? "Hoy" : `${daysLeft}d`}
                    </span>
                    <button onClick={() => removeItem(item.id)} className="p-1 text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                );
              })}
              {foodItems.length === 0 && (
                <li className="px-5 py-8 text-center text-sm text-gray-400">
                  No hay excedentes registrados. Añade el primero.
                </li>
              )}
            </ul>
          )}

          {/* Data sources footer */}
          {foodItems.length > 0 && (
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-4">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-500" /> Datos nutricionales: BEDCA (bedca.net)</span>
              <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-blue-500" /> Precios: MAPA Observatorio (mapa.gob.es)</span>
            </div>
          )}
        </div>

        {/* Generated Recipes Preview */}
        {recipes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-500" /> Menús Generados ({recipes.length})
              </h2>
            </div>
            <ul className="divide-y divide-gray-50">
              {recipes.slice(0, 5).map(r => (
                <li key={r.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-xl">🍽️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{r.title}</p>
                    <p className="text-xs text-gray-400">
                      {r.servings} raciones · {r.nutritional_summary.calories} kcal
                      {r.nutritional_summary.validated && (
                        <span className="text-green-500 ml-1">· ✓ BEDCA</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {r.nutritional_summary.is_balanced && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Equilibrado</span>
                    )}
                    {r.nutritional_summary.validated && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Verificado</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
