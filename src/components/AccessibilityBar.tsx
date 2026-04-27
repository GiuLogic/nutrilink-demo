"use client";

import { useAccessibility } from "./AccessibilityProvider";
import { LOCALES } from "@/lib/i18n";
import { Eye } from "lucide-react";

/**
 * Floating accessibility bar: language selector + high contrast toggle.
 * Designed for vulnerable users: large tap targets, flag icons (no text needed).
 */
export function AccessibilityBar() {
  const { locale, setLocale, highContrast, toggleHighContrast, t } = useAccessibility();

  return (
    <div 
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-white/95 backdrop-blur border border-gray-200 rounded-full px-2 py-1.5 shadow-lg"
      role="toolbar"
      aria-label={t('language')}
    >
      {/* Language flags */}
      {LOCALES.map((loc) => (
        <button
          key={loc.code}
          onClick={() => setLocale(loc.code)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all
            ${locale === loc.code 
              ? 'bg-green-100 ring-2 ring-green-500 scale-110' 
              : 'hover:bg-gray-100 opacity-70 hover:opacity-100'
            }`}
          aria-label={loc.name}
          aria-pressed={locale === loc.code}
          title={loc.name}
        >
          {loc.flag}
        </button>
      ))}

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* High contrast toggle */}
      <button
        onClick={toggleHighContrast}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
          ${highContrast 
            ? 'bg-yellow-400 text-black ring-2 ring-yellow-600' 
            : 'hover:bg-gray-100 text-gray-500'
          }`}
        aria-label={t('high_contrast')}
        aria-pressed={highContrast}
        title={t('high_contrast')}
      >
        <Eye className="w-5 h-5" />
      </button>
    </div>
  );
}
