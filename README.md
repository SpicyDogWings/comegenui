# comegenui

Librería de componentes UI como Web Components (Custom Elements) construidos con Vue 3.

## Quick Start

```sh
pnpm install
pnpm dev
```

## Instalación (desde el repo)

El build se genera en la nube: GitLab CI compila la librería con `build:lib`
(lo mismo que el build local) y publica el artifact: los **archivos de la lib**
(`Cu*.umd.js`, `css/`, `README-BUILD.md`) + el **folder de la skill de uso**
`comegen-ui/` (sin `docs/`, sin zip anidado). Descargalo directo desde el repo:

**Linux / macOS:**
```sh
curl -L -o comegenui.zip "https://gitlab.com/SpicyDogWings/comegen-ui/-/jobs/artifacts/main/download?job=build"
```

**Windows (PowerShell):**
```powershell
Invoke-WebRequest -Uri "https://gitlab.com/SpicyDogWings/comegen-ui/-/jobs/artifacts/main/download?job=build" -OutFile "comegenui.zip"
```

Luego descomprimí en tu proyecto (los archivos + `comegen-ui/` quedan al mismo nivel).

**Actualizar a futuro:** `update.sh` (Linux/macOS) y `update.bat` (Windows) viajan dentro de la lib. Ejecutalo desde la carpeta de la lib — además instala la skill de uso en `.agents/skills/` del proyecto (para los agentes).

**Linux / macOS:**
```sh
./<carpeta-destino>/update.sh
```

**Windows** (doble clic en `update.bat`, o desde cmd):
```cmd
update.bat
```

Con tag específico: `update.bat v3.0.0`

> El artifact incluye los UMD (`CuAlert.umd.js`, `CuButton.umd.js`, ...), los
> CSS de temas (`css/themes.css`), el `README-BUILD.md` y el folder de la skill
> de uso `comegen-ui/` (SKILL.md + docs por componente). Cargá los `.umd.js` con
> un `<script>` y usá las etiquetas (`<cu-button>`, `<cu-alert>`, ...) directo
> en el HTML — ver [Uso (HTML plano)](#uso-html-plano).

### Versión específica (Release)

Cada tag publica una [Release](https://gitlab.com/SpicyDogWings/comegen-ui/-/releases)
con el build como asset. Para bajar un tag puntual reemplazá `main` por el tag (ej. `v3.0.0`) en la URL de arriba.

## Instalación desde source (build local)

Si preferís compilar vos mismo desde el código fuente:

```sh
# 1. Clonar el repo
git clone https://gitlab.com/SpicyDogWings/comegen-ui.git
cd comegen-ui

# 2. Instalar dependencias
pnpm install

# 3. Build de la librería
pnpm build:lib
```

El output queda en `dist/`:

```
dist/
├── CuAlert.umd.js
├── CuButton.umd.js
├── ...
├── css/themes.css
└── comegenui-v{version}.zip
```

Para usar en tu proyecto, copiá los `.umd.js` que necesités y el CSS:

```html
<link rel="stylesheet" href="dist/css/themes.css">
<script src="dist/CuButton.umd.js"></script>
<cu-button color="primary">Guardar</cu-button>
```

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
<link rel="stylesheet" href="css/themes.css">

<!-- 2. Incluir componentes UMD -->
<script src="CuButton.umd.js"></script>
<script src="CuAlert.umd.js"></script>

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
