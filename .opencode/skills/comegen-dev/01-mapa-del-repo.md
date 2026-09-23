# 01 — Mapa del repo

Para que un agente nuevo se ubique antes de tocar nada.

## Estructura

```
src/
├── components/
│   ├── {category}/X.vue                # Componente real (solo lógica, template, estilos)
│   ├── customElements/{category}/X.ce.vue  # Wrapper Custom Element (thin)
│   ├── icons/ · theme/ · lab/ · legacy/ · archived/  # no públicos / internos
├── lib/{category}/x.ts                 # Entry point UMD (defineCustomElement + registro)
├── stories/                            # Verificación/demo: NO vive junto al componente
│   ├── types.ts                        # Shim → @/plugins/khadgar/contract (contrato)
│   ├── runner.l1.ts                    # Shim → @/plugins/khadgar/tests/runner.l1
│   └── {category}/X.stories.ts         # Story (secciones + checks); espeja la categoría
│       {category}/X.l1.test.ts         # Test L1 (runner de stories)
├── pages/playground/
│   └── ThemeBuilder.vue                # Página física (usa PlaygroundLayout del plugin)
├── composables/useTestResults.ts       # Shim → plugin runtime/useTestResults
├── plugins/
│   ├── cu-tokens/                      # Sistema de tokens CSS
│   └── khadgar/                  # Plugin de stories SELF-CONTAINED (runtime + generate + reporter)
│       ├── index.ts                    # Vue plugin (ruta components/:name + registry)
│       ├── contract.ts                 # DUEÑO del contrato ComponentStory/Section/Variant/checks
│       ├── chrome.ts · runtime/chrome/ # Chrome (UI) con fallbacks mínimos + inyección del host
│       ├── keys.ts · config.ts         # Registry/nav/config
│       ├── runtime/                    # StoryPage, StoryBody, StoryRenderer, PlaygroundLayout, useTestResults…
│       ├── tests/runner.l1.ts          # DUEÑO del runner capa L1 (.vue, jsdom)
│       ├── cli/generate.mjs            # Generador prop-driven (genérico)
│       └── vitest/reporter.ts          # Escribe public/test-results.json
├── config/theme.ts                     # Temas estáticos
├── router/index.ts                     # Rutas (Home/Playground; la dinámica la agrega el plugin)
└── utils/                              # getHostTheme, palette, fileIcons, search…

tools/migrate.mjs                       # Migración desde páginas (específico del repo)
tools/status.mjs                        # Inventario componentes/stories/badges (del repo)
tools/scaffold-component.mjs            # Scaffold del patrón de 3 archivos (del repo)
scripts/preflight.sh                    # type-check + tests (gate local)
scripts/typecheck-baseline              # Deuda de type-check preexistente
```

**Regla de ubicación:** el componente (`X.vue`) vive en `src/components/{category}/`; su **story y test** viven en `src/stories/{category}/` (misma categoría). El componente nunca arrastra archivos de test al lado.

Categorías válidas (`{category}`): `form/`, `information/`, `overlay/`, `navigation/`, `data/`, `buttons/`, `controls/`, `markdown/`, y raíz (ej: `Tabs.vue`, `floating-button.ts`).

## Las 3 capas de test

| Capa | Artefacto | Entorno | Estado |
|---|---|---|---|
| **L1** | `X.vue` | jsdom (`@vue/test-utils`) | ✅ implementada |
| **L2** | `X.ce.vue` | browser (Chromium) | ⏳ Fase 2 |
| **L3** | `dist-lib/CuX.umd.js` | browser | ⏳ Fase 3 |

Las tres salen de la **misma story** (`X.stories.ts`): no se duplica el escenario. Detalle en [`04-stories-y-tests.md`](04-stories-y-tests.md).

## Público vs interno

- **Público**: tiene wrapper `.ce.vue` + entry en `src/lib/` → se buildea a UMD y viaja en el zip.
- **Interno**: solo `.vue` (ej: `Dropdown.vue`, `AdvancedTable.vue`, `icons/*`). No lleva tab Vanilla ni entry en `lib/`.

## Tokens y color

```
usuario pasa color="primary"
  → .ce.vue lo pasa al .vue
  → .vue resuelve var(--cu-color-primary-*) por CSS
  → cu-tokens resuelve el hex según el tema activo (light/dark/sigacadv2)
```

Temas: `<html data-theme="dark">` (global) o `theme="..."` (por componente). Prioridad: prop `theme` → `data-theme` → `prefers-color-scheme`.

## Skills relacionadas

| Skill | Para qué |
|---|---|
| **`comegen-dev`** (esta) | Desarrollar/modificar/buildear componentes en el repo |
| `comegen-ui` (symlink → `docs/skills/use-comegen`) | **Consumir** la lib en otro proyecto (viaja con el zip) |
| `comegen-ui-docs` | Documentar componentes (`cu-*.md` e índices) |
| `comegen-preflight` | Correr el gate local antes de un MR |

## Documentos base

- [`AGENTS.md`](../../../AGENTS.md) — arquitectura y reglas del proyecto (fuente de verdad).
- `.opencode/plans/` — planes activos e historial de trabajo.
