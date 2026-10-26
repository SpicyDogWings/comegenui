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
> incluye esta página ni las fichas, ni los tokens del tema —esos los aporta el CSS del host—.
> La referencia completa de cada componente está en la sección
> [Componentes](./componentes/cu-button.md).

## Versiones del sitio

Este sitio publica **sólo la última versión** de la documentación. El build de esa versión es un
**sitio estático congelado** —su HTML, su buscador y su propia copia de ComegenUI para los demos—
servido bajo su base `/<id>/` (hoy `/5.2.1/`). La doc vive versionada en `docs/versiones/<id>/` y el
sitio la **compone** al buildear; la lib que usan sus demos viaja con ella en
`docs/versiones/<id>/lib/`, así una versión congelada se comporta como esa versión aunque el árbol de
trabajo ya haya avanzado.

La raíz **no** guarda una copia del sitio: `vercel.json` redirige `/` y cualquier URL sin versión
(`/componentes/cu-button`) a la última versión, así los links viejos siguen funcionando sin publicar
un build de más.

- Las URLs llevan la versión (`/5.2.1/componentes/cu-button`): son linkeables y compartibles.
- Los links del topbar y de la paleta **quedan dentro de la versión** que estás mirando.
- El selector de versiones **se oculta** cuando hay una sola publicada (o en `vitepress dev`, donde
  no hay catálogo). El home (`/`) es `standalone`: ahí no hay selector ni sidebar.
- Las versiones cortadas **antes** de que existiera este mecanismo (los tags `v5.0.*-alpha`) no saben
  en qué versión están: en ellas, la navegación del topbar apunta a *latest*.

¿Una versión anterior? Su doc está en el tag de git: `git checkout v5.1.1 && pnpm install && pnpm dev`.
El detalle (y cómo generar sus zips) está en [Versiones anteriores](/versiones-anteriores).

### Publicar versiones

El manifiesto es `docs/versions.json`: **una** entrada con `latest: true` (sale de `HEAD`) y una
entrada por versión congelada que quieras publicar, con su `ref` de git (idealmente un tag). La doc de
cada versión vive en `docs/versiones/<id>/` y su lib en `docs/versiones/<id>/lib/`.

```bash
pnpm docs:versions          # construye la última versión (+ las congeladas del manifiesto)
pnpm deploy:docs:versions   # publica la salida agregada (/<id>/ por versión + versions.json)
```

- `rootAlias: false` en el manifiesto evita la copia de latest en `/` (un build y ~26 MB menos): la
  raíz sólo lleva `versions.json` y el `vercel.json` con los redirects, que genera `docs-versions`.
- Una versión que sale del manifiesto (por ejemplo, la reemplazada por un patch) **se borra del
  deploy**: su historia queda en el tag.
- Deployá **la salida agregada** (`docs/site/.vitepress/dist-versions/`), no sólo el build de una
  versión: sin `versions.json` el selector no tiene catálogo.
