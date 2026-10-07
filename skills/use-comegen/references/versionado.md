# Versión y metadatos

Cada `Cu*.umd.js` trae la versión del bundle con la que se construyó. Es lo que te permite
saber qué archivo estás usando y hacer convivir componentes de versiones distintas.

Cada componente viene en dos variantes, con la misma API y el mismo tag: `CuX.core.umd.js`
(Vue incluido) y `CuX.shared.umd.js` (Vue externo, compartido en `comegen-vue.global.js`).
Elegís una por componente; ver `instalacion.md`.

## Leer la versión

El banner del archivo ya la muestra, incluida la variante:

```js
/*! comegenui v5.0.0-alpha.3 · CuAlert (cu-alert) · core · Vue incluido */
/*! comegenui v5.0.0-alpha.3 · CuAlert (cu-alert) · shared · Vue externo __COMEGEN_VUE__ */
```

En runtime, cada componente expone `comegen` en la clase y en la instancia:

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

Si un componente "no cambia nada" después de actualizar, mirá `comegen.version`: casi siempre
quedó el UMD viejo copiado o el navegador lo tiene cacheado.

## Convivir versiones

Cada componente se registra con su tag normal (`<cu-alert>`) y con un **tag versionado**
(`<cu-alert--v5-0-0-alpha-3>`).

- El tag normal se lo queda la **primera versión cargada**.
- Si cargás después otra versión del mismo componente, ComegenUI avisa por consola y la deja
  disponible con su tag versionado.
- Cargar el mismo UMD dos veces no rompe: el registro es idempotente.

```html
<!-- actualizás sólo el botón, la alerta sigue en la versión vieja -->
<script src="vendor/comegenui/5.0.0/CuAlert.core.umd.js"></script>
<script src="vendor/comegenui/5.1.0/CuButton.core.umd.js"></script>

<cu-alert>…</cu-alert>
<cu-button color="primary">Guardar</cu-button>
```

Para tener las dos versiones del **mismo** componente, usá el tag versionado de la segunda:

```html
<script src="vendor/comegenui/5.0.0/CuAlert.core.umd.js"></script>
<script src="vendor/comegenui/5.1.0/CuAlert.core.umd.js"></script>

<cu-alert>…</cu-alert>                  <!-- 5.0.0 -->
<cu-alert--v5-1-0>…</cu-alert--v5-1-0>  <!-- 5.1.0 -->
```

El tag versionado se arma con la versión, en minúsculas y con los separadores no alfanuméricos
convertidos en `-`: `5.0.0-alpha.3` → `cu-alert--v5-0-0-alpha-3`.

## Emparejar con el CSS

El CSS de temas también es parte de la lib: si actualizás componentes y cambió el tema o la
versión de tokens, copiá también `css/`. Un UMD nuevo con un `css/` viejo puede verse mal sin
que la versión del componente lo delate.
