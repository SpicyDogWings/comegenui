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
| 3 | **Story** | `src/stories/{category}/X.stories.ts`: generala con `pnpm cu-playground:generate X` (desde el contrato del `.vue`) y refinala con `X.stories.config.json`; `checks.l1` (y `ce`/`umd` cuando aplique). | [`04`](04-stories-y-tests.md) |
| 4 | **Tests** | `src/stories/{category}/X.l1.test.ts` con el runner de stories. Migrar tests viejos si existían. | [`04`](04-stories-y-tests.md) |
| 5 | **Metadata + extras** | `pnpm cu-playground:generate X --meta-only` (`tokens`/`api` → Style/API en la página genérica). Extra **Programmatic** solo si el componente usa `defineExpose`; **Events** si emite eventos. | [`04`](04-stories-y-tests.md) · [`05`](05-playground.md) |
| 6 | **Playground** | **Automático**: el plugin `cu-playground` registra la ruta y el nav desde la story. Página genérica en `/playground/components/:name`; página física opcional con `--pages`. | [`05`](05-playground.md) |
| 7 | **Docs** | Ficha generada con `pnpm cu-playground:generate <X> --docs` desde el SFC de la lib (+ sidecar `cu-x.doc.json` con la prosa curada) y su entrada en los índices. | [`07`](07-documentacion.md) + skill `comegen-ui-docs` |
| 8 | **Validar y commitear** | `./scripts/preflight.sh` verde; commit atómico (nunca `git add -A`). | [`06`](06-build-y-validacion.md) |

## Definición de terminado (DoD)

Un componente nuevo está terminado cuando **todo** esto existe y pasa:

- [ ] **Contrato**: `X.vue`; si es público, también `X.ce.vue` + `src/lib/{cat}/x.ts` con `<cu-x>` registrado.
- [ ] **Story**: `src/stories/{category}/X.stories.ts` (generada con `stories:generate` y refinada con `X.stories.config.json`) con secciones y `checks.l1` por sección.
- [ ] **Test L1**: `src/stories/{category}/X.l1.test.ts` que llama a `runL1Story(XStories)` (reemplaza tests viejos del componente).
- [ ] **Metadata**: `tokens` + `api` en la story (`--meta-only`) → la página genérica pinta **Style** y **API**.
- [ ] **Extras**: **Programmatic** solo si usa `defineExpose`; **Events** si emite eventos propios. En archivo hermano `X.stories.extras.ts`.
- [ ] **Playground**: entrada en el nav (`PlaygroundLayout.vue`); la ruta y la página las provee el plugin (no hay `X.vue` de página).
- [ ] **Docs**: ficha `docs/skills/use-comegen/componentes/cu-x.md` **generada** con `pnpm cu-playground:generate <X> --docs` (fuente de verdad = el componente) + sidecar `cu-x.doc.json` con la prosa curada.
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

Todo el devkit está separado por responsabilidad:
- **Plugin** (`src/plugins/cu-playground/`): runtime (Vue plugin + nav automático), `generate` (contrato-driven) y reporter de vitest (genérico/reutilizable; ver su `README.md`).
- **Proyecto** (`tools/`, `scripts/`): `migrate`, `status`, `new:component` y `preflight` (específicos de esta estructura de repo).

| Comando | Para qué |
|---|---|
| `pnpm run stories:status` | Inventario: qué componentes tienen story/test/página/badges y cuáles faltan migrar. |
| `pnpm cu-playground:generate <X>` | Genera la story **desde el contrato** del `.vue` (props/emits/exposes/slots/tokens) → secciones + snippets + checks + `api`. Lee `X.stories.config.json`. No pisa la story si existe. |
| `pnpm cu-playground:generate <X> --meta-only` | Actualiza solo `tokens`/`api` de una story existente sin tocar secciones/checks/extras; preserva descripciones curadas. |
| `pnpm cu-playground:generate --all` | Barre `componentsDir` y genera/actualiza todas las stories (metadata). |
| `pnpm cu-playground:generate <X> --pages` | Además emite una página física editable en `playgroundDir` (override de la genérica). |
| `pnpm cu-playground:generate <X> --docs` | Genera/actualiza la ficha `componentes/cu-x.md` desde el SFC que distribuye la lib (`.ce.vue` o `.vue`); prosa curada en el sidecar `cu-x.doc.json`. `--all --docs` para todas; `--docs --check` detecta drift (lo corre el preflight). |
| `pnpm run stories:migrate <X>` | (Legacy) Genera story + test desde la **página** vieja. Las páginas legacy están en `backups/`. |
| `pnpm run new:component <X> <category> [--internal]` | Scaffold de componente nuevo: `.vue` + `.ce.vue` + `lib/` + story + test. |
| `./scripts/preflight.sh` | Gate local completo (type-check contra baseline + todos los tests L1). |
| `./scripts/preflight.sh <X>` | Gate **scopeado**: type-check + solo el test L1 de `<X>` (~8s). |

## Mapa rápido

| Artefacto | Ruta |
|---|---|
| Componente real | `src/components/{category}/X.vue` |
| Wrapper CE | `src/components/customElements/{category}/X.ce.vue` |
| Story | `src/stories/{category}/X.stories.ts` |
| Config del generador (opcional) | `src/stories/{category}/X.stories.config.json` |
| Extras: Programmatic / Events (opcional) | `src/stories/{category}/X.stories.extras.ts` |
| Test L1 | `src/stories/{category}/X.l1.test.ts` |
| Entry point (build) | `src/lib/{category}/x.ts` |
| Tipos de stories / runner | Contrato `src/plugins/cu-playground/contract.ts` · runner `src/plugins/cu-playground/tests/runner.l1.ts` (`src/stories/types.ts` y `runner.l1.ts` son shims backwards-compat) |
| Playground (genérico) | Plugin `src/plugins/cu-playground/` (runtime en `runtime/`, chrome fallback en `runtime/chrome/`, nav automático) |
| Página física (opcional) | `src/playground/X.vue` (override; la crea `--pages`) |
| Config del playground | `cu-playground.config.json` (raíz) |
| Páginas legacy (backup) | `backups/legacy-playground-pages/X.vue` (ya no se compilan) |
| Docs del componente | `docs/skills/use-comegen/componentes/cu-x.md` |
| Preflight | `scripts/preflight.sh` |
| Reporte de tests | `public/test-results.json` (generado) |

Referencias completas en [`01-mapa-del-repo.md`](01-mapa-del-repo.md).
