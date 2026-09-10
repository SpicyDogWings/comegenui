# Plan — Tests por capas desde Stories

**Estado:** 🟡 En progreso
**Rama:** `test/stories-layers`
**Inicio:** 2026-09-10
**Objetivo:** una **story** por componente es la fuente única y genera los tests de las **3 capas** (L1 `.vue`, L2 `.ce`, L3 `.umd`). Los tests corren por CLI y el playground muestra los resultados por sección/variante.

## Leyenda

- `[ ]` pendiente · `[~]` en curso · `[x]` hecho · `[!]` bloqueado

## Arquitectura

```
Story (src/components/{cat}/X.stories.ts)
  ├── sections[] / variants[]  ──► StoryRenderer (preview del playground)
  ├── checks.l1[]              ──► runner.l1 (vitest + @vue/test-utils, jsdom)
  ├── checks.ce[]              ──► runner.ce (browser, *.ce.vue)
  ├── checks.umd[]             ──► runner.umd (browser, dist-lib/CuX.umd.js)
  └── vue / vanilla (snippets) ──► tabs de código (+ Fase 4: playground vanilla)

Resultado de los runners ──► playground/public/test-results.json
                             (reporter custom de vitest)
                             ──► badges ✅/❌ en el playground
```

- **Naming de test:** `[cu-button] colors › primary › aplica token --btn-bg`.
- La UI **no corre tests**: lee `test-results.json` (archivo estático) y pinta el resultado.
- Decisiones acordadas: piloto **Button**; stories co-locadas por categoría; preview desde stories ya en Fase 1; reporter custom; `Button.test.ts` reemplazado por el runner.

## Fase 1 — Layer 1 (`.vue`)

- [x] **1a** Fundaciones: scripts `test`/`test:l1`/`preflight`, `scripts/preflight.sh`, skill `.opencode/skills/comegen-preflight/`, reporter `tools/reporters/playground-reporter.ts`.
- [x] **1b** Story schema (`src/stories/types.ts`) + `Button.stories.ts` con las 8 secciones.
- [x] **1c** `StoryRenderer.vue` + preview del playground `Button.vue` desde stories (conservando nav/anclas).
- [x] **1d** `runner.l1.ts` + `Button.l1.test.ts`; reemplaza `Button.test.ts`.
- [x] **1e** UI de resultados: badge ✅/❌ por sección/variante en el playground.
- [ ] **1f** Escalar al resto de los componentes (297 secciones / 45 páginas), por orden de dependencia.

**Aceptación:** `./scripts/preflight.sh` corre `type-check` + L1 de Button en verde; el playground muestra ✅ por sección; romper `color` → test rojo y ❌ en la UI.

## Fase 2 — Layer 2 (`.ce`)

- [ ] Agregar `@vitest/browser` + `@vitest/browser-playwright` (vitest 4; Chromium ya instalado).
- [ ] Project `ce` en `environment: browser` dentro de `vitest.config.ts`.
- [ ] `runner.ce.ts` reusa las stories + `checks.ce`: tag registrado, `attribute→prop`, `property→prop`, eventos `ceEmit`, `defineExpose`, slots.
- [ ] Mismo `test-results.json` (la UI ya lo muestra sin cambios).

## Fase 3 — Layer 3 (`.umd`)

- [ ] `pnpm build:lib` y luego `runner.umd.ts` carga el UMD real en browser.
- [ ] Mismas stories, `checks.umd`.
- [ ] Test de coexistencia (2 UMD sin doble Vue).
- [ ] En `preflight.sh`: L3 solo si el diff toca `components/`, `lib/` o `plugins/`.

## Fase 4 (opcional) — Playground vanilla desde stories

- [ ] `tools/gen-vanilla.mjs` genera `playground/cu-*.html` desde las stories.

## Fase 5 (opcional) — Manifiesto API + deprecación

- [ ] Manifiesto de API versionado + diff como detector de breaking change.
- [ ] Validación docs ↔ código.
- [ ] Política de deprecación (nunca romper en minor).

---

## Bitácora

<!-- Cada paso suma una entrada acá y se commitea junto con el paso. -->

### 2026-09-10 — Plan

- `docs(test)`: se crea este plan en `docs/notes/plan-test-stories.md`.
- Rama `test/stories-layers` desde `main`.
