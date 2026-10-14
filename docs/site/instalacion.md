# Instalación

ComegenUI tiene **dos superficies** y cada una se instala distinto. Elegí la que corresponda a
tu proyecto:

| Tu proyecto | Superficie | Qué instalás |
|---|---|---|
| **Vue** (Vite, Nuxt, …) | componentes `.vue` | el paquete npm |
| **Vanilla** (HTML plano, sin build) | custom elements `<cu-*>` | el zip de una de las 4 configs |

---

## Vue — paquete npm

```bash
pnpm add comegenui
```

Si todavía no está publicado, instalalo desde el tarball de la release:

```bash
pnpm add ./comegenui-5.1.1.tgz
```

> [!WARNING]
> Antes de instalar por nombre, verificá el autor: el paquete `comegenui` que hoy está en el
> registry **no es este** (figura a nombre de otro maintainer). Mientras se defina el nombre
> final, usá el tarball o un scope propio.

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

También podés registrarlos todos de una:

```ts
import { createApp } from 'vue'
import ComegenUI from 'comegenui'
import 'comegenui/style.css'

createApp(App).use(ComegenUI).mount('#app')
```

- `vue` es **peer dependency**: lo aporta tu app (no se duplica).
- Importá `comegenui/style.css` una vez; los tokens del tema los inyecta la propia lib.

### Dependencias opcionales

Algunas librerías **no** vienen incluidas para no inflar la instalación. Solo las necesitás si
usás el componente que las requiere:

| Componente | Instalá |
|---|---|
| `CuMarkdown` | `marked`, `dompurify` |
| `CuMarkdown` (bloques de código) | `highlight.js` |
| `CuCellsImporter` | `xlsx` |

> [!NOTE]
> El paquete npm está en preparación; hoy exporta `CuButton` y `CuAlert`.

---

## Vanilla — custom elements

Se publican **cuatro configuraciones** (formato × variante), cada una en su propio zip. Bajá el
que uses desde la [última release](https://github.com/SpicyDogWings/comegenui/releases) y
descomprimilo en tu proyecto.

| Config | Zip | Formato | Vue | Cuándo |
|---|---|---|---|---|
| `umd-core` | `comegenui-umd-core-v{version}.zip` | UMD | incluido | 1–2 componentes, `<script>` suelto, máxima compatibilidad |
| `umd-shared` | `comegenui-umd-shared-v{version}.zip` | UMD | externo (`__COMEGEN_VUE__`) | 3+ componentes; Vue viaja una vez |
| `esm-core` | `comegenui-esm-core-v{version}.zip` | ESM | incluido | proyecto con bundler (Vite/webpack/Rollup) |
| `esm-shared` | `comegenui-esm-shared-v{version}.zip` | ESM | externo (`import 'vue'`) | bundler que ya tiene Vue, o navegador con import map |

Los bundles se llaman igual en todas: `CuX.umd.js` (UMD) o `CuX.js` (ESM). Los `shared` traen su
runtime al lado: `comegen-vue.global.js` (UMD) o `comegen-vue.js` (ESM).

No hay dependencias que instalar ni CSS que cargar: cada bundle se auto-registra y los tokens se
inyectan solos.

### `umd-core` — un `<script>` por componente

```html
<script src="vendor/comegenui/CuButton.umd.js"></script>
<script src="vendor/comegenui/CuAlert.umd.js"></script>

<cu-button color="primary">Guardar</cu-button>
<cu-alert variant="soft">Listo</cu-alert>
```

### `umd-shared` — el runtime va primero

```html
<script src="vendor/comegenui/comegen-vue.global.js"></script>  <!-- runtime compartido -->
<script src="vendor/comegenui/CuButton.umd.js"></script>
<script src="vendor/comegenui/CuAlert.umd.js"></script>
```

El runtime se expone como `globalThis.__COMEGEN_VUE__` (namespace propio), así que **no toca ni
depende de un `window.Vue` del host**. Si olvidás cargarlo, los componentes `shared` no se
registran.

### `esm-core` y `esm-shared` — módulos

```js
import 'vendor/comegenui/CuButton.js'
```

En `esm-shared` el bundle hace `import 'vue'`: lo resuelve tu bundler (tenés que tener `vue`
instalado, así se dedupea con tu app) o, en un host sin bundler (p. ej. PHP/vanilla), un
**import map** que apunte al runtime del zip:

```html
<script type="importmap">
{ "imports": { "vue": "./vendor/comegenui/comegen-vue.js" } }
</script>
<script type="module" src="vendor/comegenui/CuButton.js"></script>
```

---

## Temas

El tema se elige en el host, no por componente:

```html
<html data-theme="dark">
```

Los tokens `--cu-*` se inyectan al cargar el primer componente (o los inyecta el paquete npm).
Para armar tus propios temas, ver el [Theme Builder](./theme-builder.md).

## Actualizar

**Vanilla:** se reemplazan archivos, no hay instalador. Copiá los bundles nuevos (podés copiar
sólo los que usás) y, en las configs `shared`, también el runtime.

**Vue:** `pnpm update comegenui`.

En los dos casos, si algo "no cambia nada", casi siempre es caché o un archivo viejo. Para
confirmar qué quedó cargado: `customElements.get('cu-x').comegen` (`version`, `type`) — ver
[Versionado](./versionado.md).
