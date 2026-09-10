# Plan — Tests por capas desde Stories

**Estado:** 🟡 En progreso
**Rama:** `test/stories-layers`
**Inicio:** 2026-09-10
**Objetivo:** una **story** por componente es la fuente única y genera los tests de las **3 capas** (L1 `.vue`, L2 `.ce`, L3 `.umd`). Los tests corren por CLI (local, sin GitLab) y el playground muestra los resultados por sección/variante.

> Este plan es progresivo: cada fase se puede ejecutar sin las siguientes. Si la sesión se corta, retomar por el primer `[ ]` pendiente.

---

## Leyenda

- `[ ]` pendiente · `[~]` en curso · `[x]` hecho · `[!]` bloqueado

## Decisiones acordadas

1. Piloto: **Button**.
2. Stories **co-locadas** por categoría (`src/components/buttons/Button.stories.ts`); tipos compartidos en `src/stories/`.
3. Preview del playground **desde stories ya en Fase 1**.
4. Resultados vía **reporter custom** de vitest (con `meta`), sin parsear stdout.
5. `Button.test.ts` viejo **se reemplaza** por el runner de stories.
6. Preflight **local** disparado por skill (`.opencode/skills/comegen-preflight/`), no GitLab CI.

## Arquitectura

```
Story (src/components/{cat}/X.stories.ts)
  ├── sections[] / variants[]  ──► StoryRenderer (preview del playground)
  ├── checks.l1[]              ──► runner.l1  (vitest + @vue/test-utils, jsdom)
  ├── checks.ce[]              ──► runner.ce  (browser, *.ce.vue)
  ├── checks.umd[]             ──► runner.umd (browser, dist-lib/CuX.umd.js)
  └── vue / vanilla (snippets) ──► tabs de código (+ Fase 4: playground vanilla)

Tests ──► tools/reporters/playground-reporter.ts ──► public/test-results.json
                                                   ──► badges ✅/❌ en el playground
```

- **Naming de test:** `[cu-button] colors › primary › aplica token --btn-bg`.
- La UI **no corre tests**: lee `test-results.json` y pinta el resultado.
- Los `variants` alimentan preview y las 3 capas: no se duplica el escenario.

## Contrato de la story

```ts
// src/stories/types.ts
import type { Component, VNodeChild } from "vue";

export type SlotContent = string | number | (() => VNodeChild);

export interface Variant {
  id: string;                              // 'primary'
  props?: Record<string, unknown>;         // L1 y preview (Vue)
  attrs?: Record<string, string>;          // ce/umd (atributos kebab)
  slots?: Record<string, SlotContent>;     // default + slots nombrados
}

export interface CheckResultMeta {
  component: string;                       // 'cu-button'
  section: string;                         // id del nav
  variant: string;
  layer: "l1" | "ce" | "umd";
}

export interface L1Context { wrapper: VueWrapper; variant: Variant }
export interface CeContext { host: HTMLElement; variant: Variant }
export interface UmdContext { host: HTMLElement; variant: Variant }

export interface SectionCheck<Ctx> {
  name: string;                            // 'aplica token --btn-bg'
  run: (ctx: Ctx, variant: Variant) => void | Promise<void>;
}

export interface Section {
  id: string;                              // = id del nav del playground
  title: string;
  badge?: string;                          // texto del Badge del heading
  badgeTitle?: string;
  layout?: "row" | "col";
  variants: Variant[];
  preview?: Component;                     // demo interactiva (opcional)
  vue?: string;                            // snippet tab Vue
  vanilla?: string;                        // snippet tab Vanilla
  checks: {
    l1?: SectionCheck<L1Context>[];
    ce?: SectionCheck<CeContext>[];
    umd?: SectionCheck<UmdContext>[];
  };
}

export interface ComponentStory {
  component: string;                       // 'cu-button' (tag CE)
  vue: Component;                          // .vue real (preview + L1)
  ce?: Component;                          // *.ce.vue (L2)
  sections: Section[];
}
```

## Contrato del reporter (`public/test-results.json`)

```jsonc
{
  "generatedAt": "2026-09-10T…",
  "totals": { "pass": 0, "fail": 0 },
  "components": {
    "cu-button": {
      "tag": "cu-button",
      "sections": {
        "colors": {
          "status": "passed",
          "variants": {
            "primary": {
              "status": "passed",
              "checks": [{ "layer": "l1", "name": "aplica token --btn-bg", "status": "passed" }]
            }
          }
        }
      }
    }
  }
}
```

---

## Fase 1 — Layer 1 (`.vue`)

Tests de la capa `.vue` derivados de las secciones actuales de los playground, corriendo en CLI, con resultados visibles en la UI.

- [x] **1a** Fundaciones
  - `package.json`: `test`, `test:l1`, `test:watch`, `preflight`.
  - `scripts/preflight.sh`: `type-check` → tests L1 (corta al primer fallo).
  - `.opencode/skills/comegen-preflight/SKILL.md`: trigger "prepará el merge request".
  - `tools/reporters/playground-reporter.ts`: escribe `public/test-results.json`.
  - `vitest.config.ts`: project `l1` (jsdom) + reporter.
