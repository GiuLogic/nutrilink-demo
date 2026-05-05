# NutriLink — Roadmap

> Actualizar al final de cada sesión de trabajo.
> **Última actualización:** 27 abril 2026

---

## ✅ Completado (MVP — Demo Day)

### Infraestructura
- [x] Proyecto Next.js 16 con TypeScript + Tailwind
- [x] Deploy en Vercel: https://nutrilink-demo.vercel.app
- [x] Repo público GitHub: https://github.com/GiuLogic/nutrilink-demo
- [x] Variables de entorno en Vercel (GOOGLE_API_KEY)
- [x] `.gitignore` correcto (`.env.local` excluido)

### Core funcional
- [x] `nutrition-db.ts` — BEDCA local, 50 alimentos, lookup por nombre
- [x] `nutrition-validator.ts` — recalcula macros post-IA con BEDCA
- [x] `economic-calculator.ts` — valor MAPA + CO₂
- [x] `CSVImporter.tsx` — Formato A (cesta simple) + Formato B (inventario 100 prods)
- [x] `/api/generate-recipes` — Gemini → OpenAI → Mock (con fallback automático)
- [x] Fix bug doble `request.json()` → macros correctos (no 0g)
- [x] Clasificación nutricional 🟢🟡🔴 por producto

### Vistas
- [x] `/demo` — flujo completo CSV → BEDCA → Menús verificados
- [x] `/admin` — inventario, alertas inflación
- [x] `/familia` — menús, reservas, filtros dietéticos
- [x] `/dashboard` — KPIs ESG, CO₂, valor económico

### Pitch y documentación
- [x] `pitch_deck.html` — 10 slides, QR en slide 6, links clickables
- [x] `pitch/guion_3min.md` — estructura Paolo Ottaviani completa
- [x] `README.md` — documentación profesional con badges
- [x] `AGENTS.md` — instrucciones para IAs
- [x] `.ai/` — sistema de memoria persistente

---

## 🚧 En curso (semana 28 abril — 2 mayo)

- [ ] `pitch/feedback_paolo.md` — tomar notas de la reunión de hoy
- [ ] `pitch/pitch_v2.md` — deck completo con estructura 12 bloques
- [ ] `pitch/pitch_deck_v2.html` — deck v2 generado desde pitch_v2.md
- [ ] Actualizar slide "People" con equipo real
- [ ] Definir modelo de revenue concreto (freemium vs. SaaS)

---

## 📋 Phase 2 (post-Demo Day, mayo-julio 2026)

### Técnico
- [ ] Matching semántico BEDCA (embeddings — cubrir 100% de productos)
- [ ] Motor de predicción de disponibilidad (con histórico real)
- [ ] Integración Supabase en producción (usuarios reales)
- [ ] Multiidioma ES/AR/RO/ZH

### Negocio
- [ ] Primer piloto con entidad real (banco de alimentos o comedor social)
- [ ] Reporting ESG automático (PDF certificado)
- [ ] Integración API FESBAL (si se negocia acceso)
- [ ] Modelo RGPD / gestión de usuarios

### Expansión
- [ ] Expansión red FEBA (39 países, 460 bancos de alimentos)

---

## ❌ Explícitamente fuera de scope (Demo Day)

| Feature | Razón |
|---------|-------|
| Matching semántico automático | Demasiado complejo para demo |
| Motor predicción disponibilidad | Sin histórico real |
| Multiidioma completo | Solo ES para demo |
| Reporting ESG automático | Solo mencionar en roadmap |
| RGPD / usuarios reales | No aplica a demo técnica |

---

## 📅 Fechas clave

| Fecha | Evento |
|-------|--------|
| 27 abril 2026 | Reunión preparación pitch con Paolo Ottaviani |
| 13 mayo 2026 | **Demo Day — Acción contra el Hambre × Códigofacilito** |
| Q3 2026 | Objetivo: 1 piloto con entidad real |
| 2027 | Objetivo: Expansión FEBA |
