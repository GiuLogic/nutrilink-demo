# NutriLink — Architecture

> Decisiones técnicas de bajo nivel. Para decisiones de producto, ver `DECISIONS.md`.

---

## Stack completo

```
Frontend:     Next.js 16 (App Router) + TypeScript + Tailwind CSS
Estado:       Zustand (src/lib/store.ts)
IA menús:     Google Gemini 1.5 Flash → fallback OpenAI GPT-4o-mini → fallback Mock
Nutrición:    BEDCA local (src/lib/nutrition-db.ts) — NUNCA del LLM
Precios:      MAPA snapshot abril 2025 (src/lib/economic-calculator.ts)
DB:           Supabase/PostgreSQL (opcional — demo funciona sin ella)
Deploy:       Vercel (CD automático desde GitHub master)
```

---

## Flujo de datos (API /generate-recipes)

```
POST /api/generate-recipes
  ↓
1. Lee body UNA sola vez (request.json())  ← BUG histórico: doble lectura → fix
  ↓
2. Selector de proveedor:
   GOOGLE_API_KEY → callGemini()
   OPENAI_API_KEY → callOpenAI()
   Sin key        → buildMockRecipes()  ← siempre disponible
  ↓
3. normalizeRecipes() / calcRecipeNutrition()
   - lookupNutrition(name) en BEDCA
   - Si no hay match BEDCA: usa nutritional_value del CSV (Formato B)
   - Si no hay nada: calories = 0 (visible en UI, no se inventa)
  ↓
4. Response: { recipes, demo: bool, provider: string }
```

---

## CSVImporter — formatos soportados

### Formato A (cesta simple)
```
nombre_producto, cantidad_kg, fecha_caducidad, id_bedca, donante
```
Detectado por: header `nombre_producto`

### Formato B (inventario completo — 100+ productos)
```
ID_Lote, Producto, Categoria, Cantidad_kg, BEDCA_ID,
Kcal_100g, Proteinas_g, Carbohidratos_g, Grasas_g,
Precio_MAPA_kg, Valor_Total_Euros
```
Detectado por: header `Producto` + `Kcal_100g`

**Fallback inteligente:** Si el producto no está en BEDCA local pero el CSV trae valores nutricionales (Formato B), se usan esos valores con badge "Inventario (valores del proveedor)".

---

## Estructura de archivos clave

```
src/
├── app/
│   ├── demo/page.tsx              ⭐ Flujo principal demo
│   ├── admin/page.tsx             Vista ONG
│   ├── familia/page.tsx           Vista familias
│   ├── dashboard/page.tsx         Vista ESG empresas
│   └── api/
│       └── generate-recipes/
│           └── route.ts           API route (Gemini/OpenAI/Mock)
├── components/
│   ├── CSVImporter.tsx            Multi-formato + enriquecimiento BEDCA
│   └── BottomNav.tsx              Navegación móvil
├── lib/
│   ├── nutrition-db.ts            BEDCA local — 50 alimentos con IDs
│   ├── nutrition-validator.ts     validateRecipeNutrition() post-IA
│   ├── economic-calculator.ts     calculateEconomicValue() con MAPA
│   ├── ai/
│   │   └── gemini.ts              Wrapper @google/generative-ai
│   └── store.ts                   Zustand store (FoodItem[], Recipe[])
└── types/
    └── index.ts                   FoodItem, Recipe, NutritionalValue...
```

---

## Tipos principales (src/types/index.ts)

```typescript
FoodItem {
  id, name, category, quantity_kg, expiry_date,
  nutritional_value?: { calories_per_100g, protein_g, carbs_g, fat_g, source },
  market_price?: { price_eur_per_kg, total_value_eur, trend, source },
  is_active, created_at
}

Recipe {
  id, title, description, ingredients[], instructions[],
  servings, prep_time_min,
  nutritional_summary: { calories, protein_g, carbs_g, fat_g, fiber_g,
                          is_balanced, validated, validation_source },
  dietary_tags[], available_until, reservations_count, max_reservations,
  generated_at, is_active
}
```

---

## Variables de entorno

```env
# Obligatorias para IA (al menos una)
GOOGLE_API_KEY=          # Gemini — recomendado (free tier generoso)
OPENAI_API_KEY=          # OpenAI — fallback

# Opcionales (demo funciona sin ellas)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Sin ninguna key → modo mock automático con macros BEDCA reales.

---

## Patrones importantes

### BEDCA lookup
```typescript
// src/lib/nutrition-db.ts
const bedca = lookupNutrition(productName);  // fuzzy matching por nombre
// Devuelve: { calories_per_100g, protein_g, carbs_g, fat_g, fiber_g,
//             nutritional_class: 'saludable'|'moderado'|'ocasional',
//             source: 'BEDCA ref. NNN' }
```

### Clasificación nutricional inferida
```typescript
// Cuando no hay match BEDCA pero el CSV trae macros:
function inferNutritionalClass(kcal, fat_g):
  kcal > 400 || fat_g > 20 → 'ocasional'
  kcal > 200 || fat_g > 10 → 'moderado'
  else                     → 'saludable'
```

### Balanced meal check
```
protein_g >= 15 AND carbs_g >= 30 AND fat_g 5-30 AND calories 200-700
```
