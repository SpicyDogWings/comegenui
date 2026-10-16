# Instalación

ComegenUI se distribuye como bundles: **no hay dependencias que instalar**, y los tokens del tema
los aporta tu CSS (no viajan en el zip).
Elegís una configuración, bajás su zip desde
[Releases](https://github.com/SpicyDogWings/comegenui/releases) y copiás los archivos que uses.

## Qué trae cada zip

| Config | Zip | Formato | Vue | Cuándo |
|---|---|---|---|---|
| `umd-core` | `comegenui-umd-core-v{version}.zip` | UMD | incluido | 1–2 componentes, `<script>` suelto, máxima compatibilidad |
| `umd-shared` | `comegenui-umd-shared-v{version}.zip` | UMD | externo (`__COMEGEN_VUE__`) | varios componentes en HTML; Vue viaja una vez en `comegen-vue.global.js` |
| `esm-core` | `comegenui-esm-core-v{version}.zip` | ESM | incluido | proyecto con bundler (Vite/webpack/Rollup) |
| `esm-shared` | `comegenui-esm-shared-v{version}.zip` | ESM | externo (`import 'vue'`) | bundler que ya tiene Vue, o navegador sin bundler con import map |

Dentro de cada zip los bundles se llaman igual en todas las configuraciones: `CuX.umd.js` (UMD) o
`CuX.js` (ESM). Las `shared` traen su runtime al lado: `comegen-vue.global.js` (UMD) o
`comegen-vue.js` (ESM).

Cada bundle se auto-registra como custom element (`<cu-button>`). Los tokens del tema los aporta tu
CSS: los bundles no los traen (no viajan en el zip).

## Vanilla, sin bundler (`esm-shared`)

```html
<!-- vendor/comegenui/ = el zip descomprimido -->
<script type="importmap">
{ "imports": { "vue": "./vendor/comegenui/comegen-vue.js" } }
</script>
<script type="module" src="./vendor/comegenui/CuButton.js"></script>
<script type="module" src="./vendor/comegenui/CuAlert.js"></script>

<cu-button color="primary">Guardar</cu-button>
<cu-alert color="success" variant="soft">Guardado correctamente</cu-alert>
```

Sin el import map el navegador no puede resolver el `import 'vue'` que hace el bundle `shared`.

## UMD (sin bundler y sin módulos)

**`umd-core`** — un `<script>` por componente: Vue viaja adentro de cada bundle.

**`umd-shared`** — cargá el runtime **antes** que los componentes:

```html
<script src="./vendor/comegenui/comegen-vue.global.js"></script>  <!-- runtime compartido -->
<script src="./vendor/comegenui/CuButton.umd.js"></script>
<script src="./vendor/comegenui/CuAlert.umd.js"></script>
```

El runtime se expone como `globalThis.__COMEGEN_VUE__` (namespace propio): **no toca ni depende de
un `window.Vue` del host**. Si te olvidás de cargarlo, los bundles `shared` fallan al registrarse.

## Con bundler (Vite, webpack, Rollup…)

`esm-core` y `esm-shared` se importan como módulos:

```js
import 'vendor/comegenui/CuButton.js'
```

En `esm-shared` el bundle hace `import 'vue'` y lo resuelve tu bundler, así que dedupea con el Vue
de tu app (tenelo instalado). En `esm-core` Vue va adentro del bundle.

## Usar

Los componentes se usan como cualquier elemento HTML, o desde Vue con el mismo tag:

```html
<cu-button color="primary" variant="solid">Guardar</cu-button>
<cu-alert color="success" variant="soft">Listo</cu-alert>
```

Atributos, eventos, slots y métodos de cada uno están en [Componentes](/componentes/cu-button).

## Actualizar

No hay instalador: se reemplazan archivos.

- Copiá los bundles nuevos (podés copiar sólo los que usás). En las configuraciones `shared`, copiá
  también el runtime.
- No hay archivo de estilos que copiar: los tokens del tema los aporta tu CSS.
- Si un componente "no cambia nada" después de actualizar, casi siempre quedó el bundle viejo en la
  carpeta o el navegador lo tiene cacheado.
- Para saber qué quedó cargado: `customElements.get('cu-button').comegen` → `version`, `type`
  (ver [Versionado](/versionado)).

## Ver también

- [Personalización](/personalizacion) — temas, colores y variantes.
- [Configuración](/configuracion) — config, tokens y clases CSS.
- [Componentes](/componentes/cu-button) — API de cada uno.
