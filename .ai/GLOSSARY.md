# NutriLink — Glosario

> Términos técnicos, institucionales y de dominio que aparecen en el proyecto.
> Útil para IAs que no conocen el contexto de seguridad alimentaria española.

---

## Organizaciones e instituciones

**AESAN** (Agencia Española de Seguridad Alimentaria y Nutrición)
: Organismo del Ministerio de Sanidad español. Publica BEDCA y regula la seguridad alimentaria.

**FESBAL** (Federación Española de Bancos de Alimentos)
: Red de 55 bancos de alimentos en España. Redistribuye a ~1,3M de personas.

**FEBA** (European Food Banks Federation)
: Red europea de 39 países, 460 bancos de alimentos. Mercado potencial de expansión.

**Acción contra el Hambre**
: ONG socia del programa Códigofacilito 2026. Tiene 300+ comedores sociales en España.

**MAPA** (Ministerio de Agricultura, Pesca y Alimentación)
: Publica el Observatorio de Precios de los Alimentos (snapshot usado: abril 2025).

---

## Datos y bases de datos

**BEDCA** (Base Española de Datos de Composición de Alimentos)
: Base de datos oficial española de composición nutricional de alimentos. Publicada por AESAN. Disponible como descarga (no tiene API REST pública). Usada en NutriLink como dataset local en `nutrition-db.ts`. URL: bedca.net

**Observatorio de Precios MAPA**
: Plataforma del MAPA con precios de alimentos en España. NutriLink usa snapshot estático de abril 2025. No se consulta en tiempo real — los precios son datos locales.

**BEDCA ID**
: Identificador numérico único de cada alimento en la base BEDCA. Ejemplo: `181` = Lentejas pardinas. Aparece en el badge "✓ Verificado BEDCA ref. 181" que muestra la app.

---

## Legislación

**Ley 1/2025** (Ley de Prevención de las Pérdidas y el Desperdicio Alimentario)
: Ley española en vigor desde enero 2025 que obliga a las entidades de redistribución alimentaria a medir y reportar el impacto nutricional de los alimentos redistribuidos. NutriLink facilita el cumplimiento de esta ley mediante trazabilidad BEDCA.
: BOE: https://www.boe.es/eli/es/l/2025/01/09/1

---

## Términos nutricionales del proyecto

**Macros / macronutrientes**
: Proteínas (protein_g), carbohidratos (carbs_g), grasas (fat_g), fibra (fiber_g). Expresados por 100g en BEDCA.

**Clasificación nutricional** (usada en CSVImporter y nutrition-db.ts)
: 🟢 Saludable: <200 kcal y <10g grasa por 100g
: 🟡 Moderado: 200-400 kcal o 10-20g grasa
: 🔴 Ocasional: >400 kcal o >20g grasa

**Ración equilibrada**
: Una comida principal que cubre: ≥15g proteína, ≥30g carbohidratos, 5-30g grasa, 200-700 kcal por ración (4 personas).

**Malnutrición oculta**
: Cuando una persona recibe suficientes calorías pero carece de nutrientes esenciales (proteínas, vitaminas, minerales). Afecta a ~1/3 de niños en familias usuarias de bancos de alimentos (fuente: Acción contra el Hambre 2024).

---

## Términos ESG y sostenibilidad

**CO₂ evitado**
: Estimación del CO₂ que se deja de emitir al redistribuir alimentos en lugar de desecharlos. Factor usado: 2.1 kg CO₂/kg alimento (EU FUSIONS / FAO).

**Reporting ESG**
: Environment, Social, Governance. Las empresas donantes necesitan acreditar su impacto social para sus informes de sostenibilidad. NutriLink genera estos datos automáticamente.

**Factor EU FUSIONS**
: Estudio europeo sobre desperdicio alimentario que establece el factor de conversión kg alimento → kg CO₂. Usado como estándar en NutriLink.

---

## Términos técnicos del proyecto

**Modo mock**
: Cuando no hay GOOGLE_API_KEY ni OPENAI_API_KEY configuradas, el sistema devuelve 3 recetas de demostración pre-generadas pero con macros calculados con BEDCA real. Completamente válido para presentaciones.

**Formato A / Formato B (CSV)**
: Formato A = cesta simple (10 productos, columna `nombre_producto`).
: Formato B = inventario completo (100+ productos, columnas `Producto`, `Kcal_100g`, etc.).

**Enriquecimiento nutricional**
: El proceso de cruzar cada producto del CSV con BEDCA para añadir macros, fuente y clasificación. Visible en el CSVImporter con animación y badge ✓.

**Badge verificado BEDCA**
: El indicador visual en las recetas generadas que certifica que los macros mostrados provienen de BEDCA y no del LLM.
