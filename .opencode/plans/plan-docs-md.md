# Plan — Documentación VitePress sin khadgar, mantenida por un agente

Rama: `refactor/docs-md` (base `docs/actualizar-skill`).

Objetivo: retirar el pipeline de khadgar (extracción automática → autogeneración de fichas),
dejar los `.md` como fuente de verdad, reemplazar el `Demo.vue` genérico por demos inline
por página, y crear un agente de opencode que mantenga la documentación cuando cambia un
componente. De paso, destrabar TypeScript 7 + Vue 3.6 y actualizar dependencias.

---

## 1. Qué hacen hoy los 3 plugins (hallazgos)

Los "3 plugins de khadgar" son 3 etapas de un pipeline (~2.100 líneas):

| Plugin | Qué hace | Piezas clave |
|---|---|---|
| `src/plugins/khadgar/` | **Extractor** (fábrica). Dado un `.vue`, produce el contrato JSON (`KhadgarComponent`): props/events/slots/exposed vía `vue-component-meta`; tokens, clases, interfaces y deps con su propio parser; mergea la prosa curada del sidecar `*.doc.json`. Sabe de SFCs, no de markdown. | `extract/index.mjs`, `extract/checker.mjs`, `cli/parse-sfc.mjs`, `cli/extract.mjs`, `config.ts`, `api.ts` |
| `src/plugins/khadgar-docs/` | **Consumidor VitePress**: `render.mjs` (contrato → ficha `.md`), `site.mjs` (fichas del sitio, `khadgar.gen.json` nav/sidebar, `khadgar.json`), `cli.mjs` (fichas de la skill + `--check` de drift), `theme.mjs` (tokens CU → `themes.gen.css`, `shiki.gen.mjs`, puente `--vp-*`), `vitepress.mjs` (sidebar) | `src/plugins/khadgar-docs/` |
| `src/plugins/khadgar-docs-custom-elements/` | Fichas **vanilla** (`<cu-x>`, UMD) de los custom elements; reusa el render | `khadgar-docs-custom-elements/index.mjs` |

La "magia" está concentrada en: `vue-component-meta` (levanta un programa TS completo), los
overrides de los 50 sidecars `.doc.json`, y el modo `vue`/`vanilla`/`vanilla+vue` del render.
El resto es parseo de SFC y generación de markdown.

Consumidores que se tocan al retirarlo: `khadgar.config.json`, `tools/seed-jsdoc.mjs`,
`docs/site/.vitepress/{config.ts,theme/*}`, `package.json`, `scripts/preflight.sh`,
`AGENTS.md`, `README.md`, skills (`comegen-ui-docs`, `generate-release`, `comegen-preflight`)
y `docs/notes/06-cu-markdown-api.md`.

---

## 2. Arquitectura propuesta

```
docs/skills/use-comegen/componentes/cu-<tag>.md   ← ficha canónica, escrita a mano (viaja en el zip)
docs/site/componentes/<slug>.md                   ← página VitePress finita: frontmatter + include + demos
docs/site/.vitepress/theme/{themes,vitepress}.gen.css, shiki.gen.mjs  ← los genera cu-tokens
docs/site/.vitepress/sidebar.ts                   ← escanea frontmatter title/group (~30 líneas)
```

- **Una ficha por componente**: las fichas actuales de la skill ya están en formato mergeado
  (vanilla + apartado "Vista Vue"), así que quedan como canónicas. La página del sitio las
  incluye con `<!--@include: ../../skills/use-comegen/componentes/cu-<tag>.md-->` (soporte
  nativo de VitePress) y **suma los demos en vivo debajo**.
  - Alternativa si se prefiere sitio canónico: `pnpm docs:copy` copia sitio → skill limpiando
    bloques marcados `<!-- demo -->`. Agrega un script; la include no agrega ninguno.
  - Desaparecen las pestañas Vue/Vanilla (`ViewTabs.vue`) y las páginas `-vanilla.md`: una
    sola página muestra ambas cosas.
- **Demos**: `index.md` y `theme-builder.md` ya usan `<script setup>` + `<ClientOnly>`. Cada
  página documenta y muestra lo que el componente realmente hace (variantes, estados, slots),
  sin controles autogenerados.
- **Tema**: `theme.mjs` de khadgar-docs se muda a `cu-tokens`
  (`src/plugins/cu-tokens/vitepress.ts` + CLI `src/plugins/cu-tokens/cli/vitepress.mjs`) que
  escribe `themes.gen.css`, `vitepress.gen.css`, `shiki.gen.mjs`, `public/comegen.config.json`
  y copia assets. `pnpm site:sync` pasa a llamar a ese CLI.
- **Nav/sidebar**: `sidebar.ts` lee `title`/`group` del frontmatter de
  `docs/site/componentes/*.md` al cargar la config. El agente solo agrega frontmatter a la
  página nueva.

### Estructura de una página del sitio

```md
---
title: Button
group: Buttons
---
<script setup>
import Button from "@/components/buttons/Button.vue";
</script>

<!--@include: ../../skills/use-comegen/componentes/cu-button.md-->

## Demos en vivo

<ClientOnly>
  <Button color="primary" variant="solid">Guardar</Button>
</ClientOnly>
```

---

## 3. Fases

### Fase 0 — Rama y spike
1. `git switch -c refactor/docs-md docs/actualizar-skill` (la actual tiene 51 commits que `main` no).
2. Escribir este plan en `.opencode/plans/plan-docs-md.md`.
3. Spike de compatibilidad: `vue@3.6.0-rc.9` + `vitepress@1.6.4`. Verificar una sola copia de
   Vue (`pnpm why vue` / `ls node_modules/.pnpm | grep 'vue@'`); si VitePress anida su 3.5,
   `pnpm.overrides` para que use la RC o fallback a VitePress 2 alpha.

