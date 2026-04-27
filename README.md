# 🔗 NutriLink

> **La capa de inteligencia nutricional para los sistemas de redistribución alimentaria en España.**

[![Demo](https://img.shields.io/badge/Demo%20en%20vivo-nutrilink--demo.vercel.app-orange?style=for-the-badge)](https://nutrilink-demo.vercel.app/demo)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![BEDCA](https://img.shields.io/badge/Validación-BEDCA%20AESAN-green?style=flat-square)](https://www.bedca.net)
[![Gemini](https://img.shields.io/badge/IA-Gemini%201.5%20Flash-blue?style=flat-square&logo=google)](https://aistudio.google.com)

---

## ¿Qué es NutriLink?

España redistribuye **140.000 toneladas de alimentos al año** a 1,3 millones de personas vulnerables — pero sin información nutricional. Las familias reciben calorías, no dietas equilibradas.

**NutriLink** no es una plataforma nueva. Es la capa de inteligencia que se conecta a los sistemas que ya usan los bancos de alimentos, enriqueciendo cada excedente con datos nutricionales oficiales y generando menús verificados automáticamente.

---

## 🎯 Flujo core (demo funcionando)

```
CSV con excedentes
      ↓
Enriquecimiento BEDCA (Base Española de Datos de Composición de Alimentos — AESAN)
  → Clasificación 🟢 Saludable / 🟡 Moderado / 🔴 Ocasional
      ↓
Generación de menús (Google Gemini 1.5 Flash)
  → La IA genera SOLO nombres e instrucciones
      ↓
Validación nutricional con BEDCA
  → Los macros se recalculan con BEDCA, nunca con la IA
  → Badge ✓ Verificado BEDCA con ID trazable
```

**Diferenciador clave:** Ningún valor nutricional mostrado proviene del LLM. BEDCA lo certifica todo.

---

## 🚀 Demo en vivo

**[nutrilink-demo.vercel.app/demo](https://nutrilink-demo.vercel.app/demo)**

| Ruta | Actor | Contenido |
|------|-------|-----------|
| `/demo` ⭐ | Jurado / Público | Flujo completo CSV → BEDCA → Menús verificados |
| `/admin` | ONG / Banco de Alimentos | Inventario, alertas inflación, generación de recetas |
| `/familia` | Familia beneficiaria | Menús, reservas, filtros halal/vegano/sin gluten |
| `/dashboard` | Empresa donante | Dashboard ESG, CO₂, valor económico, certificado |
| `/` | General | Presentación del producto |

---

## ⚙️ Stack técnico

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| Frontend | Next.js 16 + TypeScript + Tailwind CSS | UI responsive, App Router |
| Base de datos | Supabase / PostgreSQL | Inventario y recetas |
| IA (menús) | Google Gemini 1.5 Flash | Genera estructura y nombres |
| Validación nutricional | BEDCA local (AESAN) | Calcula todos los macros |
| Precios | MAPA Observatorio (snapshot abr. 2025) | Valor económico excedentes |
| Deploy | Vercel | CD automático desde GitHub |

**Coste estimado piloto:** ~25€/mes (Gemini free tier + Vercel free + Supabase free)

---

## 📦 Instalación local

```bash
# Clonar
git clone https://github.com/GiuLogic/nutrilink-demo.git
cd nutrilink-demo

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local y añadir GOOGLE_API_KEY

# Desarrollo
npm run dev
# → http://localhost:3000
```

### Variables de entorno

```env
# .env.local — NUNCA subir a Git

# IA (prioridad: Gemini → OpenAI → Mock automático)
GOOGLE_API_KEY=AIzaSy...     # aistudio.google.com/apikey — GRATIS

# Supabase (opcional para la demo /demo)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

> **Sin API key:** la demo funciona con 3 recetas de muestra con macros BEDCA reales. Completamente válido para presentaciones.

---

## 📊 Formatos CSV compatibles

### Formato A — Cesta simple (10 productos)
```csv
nombre_producto,cantidad_kg,fecha_caducidad,id_bedca,donante
Lentejas pardinas,5,2026-06-15,181,Mercadona Av. Albufera
Arroz blanco,3,2026-08-20,99,Carrefour Vallecas
```

### Formato B — Inventario completo (100+ productos)
```csv
ID_Lote,Producto,Categoria,Cantidad_kg,BEDCA_ID,Kcal_100g,Proteinas_g,Carbohidratos_g,Grasas_g,Precio_MAPA_kg,Valor_Total_Euros
LOT-9728,Pan de molde,Cereales y Tubérculos,148.9,0100,352,2.5,67.7,2.1,2.18,324.6
```

El importer detecta el formato automáticamente.

---

## 🧱 Estructura del proyecto

```
src/
├── app/
│   ├── demo/page.tsx          # ⭐ Flujo principal de la demo
│   ├── admin/page.tsx         # Vista ONG / Banco de Alimentos
│   ├── familia/page.tsx       # Vista familias beneficiarias
│   ├── dashboard/page.tsx     # Dashboard ESG empresas donantes
│   └── api/
│       └── generate-recipes/route.ts  # API: Gemini → OpenAI → Mock
├── components/
│   └── CSVImporter.tsx        # Importer multi-formato con enriquecimiento BEDCA
├── lib/
│   ├── nutrition-db.ts        # Base de datos BEDCA local (50 alimentos)
│   ├── nutrition-validator.ts # Recalcula macros con BEDCA post-IA
│   ├── economic-calculator.ts # Valor económico con precios MAPA
│   ├── ai/
│   │   └── gemini.ts          # Wrapper Google Generative AI
│   └── store.ts               # Estado global (Zustand)
└── types/index.ts             # Tipos TypeScript compartidos
```

---

## 🔬 Validación nutricional — por qué es el diferenciador

```typescript
// ❌ Lo que NO hacemos
const macros = await openai.chat("¿Cuántas calorías tiene esta receta?");
// → Los LLM alucinan valores nutricionales con frecuencia

// ✅ Lo que SÍ hacemos
const macros = validateRecipeNutrition(ingredients, servings);
// → Cruza cada ingrediente con BEDCA (AESAN)
// → Calcula macros por peso exacto
// → Devuelve ID BEDCA trazable por ingrediente
```

---

## 📈 Impacto medible

Por cada **100 kg redistribuidos con NutriLink:**

| Métrica | Valor | Fuente |
|---------|-------|--------|
| Raciones equilibradas | ~250 | BEDCA + estándar OMS |
| Valor nutricional | ~185€ | Precios MAPA abr. 2025 |
| CO₂ evitado | ~210 kg | Factor EU FUSIONS/FAO 2.1 kg/kg |
| Trazabilidad | 100% | ID BEDCA por ingrediente |

---

## ⚖️ Cumplimiento Ley 1/2025

La [Ley 1/2025 de Prevención del Desperdicio Alimentario](https://www.boe.es/eli/es/l/2025/01/09/1) impulsa la trazabilidad nutricional en toda la cadena de redistribución. NutriLink proporciona exactamente los registros auditables que la ley requiere.

---

## 🗺️ Roadmap

| Fase | Feature | Estado |
|------|---------|--------|
| ✅ MVP | CSV → BEDCA → Menús verificados | **Deployado** |
| Phase 2 | Matching semántico automático (sin mapeo manual) | Planificado |
| Phase 2 | Motor predicción de disponibilidad | Planificado |
| Phase 2 | Multiidioma completo (AR/RO/ZH) | Planificado |
| Phase 3 | Reporting ESG automático + certificado PDF | En diseño |
| Phase 3 | Integración API bancos de alimentos (FESBAL) | En negociación |

---

## 📞 Contacto

**Proyecto:** Acción contra el Hambre × Códigofacilito 2026  
**Demo:** [nutrilink-demo.vercel.app/demo](https://nutrilink-demo.vercel.app/demo)  
**GitHub:** [github.com/GiuLogic/nutrilink-demo](https://github.com/GiuLogic/nutrilink-demo)  
**Email:** giulialgz@gmail.com

---

*NutriLink — "No somos una plataforma nueva. Somos la inteligencia que les faltaba."*