- [x] **1b** Story schema + piloto Button
  - `src/stories/types.ts` con el contrato de arriba.
  - `src/components/buttons/Button.stories.ts` con las 8 secciones: `variants`, `colors`, `disabled`, `sizes`, `icons`, `loading`, `links`, `fullwidth`.
  - Cada variante = una fila del demo actual del playground; cada sección con sus `checks.l1`, `vue` y `vanilla` (mover los snippets existentes).
- [x] **1c** Preview del playground desde stories
  - `src/pages/playground/StoryRenderer.vue`: recorre `sections` → `variants` y renderiza `<component :is="section.vue" v-bind="variant.props">` con `variant.slots`. Soporta `section.preview` para demos interactivas (ej. `loading`).
  - `src/pages/playground/components/Button.vue`: reemplaza el markup inline por el renderer, conservando `<section id>`, headings, `Badge`, `SectionDemo` y el nav (`outlineItems`) para no romper el router.
- [x] **1d** Runner L1 + tests
  - `src/stories/runner.l1.ts`: itera story → sección → variante → check; `mount()` de `@vue/test-utils`; `it(name, { meta }, fn)` con `meta = { component, section, variant, layer: 'l1' }`.
  - `src/components/buttons/Button.l1.test.ts`: `runL1Story(cuButtonStories)`.
  - Eliminar `src/components/buttons/Button.test.ts` (sus checks se migran a la story).
- [x] **1e** UI de resultados
  - Composable/loader que fetchea `/test-results.json` (con fallback "sin correr" si no existe).
  - Badge ✅/❌/— en el heading de cada sección; al click, detalle de checks fallidos con el error.
- [ ] **1f** Escalar al resto (progresivo, por orden de dependencia)
  - Orden sugerido: `Input`, `Select`, `Dropdown`, `Alert`, `Badge`, `Card`, `Checkbox`, `Switch`, `Textarea`, `Tabs`, `Modal`, `Table`, … (297 `SectionDemo` en 45 páginas).
  - Un commit atómico por componente (o por par de componentes chicos).

**Aceptación Fase 1:** `./scripts/preflight.sh` corre `type-check` + L1 de Button en verde; el playground de Button muestra ✅ por sección; romper `color` → test rojo y ❌ en la UI.

**Bloqueantes conocidos (preexistentes):**
- [x] `pnpm run type-check` falla con **225 errores** repartidos en playground/legacy/utils (main ya está rojo). Resuelto con **baseline** en `scripts/typecheck-baseline`: el preflight no bloquea por la deuda vieja, pero **sí falla si aparecen errores nuevos**. La deuda de fondo queda como tarea aparte.
- [x] `src/components/buttons/ToggleColorSheme.test.ts` (3 fallos): el test mockeaba `@/plugins/cu-tokens`, pero el componente migró a `@/stores/theme` (Pinia). Actualizado a Pinia + mock del plugin.
- [x] `src/components/theme/ThemeManagerModal.test.ts` (3 fallos): el test apuntaba a `.tm-modal` / "Reset Defaults" (markup viejo). Alineado al actual (`.tm-layout`, título "Export", `.tm-code-block`, botones Export/Copy/Download).

## Fase 2 — Layer 2 (`.ce`)

- [ ] Dependencias: `@vitest/browser` + `@vitest/browser-playwright` (vitest 4; Chromium ya instalado; `vitest.shims.d.ts` ya referencia el provider).
- [ ] `vitest.config.ts`: agregar project `ce` con `environment: 'browser'`.
- [ ] `src/stories/runner.ce.ts`: `defineCustomElement(*.ce.vue)` (o importar el entry de `src/lib/`) y correr `checks.ce` sobre el tag real.
- [ ] `src/stories/contractChecks.ts`: checks reutilizables ce+umd (tag registrado, `attribute→prop`, `property→prop`, eventos `ceEmit`, `defineExpose`, slots).
- [ ] `Button.ce.test.ts` con los checks comunes + los específicos de la sección.
- [ ] Mismo reporter → mismo `test-results.json` (la UI ya lo muestra sin cambios).

**Aceptación Fase 2:** `pnpm run test:ce` corre en Chromium y valida el contrato CE de Button sin build.

## Fase 3 — Layer 3 (`.umd`)

- [ ] `runner.umd.ts`: carga `dist-lib/CuX.umd.js` como `<script>` en el browser e inyecta el tag como lo hace el host; corre `checks.umd`.
- [ ] Test de **coexistencia**: cargar 2 UMD y verificar que no se pisan (doble Vue / doble registro de CE / tokens duplicados).
- [ ] `scripts/preflight.sh`: correr `build:lib` antes de L3; L3 solo si el diff toca `components/`, `lib/` o `plugins/`.

**Aceptación Fase 3:** `pnpm run test:umd` valida el artefacto real que recibe el sistema consumidor.

## Fase 4 (opcional) — Playground vanilla desde stories

