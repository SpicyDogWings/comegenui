# comegenui

Librería de componentes UI como Web Components (Custom Elements) construidos con Vue 3.

## Quick Start

```sh
pnpm install
pnpm dev
```

## Instalación para uso

> **Para desarrollo** (modificar componentes, contribuir) ver [Instalación desde source](#instalación-desde-source-build-local).

### Opción 1: Descargar build de CI (recomendado)

GitLab CI compila la librería automáticamente y publica un artifact con los
archivos listos para usar: `Cu*.umd.js`, `css/`, `comegen-ui/` (skill de uso)
y los scripts de actualización.

**Linux / macOS:**
```sh
curl -L -o comegenui.zip "https://gitlab.com/SpicyDogWings/comegen-ui/-/jobs/artifacts/main/download?job=build"
```

**Windows (PowerShell):**
```powershell
Invoke-WebRequest -Uri "https://gitlab.com/SpicyDogWings/comegen-ui/-/jobs/artifacts/main/download?job=build" -OutFile "comegenui.zip"
```

**Versión específica (tag/release):** reemplazá `main` por el tag (ej. `v3.0.0`) en la URL.

Cada tag publica una [Release](https://gitlab.com/SpicyDogWings/comegen-ui/-/releases) con el build como asset.

**Descomprimí** en tu proyecto. Los archivos quedan al mismo nivel:

```
tu-proyecto/
├── CuButton.umd.js
├── CuAlert.umd.js
├── ...
├── css/themes.css
├── use-comegen/       ← skill de uso (para agentes)
├── update.sh            ← actualizador Linux/macOS
├── update.bat           ← actualizador Windows
└── update.ps1           ← actualizador PowerShell
```

**Uso en HTML:**
```html
<link rel="stylesheet" href="css/themes.css">
<script src="CuButton.umd.js"></script>
<cu-button color="primary">Guardar</cu-button>
```

### Opción 2: Instalación manual (zip del release)

1. Ir a [Releases](https://gitlab.com/SpicyDogWings/comegen-ui/-/releases)
2. Descargar el `.zip` del tag deseado
3. Extraer en tu proyecto
4. Cargar los `.umd.js` que necesités con `<script>` y el CSS con `<link>`

### Scripts incluidos en el zip

| Script | Plataforma | Descripción |
|--------|-----------|-------------|
| `update.sh` | Linux/macOS | Descarga e instala el último build (o un tag específico) |
| `update.bat` | Windows (cmd) | Idem, evade ExecutionPolicy |
| `update.ps1` | Windows (PowerShell) | Idem, versión PowerShell |

**Uso:**
```sh
./update.sh                          # actualiza TODA la lib (main)
./update.sh v3.0.0                   # actualiza TODA la lib (tag específico)
./update.sh --only CuButton          # actualiza SOLO CuButton
./update.sh --only CuButton,CuAlert  # actualiza solo esos componentes
./update.sh --only CuButton v3.0.0   # solo CuButton, desde un tag
```

```cmd
update.bat
update.bat v3.0.0
update.bat -Only CuButton
update.bat -Only CuButton,CuAlert v3.0.0
```

```powershell
.\update.ps1
.\update.ps1 v3.0.0
.\update.ps1 -Only CuButton
.\update.ps1 -Only CuButton,CuAlert v3.0.0
```

`--only` / `-Only` acepta el nombre como `CuButton`, `button`, `cu-button` o
`CuButton.umd.js` (sin distinguir mayúsculas ni guiones). `-o` es alias.

**Qué hacen:**
1. Descargan el artifact de GitLab (según tag o `main`)
2. **Sin `--only`:** reemplazan la carpeta de forma **atómica** (si falla, lo anterior queda intacto).
   **Con `--only`:** copian solo los `.umd.js` elegidos y su doc (`use-comegen/componentes/cu-*.md`), dejando el resto de los componentes intactos (y sin tocar `css/themes.css`)
3. Actualizan la skill de uso en `.agents/skills/use-comegen/` del proyecto huésped (completa o solo los docs elegidos)

**Variables opcionales:**
- `CG_URL` / `$env:CG_URL` — override de URL (para probar con archivo local)
- `CG_PROJECT_ROOT` / `$env:CG_PROJECT_ROOT` — forzar raíz del proyecto

### Actualización manual

1. Descargá el nuevo zip (ver Opción 1)
2. **Backup** de tu carpeta actual (opcional pero recomendado)
3. Extraé el contenido sobreescribiendo los archivos anteriores
4. Los archivos que hayas personalizado (ej. `comegen.config.json`) se pierden — respaldalos antes

---

## Instalación desde source (build local)

> **Para desarrollo** de la librería (crear/modificar componentes, contribuir al repo).
> Para solo **usar** los componentes, ver [Instalación para uso](#instalación-para-uso).

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
