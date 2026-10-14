# Instalar y actualizar

ComegenUI tiene **dos superficies**: elegí según tu proyecto.

| Tu proyecto | Superficie | Se instala con |
|---|---|---|
| **Vue** (Vite, Nuxt, …) | componentes `.vue` | el paquete npm |
| **Vanilla** (HTML plano, sin build) | custom elements `<cu-*>` | el zip de una de las 4 configs |

## Vue — paquete npm

```bash
pnpm add comegenui
```

Si todavía no está publicada la versión, o querés fijar una exacta, instalá desde el tarball
de la release:

```bash
pnpm add ./comegenui-5.1.1.tgz
```

Importá el CSS **una vez**, en el entry de tu app (`main.ts`):

```ts
import { CuButton, CuAlert } from 'comegenui'
import 'comegenui/style.css'
```

```vue
<template>
  <CuButton color="primary">Guardar</CuButton>
  <CuAlert variant="soft">Listo</CuAlert>
</template>
```

Registro global de todos los componentes:

```ts
import ComegenUI from 'comegenui'
import 'comegenui/style.css'

createApp(App).use(ComegenUI).mount('#app')
```

- `vue` es **peer dependency**: lo aporta tu app (no se duplica).
- Importá `comegenui/style.css` una vez; los tokens del tema los inyecta la propia lib.
- **Dependencias opcionales** (no vienen incluidas; solo si usás el componente):

  | Componente | Instalá |
  |---|---|
  | `CuMarkdown` | `marked`, `dompurify` |
  | `CuMarkdown` (bloques de código) | `highlight.js` |
  | `CuCellsImporter` | `xlsx` |

- Actualizar: `pnpm update comegenui`.

## Vanilla — los 4 zips

La lib se publica en **cuatro configuraciones**, cada una en su propio zip: elegís una
(formato × variante) según cómo consumas los componentes.

| Config | Zip | Formato | Vue | Cuándo |
|---|---|---|---|---|
| `umd-core` | `comegenui-umd-core-v{version}.zip` | UMD | incluido | 1–2 componentes, `<script>` suelto, máxima compatibilidad |
| `umd-shared` | `comegenui-umd-shared-v{version}.zip` | UMD | externo (`__COMEGEN_VUE__`) | 3+ componentes; Vue viaja una vez en `comegen-vue.global.js` |
| `esm-core` | `comegenui-esm-core-v{version}.zip` | ESM | incluido | proyecto con bundler (Vite/webpack/Rollup) |
| `esm-shared` | `comegenui-esm-shared-v{version}.zip` | ESM | externo (`import 'vue'`) | bundler que ya tiene Vue, o navegador con import map |

Dentro de cada zip, los bundles comparten nombre: `CuX.umd.js` (UMD) o `CuX.js` (ESM). Los
`shared` traen su runtime en la misma carpeta: `comegen-vue.global.js` (UMD) o `comegen-vue.js`
(ESM).

No hay dependencias que instalar ni CSS que cargar: cada bundle se auto-registra
(`defineComegenElement('cu-x', …)`) y los tokens del tema se inyectan solos (`initTokens()`).

### UMD (navegador, sin bundler)

**`umd-core`** — un `<script>` por componente:

```html
<script src="vendor/comegenui/CuButton.umd.js"></script>
<script src="vendor/comegenui/CuAlert.umd.js"></script>
```

**`umd-shared`** — cargá el runtime compartido **antes** que los componentes:

```html
<script src="vendor/comegenui/comegen-vue.global.js"></script>  <!-- runtime compartido -->
<script src="vendor/comegenui/CuButton.umd.js"></script>
<script src="vendor/comegenui/CuAlert.umd.js"></script>
```

> El runtime se expone como `globalThis.__COMEGEN_VUE__` (namespace propio), así que **no
> toca ni depende de un `window.Vue` del host**. Si olvidás cargarlo, los componentes
> `shared` fallan al registrarse.

### ESM (bundler)

**`esm-core`** y **`esm-shared`** se importan como módulos:

```js
import 'vendor/comegenui/CuButton.js'
```

En `esm-shared` el bundle hace `import 'vue'`: lo resuelve tu bundler (tenés que tener `vue`
instalado; así se dedupea con tu app) o, en un host sin bundler (p. ej. PHP/vanilla), un
**import map** que apunte al runtime que viaja en el zip:

```html
<script type="importmap">
{ "imports": { "vue": "./vendor/comegenui/comegen-vue.js" } }
</script>
<script type="module" src="vendor/comegenui/CuButton.js"></script>
```

### Usar

```html
<cu-button color="primary" variant="solid">Guardar</cu-button>
<cu-alert color="success" variant="soft">Listo</cu-alert>
```

### Actualizar

Se reemplazan archivos, no hay instalador:

- Copiá los bundles nuevos (podés copiar sólo los que usás). En las configs `shared`, copiá
  también el runtime. No hay CSS que copiar: los tokens se inyectan solos.
- Si un componente "no cambia nada" después de actualizar, casi siempre quedó el bundle viejo
  en la carpeta o el navegador lo tiene cacheado.
- Para confirmar qué versión y **tipo de build** está cargado: `customElements.get('cu-x').comegen`
  (`version`, `type`) — ver `versionado.md`.

## Buildear las libs (sólo en el repo de ComegenUI)

```bash
pnpm build:lib       # las dos superficies: vanilla (dist-libs/) + npm (dist-vue/)
pnpm build:vanilla   # solo los zips: dist-libs/ (4 carpetas + 4 zips sueltos)
pnpm build:npm       # solo el paquete npm: dist-vue/
pnpm pack:npm        # empaqueta el tarball del paquete npm
```

Una sola config cuando la necesitás suelta (y forzar la versión del zip):

```bash
pnpm build:vanilla:esm-shared         # solo esa config
pnpm build:vanilla:umd-core
pnpm build:vanilla v5.0.0             # fuerza la versión de los zips
```

Cada config sale en `dist-libs/<config>/`; los 4 zips (`comegenui-<config>-v{version}.zip`)
quedan **sueltos en `dist-libs/`**, listos para arrastrar al release. Cada uno trae los
bundles de su config + el runtime del `shared` si aplica. **No** incluye la documentación ni la
skill: la doc vive en el repo (`docs/componentes/`) y la skill se baja aparte (ver `SKILL.md`).
