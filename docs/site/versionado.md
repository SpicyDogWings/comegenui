# Versionado y metadatos

Cada bundle de ComegenUI viaja con la versión y el **tipo de build** con el que se construyó.
Así, si copiás un solo archivo a tu proyecto, podés saber qué componente es, de qué versión y
de qué configuración viene sin mirar el resto de la librería.

## Configuraciones: formato × variante

Cada componente se publica en **cuatro configuraciones**, con la misma API y el mismo tag:

| Config | Archivo | Formato | Vue |
|---|---|---|---|
| `umd-core` | `CuX.umd.js` | UMD | incluido |
| `umd-shared` | `CuX.umd.js` | UMD | externo (`__COMEGEN_VUE__`) |
| `esm-core` | `CuX.js` | ESM | incluido |
| `esm-shared` | `CuX.js` | ESM | externo (`import 'vue'`) |

Los `shared` traen su runtime al lado: `comegen-vue.global.js` (UMD, global `__COMEGEN_VUE__`)
o `comegen-vue.js` (ESM). Cada config sale en su carpeta `dist-libs/<config>/` con su zip
`comegenui-<config>-v{version}.zip` (ver [instalación](../skills/use-comegen/references/instalacion.md)).

## Identidad del archivo

El banner (primera línea del archivo) deja la identidad —incluido el tipo de build— a la vista:

```js
/*! comegenui v5.0.0-alpha.3 · CuAlert (cu-alert) · umd-core · Vue incluido */
/*! comegenui v5.0.0-alpha.3 · CuAlert (cu-alert) · esm-shared · Vue externo (bare import) */
```

## Metadatos en runtime

Después de cargar el bundle, el componente expone `comegen` tanto en su clase como en cada
instancia:

```js
customElements.get('cu-alert').comegen
document.querySelector('cu-alert').comegen
// {
//   lib: 'comegenui',
//   name: 'CuAlert',
//   tag: 'cu-alert',
//   version: '5.0.0-alpha.3',
//   format: 'umd',          // 'umd' | 'esm'
//   variant: 'core',        // 'core' | 'shared'
//   type: 'umd-core',       // tipo de build completo
//   versionedTag: 'cu-alert--v5-0-0-alpha-3',
// }
```

Es útil para diagnosticar un archivo viejo (o de otra config): compará `version` y `type`
contra lo que esperabas antes de culpar al caché del navegador.

## Convivir varias versiones

Cada componente se registra con dos tags:

- el tag normal (`<cu-alert>`), y
- un **tag versionado** (`<cu-alert--v5-0-0-alpha-3>`).

El tag normal se lo queda la **primera versión que se cargue**. Si después cargás otra versión
del mismo componente, ComegenUI lo avisa por consola y deja la nueva disponible con su tag
versionado. Cargar el mismo bundle dos veces no rompe: el registro es idempotente.

Así podés ir actualizando componente por componente sin reemplazar todo el set:

```html
<!-- la 5.0.0 llega primero y se queda con <cu-alert> -->
<script src="vendor/comegenui/5.0.0/umd-core/CuAlert.umd.js"></script>
<script src="vendor/comegenui/5.1.0/umd-core/CuButton.umd.js"></script>

<!-- sigue la alerta vieja… -->
<cu-alert color="neutral">…</cu-alert>

<!-- …y usás el botón nuevo -->
<cu-button color="primary">Guardar</cu-button>
```

Si necesitás las **dos versiones del mismo componente**, la segunda va por su tag versionado:

```html
<script src="vendor/comegenui/5.0.0/umd-core/CuAlert.umd.js"></script>
<script src="vendor/comegenui/5.1.0/umd-core/CuAlert.umd.js"></script>

<cu-alert>…</cu-alert>                  <!-- 5.0.0 -->
<cu-alert--v5-1-0>…</cu-alert--v5-1-0>  <!-- 5.1.0 -->
```

> Cada zip es sólo la lib (los bundles de su config + el runtime del `shared` si aplica): no
> incluye esta página ni las fichas, y **no hay CSS** (los tokens se inyectan solos al cargar
> el primer componente). La referencia completa de cada componente está en la sección
> [Componentes](./componentes/cu-button.md).
