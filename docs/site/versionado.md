# Versionado y metadatos

Cada bundle de ComegenUI viaja con la versión y el **tipo de build** con el que se construyó.
Así, si copiás un solo archivo a tu proyecto, podés saber qué componente es, de qué versión y
de qué configuración viene sin mirar el resto de la librería.

Además de la librería, **este sitio también está versionado**: ver
[Versiones del sitio](#versiones-del-sitio).

## Configuraciones: formato × variante

Cada componente se publica en **cuatro configuraciones**, con la misma API y el mismo tag:

| Config | Archivo | Formato | Vue |
|---|---|---|---|
| `umd-core` | `CuX.umd.js` | UMD | incluido |
| `umd-shared` | `CuX.umd.js` | UMD | externo (`__COMEGEN_VUE__`) |
| `esm-core` | `CuX.js` | ESM | incluido |
| `esm-shared` | `CuX.js` | ESM | externo (`import 'vue'`) |

Los `shared` traen su runtime al lado: `comegen-vue.global.js` (UMD, global `__COMEGEN_VUE__`)
o `comegen-vue.js` (ESM). Cada config sale en su carpeta `dist-libs/<config>/`; los 4 zips
(`comegenui-<config>-v{version}.zip`) quedan sueltos en `dist-libs/` (ver [instalación](/instalacion)).

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

## Versiones del sitio

Esta documentación se versiona **aparte de la librería**. Cada versión publicada es un **build
estático congelado** —su HTML, su buscador y su propia copia de ComegenUI para los demos— servido
bajo su base `/<id>/`. La raíz `/` es una copia de *latest* (la que sale del árbol de trabajo),
así que las URLs sin versión siguen funcionando y apuntan a la última.

Para cambiar de versión, usá el **selector al lado del nombre** en el topbar o los comandos de la
categoría *Versión* de la paleta (`Ctrl`/`⌘` + `K`). El salto es una **navegación dura**: cada
versión es una app distinta (otro router, otro índice de búsqueda), así que la página se recarga.
Te lleva al **mismo path** dentro de la versión elegida y, si esa página no existía en esa versión,
al home de esa versión.

- Las URLs llevan la versión (`/5.1.0/componentes/cu-button`): son linkeables y compartibles, y no
  hay preferencia guardada que te cambie de versión.
- Los links del topbar y de la paleta **quedan dentro de la versión** que estás mirando.
- Los demos corren **la lib de esa misma versión**: la doc de la 5.1.0 embebe la 5.1.0.
- El selector **se oculta** si hay una sola versión publicada (o en `vitepress dev`, donde no hay
  catálogo). El home (`/`) es `standalone`: ahí no hay selector ni sidebar.
- Las versiones cortadas **antes** de que existiera este mecanismo (los tags viejos, como
  `v5.1.0`) no saben en qué versión están: en ellas, la navegación del topbar apunta a *latest*.
  Las que congeles de acá en adelante sí quedan dentro de su versión.

### Publicar versiones

El manifiesto es `docs/versions.json`: **una** entrada con `latest: true` (sale de `HEAD`) y una
entrada por versión congelada, con su `ref` de git (idealmente un tag). Después:

```bash
pnpm docs:versions          # construye latest + las congeladas y arma el catálogo
pnpm deploy:docs:versions   # publica la salida agregada (raíz = alias de latest, /<id>/ por versión)
```

Deployá **la salida agregada** (`docs/site/.vitepress/dist-versions/`), no sólo el build de la
raíz: sin `versions.json` ni las carpetas `/<id>/` el selector no tiene catálogo y queda oculto.
