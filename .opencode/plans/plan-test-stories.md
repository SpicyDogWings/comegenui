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
- [~] **1f** Escalar al resto (progresivo, por orden de dependencia)
  - [x] **Badge** migrado (story + 48 checks L1 + página con `StoryRenderer`).
  - [x] **Label** migrado (story + 19 checks L1 + página con `StoryRenderer`).
  - [x] **Alert** migrado (story + 32 checks L1 + página con `StoryRenderer`).
  - [x] **Card** migrado (story + 36 checks L1 + página con `StoryRenderer`).
  - [x] **Switch** migrado (story + 25 checks L1 + página con `StoryRenderer`).
  - [x] **Checkbox** migrado (story + 18 checks L1 + página con `StoryRenderer`).
  - [x] **Textarea** migrado (story + 24 checks L1 + página con `StoryRenderer`).
  - [x] **Input** migrado (story + 55 checks L1 + página con `StoryRenderer`).
  - [x] **Avatar** migrado (story + 45 checks L1 + página con `StoryRenderer`).
  - [x] **Loader** migrado (story + 8 checks L1 + página con `StoryRenderer`).
  - [x] **ColorPicker** migrado (story + 6 checks L1 + página con `StoryRenderer`).
  - [x] **CopyButton** migrado (story + 25 checks L1 + página con `StoryRenderer`).
  - [x] **FloatingButton** migrado (story + 25 checks L1 + página con `StoryRenderer`).
  - [x] **ToggleColorSheme** migrado (story + 23 checks L1 + página con `StoryRenderer`).
  - [x] **FileList** migrado (story + 13 checks L1; interno, sin página de playground).
  - [x] **Collapse** migrado (story + 20 checks L1 + página con `StoryRenderer`).
  - [x] **Tabs** migrado (story + 50 checks L1 + página con `StoryRenderer`).
  - [x] **Pagination** migrado (story + 37 checks L1 + página con `StoryRenderer`).
  - Herramientas de eficiencia: `stories:status`, `stories:migrate`, `new:component`.
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

## Extra — Playbook `comegen-dev` (reestructura de la skill de desarrollo)

- [x] Renombrar `comegen-ui-dev` → **`comegen-dev`** y partirlo en `SKILL.md` (entrada corta: flujo + DoD) + archivos de referencia (patrón de `comegen-ui-docs`).
- [x] Referencias: `01-mapa-del-repo`, `02-crear-componente`, `03-modificar-componente`, `04-stories-y-tests`, `05-playground`, `06-build-y-validacion`, `07-documentacion`.
- [x] `08-migrar-al-sistema-de-stories.md`: receta de migración (1f) con Badge como ejemplo trabajado (secciones, mapeo de checks, preview para la grilla, refactor de la página).
- [x] Stories y tests centralizados en `src/stories/{category}/` (espejo de categorías), fuera de `src/components/`: el componente ya no arrastra archivos de verificación al lado.

## Extra — Eficiencia (herramientas)

- [x] `pnpm run stories:status` — inventario de componentes (público/página/story/test viejo/badges).
- [x] `pnpm run stories:migrate X` — story + test L1 con secciones, snippets, **variants y checks genéricos** automáticos; marca los TODO (v-for, slots nombrados, dinámicos).
- [x] `pnpm run new:component X <category> [--internal]` — scaffold de componente nuevo (`.vue` + `.ce.vue` + `lib/` + story + test).
- [x] `./scripts/preflight.sh X` — preflight scopeado a un componente (~8s).
- [x] Badge del playground sin la palabra "tests": `✓ N` / `✗ fallos/total`.
- [ ] Migrar el resto de 1f usando las herramientas (idealmente en paralelo por lotes).
- [x] `04-stories-y-tests.md`: contrato de story, runner L1, reporter, badges, Fases 2/3.
- [x] `AGENTS.md`: árbol con stories/tests + puntero al playbook + sección "Tests y preflight".
- [ ] Fase 2/3 del plan (`.ce` y `.umd`) reflejadas en `04` cuando existan.

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

### 2026-09-10 — Playbook `comegen-dev`

- `docs(skill)`: `comegen-ui-dev` → `comegen-dev`, partido en `SKILL.md` (flujo de 8 pasos + DoD) + `01`…`07` de referencia.
- `docs(skill)`: nuevo `04-stories-y-tests.md` con el sistema de stories/tests por capas y el reporter.
- `docs(agents)`: `AGENTS.md` con el árbol actualizado (stories/tests/playground), puntero al playbook y sección "Tests y preflight".

### 2026-09-10 — Ubicación de stories/tests

- `refactor(stories)`: `Button.stories.ts` y `Button.l1.test.ts` movidos de `src/components/buttons/` a `src/stories/buttons/` (espeja la categoría). El componente ya no convive con sus archivos de verificación.
- Playground `Button.vue` y el playbook (`SKILL.md`, `01`–`05`, `08`, `AGENTS.md`) actualizados a la nueva ruta.
- Preflight en verde tras el movimiento: 37 archivos / 386 tests; type-check sin errores nuevos.

