# comegenui

Librería de componentes UI como Web Components (Custom Elements) construidos con Vue 3.

## Quick Start

```sh
pnpm install
pnpm dev
```

## Instalación (desde el repo)

El build se genera en la nube: GitLab CI compila la librería con `build:lib`
(lo mismo que el build local) y publica el artifact con **el zip versionado**
`comegenui-v{version}.zip` + la carpeta `docs/comegen-ui/` (skill de uso de
comegen, sin las de desarrollo/documentar). El zip descomprime en la carpeta
**`comegenui/`**. Descargalo directo desde el repo:

```sh
# 1. Descargar el último build de main
curl -L -o comegenui.zip \
  "https://gitlab.com/SpicyDogWings/comegen-ui/-/jobs/artifacts/main/download?job=build"

# 2. Descomprimir el artifact (zip versionado + skill de uso)
unzip comegenui.zip

# 3. Descomprimir la librería en tu proyecto → crea la carpeta comegenui/
unzip comegenui-v{version}.zip -d <carpeta-destino>
```

> El artifact incluye el zip versionado `comegenui-v{version}.zip` (que al
> descomprimir genera la carpeta `comegenui/` con los UMD, `css/` y la skill de
> uso `docs/comegen-ui/`) y la carpeta `docs/comegen-ui/` con la skill de uso.
> Cargá los `.umd.js` con un `<script>` y usá las etiquetas
> (`<cu-button>`, `<cu-alert>`, ...) directo en el HTML — ver
> [Uso (HTML plano)](#uso-html-plano).

### Versión específica (Release)

Cada tag publica una [Release](https://gitlab.com/SpicyDogWings/comegen-ui/-/releases)
con el build como asset. Para bajar un tag puntual:

```sh
curl -L -o comegenui.zip \
  "https://gitlab.com/SpicyDogWings/comegen-ui/-/jobs/artifacts/<TAG>/download?job=build"
```

(reemplazá `<TAG>` por el tag, ej. `v3.0.0`)

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Dev server con hot-reload |
| `pnpm build` | Type-check + build para producción (app) |
| `pnpm build:lib` | Build de la librería UMD (Web Components) |
| `pnpm storybook` | Storybook en `localhost:6006` |
| `pnpm type-check` | Type-check con `vue-tsc` |

## Build de la librería

```sh
pnpm build:lib
```

Compila cada componente en `src/lib/` como UMD independiente. Output en `dist/`:

```
dist/
├── CuAlert.umd.js
├── CuButton.umd.js
├── CuBadge.umd.js
├── ...
├── css/
│   ├── themes.css      ← Todos los temas combinados
│   ├── light.css       ← Solo tema light
│   └── dark.css        ← Solo tema dark
├── README-BUILD.md
└── comegenui-v{version}.zip
```

### Cómo funciona

1. Busca todos los `src/lib/**/*.ts` (excluye `index.ts` y `tokens.ts`)
2. Cada `.ts` es un entry point que define un Custom Element via `defineCustomElement`
3. Compila cada uno como UMD con `vue({ features: { customElement: true } })` + `UnoCSS({ mode: "shadow-dom" })`
4. Genera los CSS del sistema de tokens
5. Empaqueta todo en un zip versionado

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
<!-- 1. Incluir CSS del tema -->
<link rel="stylesheet" href="comegenui/css/themes.css">

<!-- 2. Incluir componentes UMD -->
<script src="comegenui/CuButton.umd.js"></script>
<script src="comegenui/CuAlert.umd.js"></script>

<!-- 3. Usar -->
<cu-button color="primary">Click me</cu-button>
<cu-alert color="success" variant="soft">Guardado correctamente</cu-alert>
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
