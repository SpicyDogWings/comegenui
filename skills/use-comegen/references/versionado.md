# Versión y metadatos

Cada bundle de ComegenUI trae la versión **y el tipo de build** con el que se construyó. Es lo
que te permite saber qué archivo estás usando, y hacer convivir configuraciones y versiones
distintas.

Cada componente viene en **cuatro configuraciones**, con la misma API y el mismo tag: `umd-core`
y `umd-shared` (`CuX.umd.js`) y `esm-core` y `esm-shared` (`CuX.js`). Elegís una; ver
`instalacion.md`.

## Leer la versión y el tipo

El banner del archivo ya los muestra:

```js
/*! comegenui v5.0.0-alpha.3 · CuAlert (cu-alert) · umd-core · Vue incluido */
/*! comegenui v5.0.0-alpha.3 · CuAlert (cu-alert) · esm-shared · Vue externo (bare import) */
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
//   format: 'umd',          // 'umd' | 'esm'
//   variant: 'core',        // 'core' | 'shared'
//   type: 'umd-core',       // tipo de build completo
//   versionedTag: 'cu-alert--v5-0-0-alpha-3',
// }
```

Si un componente "no cambia nada" después de actualizar, mirá `comegen.version` (y `type`): casi
siempre quedó el bundle viejo copiado o el navegador lo tiene cacheado.

## Convivir versiones

Cada componente se registra con su tag normal (`<cu-alert>`) y con un **tag versionado**
(`<cu-alert--v5-0-0-alpha-3`).

- El tag normal se lo queda la **primera versión cargada**.
- Si cargás después otra versión del mismo componente, ComegenUI avisa por consola y la deja
  disponible con su tag versionado.
- Cargar el mismo bundle dos veces no rompe: el registro es idempotente.

```html
<!-- actualizás sólo el botón, la alerta sigue en la versión vieja -->
<script src="vendor/comegenui/5.0.0/umd-core/CuAlert.umd.js"></script>
<script src="vendor/comegenui/5.1.0/umd-core/CuButton.umd.js"></script>

<cu-alert>…</cu-alert>
<cu-button color="primary">Guardar</cu-button>
```

Para tener las dos versiones del **mismo** componente, usá el tag versionado de la segunda:

```html
<script src="vendor/comegenui/5.0.0/umd-core/CuAlert.umd.js"></script>
<script src="vendor/comegenui/5.1.0/umd-core/CuAlert.umd.js"></script>

<cu-alert>…</cu-alert>                  <!-- 5.0.0 -->
<cu-alert--v5-1-0>…</cu-alert--v5-1-0>  <!-- 5.1.0 -->
```

El tag versionado se arma con la versión, en minúsculas y con los separadores no alfanuméricos
convertidos en `-`: `5.0.0-alpha.3` → `cu-alert--v5-0-0-alpha-3`.

## Temas y CSS

Ya no hay CSS que emparejar: los tokens del tema se inyectan solos al cargar el primer
componente (`initTokens()`). No hay que copiar ningún `css/` al actualizar.
