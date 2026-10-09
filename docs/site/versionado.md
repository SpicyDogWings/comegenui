# Versionado y metadatos

Cada `.umd.js` de ComegenUI viaja con la versión del bundle con la que se construyó. Así, si
copiás un solo archivo a tu proyecto, podés saber qué componente es y de qué versión viene sin
mirar el resto de la librería.

## Variantes: `core` y `shared`

Cada componente se publica en **dos variantes**, con la misma API y el mismo tag:

| Variante | Vue | Para qué |
|---|---|---|
| `CuX.core.umd.js` | incluido | Un `<script>` suelto funciona sin nada más (1–2 componentes). |
| `CuX.shared.umd.js` | externo (`__COMEGEN_VUE__`) | Varios componentes comparten un solo runtime (`comegen-vue.global.js`). |

En la variante `shared`, cargá `comegen-vue.global.js` **antes** que los componentes. Se expone
como `globalThis.__COMEGEN_VUE__`, un namespace propio: no toca ni depende de un `window.Vue`
del host.

## Identidad del archivo

El banner (primera línea del UMD) deja la identidad —incluida la variante— a la vista:

```js
/*! comegenui v5.0.0-alpha.3 · CuAlert (cu-alert) · core · Vue incluido */
/*! comegenui v5.0.0-alpha.3 · CuAlert (cu-alert) · shared · Vue externo __COMEGEN_VUE__ */
```

## Metadatos en runtime

Después de cargar el UMD, el componente expone `comegen` tanto en su clase como en cada
instancia:

```js
customElements.get('cu-alert').comegen
document.querySelector('cu-alert').comegen
// {
//   lib: 'comegenui',
//   name: 'CuAlert',
//   tag: 'cu-alert',
//   version: '5.0.0-alpha.3',
//   versionedTag: 'cu-alert--v5-0-0-alpha-3',
// }
```

Es útil para diagnosticar un archivo viejo: compará `version` contra la versión que esperabas
(o contra la del zip) antes de culpar al caché del navegador.

## Convivir varias versiones

Cada componente se registra con dos tags:

- el tag normal (`<cu-alert>`), y
- un **tag versionado** (`<cu-alert--v5-0-0-alpha-3>`).

El tag normal se lo queda la **primera versión que se cargue**. Si después cargás otra versión
del mismo componente, ComegenUI lo avisa por consola y deja la nueva disponible con su tag
versionado. Cargar el mismo UMD dos veces no rompe: el registro es idempotente.

Así podés upgrading componente por componente sin reemplazar todo el set:

```html
<!-- la 5.0.0 llega primero y se queda con <cu-alert> -->
<script src="vendor/comegenui/5.0.0/CuAlert.core.umd.js"></script>
<script src="vendor/comegenui/5.1.0/CuButton.core.umd.js"></script>

<!-- sigue la alerta vieja… -->
<cu-alert color="neutral">…</cu-alert>

<!-- …y usás el botón nuevo -->
<cu-button color="primary">Guardar</cu-button>
```

Si necesitás las **dos versiones del mismo componente**, la segunda va por su tag versionado:

```html
<script src="vendor/comegenui/5.0.0/CuAlert.core.umd.js"></script>
<script src="vendor/comegenui/5.1.0/CuAlert.core.umd.js"></script>

<cu-alert>…</cu-alert>                  <!-- 5.0.0 -->
<cu-alert--v5-1-0>…</cu-alert--v5-1-0>  <!-- 5.1.0 -->
```

> El zip es sólo la lib (las dos variantes de UMD + `comegen-vue.global.js` + `css/`): no
> incluye esta página ni las fichas. La referencia completa de cada componente está en la
> sección [Componentes](./componentes/cu-button.md).
