# NutriLink — Prompts para retomar sesiones

> Copia y pega estos prompts al iniciar cualquier sesión nueva con cualquier IA.
> Probados y optimizados para Cline (VS Code), Claude, ChatGPT y Cursor.

---

## 🟢 Prompt universal — retomar el proyecto (siempre usar este primero)

```
Voy a trabajar en el proyecto NutriLink.
Antes de responder, lee estos archivos en este orden:
1. AGENTS.md
2. .ai/CONTEXT.md
3. .ai/ROADMAP.md
4. .ai/DECISIONS.md

Cuando hayas terminado, dime:
- Estado actual del proyecto (en 3 líneas)
- Qué quedó pendiente en la última sesión
- Qué decisiones irreversibles existen que no debo romper

No propongas cambios ni hagas nada hasta que yo te diga en qué quiero trabajar.
```

---

## 🎤 Prompt — trabajar en el pitch

```
Proyecto: NutriLink (demo en https://nutrilink-demo.vercel.app/demo)
Lee: .ai/CONTEXT.md, pitch/guion_3min.md, y el pitch_deck.html existente

Vamos a mejorar el pitch siguiendo la estructura de Paolo Ottaviani (12 bloques):
Hook → Problem → Solution → How it works (case studies) → Benefits → 
Revenue model → Target & Market → Metrics → Competition → Roadmap → People → CTA

[Indicar aquí en qué bloque específico quieres trabajar]
```

---

## 🐛 Prompt — debugging técnico

```
Proyecto NutriLink. Lee AGENTS.md y .ai/ARCHITECTURE.md primero.

El problema es: [describir el bug]
El archivo afectado es: [ruta del archivo]
El error exacto es: [copiar el error]

Antes de proponer solución, explícame qué crees que está pasando.
Respeta las reglas inviolables de AGENTS.md (especialmente: BEDCA sobre IA).
```

---

## ✨ Prompt — añadir nueva funcionalidad

```
Proyecto NutriLink. Lee .ai/CONTEXT.md, .ai/ARCHITECTURE.md y .ai/DECISIONS.md.

Quiero añadir: [describir la funcionalidad]

Antes de implementar:
1. ¿Contradice alguna decisión en DECISIONS.md?
2. ¿Requiere nueva dependencia npm? (justificar)
3. ¿Afecta a src/types/index.ts?
4. ¿Va a /demo, /admin, /familia, /dashboard o es una nueva ruta?

Propón el plan primero, implementa después de que lo apruebe.
```

---

## 📊 Prompt — actualizar el pitch deck

```
Proyecto NutriLink. Lee pitch/guion_3min.md y el pitch_deck.html actual.

Quiero actualizar el pitch deck con: [describir los cambios]

El deck es un HTML standalone (pitch_deck.html). 
Mantén el estilo naranja (#ea580c) y el QR en el slide de demo.
Los links deben ser clickables con target="_blank".
Primero muéstrame qué slides vas a cambiar y por qué.
```

---

## 🔄 Prompt — cerrar sesión y actualizar memoria

```
Antes de terminar esta sesión, actualiza:

1. .ai/ROADMAP.md:
   - Marca como completado: [listar lo que hicimos]
   - Añade como pendiente: [listar lo que queda]

2. .ai/DECISIONS.md (solo si tomamos alguna decisión técnica importante hoy):
   - [Describir la decisión si aplica]

3. Dime el comando de git para hacer commit de la memoria actualizada.
```

---

## 🧪 Prompt — verificar que la demo funciona

```
Proyecto NutriLink. Lee .ai/CONTEXT.md.

Necesito verificar que el flujo completo de la demo funciona.
El flujo es: CSV sube → BEDCA enriquece → Menús generados → Badge verificado

Revisa estos archivos:
- src/components/CSVImporter.tsx
- src/app/api/generate-recipes/route.ts
- src/lib/nutrition-db.ts

Dime si hay algún problema potencial antes del Demo Day (13 mayo 2026).
```

---

## 🌐 Cómo usar estos prompts con otras IAs

### Claude Desktop / claude.ai
1. Abre un nuevo chat
2. Adjunta los archivos `.ai/CONTEXT.md` + `AGENTS.md`
3. Pega el prompt universal

### ChatGPT (GPT-4o)
1. Abre un nuevo chat
2. Usa el botón de adjuntar archivos para subir los `.md` de `.ai/`
3. Pega el prompt universal

### Cursor (IDE)
1. Abre el proyecto (`cursor D:\MVP\nutrilink`)
2. En el chat de Cursor, usa `@.ai/CONTEXT.md` para referenciar directamente
3. Cursor lee `AGENTS.md` automáticamente

### GitHub Copilot Chat
1. Añade `.github/copilot-instructions.md` con el contenido de `AGENTS.md`
2. Copilot lo leerá en cada chat de forma automática