- [ ] `tools/gen-vanilla.mjs`: genera `playground/cu-*.html` desde las mismas stories (tag + `attrs` + `vanilla`).

## Fase 5 (opcional) — Manifiesto API + deprecación

- [ ] Manifiesto de API versionado (`tags`, `props`, `events`, `methods`) + diff como detector de breaking change.
- [ ] Validación docs ↔ código.
- [ ] Política de deprecación (nunca romper API pública en minor).

---

## Convención de commits

Atómicos, uno por paso:

- `docs(plans): …` — este plan / bitácora.
- `test(infra): …` — 1a.
- `test(stories): …` — 1b.
- `test(playground): …` — 1c.
- `test(l1): …` — 1d.
- `test(ui): …` — 1e.
- `test(l1/componente): …` — 1f (uno por componente).

Cada commit incluye su entrada en la **Bitácora**.

---

## Bitácora

<!-- Cada paso suma una entrada acá y se commitea junto con el paso. -->

### 2026-09-10 — Plan

- `docs(test)`: plan inicial en `docs/notes/plan-test-stories.md` (luego movido a `.opencode/plans/`).
- Rama `test/stories-layers` desde `main`.

### 2026-09-10 — 1a Fundaciones

- `chore(test)`: scripts `test`/`test:l1`/`test:watch`/`preflight` en `package.json`.
- `tools/reporters/playground-reporter.ts`: reporter custom → `public/test-results.json`.
- `scripts/preflight.sh`: type-check + L1.
- `.opencode/skills/comegen-preflight/SKILL.md`.
- `vitest.config.ts`: project `l1` (jsdom) + reporter.
- Verificado: 37 archivos / 331 tests corren; 6 fallos preexistentes (2 archivos) listados como bloqueantes.

### 2026-09-10 — 1b Story schema + Button

- `test(stories)`: `src/stories/types.ts` (contrato `ComponentStory`/`Section`/`Variant`/`checks.l1|ce|umd`), con `expect` inyectado en el contexto para que las stories no importen vitest.
- `test(stories)`: `src/components/buttons/Button.stories.ts` con las 8 secciones del playground (variants, colors, disabled, sizes, icons, loading, links, fullwidth), snippets Vue/Vanilla y checks L1.
- Sin errores de type-check en los archivos nuevos (el baseline rojo de 225 es preexistente).

### 2026-09-10 — Bloqueantes de verde

- `chore(preflight)`: baseline de type-check (`scripts/typecheck-baseline` = 225). El preflight no bloquea por deuda vieja; falla si hay errores nuevos.
- `test(fix)`: `ToggleColorSheme.test.ts` monta con Pinia y mockea el plugin de tokens.
- `test(fix)`: `ThemeManagerModal.test.ts` alineado al markup actual (`.tm-layout`, "Export", `.tm-code-block`, botones Export/Copy/Download).
- Verificado: `pnpm exec vitest run --project l1` → 2 archivos / 8 tests en verde.
- `fix(preflight)`: `reporters` movido a la raíz de `vitest.config.ts` (no es config por proyecto); conteo de errores de type-check con el patrón correcto (`error TS[0-9]+`); `public/test-results.json` al `.gitignore`.
- Preflight completo en verde: 225 errores preexistentes (baseline) + 37 archivos / 331 tests.

### 2026-09-10 — 1c Preview desde stories

- `test(playground)`: `src/pages/playground/StoryRenderer.vue` renderiza secciones/headings/badges/snippets y el preview (variantes o `preview` interactivo).
- `test(playground)`: `src/pages/playground/components/Button.vue` pasa a consumir `cuButtonStories`; el nav se deriva de las secciones de la story (se conservan Style y API).
- Snippets de la sección `icons` completados (ya no tienen `…`).
- Verificado en dev server: 8 secciones + Style + API, headings y badges correctos, 0 errores de consola.

### 2026-09-10 — 1d Runner L1

- `test(l1)`: `src/stories/runner.l1.ts` (mount `.vue` + `meta` plano para el reporter).
- `test(l1)`: `src/components/buttons/Button.l1.test.ts` reemplaza `Button.test.ts` (eliminado); se migraron sus checks a la story (defaults, slot, click, disabled, loading, variant, color, size, to, full width).
- Reporter verificado: `public/test-results.json` con 65 checks de `cu-button` en verde.
- Suite completa: 37 archivos / 386 tests en verde.

### 2026-09-10 — 1e UI de resultados

- `test(ui)`: `src/composables/useTestResults.ts` lee `public/test-results.json` (cache no-store, fallback "sin correr").
- `test(ui)`: `src/pages/playground/TestResultBadge.vue` (✅/❌/—) con `title` que lista los checks fallidos.
- `test(ui)`: `StoryRenderer.vue` pinta el badge por sección.
- Verificado en dev server: secciones en ✅ con conteo; rompiendo un check a propósito → ❌ + tooltip con el error; revertido a verde.
- Suite completa: 37 archivos / 386 tests; type-check sin errores nuevos (225 baseline).
