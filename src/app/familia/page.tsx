"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Users, CheckCircle, ChevronRight } from "lucide-react";
import type { Recipe } from "@/types";
import type { DietaryTag } from "@/types";
import { useAccessibility } from "@/components/AccessibilityProvider";
import { AccessibilityBar } from "@/components/AccessibilityBar";
import { DietaryFilter } from "@/components/DietaryFilter";

const categoryIcon = (is_balanced: boolean) =>
  is_balanced ? "✅" : "⚠️";

const DIETARY_ICONS: Record<DietaryTag, string> = {
  halal: '☪️',
  vegetariano: '🥬',
  sin_gluten: '🌾',
  sin_lactosa: '🥛',
  sin_frutos_secos: '🥜',
};

const DIETARY_LABEL_KEYS: Record<DietaryTag, string> = {
  halal: 'halal',
  vegetariano: 'vegetarian',
  sin_gluten: 'gluten_free',
  sin_lactosa: 'lactose_free',
  sin_frutos_secos: 'nut_free',
};

export default function FamiliaPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [reserving, setReserving] = useState(false);
  const [reserved, setReserved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dietaryFilter, setDietaryFilter] = useState<DietaryTag | null>(null);
  const { t } = useAccessibility();

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recipes");
      const data = await res.json();
      setRecipes(data.recipes ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);

  const handleReserve = async (recipe: Recipe) => {
    setReserving(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe_id: recipe.id }),
      });
      const data = await res.json();
      setReserved(data.reservation?.family_code ?? "FAM-OK");
    } catch { /* ignore */ }
    setReserving(false);
  };

  const spotsLeft = (r: Recipe) => r.max_reservations - r.reservations_count;
  const isUrgent = (r: Recipe) => {
    const d = new Date(r.available_until);
    const today = new Date();
    return (d.getTime() - today.getTime()) < 86400000;
  };

  const filteredRecipes = dietaryFilter
    ? recipes.filter(r => r.dietary_tags?.includes(dietaryFilter))
    : recipes;

  return (
    <div className="min-h-screen bg-gray-50 pb-accessibility">
      {/* Header */}
      <header className="bg-green-700 text-white px-4 py-4 sticky top-0 z-10 shadow" role="banner">
        <div className="max-w-md mx-auto">
          <h1 className="font-bold text-lg leading-tight">🥗 {t('weekly_menus')}</h1>
          <p className="text-green-200 text-xs">Demo: así verían las familias los menús desde su móvil</p>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4" role="main">
        {/* Info banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-800" role="status">
          <p>🌱 {t('info_banner').replace(/\*\*(.*?)\*\*/g, '$1')}</p>
        </div>

        {/* Dietary filters */}
        <DietaryFilter activeFilter={dietaryFilter} onFilter={setDietaryFilter} />

        {loading ? (
          <div className="space-y-3" aria-label={t('loading')}>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse h-32" role="status" />
            ))}
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 text-sm">{t('no_results')}</p>
          </div>
        ) : (
          <div className="space-y-3" role="list" aria-label={t('weekly_menus')}>
            {filteredRecipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => { setSelected(recipe); setReserved(null); }}
                className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-green-300 hover:shadow-md transition-all text-left tap-target"
                role="listitem"
                aria-label={`${recipe.title} — ${recipe.servings} ${t('servings')}, ${spotsLeft(recipe)} ${t('spots')}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {/* Status badges */}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {isUrgent(recipe) && (
                        <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">{t('last_day')}</span>
                      )}
                      {recipe.nutritional_summary.is_balanced && (
                        <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">{t('balanced')}</span>
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-800 text-sm leading-snug">{recipe.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{recipe.description}</p>

                    {/* Dietary tags as visual icons */}
                    {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {recipe.dietary_tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-0.5 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                            title={t(DIETARY_LABEL_KEYS[tag])}
                            aria-label={t(DIETARY_LABEL_KEYS[tag])}
                          >
                            <span aria-hidden="true">{DIETARY_ICONS[tag]}</span>
                            <span className="hidden sm:inline">{t(DIETARY_LABEL_KEYS[tag])}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quick stats with icons */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" aria-hidden="true" />{recipe.prep_time_min} {t('minutes')}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" aria-hidden="true" />{recipe.servings} {t('servings')}</span>
                      <span className="text-green-600 font-medium">{spotsLeft(recipe)} {t('spots')}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" aria-hidden="true" />
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Recipe Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
        >
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b border-gray-100 z-10">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-bold text-gray-800 text-lg leading-tight">{selected.title}</h2>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none tap-target flex items-center justify-center"
                  aria-label={t('close')}
                >
                  ×
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" aria-hidden="true" />{selected.prep_time_min} {t('minutes')}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" aria-hidden="true" />{selected.servings} {t('servings')}</span>
                <span>{categoryIcon(selected.nutritional_summary.is_balanced)} {selected.nutritional_summary.is_balanced ? t('balanced_diet') : t('check_balance')}</span>
              </div>

              {/* Dietary tags in modal header */}
              {selected.dietary_tags && selected.dietary_tags.length > 0 && (
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {selected.dietary_tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200"
                      aria-label={t(DIETARY_LABEL_KEYS[tag])}
                    >
                      <span aria-hidden="true">{DIETARY_ICONS[tag]}</span>
                      {t(DIETARY_LABEL_KEYS[tag])}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5 space-y-5">
              <p className="text-sm text-gray-600">{selected.description}</p>

              {/* BEDCA validation badge */}
              {selected.nutritional_summary.validated && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2 text-xs text-green-700" role="status">
                  <span aria-hidden="true">✅</span>
                  <span><strong>{t('bedca_verified')}</strong> — {t('bedca_desc')}</span>
                </div>
              )}

              {/* Nutrition — icon-enhanced visual cards */}
              <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-4 gap-2 text-center" role="group" aria-label="Nutrición">
                <div>
                  <p className="text-2xl mb-1" aria-hidden="true">🔥</p>
                  <p className="text-lg font-bold text-gray-700">{selected.nutritional_summary.calories}</p>
                  <p className="text-xs text-gray-400">{t('kcal')}</p>
                </div>
                <div>
                  <p className="text-2xl mb-1" aria-hidden="true">🥩</p>
                  <p className="text-lg font-bold text-red-600">{selected.nutritional_summary.protein_g}g</p>
                  <p className="text-xs text-gray-400">{t('protein')}</p>
                </div>
                <div>
                  <p className="text-2xl mb-1" aria-hidden="true">🌾</p>
                  <p className="text-lg font-bold text-yellow-600">{selected.nutritional_summary.carbs_g}g</p>
                  <p className="text-xs text-gray-400">{t('carbs')}</p>
                </div>
                <div>
                  <p className="text-2xl mb-1" aria-hidden="true">🫒</p>
                  <p className="text-lg font-bold text-blue-600">{selected.nutritional_summary.fat_g}g</p>
                  <p className="text-xs text-gray-400">{t('fats')}</p>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">{t('ingredients')}</h3>
                <ul className="space-y-1" role="list">
                  {selected.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-gray-700">{ing.item}</span>
                      <span className="text-gray-400 text-xs font-medium">{ing.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">{t('preparation')}</h3>
                <ol className="space-y-2" role="list">
                  {selected.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center" aria-hidden="true">{i + 1}</span>
                      <span className="text-gray-600">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Reserve button — large tap target */}
              {reserved ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center" role="alert">
                  <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" aria-hidden="true" />
                  <p className="font-bold text-green-700 text-lg">{t('reserve_confirmed')}</p>
                  <p className="text-sm text-gray-600 mt-1">{t('your_code')}: <strong className="text-xl">{reserved}</strong></p>
                  <p className="text-xs text-gray-500 mt-2">{t('show_at_center')}</p>
                </div>
              ) : (
                <button
                  onClick={() => handleReserve(selected)}
                  disabled={reserving || spotsLeft(selected) <= 0}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-5 rounded-xl text-base transition-colors tap-target"
                  aria-label={spotsLeft(selected) <= 0 ? t('no_spots') : `${t('reserve_button')} (${spotsLeft(selected)} ${t('spots')})`}
                >
                  {reserving ? t('reserving') : spotsLeft(selected) <= 0 ? t('no_spots') : `${t('reserve_button')} (${spotsLeft(selected)} ${t('spots')})`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating accessibility bar */}
      <AccessibilityBar />
    </div>
  );
}
