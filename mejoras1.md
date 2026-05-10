# NutriLink — Mejoras de flujos internos (v1)

> Documento generado: 9 mayo 2026  
> Contexto: Análisis pre-Demo Day (13 mayo 2026)  
> Objetivo: documentar mejoras necesarias, correcciones de datos y decisiones estratégicas

---

## 1. AUDITORÍA DE DATOS NUTRICIONALES (nutrition-db.ts)

### Estado actual: 45 alimentos con datos BEDCA

**Resultado de la auditoría:**
- ~43 alimentos tienen IDs BEDCA verificables y valores correctos ✅
- 2 alimentos (Tofu, Cuscús) marcados como "BEDCA estimado" — sin ID oficial ⚠️
- Los valores nutricionales (kcal, proteínas, carbs, grasas) son del orden correcto

### Problemas detectados:

| Problema | Severidad | Solución |
|----------|-----------|----------|
| Tofu y Cuscús no tienen ID BEDCA real | 🟡 Baja | Marcar como "estimación propia" o eliminar del subset BEDCA |
| La clasificación 🟢🟡🔴 es NUESTRA, no de BEDCA | 🟡 Media | Decir "clasificación NutriLink según criterios OMS" — no "clasificación BEDCA" |
| 45 alimentos no cubren todo el universo | 🟡 Media | Phase 2: matching semántico con embeddings |

### Qué decir en el pitch:
- ✅ "Datos de BEDCA (AESAN), base oficial española de composición de alimentos"
- ✅ "Clasificación nutricional NutriLink siguiendo criterios OMS"
- ❌ NO decir "clasificación BEDCA" (BEDCA no clasifica así)
- ❌ NO decir "todos los alimentos cubiertos" (solo 45 de ~800 en BEDCA completo)

---

## 2. AUDITORÍA DE PRECIOS (price-db.ts)

### Estado actual: ~35 precios PVP basados en "abril 2025"

**Resultado de la auditoría:**
- Precios al consumidor razonables para 2025
- Necesitan actualización a 2026 (tenemos informe MAPA S13/2026)

### Problemas detectados:

| Problema | Severidad | Solución propuesta |
|----------|-----------|-------------------|
| Atún = 16.50€/kg (es precio de atún FRESCO) | 🔴 Alta | Añadir "Atún en conserva" a ~9€/kg separado |
| Fecha "abril 2025" obsoleta | 🟡 Media | Actualizar a "marzo 2026" con datos MAPA S13 |
| Aceite de oliva 9.50€/L — ha bajado en 2026 | 🟡 Media | Ajustar a ~8.50€/L según MAPA S13 (427€/100kg) |

### Precios a actualizar (PVP ajustado con referencia MAPA S13-2026):

| Producto | Actual (2025) | MAPA origen S13/2026 | PVP propuesto 2026 | Acción |
|----------|--------------|---------------------|-------------------|--------|
| Aceite de oliva | 9.50 €/L | 4.27 €/kg (almazara) | **8.50 €/L** | ↓ Bajar |
| Arroz blanco | 1.30 €/kg | 4.62 €/kg (cáscara japónica) | **1.40 €/kg** | ↑ Subir |
| Patata | 1.05 €/kg | 0.58 €/kg | **1.15 €/kg** | ↑ Subir |
| Naranja | 1.50 €/kg | 0.89 €/kg (todas var.) | **1.65 €/kg** | ↑ Subir |
| Pollo pechuga | 6.50 €/kg | 4.95 €/kg (canal) | **6.80 €/kg** | ↑ Subir |
| Huevos | 2.80 €/doc | 2.43 €/doc (jaula L) | **2.50 €/doc** | ↓ Bajar |
| Tomate | 2.15 €/kg | 1.77 €/kg (redondo) | **2.30 €/kg** | ↑ Subir |
| Zanahoria | 1.10 €/kg | 0.42 €/kg | **1.15 €/kg** | = Mantener |
| Cebolla | 1.25 €/kg | 0.35 €/kg | **1.20 €/kg** | ↓ Ligeramente |
| **NUEVO: Atún conserva** | — | — | **9.00 €/kg** | Añadir |

---

## 3. ESTRATEGIA DE PRECIOS PARA REPORTING ESG

### Decisión: Usar PVP (Precio Venta al Público)

**Razón:** El estándar ESG para valorar donaciones es el "Fair Market Value" — lo que costaría al beneficiario comprar esos alimentos en el mercado.

**Fuentes que respaldan esta decisión:**
- FESBAL: valora donaciones a precio medio al consumidor
- GRI (Global Reporting Initiative): "Fair market value at point of donation"
- Normativa fiscal española: valor de mercado del bien donado

**Fuente a citar:** "Precios medios al consumidor, referenciados con Informe Semanal de Coyuntura MAPA, Semana 13/2026"

### Frecuencia de actualización: MENSUAL

**Justificación:**
- Los informes ESG son anuales o trimestrales
- La diferencia semanal vs mensual es <0.5% en el total
- Para reporting Ley 1/2025, mensual es más que suficiente

---

## 4. AUTOMATIZACIÓN DE PRECIOS (Roadmap)

### Opciones analizadas:

| Opción | Complejidad | Para cuándo | Descripción |
|--------|-------------|------------|-------------|
| **A) Supabase (RECOMENDADA piloto)** | Media (4-6h) | Q3 2026 | Tabla `precios_alimentos` actualizable por admin 1x/mes |
| **B) Scraping MAPA PDF** | Alta (15-20h) | Phase 2 | Script que descarga PDF semanal y extrae precios |
| **C) API INE (IPC)** | Baja (3-4h) | Q3 2026 | Ajuste automático por inflación oficial. API: `servicios.ine.es/wstempus/js/` |

### Decisión para Demo Day (13 mayo):
- **Precios hardcodeados en `price-db.ts`** actualizados a marzo 2026
- En el pitch: "Actualización mensual con datos MAPA oficiales. En producción: integración API INE."

### Decisión para Piloto (Q3 2026):
- Opción A (Supabase) + Opción C (INE IPC) como complemento

---

## 5. LOS 4 PILARES — EVALUACIÓN DE REALISMO

### Estado actual de cada pilar:

| Pilar | ¿Funciona en la demo? | ¿Datos reales? | Riesgo en pitch |
|-------|----------------------|---------------|-----------------|
| 🏷️ Categorización nutricional (BEDCA) | ✅ Sí | ~95% real | 🟢 Bajo |
| 💶 Valor económico (MAPA) | ✅ Sí | ~90% real | 🟡 Medio (atún) |
| 🍳 Recetas optimizadas (IA + BEDCA) | ✅ Sí | ✅ Real | 🟢 Bajo |
| 📈 Predicciones (FESBAL + culturales) | ❌ **NO EXISTE** | ❌ Sin datos | 🔴 **ALTO** |

### Decisión: Renombrar Pilar 4

**Antes:** "📈 Predicciones — FESBAL + eventos culturales"  
**Después:** "📊 Reporting ESG — Ley 1/2025 + CO₂"

**Razón:** El reporting ESG (`/dashboard`) SÍ funciona en la demo. Muestra CO₂ evitado, valor económico y métricas de impacto social. Las predicciones son Phase 2.

**Qué decir en el pitch sobre predicciones:**
> "En Phase 2, con datos históricos de FESBAL, el módulo predictivo anticipará picos de demanda por eventos culturales (Ramadán, Navidad, inicio de curso)."

---

## 6. CORRECCIONES DE LENGUAJE PARA EL PITCH

| ❌ NO decir | ✅ SÍ decir |
|------------|------------|
| "Datos en tiempo real de BEDCA" | "Base BEDCA oficial integrada localmente en NutriLink" |
| "Conectado a Mercamadrid" | "Precios MAPA, contrastables con Mercamadrid en producción" |
| "Predicciones funcionando" | "Módulo predictivo en desarrollo (Phase 2, con datos FESBAL)" |
| "Clasificación BEDCA" | "Clasificación NutriLink basada en criterios OMS" |
| "Todos los alimentos cubiertos" | "Subconjunto BEDCA con los 45 alimentos más comunes en redistribución" |
| "Precios actualizados automáticamente" | "Precios actualizados mensualmente con datos MAPA oficiales" |

---

## 7. MEJORAS TÉCNICAS PENDIENTES (por prioridad)

### Para Demo Day (13 mayo):
- [ ] Actualizar `price-db.ts` con precios PVP marzo 2026
- [ ] Añadir "Atún en conserva" como entrada separada (~9€/kg)
- [ ] Renombrar pilar 4 en la demo: "Predicciones" → "Reporting ESG"
- [ ] Cambiar `last_updated: '2025-04'` → `'2026-03'` en price-db.ts

### Para Piloto (Q3 2026):
- [ ] Tabla `precios_alimentos` en Supabase (reemplazar price-db.ts hardcodeado)
- [ ] Mini-panel admin para que ONG actualice precios mensualmente
- [ ] Integración API INE (IPC) para ajuste automático por inflación
- [ ] Añadir soporte Excel (.xlsx) al CSVImporter
- [ ] Matching semántico BEDCA (cubrir >45 alimentos)

### Para Producción (2027):
- [ ] Scraping automatizado informe MAPA semanal
- [ ] Módulo predictivo con datos históricos FESBAL
- [ ] Reporting ESG con PDF certificado descargable
- [ ] Multiidioma (AR/RO/ZH para familias)

---

## 8. FORMATOS DE IMPORTACIÓN (análisis para siguiente sesión)

### Formatos actuales soportados:
- ✅ CSV Formato A (cesta simple: nombre_producto, cantidad_kg, fecha_caducidad, id_bedca, donante)
- ✅ CSV Formato B (inventario completo: ID_Lote, Producto, Categoria, Cantidad_kg, macros, precio)

### Formatos a añadir (por prioridad):
1. **Excel (.xlsx)** — el más usado por bancos de alimentos. Librería: `xlsx` (SheetJS)
2. **JSON** — para integraciones API futuras
3. **Google Sheets URL** — acceso directo a hojas compartidas (API Google Sheets)
4. **PDF con tablas** — OCR, complejidad alta → Phase 2

---

*Última actualización: 9 mayo 2026*
*Próxima revisión: post-Demo Day (14 mayo 2026)*