### 2026-09-10 — Herramientas de eficiencia

- `feat(tools)`: `tools/stories/status.mjs` — inventario (público/página/story/test viejo/badges).
- `feat(tools)`: `tools/stories/migrate.mjs` — genera story+test desde la página del playground (secciones, títulos, badges solo del heading, snippets, tests viejos a mapear).
- `feat(tools)`: `tools/scaffold-component.mjs` — scaffold de componente nuevo (`.vue` + `.ce.vue` + `lib/` + story + test).
- `chore(preflight)`: baseline de type-check 225 → 224.
- Playbook actualizado con los comandos y el atajo de migración.

### 2026-09-10 — 1f: Badge migrado

- `test(l1/badge)`: `src/stories/information/Badge.stories.ts` (3 secciones, 48 checks L1: variants/default/colors/combinations) + `Badge.l1.test.ts`.
- `test(playground)`: `src/pages/playground/components/Badge.vue` refactorizado a `StoryRenderer` (Programmatic/Style/API se conservan).
- `git rm src/components/information/Badge.test.ts` (4 tests migrados a la story).
- Preflight en verde: 37 archivos / 430 tests; type-check sin errores nuevos.

### 2026-09-10 — Fix espaciado + 1f: Label migrado (métricas)

- `fix(playground)`: `StoryRenderer` vuelve a renderizar **fragmento** (sin `<div>` wrapper), restaurando el `gap: 1.5rem` entre secciones: 49px medidos, igual que las páginas a mano (Alert).
- `feat(stories)`: `Section.description` opcional (párrafos tipo "Native") renderizado por el StoryRenderer.
- `test(l1/label)`: Label migrado — 5 secciones (default/for/colors/slot/native), 19 checks L1, página refactorizada a `StoryRenderer`, `Label.test.ts` eliminado.
- **Métricas de la migración:** tool `stories:migrate` <1s · story + checks + página + test ~50s · preflight (type-check + 444 tests) 20s · total ~1m 15s.
- Preflight: 37 archivos / 444 tests; type-check 224 (sin errores nuevos).

### 2026-09-10 — 1f: Alert migrado (métricas)

- `test(l1/alert)`: Alert migrado — 6 secciones (variants/colors/close/toggle/icons/notitle), **32 checks L1**, página refactorizada a `StoryRenderer`, `Alert.test.ts` eliminado.
- Preview interactivo de `toggle` (v-model:show) preservado con `preview`.
- **Métricas:** tool <1s · story + checks + página + test **~51s** · preflight (type-check + 468 tests) **21s** · total **~1m 16s**.
- Verificado en navegador: 6 secciones ✅, 17 alerts renderizados, 0 errores de consola.

### 2026-09-10 — Herramientas v2 + preflight scopeado + badge

- `feat(tools)`: `stories:migrate` ahora extrae **variants** del markup (props estáticos, booleanos, atómicos, interpolación `{{ prop }}`) y genera **checks genéricos** (raíz, variant, color, slot). Marca TODO: `v-for`, slots nombrados, atributos dinámicos.
- `feat(preflight)`: `./scripts/preflight.sh <X>` corre type-check + solo el L1 del componente; `--no-typecheck` disponible. Full: 20s → scoped: ~8s.
- `fix(ui)`: badge del playground sin "tests": `✓ N` / `✗ fallos/total` (tooltip con el detalle).

### 2026-09-10 — 1f: Card migrado (métricas con tools v2)

- `test(l1/card)`: Card migrado — 7 secciones, **36 checks L1** (los genéricos del tool + específicos de title/subtitle/image/layout/slots nombrados), página a `StoryRenderer`, `Card.test.ts` eliminado.
- **Métricas:** tool <1s generó 59 checks (58 pasaban ya) · completar/combinar ~1m · preflight scopeado **8s**.
- Nota del tool: `v-for` (colors) y slots nombrados quedan marcados como TODO; requieren mano humana.
- Verificado en navegador: 7 secciones con `✓ N`, 24 cards, 0 errores de consola.

### 2026-09-10 — 1f: Switch migrado (métricas con tools v2.1)

- `feat(tools)`: check de color/slot robusto (busca el token en todo el markup, no solo en la raíz) y detección de `defineModel` (modelValue va a `props`, no a `attrs`).
- `test(l1/switch)`: Switch migrado — 5 secciones, **25 checks L1**, página a `StoryRenderer`, `Switch.test.ts` eliminado. API de slots corregida (documenta el slot `default`).
- **Métricas:** tool <1s (13 checks verdes automáticos) · completar checks específicos + página ~16s · preflight scopeado **9s**. Total **~1m 33s**, de los cuales ~40s fueron mejoras al tool que benefician a todos los próximos.
- Verificado en navegador: `✓ 9 / ✓ 4 / ✓ 2 / ✓ 6 / ✓ 4`, 16 switches, 0 errores.