### Fase 1 — Tema a cu-tokens
4. Mover la lógica de `khadgar-docs/theme.mjs` a `src/plugins/cu-tokens/vitepress.ts`
   (reusa `generateThemesCSS`, `generateShikiThemes`, `extractShared/Colors`).
5. CLI `src/plugins/cu-tokens/cli/vitepress.mjs` (con tsx, igual que los otros `.mjs`) +
   `package.json: "site:sync": "tsx --tsconfig tsconfig.app.json src/plugins/cu-tokens/cli/vitepress.mjs"`.
   Verificar que los `.gen.*` queden idénticos.

### Fase 2 — Sitio sin khadgar
6. `docs/site/.vitepress/sidebar.ts` (scan de frontmatter, sin deps nuevas).
7. `config.ts`: sin `khadgar.gen.json`, sin alias `#khadgar-data`, sin `transformPageData`;
   `markdown.theme` sigue leyendo `shiki.gen.mjs`.
8. `Layout.vue`: chau `Demo` y `ViewTabs`; queda `AppTopbar`.
9. Borrar `theme/{Demo.vue,data.ts,registry.ts,samples.ts,ViewTabs.vue}`.
10. Migrar las ~50 páginas de `docs/site/componentes/` a la página finita (script one-off),
    agregar frontmatter `title`/`group`, y **desgitignorar** `docs/site/componentes/` en
    `.gitignore` para commitearlas. Sumar demos a mano/agente componente por componente (no
    hace falta todo de una).
11. Quitar el backlink `[← Volver](../SKILL.md)` de las fichas canónicas (en el sitio sería
    link muerto).

### Fase 3 — Borrar el pipeline
12. Borrar `src/plugins/khadgar/`, `khadgar-docs/`, `khadgar-docs-custom-elements/`,
    `khadgar.config.json`, `tools/seed-jsdoc.mjs`, los 50 `*.doc.json`, y las entradas de
    `.gitignore` (`public/khadgar.json`, `khadgar.gen.json`, `khadgar.json`).
13. `package.json`: fuera `docs:scaffold` y `vue-component-meta`.

### Fase 4 — Verificación de docs
14. `scripts/check-docs.mjs` (~40 líneas, sin extracción): cada tag definido en
    `src/lib/**/*.ts` tiene ficha en `docs/skills/...` y página en `docs/site/...` con
    `title`/`group`; sin eso, preflight falla. Se engancha en `scripts/preflight.sh`
    reemplazando el `khadgar-docs cli --check`.

### Fase 5 — Agente + docs internas
15. `.opencode/agent/comegen-docs.md` (`mode: primary`, `temperature` baja). Prompt: detectar
    componente (pedido o `git diff`), leer `.vue` + `.ce.vue` + entry `lib/`, actualizar ficha
    canónica (tablas props/events/slots/exposed, ejemplos ```vue y ```html, demos),
    actualizar el índice de `docs/skills/use-comegen/SKILL.md`, validar con
    `pnpm dev`/`pnpm test`/`pnpm docs:check`, y no tocar generados.
16. `.gitignore`: agregar `!.opencode/agent/` y `!.opencode/agent/**` (hoy `.opencode/*` está
    ignorado salvo skills/plans).
17. Reescribir `.opencode/skills/comegen-ui-docs/*` al flujo nuevo (hoy describe `.doc.json` y
    `pnpm site:sync` como generador), `docs/skills/generate-release/SKILL.md`,
    `.opencode/skills/comegen-preflight/SKILL.md`, `AGENTS.md`, `README.md` y
    `docs/notes/06-cu-markdown-api.md`.

### Fase 6 — Dependencias (TS 7 dual + Vue 3.6)
18. `typescript` → alias `npm:@typescript/typescript6@^6.0.2` (vue-tsc/Volar siguen con la API 6
    — TS 7.0 no tiene API programática hasta 7.1) + alias `typescript-7` →
    `npm:typescript@^7.0.2` para `tsc` rápido. `vue` → `3.6.0-rc.9`, `vue-tsc` → `3.3.11`,
    `vite`/`vitest`/`pinia` a último compatible.
19. `pnpm install`, `pnpm type-check`, `pnpm test`, `pnpm build`, `pnpm build:lib`. Re-ajustar
    `scripts/typecheck-baseline` si el bump mueve errores preexistentes.

### Fase 7 — Cierre
20. `./scripts/preflight.sh` verde, `pnpm build` + revisar el sitio navegando (playwright),
    commit(s) por fase.

---

## 4. Riesgos a vigilar

- **Vue duplicada** entre `vitepress` y la raíz con pnpm (la trampa más probable de Vue 3.6
  RC). El spike de Fase 0 lo detecta; mitigación con overrides o VitePress 2 alpha.
- **TS 7 no chequea `.vue`** hasta 7.1: el gate sigue siendo `vue-tsc` con API 6; TS 7 queda
  para `tsc` de scripts/`tsconfig` plano. No prometer más que eso.
- **Include fuera de `srcDir`**: verificar dev y build; si molesta, se cae a `pnpm docs:copy`.
- **Migrar 50 páginas**: se hace con script y queda commiteado; los demos se agregan
  incrementalmente.

---

## 5. Decisiones tomadas

- Rama nueva desde `docs/actualizar-skill` (no desde `main`).
- Una ficha por componente; el sitio la incluye (o `docs:copy` si se prefiere sitio canónico).
- Demos inline en cada `.md` (VitePress nativo), sin componente genérico.
- Tema generado por `cu-tokens` (no por khadgar-docs).
- Agente de documentación `comegen-docs` en modo `primary`.
- Dependencias: TS 7 dual + Vue 3.6 RC; VitePress 1.6.4.
