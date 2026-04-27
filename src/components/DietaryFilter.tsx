"use client";

import { useAccessibility } from "./AccessibilityProvider";

export type DietaryTag = 'halal' | 'vegetariano' | 'sin_gluten' | 'sin_lactosa' | 'sin_frutos_secos';

interface DietaryFilterProps {
  activeFilter: DietaryTag | null;
  onFilter: (tag: DietaryTag | null) => void;
}

const FILTER_OPTIONS: { tag: DietaryTag | null; icon: string; labelKey: string }[] = [
  { tag: null,                icon: '🍽️', labelKey: 'all' },
  { tag: 'halal',            icon: '☪️', labelKey: 'halal' },
  { tag: 'vegetariano',      icon: '🥬', labelKey: 'vegetarian' },
  { tag: 'sin_gluten',       icon: '🌾', labelKey: 'gluten_free' },
  { tag: 'sin_lactosa',      icon: '🥛', labelKey: 'lactose_free' },
  { tag: 'sin_frutos_secos', icon: '🥜', labelKey: 'nut_free' },
];

export function DietaryFilter({ activeFilter, onFilter }: DietaryFilterProps) {
  const { t } = useAccessibility();

  return (
    <div className="mb-4" role="group" aria-label={t('filter_diet')}>
      <p className="text-xs text-gray-500 mb-2 font-medium">{t('filter_diet')}</p>
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map(({ tag, icon, labelKey }) => {
          const isActive = activeFilter === tag;
          return (
            <button
              key={labelKey}
              onClick={() => onFilter(tag)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all
                ${isActive
                  ? 'bg-green-600 text-white shadow-md scale-105'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                }`}
              aria-pressed={isActive}
              aria-label={t(labelKey)}
            >
              <span className="text-base" aria-hidden="true">{icon}</span>
              <span>{t(labelKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