### 2026-09-10 — 1f: Checkbox migrado

- `test(l1/checkbox)`: Checkbox migrado — 5 secciones, **18 checks L1**, página a `StoryRenderer`, `Checkbox.test.ts` eliminado.
- Tool: 9 checks automáticos verdes; completados los específicos (input+label, tildado con icono, change/update:modelValue, sizes, disabled).
- Preflight scopeado: 18/18 verde.

### 2026-09-10 — 1f: Textarea migrado

- `test(l1/textarea)`: Textarea migrado — 6 secciones, **24 checks L1**, página a `StoryRenderer`, `Textarea.test.ts` eliminado.
- Tool: 30 checks automáticos verdes; completados placeholder/rows, readonly, disabled, noResize y v-model.

### 2026-09-10 — 1f: Input migrado

- `test(l1/input)`: Input migrado — 7 secciones, **55 checks L1**, página a `StoryRenderer`, `Input.test.ts` eliminado.
- Tool: 39 checks automáticos verdes; completados placeholder/type, disabled, valor inicial y v-model.

### 2026-09-10 — 1f: Avatar migrado

- `test(l1/avatar)`: Avatar migrado (sin test viejo) — 4 secciones, **45 checks L1**, página a `StoryRenderer`.
- `fix(tools)`: check de color tolerante a fallback (`var(--cu-color-x, #fallback)`).
- Checks propios: iniciales, color de paleta, size, imagen y ausencia de iniciales con `src`.

### 2026-09-10 — 1f: Loader migrado

- `test(l1/loader)`: Loader migrado — 3 secciones, **8 checks L1**, página a `StoryRenderer`, `Loader.test.ts` eliminado.
- Previews propios con caja `position:relative` (el loader es `absolute`) y grilla para Colors.

### 2026-09-10 — 1f: ColorPicker migrado

- `test(l1/color-picker)`: ColorPicker migrado — 3 secciones, **6 checks L1**, página a `StoryRenderer`, `ColorPicker.test.ts` eliminado.

### 2026-09-10 — 1f: CopyButton migrado

- `test(l1/copy-button)`: CopyButton migrado — 3 secciones, **25 checks L1**, página a `StoryRenderer`, `CopyButton.test.ts` eliminado.
- `fix(tools)`: `parseAttrs` soporta valores con comillas simples (JSON en `text='{"id":1}'`).
- Checks propios: icon-only/aria-label, label visible, `copiedLabel` tras copiar (clipboard mockeado), color y variante delegada a Button.

### 2026-09-10 — 1f: FloatingButton migrado

- `test(l1/floating-button)`: FloatingButton migrado — 3 secciones, **25 checks L1**, página a `StoryRenderer`, `FloatingButton.test.ts` eliminado.
- Previews con `position: static` (trampa de FABs) e íconos por slot en las variantes.

### 2026-09-10 — 1f: ToggleColorSheme migrado + infra de stories

- `feat(stories)`: `ComponentStory.setup`/`global` (Pinia, init de plugins) en el runner; `--page` en `stories:migrate` (componente con typo `Sheme` vs página `Scheme`); export de `init` en cu-tokens.
- `test(l1/toggle-color-sheme)`: ToggleColorSheme migrado — 2 secciones, **23 checks L1**, página a `StoryRenderer`, test viejo eliminado.

### 2026-09-10 — 1f: FileList migrado

- `test(l1/file-list)`: FileList migrado (interno, sin página) — 7 secciones, **13 checks L1**, test viejo eliminado.
- Story escrita a mano (el tool requiere página): items, empty, select, remove, disabled, max-height, colors.

### 2026-09-10 — 1f: Collapse migrado

- `test(l1/collapse)`: Collapse migrado — 4 secciones, **20 checks L1**, página a `StoryRenderer`, `Collapse.test.ts` eliminado.
- Checks propios: abierto/cerrado, toggle(true/false), defaultOpen, exposes open/close/toggle, color.

### 2026-09-10 — 1f: Tabs migrado

- `test(l1/tabs)`: Tabs migrado — 6 secciones, **50 checks L1**, página a `StoryRenderer`, `Tabs.test.ts` eliminado.
- Story escrita a mano (el esqueleto del tool quedaba roto con `tabs` dinámico): click, teclado, disabled global/por tab, keepAlive, icon prop vs slot, exposes.

### 2026-09-10 — 1f: Pagination migrado

- `test(l1/pagination)`: Pagination migrado — 4 secciones, **37 checks L1**, página a `StoryRenderer`, `Pagination.test.ts` eliminado.
- `global` con stub de `Select` para poder operar el `<select>` de page size (mismo enfoque que el test viejo).
