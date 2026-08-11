---
name: desarrollar-comegen-ui
description: Guía para desarrollar y contribuir a ComegenUI 2.x (librería de Web Components hecha con Vue 3). Usá esta skill cuando el usuario quiera: crear un componente nuevo, agregar un componente, modificar un componente existente, editar/ajustar/optimizar un componente, entender el build, cómo se compilan los UMD, usar el playground, usar Storybook, cambiar el sistema de temas, agregar/modificar un tema, escribir tests de composables, o entender la estructura del proyecto. Sinónimos: "armame un componente", "hacé un nuevo botón", "agregá una prop a X", "cómo se construye", "cómo se compila la librería", "cómo corro el playground", "cómo funciona el build", "qué convenciones de código hay", "cómo agrego un tema", "modificá el color del alert", "refactorizá el table". NO uses esta skill para usar los componentes en un proyecto del usuario (eso es `comegen-ui`) ni para documentarlos (eso es `documentar-comegen-ui`).
---

# Desarrollar ComegenUI

Skill de **desarrollo** para ComegenUI 2.x. Cubre la arquitectura de componentes, el pipeline de build, cómo usar el playground y Storybook, las convenciones de código, y el workflow para crear componentes nuevos.

> **Audiencia:** contribuidores al proyecto (humanos o agentes). No es la doc de uso de la librería — eso está en la skill [`comegen-ui`](../comegen-ui/SKILL.md).

---

## Cuándo usar esta skill

Cargala cuando la tarea sea alguna de:

- **Crear** un componente nuevo (Custom Element + Vue + .ts).
- **Modificar** un componente existente (cambios de API, props, eventos, slots, estilos).
- **Entender** el pipeline de build (`build-libs.ts`, `package.json`).
- **Usar el playground** para experimentar manualmente.
- **Correr Storybook** localmente.
- **Cambiar el sistema de temas** (colores, hex por tema, theme names).
- **Hacer testing** de composables o componentes.
- **Entender** qué hace cada script en `scripts/`.

Si la tarea es **documentar** un componente para la skill del usuario final, usá [`documentar-comegen-ui`](../documentar-comegen-ui/SKILL.md) en su lugar.

---

## Índice

1. [Arquitectura](arquitectura.md) — el patrón de 3 archivos y la separación de responsabilidades.
2. [Crear un componente nuevo](crear-componente.md) — paso a paso: desde la idea hasta el bundle UMD.
3. [Convenciones de desarrollo](convenciones-desarrollo.md) — naming, imports, UnoCSS, tipos.
4. [Sistema de temas](temas.md) — cómo agregar/modificar un tema, cómo fluye el color.
5. [Playground](playground.md) — qué es, qué archivos son editables, cómo experimentar.
6. [Storybook](storybook.md) — ubicación de las stories, cómo agregar una nueva.
7. [Build](build.md) — `build-libs.ts`, `pnpm build:lib`, qué sale en `dist/`.
8. [Scripts](scripts.md) — qué hace cada `.sh` en `scripts/`.
9. [Testing](testing.md) — Vitest, tests de composables.
10. [Comandos rápidos](comandos.md) — cheatsheet de pnpm y de los scripts.

---

## Workflow general

### Para crear un componente nuevo

1. Leer [arquitectura.md](arquitectura.md) y [convenciones-desarrollo.md](convenciones-desarrollo.md).
2. Decidir **dónde va** (raíz, `form/`, `data/`, `labs/`, `archived/`).
3. Crear los 3 archivos siguiendo [crear-componente.md](crear-componente.md):
   - `<Nombre>.vue` — implementación interna.
   - `<Nombre>.ce.vue` — wrapper Custom Element.
   - `<Nombre>.ts` — registro.
4. Crear la storybook en `src/stories/<Nombre>.stories.ts`.
5. (Opcional) Agregar un preset en `playground/examples/`.
6. Correr `pnpm build:lib` y probar el componente en el playground.
7. Documentar siguiendo la skill [`documentar-comegen-ui`](../documentar-comegen-ui/SKILL.md).

