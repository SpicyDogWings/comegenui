# Versionado y metadatos

Cada `.umd.js` de ComegenUI viaja con la versión del bundle con la que se construyó. Así, si
copiás un solo archivo a tu proyecto, podés saber qué componente es y de qué versión viene sin
mirar el resto de la librería.

## Identidad del archivo

El banner (primera línea del UMD) deja la identidad a la vista:

```js
/*! comegenui v5.0.0-alpha.3 · CuAlert (cu-alert) */
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
<script src="vendor/comegenui/5.0.0/CuAlert.umd.js"></script>
<script src="vendor/comegenui/5.1.0/CuButton.umd.js"></script>

<!-- sigue la alerta vieja… -->
<cu-alert color="neutral">…</cu-alert>

<!-- …y usás el botón nuevo -->
<cu-button color="primary">Guardar</cu-button>
```

Si necesitás las **dos versiones del mismo componente**, la segunda va por su tag versionado:

```html
<script src="vendor/comegenui/5.0.0/CuAlert.umd.js"></script>
<script src="vendor/comegenui/5.1.0/CuAlert.umd.js"></script>

<cu-alert>…</cu-alert>                  <!-- 5.0.0 -->
<cu-alert--v5-1-0>…</cu-alert--v5-1-0>  <!-- 5.1.0 -->
```

> El zip es sólo la lib (UMD + `css/`): no incluye esta página ni las fichas. La referencia
> completa de cada componente está en la sección [Componentes](./componentes/cu-button.md).
