# Nota 15 — `<cu-select>` / `<cu-autocomplete>` dentro de una card no despliega el menú

**Estado:** resuelto (2026-10-26) en `Popover.vue`, con tests y mutaciones.

Síntoma: un control cuyo menú es un `Popover` (dentro de una card o de cualquier contenedor que
recorte) parece no abrir. Eran **dos causas independientes** que se tapaban entre sí; arreglar una
sola no alcanza.

## Causa 1 — el wrapper de `<cu-card>` reemitía el click y cerraba el panel

`Card.ce.vue` hace `@click="ceEmit('click', $event)"`: cada click en el contenido de la card se
**reemite** como `new CustomEvent('click', { bubbles: true, composed: true })` sobre el host. Ese
evento llega al listener de `click` en fase de captura que `Popover` tiene en `document`, no está en
su `composedPath()` y se interpretaba como "click afuera" → cerraba el panel **en el mismo gesto que
lo abría**. El panel se creaba y se destruía en la misma tarea: desde afuera "no abría".

Medición (Chromium 141, `<cu-card>` con `<cu-select>`, click programático en el trigger):

| | clicks vistos en `window` (captura) | panel en el DOM 150 ms después |
|---|---|---|
| antes | `PointerEvent` → `CustomEvent` (target `card-host`) | **no** |
| después | `PointerEvent` → `CustomEvent` | sí (el `CustomEvent` ya no cierra) |

Un `cu-dropdown-menu` dentro de una card se comportaba igual (misma causa, no es exclusiva del
select).

Arreglo: `onDocumentClick` ignora los eventos que no son de puntero (`!(e instanceof MouseEvent)`).
Un `MouseEvent`/`PointerEvent` afuera sigue cerrando; `Escape` sigue cerrando.

## Causa 2 — `overflow: hidden` del ancestro recorta el panel `absolute`

El panel no-`fixed` es `position: absolute` dentro de `.cu-popover { position: relative }`, así que
lo recorta cualquier ancestro con `overflow` distinto de `visible`. La card lo tiene en
`src/components/information/Card.vue:142` (`.cu-card`), pero el problema es de cualquier ancestro:
`.cu-table` (línea 239), un contenedor propio, etc.

Medición con el panel ya abierto (se neutralizó la causa 1 para poder medir):

| caso | panel (top..bottom) | borde inferior del ancestro | px del panel por debajo | hit-test debajo del ancestro |
|---|---|---|---|---|
| `div` sin recorte (control) | 55..143 | 60 | 83 | **panel** (visible) |
| `div` `overflow: hidden` | 245..333 | 290 | 43 de 88 | `BODY` → recortado |
| `cu-card` (uso real) | 962..1038 | 959 | 79 de 76 → **todo** | `BODY` → invisible |
| `cu-card` + `.cu-card{overflow:visible}` (control) | 962..1038 | 959 | 79 | **panel** (visible) |

O sea: el panel sí existe en el DOM, pero queda fuera del área visible de la card. Con la card tal
cual, el panel arranca 3 px **debajo** del borde inferior: 0 px visibles.

### `fixed` sí escapa (menos con un containing block)

| caso | `position` del panel | hit-test debajo del ancestro |
|---|---|---|
| ancestro `overflow: hidden` + `fixed` | `fixed`, `z-index: 10000` | **panel** (visible) |
| ancestro `overflow: hidden` + `transform: translateZ(0)` + `fixed` | `fixed` | `BODY`, y el panel aparece **714 px** más abajo |

`transform` (y `filter`, `perspective`, `backdrop-filter`, `contain`, `will-change` de esos ejes)
crean containing block: `fixed` deja de ser viewport y queda anclado al ancestro, desplazado. Por
eso el fallback automático **no** se activa si encuentra uno de esos ancestros: prefiere el recorte
al panel mal posicionado.

## Arreglo

En `Popover.vue`, al abrir y con el panel ya renderizado (`nextTick`), se mide el panel y se recorre
el **flat tree** del ancla (`assignedSlot` → `parentElement` → `host`). Si algún ancestro con
`overflow` distinto de `visible` lo recorta, el panel pasa a `fixed` con las coordenadas que ya
calculaba la prop `fixed` (y toma el ancho del ancla, porque `width: 100%` sólo tiene sentido en el
flujo). Se recalcula en scroll/resize, como `fixed`.

El recorrido tiene que ser el flat tree: `<cu-select>` es hijo de `<cu-card>` en el light DOM, pero
el elemento que recorta (`.cu-card`) vive **dentro del shadow root de la card**, así que
`parentElement` no lo ve; el salto lo da `assignedSlot`.

Resultado (misma medición, después del arreglo):

| caso | `position` del panel | hit-test debajo de la card | click en una opción |
|---|---|---|---|
| `<cu-select>` en `<cu-card>` | `fixed` | **panel** | selecciona y cierra |
| `<cu-dropdown-menu>` en `<cu-card>` | `fixed` | **panel** | — |
| panel que entra completo en un ancestro `overflow: hidden` | `absolute` (no se toca) | — | — |

## Cómo reproducirlo

```bash
COMEGEN_CONFIGS=umd-core COMEGEN_NO_ZIP=1 pnpm build:lib   # dist-libs/umd-core
```

```html
<script src="./CuCard.umd.js"></script>
<script src="./CuSelect.umd.js"></script>
<cu-card id="card" title="Card">
  <cu-select id="sel" placeholder="select en card"></cu-select>
</cu-card>
<script>
  document.getElementById('sel').options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }];
</script>
```

```js
// con playwright (node_modules/.pnpm/playwright@*), sirviendo la carpeta
const el = document.getElementById('sel');
el.shadowRoot.querySelector('button.cu-select-toggle').click();
await new Promise((r) => setTimeout(r, 150));
const panel = el.shadowRoot.querySelector('.cu-popover-panel');
console.log(!!panel, panel && getComputedStyle(panel).position);   // antes: false
```

Con `getBoundingClientRect()` del panel contra el del `article.cu-card`
(`document.getElementById('card').shadowRoot.querySelector('.cu-card')`) se ve el recorte; con
`elementFromPoint` (y `shadowRoot.elementFromPoint` para atravesar shadow) se ve si el usuario puede
llegar al panel.

## Límites que quedan

- Ancestro con `transform`/`filter`/`contain`: el panel sigue recortado (ver arriba). No se cambió
  `overflow: hidden` de la card: es lo que recorta la media en las esquinas.
- No hay auto-flip: el fallback sólo cambia el sistema de coordenadas, no elige arriba/abajo. Un
  panel que se sale del viewport sigue saliéndose.
- `z-index: 10000` en `fixed` (igual que la prop `fixed`): un ancestro con `z-index` mayor puede
  taparlo.
