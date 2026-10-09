# comegenui

Librería de componentes UI como Web Components (Custom Elements) construidos con Vue 3.

## Quick Start

```sh
pnpm install
pnpm dev
```

## Instalación para uso

> **Para desarrollo** (modificar componentes, contribuir) ver [Instalación desde source](#instalación-desde-source-build-local).

Repo oficial: [`github.com/SpicyDogWings/comegenui`](https://github.com/SpicyDogWings/comegenui).

### Opción 1: Bajar los zips de una Release (recomendado)

Cada release de GitHub publica la lib en **cuatro zips**, una configuración cada uno, según
formato (UMD/ESM) y variante (core/shared):

| Config | Asset del release | Formato | Vue |
|---|---|---|---|
| `umd-core` | `comegenui-umd-core-v{version}.zip` | UMD | incluido |
| `umd-shared` | `comegenui-umd-shared-v{version}.zip` | UMD | externo (`__COMEGEN_VUE__`) |
| `esm-core` | `comegenui-esm-core-v{version}.zip` | ESM | incluido |
| `esm-shared` | `comegenui-esm-shared-v{version}.zip` | ESM | externo (`import 'vue'`) |

1. Ir a [Releases](https://github.com/SpicyDogWings/comegenui/releases).
2. Bajá el zip de la configuración que uses y descomprimilo en tu proyecto.

Dentro de cada zip, los bundles se llaman `CuX.umd.js` (UMD) o `CuX.js` (ESM). Los `shared`
traen su runtime al lado: `comegen-vue.global.js` (UMD) o `comegen-vue.js` (ESM).

Elegí la configuración según cómo consumas:

- **`umd-core`** — `<script>` suelto, 1–2 componentes, máxima compatibilidad.
- **`umd-shared`** — varios componentes en HTML: Vue viaja una vez en `comegen-vue.global.js`
  (se expone como `globalThis.__COMEGEN_VUE__`, sin tocar `window.Vue`).
- **`esm-core` / `esm-shared`** — proyecto con bundler (Vite/webpack/Rollup). En `shared`, el
  bundle hace `import 'vue'`: lo resuelve tu bundler (tenés Vue instalado) o un import map que
  apunte a `comegen-vue.js` (para hosts sin bundler, p. ej. PHP/vanilla).

Detalle en [instalación](skills/use-comegen/references/instalacion.md).

> Cada zip trae **sólo la lib** (los bundles + el runtime del `shared` si aplica): no incluye
> documentación, ni la skill de uso `use-comegen`, ni CSS. Los tokens del tema se inyectan
> solos al cargar el primer componente. La instalación es manual: descomprimir y copiar.

### Opción 2: Build desde source (cualquier ref)

Para una versión exacta (rama o tag):

```sh
git clone https://github.com/SpicyDogWings/comegenui.git
cd comegenui
git checkout <ref>          # main, v5.0.0-alpha.3, …
pnpm install
pnpm build:lib              # → dist-libs/<config>/comegenui-<config>-v{version}.zip
```

**Uso en HTML:**

```html
<script src="dist-libs/umd-core/CuButton.umd.js"></script>
<cu-button color="primary">Guardar</cu-button>
```

### Actualizar la lib

Se reemplazan archivos, no hay instalador:

1. Bajá el zip del ref nuevo (Opción 1 u 2).
2. **Backup** de tu carpeta actual (opcional pero recomendado).
3. Copiá los bundles nuevos (podés copiar sólo los que usás). En las configs `shared`, copiá
   también el runtime. No hay CSS que copiar: los tokens se inyectan solos al cargar el
   primer componente.
4. Para confirmar qué versión quedó cargada: `customElements.get('cu-x').comegen.version`
   (ver [Versionado](docs/site/versionado.md) y `skills/use-comegen/references/versionado.md`).

## Skill de uso `use-comegen` (para agentes)

La skill de uso **no viaja en el zip**: se instala desde el repo oficial con el CLI
[`skills`](https://github.com/vercel-labs/skills) (Vercel), que la deja en el directorio
de tu agente y registra el origen en `skills-lock.json`.

```sh
# último `main` (autodetecta el agente; forzá con -a opencode, -a claude-code, …)
npx skills add SpicyDogWings/comegenui --skill use-comegen

# fijar una rama/tag concreto
npx skills add "https://github.com/SpicyDogWings/comegenui/tree/v5.0.0-alpha.3/skills/use-comegen"

# actualizar
npx skills update use-comegen
```

Requiere Node 24+. Si no podés usar el CLI, bajá la carpeta a mano:

**Con git (sparse-checkout, sin bajar el resto del repo):**

```sh
git clone --filter=blob:none --sparse --branch main \
  https://github.com/SpicyDogWings/comegenui.git /tmp/comegenui
cd /tmp/comegenui
git sparse-checkout set skills/use-comegen
mkdir -p <proyecto>/.opencode/skills
cp -r skills/use-comegen <proyecto>/.opencode/skills/
```

Cambiá `--branch main` por la rama o tag que quieras (`--branch v5.0.0-alpha.3`).

**Sin git (tarball del ref):**

```sh
mkdir -p <proyecto>/.opencode/skills
curl -L https://github.com/SpicyDogWings/comegenui/archive/refs/heads/main.tar.gz \
  | tar -xz --strip-components=2 -C <proyecto>/.opencode/skills \
    'comegenui-main/skills/use-comegen'
```

Para un tag: `archive/refs/tags/v5.0.0-alpha.3.tar.gz` con el prefijo
`comegenui-5.0.0-alpha.3/` (GitHub quita la `v` inicial del ref al nombrar la carpeta).

El detalle completo y la correspondencia de versión están en
`skills/use-comegen/SKILL.md`.

---

## Instalación desde source (build local)

> **Para desarrollo** de la librería (crear/modificar componentes, contribuir al repo).
> Para solo **usar** los componentes, ver [Instalación para uso](#instalación-para-uso).

```sh
# 1. Clonar el repo
git clone https://github.com/SpicyDogWings/comegenui.git
cd comegenui

# 2. Instalar dependencias
pnpm install

# 3. Build de la librería
pnpm build:lib
```

El output queda en `dist-libs/`: una carpeta por configuración, cada una con su zip.

```
dist-libs/
├── umd-core/    CuX.umd.js                             + comegenui-umd-core-v{version}.zip
├── umd-shared/  CuX.umd.js + comegen-vue.global.js     + comegenui-umd-shared-v{version}.zip
├── esm-core/    CuX.js                                 + comegenui-esm-core-v{version}.zip
└── esm-shared/  CuX.js + comegen-vue.js                + comegenui-esm-shared-v{version}.zip
```

Para usar en tu proyecto, copiá los bundles que necesités (y el runtime del `shared` si lo usás):

```html
<script src="dist-libs/umd-core/CuButton.umd.js"></script>
<cu-button color="primary">Guardar</cu-button>
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Dev server del sitio de docs (VitePress) con hot-reload |
| `pnpm build` | Build del sitio de docs |
| `pnpm preview` | Preview del sitio buildeado |
| `pnpm site:sync` | Regenera el tema de VitePress (tokens CU → `*.gen.*`) |
| `pnpm build:lib` | Build de la librería (Web Components) en 4 configs + un zip por config |
| `pnpm type-check` | Type-check con `vue-tsc` |
| `pnpm test` | Tests unitarios (Vitest) |
| `pnpm guard` | Gate local con veredicto por componente (`--full`, `--solo <tag>`, `--explicar`) |
| `pnpm mutation` | Prueba de falsos verdes: aplica bugs y verifica que los tests los detecten |
| `pnpm contract` | Verifica el contrato de cada custom element (`contract:update` regenera el baseline) |
| `pnpm impact` | Qué componentes dependen de los archivos que cambiaste |

> **Hooks locales:** activá el gate automático una vez por clon con
> `git config core.hooksPath .githooks`. `pre-commit` corre rápido (`guard.sh --fast`)
> y `pre-push` corre completo (`guard.sh --full`). Las pruebas corren en local: no hay CI automático.

## Build de la librería

```sh
pnpm build:lib
```

Compila cada componente en `src/lib/` como bundle independiente, en **cuatro configuraciones**
(formato × variante). Output en `dist-libs/`, una carpeta por config con su propio zip:

```
dist-libs/
├── umd-core/    CuButton.umd.js  CuAlert.umd.js  …            + comegenui-umd-core-v{version}.zip
├── umd-shared/  CuButton.umd.js  CuAlert.umd.js  …            + comegen-vue.global.js
│                                                              + comegenui-umd-shared-v{version}.zip
├── esm-core/    CuButton.js  CuAlert.js  …                    + comegenui-esm-core-v{version}.zip
└── esm-shared/  CuButton.js  CuAlert.js  …                    + comegen-vue.js
                                                               + comegenui-esm-shared-v{version}.zip
```

### Cómo funciona

1. Busca todos los `src/lib/**/*.ts` (excluye `index.ts` y `tokens.ts`)
2. Cada `.ts` es un entry point que define un Custom Element via `defineCustomElement`
3. Compila **cuatro veces** cada componente con `vue({ features: { customElement: true } })` +
   `UnoCSS({ mode: "shadow-dom" })`:
   - `umd-core` / `esm-core`: UMD (`format: umd`) o ESM (`format: es`) con Vue incluido
   - `umd-shared`: UMD con `vue` externo contra el global `__COMEGEN_VUE__`
   - `esm-shared`: ESM con `vue` externo por bare import (`import 'vue'`)
4. Genera el runtime de Vue de cada `shared`: `comegen-vue.global.js` (IIFE, UMD) y
   `comegen-vue.js` (ESM)
5. Empaqueta cada configuración en su zip `comegenui-<config>-v{version}.zip` (bundles +
   runtime si es `shared`; sin CSS)`

### Agregar un componente nuevo

1. Crear `src/components/{category}/MiComponente.vue` (componente real)
2. Crear `src/components/customElements/{category}/MiComponente.ce.vue` (wrapper CE)
3. Crear `src/lib/{category}/mi-componente.ts` (entry point)
4. Ejecutar `pnpm build:lib`

## Temas

Los temas se configuran en `comegen.config.json`:

```json
{
  "themes": {
    "light": {
      "primary": "#E73F1E",
      "neutral": "#1a1a1a",
      "success": "#22c55e",
      "warning": "#f59e0b",
      "danger": "#ef4444",
      "surface": "#eeeeee"
    },
    "dark": {
      "neutral": "#e5e5e5",
      "surface": "#1c1c1c"
    }
  }
}
```

### Agregar un tema nuevo

1. Agregar entrada en `comegen.config.json` con los 6 colores
2. Ejecutar `pnpm build:lib`
3. Usar: `<html data-theme="mi-tema">` o `<cu-button theme="mi-tema">`

### Prioridad de temas

```
theme prop (componente) → data-theme (<html>) → prefers-color-scheme (OS)
```

### Tokens CSS generados

Para cada color (`primary`, `neutral`, `success`, etc.) se generan:

- `--cu-color-{name}` — color base
- `--cu-color-{name}-text` — texto sobre el color
- `--cu-color-{name}-hover`, `-active` — estados interactivos
- `--cu-color-{name}-soft` — variante suave
- `--cu-color-{name}-subtle` — variante sutil
- `--cu-color-{name}-ghost-hover`, `-ghost-active` — variante fantasma

## Uso (HTML plano)

```html
<!-- 1. Incluir componentes UMD (config umd-core: Vue adentro) -->
<script src="CuButton.umd.js"></script>
<script src="CuAlert.umd.js"></script>

<!-- 2. Usar -->
<cu-button color="primary">Click me</cu-button>
<cu-alert color="success" variant="soft">Guardado correctamente</cu-alert>
```

Para la config `umd-shared`, cargá el runtime **antes** de los componentes:

```html
<script src="comegen-vue.global.js"></script>
<script src="CuButton.umd.js"></script>
<script src="CuAlert.umd.js"></script>
```

Para `esm-core` / `esm-shared`, importá los módulos:

```js
import './comgenui/CuButton.js'
```

En `esm-shared`, el bundle hace `import 'vue'`; con un navegador sin bundler, resolvelo con un
import map al runtime del zip:

```html
<script type="importmap">
{ "imports": { "vue": "./comgenui/comegen-vue.js" } }
</script>
```

## Estructura del proyecto

```
src/
├── components/
│   ├── {category}/MiComponente.vue        ← Componente real
│   ├── customElements/{category}/MiComponente.ce.vue  ← Wrapper CE
│   ├── icons/                             ← Iconos
│   ├── theme/                             ← ThemeManagerModal
│   ├── lab/                               ← Experimentales
│   └── legacy/                            ← Versiones anteriores (no usar)
├── lib/
│   └── {category}/mi-componente.ts        ← Entry points para build
├── config/
│   └── theme.ts                           ← Definiciones de temas
├── plugins/cu-tokens/                     ← Sistema de tokens CSS
├── composables/                           ← Composables reutilizables
└── utils/                                 ← Utilidades
```

## IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (deshabilitar Vitur)

## Browser Setup

- Chromium: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) + [Custom Object Formatter](http://bit.ly/object-formatters)
- Firefox: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/) + [Custom Object Formatter](https://fxdx.dev/firefox-devtools-custom-object-formatters/)
