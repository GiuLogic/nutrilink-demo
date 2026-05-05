# NutriLink — Project Context

> **Versión:** 1.0 · **Última actualización:** 27 abril 2026
> Lee este archivo primero en cualquier sesión nueva.

---

## ¿Qué es NutriLink?

**Una frase:** NutriLink es la capa de inteligencia nutricional que se conecta a los sistemas de redistribución alimentaria en España — sin sustituirlos, potenciándolos.

**El problema que resuelve:** España redistribuye 140.000 toneladas de alimentos al año a 1,3 millones de personas vulnerables, pero sin información nutricional. Las familias reciben calorías, no dietas equilibradas. La Ley 1/2025 obliga a reportar impacto nutricional, y hoy nadie puede cumplirla.

**El diferenciador clave:** La IA (Gemini) genera la estructura de los menús. BEDCA (base oficial AESAN) certifica todos los macros. Ningún valor nutricional mostrado al usuario proviene del LLM. Esto hace que los datos sean auditables y trazables para regulación.

---

## Estado actual (27 abril 2026)

| Componente | Estado | URL/Ruta |
|-----------|--------|---------|
| Demo Vercel | ✅ Online | https://nutrilink-demo.vercel.app/demo |
| Repo GitHub | ✅ Público | https://github.com/GiuLogic/nutrilink-demo |
| Pitch deck v1 | ✅ Listo | `pitch_deck.html` (10 slides + QR) |
| Guión 3 min | ✅ Listo | `pitch/guion_3min.md` |
| Pitch v2 | 🚧 Pendiente | `pitch/pitch_v2.md` (tras feedback Paolo) |
| Supabase DB | ⏸️ Opcional | Sin integrar en demo — usa datos mock |
| GOOGLE_API_KEY | ✅ En Vercel | Si falla → modo mock automático |

---

## Contexto del programa

- **Programa:** Códigofacilito 2026 × Acción contra el Hambre
- **Demo Day:** 13 mayo 2026
- **Formador pitching:** Paolo Ottaviani (estructura 11 bloques: Hook→CTA)
- **Reunión preparación pitch:** 27 abril 2026 (hoy)
- **Colaboradora campo:** Aurelia (datos reales del Banco de Alimentos — si llegan)

---

## Usuarios del sistema

| Actor | Vista | Necesidad principal |
|-------|-------|---------------------|
| Banco de alimentos / ONG | `/admin` | Gestionar inventario, generar menús |
| Familia beneficiaria | `/familia` | Ver menús disponibles, reservar |
| Empresa donante | `/dashboard` | Reporting ESG, CO₂, valor económico |
| Jurado / Demo Day | `/demo` | Flujo completo de demostración |

---

## Flujo core (lo que demostramos)

```
CSV excedentes → JOIN BEDCA → Clasificación (🟢🟡🔴) → Gemini genera menús → Recálculo macros BEDCA → Badge ✓ Verificado
```

---

## KPIs por cada 100 kg procesados

- ~250 raciones equilibradas
- ~185€ valor nutricional (precios MAPA abril 2025)
- ~210 kg CO₂ evitado (factor EU FUSIONS 2.1 kg/kg)
- 100% trazable para ESG + Ley 1/2025

---

## Coste estimado piloto

~25€/mes por entidad (Gemini free tier + Vercel free + Supabase free)
