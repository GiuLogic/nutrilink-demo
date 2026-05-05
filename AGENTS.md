# NutriLink — Instrucciones para agentes IA

> Este archivo es leído automáticamente por Cline, Cursor, Claude Code y Gemini CLI.
> **Léelo completo antes de responder al usuario o hacer cualquier cambio.**

---

## 📂 Orden de lectura obligatorio al iniciar cualquier sesión

1. `AGENTS.md` ← estás aquí
2. `.ai/CONTEXT.md` ← overview del proyecto (empieza siempre por aquí)
3. `.ai/ROADMAP.md` ← qué está hecho y qué queda pendiente
4. `.ai/ARCHITECTURE.md` ← stack y patrones técnicos
5. `.ai/DECISIONS.md` ← decisiones irreversibles (NO discutir, solo cumplir)

---

## 🔴 Reglas inviolables

1. **BEDCA sobre IA siempre** — los valores nutricionales mostrados al usuario SIEMPRE provienen de `nutrition-db.ts` (BEDCA), NUNCA del LLM. Es el diferenciador del producto.
2. **No subir `.env.local` a git** — contiene API keys privadas.
3. **No añadir dependencias npm** sin justificarlo explícitamente con el usuario.
4. **No cambiar la estructura de tipos** en `src/types/index.ts` sin preguntar — muchos componentes dependen de ella.
5. **No eliminar el modo mock** de `/api/generate-recipes/route.ts` — es esencial para demos sin API key.

---

## ✅ Convenciones de código

- **Idioma de la UI:** español
- **Componentes:** Server Components por defecto; `"use client"` solo cuando sea estrictamente necesario (estado interactivo, hooks)
- **Estilos:** Tailwind CSS puro — no crear CSS custom files
- **Estado global:** Zustand en `src/lib/store.ts`
- **Tipos:** todos en `src/types/index.ts`
- **Imports:** alias `@/` para todo lo que esté en `src/`
- **Formato de fechas:** ISO 8601 (`YYYY-MM-DD`)

---

## 🏗️ Stack (no cambiar sin consultar)

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js App Router | 16.x |
| Lenguaje | TypeScript | estricto |
| UI | Tailwind CSS | 3.x |
| Estado | Zustand | latest |
| IA (menús) | Google Gemini 1.5 Flash | API |
| IA (fallback) | OpenAI GPT-4o-mini | API |
| Validación nutricional | BEDCA local (`nutrition-db.ts`) | — |
| DB | Supabase / PostgreSQL | — |
| Deploy | Vercel | free tier |

---

## 🔄 Protocolo al finalizar una sesión

Antes de cerrar, actualiza estos archivos:
1. `.ai/ROADMAP.md` — marcar lo completado, añadir lo pendiente
2. `.ai/DECISIONS.md` — si se tomó alguna decisión técnica importante
3. Commit: `git add .ai/ && git commit -m "docs: actualizar memoria [fecha]"`

---

## 🚀 Prompt universal para retomar sesión

```
Lee .ai/CONTEXT.md, .ai/ROADMAP.md y .ai/DECISIONS.md.
Dime el estado del proyecto, qué quedó pendiente y qué decisiones irreversibles existen.
No propongas cambios hasta que yo te indique en qué quiero trabajar.
```

---

## 📁 Estructura del proyecto (nivel alto)

```
D:\MVP\nutrilink\
├── .ai/                    ← Memoria persistente del proyecto
│   ├── CONTEXT.md
│   ├── ARCHITECTURE.md
│   ├── DECISIONS.md
│   ├── ROADMAP.md
│   ├── GLOSSARY.md
│   └── PROMPTS.md
├── pitch/                  ← Materiales de pitch (narrativa)
│   ├── guion_3min.md
│   ├── pitch_v2.md         (pendiente)
│   └── feedback_paolo.md   (pendiente)
├── public/
│   └── cesta_demo.csv      ← CSV de demo para presentaciones
├── src/
│   ├── app/
│   │   ├── demo/           ← ⭐ Flujo principal demo (Demo Day)
│   │   ├── admin/          ← Vista ONG/banco de alimentos
│   │   ├── familia/        ← Vista familias beneficiarias
│   │   ├── dashboard/      ← Vista empresa donante (ESG)
│   │   └── api/
│   │       └── generate-recipes/route.ts
│   ├── components/
│   │   └── CSVImporter.tsx ← Multi-formato (simple + inventario 100 prods)
│   ├── lib/
│   │   ├── nutrition-db.ts      ← BEDCA local (50 alimentos)
│   │   ├── nutrition-validator.ts ← Recalcula macros post-IA
│   │   ├── economic-calculator.ts ← Valor MAPA + CO₂
│   │   ├── ai/gemini.ts         ← Wrapper Gemini
│   │   └── store.ts             ← Estado global Zustand
│   └── types/index.ts
├── AGENTS.md               ← Este archivo (leído por Cline/Cursor/etc.)
├── README.md
└── pitch_deck.html         ← Deck v1 (10 slides, tiene QR)
```
