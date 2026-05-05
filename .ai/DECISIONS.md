# NutriLink — Architecture Decision Records (ADR)

> Registro de decisiones importantes con contexto y razón.
> **No revertir estas decisiones sin nueva entrada en este log.**

---

## ADR-001 — BEDCA como dataset local (no API)
**Fecha:** 26 abril 2026  
**Estado:** ✅ Adoptado  

**Contexto:** BEDCA (bedca.net) no tiene API REST pública. Es un dataset descargable (Excel/XML) de AESAN.

**Decisión:** Extraer subconjunto de ~50 alimentos prioritarios e integrarlo en `src/lib/nutrition-db.ts` como datos estáticos en TypeScript.

**Consecuencias:**
- ✅ Sin dependencia de conectividad externa
- ✅ Latencia cero (lookup local)
- ✅ La demo funciona offline
- ⚠️ Hay que actualizar manualmente cuando BEDCA publique nuevas versiones
- ⚠️ ~50 alimentos no cubren el universo completo (Phase 2: matching semántico)

**Alternativas rechazadas:**
- Scraping bedca.net → frágil, viola ToS
- API de terceros con datos nutricionales → no son datos oficiales AESAN

---

## ADR-002 — IA genera estructura, BEDCA certifica macros
**Fecha:** 26 abril 2026  
**Estado:** ✅ Adoptado — DIFERENCIADOR CORE, NO CAMBIAR

**Contexto:** Los LLMs (Gemini, GPT) inventan/aproximan valores nutricionales con frecuencia. Para ONGs y reportes ESG/Ley 1/2025, los datos deben ser auditables.

**Decisión:** 
- Gemini solo genera: nombre del plato, descripción, instrucciones, lista de ingredientes
- NUNCA se muestran los valores nutricionales que genera el LLM
- Post-procesamiento: `validateRecipeNutrition()` recalcula macros ingrediente por ingrediente con BEDCA

**Consecuencias:**
- ✅ Datos 100% auditables con ID BEDCA trazable
- ✅ Cumple requisitos Ley 1/2025
- ✅ Diferenciador frente a competencia
- ⚠️ Si un ingrediente no está en BEDCA y el CSV no trae macros → macros = 0 (visible en UI)

**Regla para el pitch:** "La IA genera. BEDCA certifica."

---

## ADR-003 — Modo mock obligatorio (sin API key)
**Fecha:** 26 abril 2026  
**Estado:** ✅ Adoptado

**Contexto:** Para demos en salas sin conectividad o sin API key configurada.

**Decisión:** `buildMockRecipes()` en `route.ts` siempre disponible como último fallback. Usa los `nutritional_value` que vienen en el `FoodItem` importado (del CSV).

**Consecuencias:**
- ✅ La demo funciona siempre, incluso sin GOOGLE_API_KEY
- ✅ Los mocks usan ingredientes reales del CSV importado
- ✅ Los macros son reales (de BEDCA o del CSV)

---

## ADR-004 — CSV multi-formato (A simple + B inventario)
**Fecha:** 27 abril 2026  
**Estado:** ✅ Adoptado

**Contexto:** El CSV de la demo original tenía formato simple (10 productos). El banco de alimentos puede tener inventarios de 100+ productos con macros pre-calculados.

**Decisión:** Detectar formato automáticamente en `parseCSV()` por cabeceras. Formato B usa los macros del propio CSV como fallback si no hay match en BEDCA.

**Consecuencias:**
- ✅ Compatible con cualquier CSV que tenga columna "Producto" o "nombre_producto"
- ✅ Productos sin match BEDCA no dan error si el CSV trae macros

---

## ADR-005 — Deploy Vercel free tier para piloto
**Fecha:** 27 abril 2026  
**Estado:** ✅ Adoptado

**Contexto:** Piloto sin presupuesto. ONG no puede pagar infraestructura cara.

**Decisión:** Vercel (free) + Gemini free tier (1.500 req/día) + Supabase free (500MB). Total: ~25€/mes en fase piloto (solo si se supera el free tier).

**Límites a vigilar:**
- Gemini free: 1.500 requests/día, 15 RPM
- Vercel free: 100GB bandwidth, funciones serverless 10s timeout
- Supabase free: 500MB DB, 2GB bandwidth

---

## ADR-006 — `request.json()` se lee UNA sola vez
**Fecha:** 27 abril 2026  
**Estado:** ✅ Fix aplicado

**Contexto (bug):** En versiones anteriores de `route.ts`, `request.json()` se llamaba dos veces (una en validación, otra en el body). En Next.js App Router el body stream solo puede leerse una vez — la segunda lectura devuelve `{}`.

**Fix:** Leer el body al inicio del handler y almacenar en variable `const body = await request.json()`. Acceder solo a `body` después.

---

## Decisiones pendientes (Phase 2)

| Decisión | Opciones | Estado |
|----------|---------|--------|
| Matching semántico BEDCA | Embeddings vs. fuzzy string | 🔲 No decidido |
| Modelo de pricing freemium | 49€/mes empresa vs. por uso | 🔲 No decidido |
| Multiidioma | i18next vs. next-intl | 🔲 No decidido |
| RGPD / usuarios reales | Clerk vs. NextAuth vs. Supabase Auth | 🔲 No decidido |
