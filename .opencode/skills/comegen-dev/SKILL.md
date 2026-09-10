---
name: comegen-dev
description: 'Playbook de desarrollo de comegen-ui (Vue 3 + Custom Elements + UnoCSS): crear, modificar, testear o buildear componentes del repo, y trabajar en el playground. Frases: "crear componente", "nuevo componente", "modificar componente", "story", "testear componente", "playground", "build lib", "preflight". NO usar para consumir la lib en otro proyecto (esa es `comegen-ui`, la skill de uso que viaja con el zip) ni para documentar (esa es `comegen-ui-docs`).'
---

# `comegen-dev` — playbook de componentes

Desarrollo de componentes **comegen-ui** (Vue 3 + Custom Elements + UnoCSS, UMD via `build-lib.ts`), su playground, sus stories y sus tests.

> **Regla #1:** "compila" **no** es "terminado". Un componente está terminado solo cuando cumple la [Definición de terminado](#definición-de-terminado-dod) y `./scripts/preflight.sh` da verde. **Nunca** declares algo listo sin correr el preflight.

## Cuándo se activa

- "Crear/agregar componente" → seguí el [flujo](#flujo) completo.
- "Modificar componente" → [flujo](#flujo) + [`03-modificar-componente.md`](03-modificar-componente.md).
- "Migrar componente al sistema de stories/tests" → [`08-migrar-al-sistema-de-stories.md`](08-migrar-al-sistema-de-stories.md).
- "Story / testear componente" → [`04-stories-y-tests.md`](04-stories-y-tests.md) + [`06-build-y-validacion.md`](06-build-y-validacion.md).
- "Playground" (página, sección, nav, trampas) → [`05-playground.md`](05-playground.md).
- "Buildear la lib" / "preflight" → [`06-build-y-validacion.md`](06-build-y-validacion.md).
- "Agregar/modificar un token" → [`05-playground.md`](05-playground.md) (Tokens ↔ ThemeBuilder).

## Cuándo NO se activa

- Consumir comegen-ui en **otro** proyecto → skill de uso `comegen-ui` (viaja con el zip).
- Documentar un componente → skill [`comegen-ui-docs`](../comegen-ui-docs/SKILL.md).
- Modificar el build system (`build-lib.ts`, `vite.config.ts`, `vitest.config.ts`) salvo que la tarea sea exactamente eso.

## Flujo

Seguí los pasos **en orden**. No saltees el 3 (story) ni el 4 (tests): ahí es donde se evita entregar a medias.

| # | Paso | Qué hacés | Detalle |
|---|------|-----------|---------|
| 0 | **Orientarse** | Leer `AGENTS.md` y [`01-mapa-del-repo.md`](01-mapa-del-repo.md). Decidir: ¿crear o modificar? ¿categoría? ¿público (lib) o interno? | [`01`](01-mapa-del-repo.md) |
| 1 | **Contrato** | Definir props/emits/slots/`defineExpose` y tokens (`--cu-color-*`). Es la API que van a consumir los hosts. | [`02`](02-crear-componente.md) §Contrato |
| 2 | **Implementar** | `.vue` real; si es público: `.ce.vue` + `lib/{cat}/x.ts`. | [`02`](02-crear-componente.md) / [`03`](03-modificar-componente.md) |
| 3 | **Story** | `src/stories/{category}/X.stories.ts` con secciones = casos de uso reales y `checks.l1` (y `ce`/`umd` cuando aplique). | [`04`](04-stories-y-tests.md) |
| 4 | **Tests** | `src/stories/{category}/X.l1.test.ts` con el runner de stories. Migrar tests viejos si existían. | [`04`](04-stories-y-tests.md) |
| 5 | **Playground** | Página + `route` + entrada de nav. El preview sale de la story vía `StoryRenderer`. | [`05`](05-playground.md) |
| 6 | **Docs** | `docs/skills/use-comegen/componentes/cu-x.md` (+ índices). | [`07`](07-documentacion.md) + skill `comegen-ui-docs` |
| 7 | **Validar y commitear** | `./scripts/preflight.sh` verde; commit atómico (nunca `git add -A`). | [`06`](06-build-y-validacion.md) |

## Definición de terminado (DoD)

Un componente nuevo está terminado cuando **todo** esto existe y pasa:

- [ ] **Contrato**: `X.vue`; si es público, también `X.ce.vue` + `src/lib/{cat}/x.ts` con `<cu-x>` registrado.
- [ ] **Story**: `src/stories/{category}/X.stories.ts` con secciones = casos de uso (variantes, estados, slots, eventos) y `checks.l1` por sección.
- [ ] **Test L1**: `src/stories/{category}/X.l1.test.ts` que llama a `runL1Story(X.stories)` (reemplaza tests viejos del componente).
- [ ] **Playground**: página registrada en `router` + nav; el preview se renderiza desde la story.
- [ ] **Docs**: `docs/skills/use-comegen/componentes/cu-x.md` con props/slots/events/methods.
- [ ] **Verde**: `./scripts/preflight.sh` sin errores nuevos de type-check y con los tests en verde.
- [ ] **Badges**: el playground muestra ✅ en cada sección (lo pinta `TestResultBadge` desde `public/test-results.json`).
- [ ] **Commit atómico** con su entrada en el plan/bitácora (`git status --short` antes de stagear).

Si falta cualquiera, decilo explícitamente en el reporte; no lo tapes con "el componente quedó funcionando".

## Reglas de oro

1. **Patrón de 3 archivos** para públicos: `.vue` → `.ce.vue` → `lib/*.ts`.
2. **Colores por CSS custom properties** (`var(--cu-color-{name}-*)`), nunca `getHostTheme()`.
3. **`.ce.vue` no importa sub-componentes `.vue`**; pasa props explícitas (nunca `v-bind="{...props}"`).
4. **`defineExpose` siempre arrow functions** (`isOpen: () => ...`), nunca getters.
5. **Eventos** del `.ce.vue` al host via `ceEmit()` (`CustomEvent` con `bubbles` + `composed`).
6. **Slots**: `.vue` con `#nombre`; `.ce.vue` con `<template #nombre>`.
7. El prop se llama **`hightContrast`** (typo histórico del codebase: no "corregir" a `highContrast`).
8. **Ramificar** según [`AGENTS.md`](../../../AGENTS.md) regla 11: rama nueva solo si la base es `main`.

## Herramientas

| Comando | Para qué |
|---|---|
| `pnpm run stories:status` | Inventario: qué componentes tienen story/test/página/badges y cuáles faltan migrar. |
| `pnpm run stories:migrate <X>` | Genera el esqueleto de story + test L1 de un componente existente (secciones, snippets, tests viejos a mapear). |
| `pnpm run new:component <X> <category> [--internal]` | Scaffold de componente nuevo: `.vue` + `.ce.vue` + `lib/` + story + test. |
| `./scripts/preflight.sh` | Gate local (type-check contra baseline + L1). |

## Mapa rápido

| Artefacto | Ruta |
|---|---|
| Componente real | `src/components/{category}/X.vue` |
| Wrapper CE | `src/components/customElements/{category}/X.ce.vue` |
| Story | `src/stories/{category}/X.stories.ts` |
| Test L1 | `src/stories/{category}/X.l1.test.ts` |
| Entry point (build) | `src/lib/{category}/x.ts` |
| Tipos de stories / runner | `src/stories/types.ts` · `src/stories/runner.l1.ts` |
| Playground | `src/pages/playground/components/X.vue` + `src/router/index.ts` + `PlaygroundLayout.vue` |
| Docs del componente | `docs/skills/use-comegen/componentes/cu-x.md` |
| Preflight | `scripts/preflight.sh` |
| Reporte de tests | `public/test-results.json` (generado) |

Referencias completas en [`01-mapa-del-repo.md`](01-mapa-del-repo.md).
