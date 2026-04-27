"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { t as translate, getDir, LOCALES } from "@/lib/i18n";

interface AccessibilityState {
  locale: Locale;
  highContrast: boolean;
  setLocale: (l: Locale) => void;
  toggleHighContrast: () => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const AccessibilityContext = createContext<AccessibilityState>({
  locale: 'es',
  highContrast: false,
  setLocale: () => {},
  toggleHighContrast: () => {},
  t: (k) => k,
  dir: 'ltr',
});

export function useAccessibility() {
  return useContext(AccessibilityContext);
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');
  const [highContrast, setHighContrast] = useState(false);

  // Persist preferences in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nutrilink_locale');
    if (saved && ['es', 'ar', 'ro', 'zh'].includes(saved)) {
      setLocaleState(saved as Locale);
    }
    const savedHC = localStorage.getItem('nutrilink_hc');
    if (savedHC === 'true') setHighContrast(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('nutrilink_locale', l);
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => {
      localStorage.setItem('nutrilink_hc', String(!prev));
      return !prev;
    });
  }, []);

  const t = useCallback((key: string) => {
    return translate(locale, key as Parameters<typeof translate>[1]);
  }, [locale]);

  const dir = getDir(locale);

  return (
    <AccessibilityContext.Provider value={{ locale, highContrast, setLocale, toggleHighContrast, t, dir }}>
      <div dir={dir} className={highContrast ? 'high-contrast' : ''}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}