### Para modificar un componente existente

1. Identificar qué archivo(s) cambia: `.ce.vue`, `.vue`, `.ts`, o varios.
2. **Si cambia la API pública** (props, eventos, slots, métodos del `.ce.vue`): actualizar también la documentación con la skill de documentación.
3. Si cambia el sistema de temas, ver [temas.md](temas.md).
4. Rebuild con `pnpm build:lib` y verificar en el playground.

---

## Regla de oro

> **Todo componente público debe tener 3 archivos: `.vue`, `.ce.vue`, `.ts`.** No escatimes ninguno. El `.ce.vue` es la **única** fuente de verdad de la API pública; el `.vue` interno puede refactorizarse sin tocar la API.

> **Regla de oro #2 — Especificidad de variantes (activa en CADA componente que crees o modifiques):** toda regla de variante que defina `color`/`background-color` va con **doble clase** (`.cu-x.cu-x--variant`), y el texto sobre `solid` va **siempre** con `var(--cu-color-surface)` — **nunca** `--cu-color-{name}-text`, que es el color oscurecido y en temas como `sigacadv2` llega a `#000000` (texto negro sobre solid). Sin esto, estilos globales del consumidor/playground (`button { color }`, `.card span { color }`, resets) rompen la variante. Detalle y checklist en [convenciones-desarrollo.md](convenciones-desarrollo.md#especificidad-en-variantes-con-color-propio).

> **Regla de oro #3 — Workflow de ramas (activa en CADA tarea de desarrollo):** toda nueva funcionalidad o cambio (feature, fix, docs, tests) se desarrolla en una **rama propia creada fuera de `main`** (ej: `feat/mi-feature`, `fix/arreglo-x`, `docs/tema-y`, `test/componente-z`). **Nunca se commitea directo en `main`**: `main` solo recibe merges (idealmente con MR/review). Al terminar la tarea, mergear la rama en `main` (o abrir el MR) y borrar la rama local.

---

## Estructura del proyecto

```
comegenui/
├── src/
│   ├── components/              ← componentes (ver arquitectura.md)
│   │   ├── Alert.vue / .ce.vue / .ts
│   │   ├── Button.vue / .ce.vue / .ts
│   │   ├── form/                ← inputs, controles
│   │   ├── data/                ← tablas
│   │   ├── labs/                ← experimentales (sí compilan; puede estar vacía)
│   │   └── archived/            ← retirados (sí compilan — ver docs/notes/)
│   ├── composables/             ← usePagination, useSearch, useTableData
│   ├── config/                  ← theme.ts
│   ├── utils/                   ← palette.ts, getHostTheme.ts
│   ├── stories/                 ← Storybook stories
│   ├── App.vue
│   └── main.ts
├── playground/                  ← HTML estático para experimentar
│   ├── index.html
│   ├── playground.js            ← base (NO modificar)
│   ├── example.js               ← editable
│   └── examples/                ← presets editables
├── scripts/                     ← bash scripts (build, deploy, config)
├── docs/                        ← esta documentación
├── .storybook/                  ← config de Storybook
├── build-libs.ts                ← pipeline de build UMD
├── package.json
└── index.html                   ← Vite dev server
```

---

## Archivos de referencia rápida

- `build-libs.ts` — pipeline de build (ver [build.md](build.md)).
- `src/config/theme.ts` — temas disponibles (ver [temas.md](temas.md)).
- `src/utils/palette.ts` — funciones de color (`getBgClasses`, `getFgClasses`, `getColorMap`).
- `src/utils/getHostTheme.ts` — detección del tema activo.
- `package.json` — scripts de pnpm.
- `scripts/menu.sh` — menú interactivo con `pan` (CLI de hefesto).
- `docs/notes/` — notas de auditoría (problemas pendientes).
