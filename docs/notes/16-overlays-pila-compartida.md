# Nota 16 — Motor de overlays: pila compartida, submenús en CE, flip/clamp

**Estado:** resuelto (2026-11-03) en `Popover`, `Dropdown`, `DropdownMenu`, `Modal`, `SideOver`,
`Button` y `NavbarList`, con tests de comportamiento y mutaciones.

Los lotes 1–5 de la auditoría cerraron bugs por componente; esta nota registra los que eran del
**motor** (el mismo defecto en todos los overlays) y las decisiones que los acompañan.

## 1. `Escape` no era topmost

Cada overlay escuchaba `keydown` por su cuenta: un `Escape` cerraba el menú **y** su submenú (o un
`Modal` y el `SideOver` de al lado) en la misma pulsación.

Arreglo: `src/composables/useOverlayStack.ts`, una pila donde cada overlay se registra al abrirse.
Un único listener en `document` atiende `Escape` y llama a `close()` **sólo del tope**.

El estado vive en `globalThis` (`__cu_overlay_stack__`), no en el módulo: cada componente del zip se
bundlea por separado, así que el mismo módulo se evalúa varias veces en una página y cada copia
tendría su propia pila. Mismo criterio que el registry de hover de `Popover`.

El bloqueo del scroll también es uno solo: los overlays que lo piden (`SideOver`) incrementan un
contador y el `overflow` del body se restaura recién cuando el último se va. Un `Modal` no pide el
lock, así que abrir/cerrar uno arriba no libera el scroll de un panel que sigue abierto.

Medición (Chromium, `cu-modal` + `cu-side-over` abiertos, `Escape`):

| orden | `cu-side-over` abierto | `cu-modal` abierto | `body.style.overflow` |
|---|---|---|---|
| los dos abiertos | sí | sí | `hidden` |
| 1er `Escape` | **no** | sí | `""` |
| 2do `Escape` | no | **no** | `""` |

Antes: el primer `Escape` cerraba los dos.

## 2. Submenús rotos dentro de un custom element

`Dropdown.detectNested()` caminaba `parentElement`, que frena en la frontera del shadow root.
Dentro de `<cu-dropdown-menu>`, el panel del padre vive en su shadow y el submenú en el light DOM:
el submenú nunca se reconocía como anidado y se abría como un dropdown suelto (botón propio, panel
abajo, no en cascada).

Hay dos caminos, en `src/utils/dropdownNesting.ts`:

1. **flat tree** (`src/utils/flatTree.ts`): `assignedSlot` + `getRootNode().host`, para el anidado
   en Vue y el contenido ya proyectado por un slot.
2. **light DOM**: un ancestro `<cu-dropdown-menu>` proyecta todo su contenido en el panel salvo el
   slot `toggle`. Hace falta porque el contenido light existe **antes** de que el panel del padre se
   renderice (`v-if`, cerrado) y en ese momento `assignedSlot` todavía es `null`.

`DropdownMenu` usa la misma detección para no dibujar su `Button` cuando es submenú: la fila la
dibuja el motor (`role="menuitem"`, `aria-haspopup`, `aria-expanded`, chevron decorativo).

Medición (Chromium 900×700, `<cu-dropdown-menu>` con otro adentro):

| | antes | después |
|---|---|---|
| trigger del submenú | `button.cu-button` (dropdown suelto) | `button.cu-dropdown-menu-item[role=menuitem]`, `aria-haspopup=menu` |
| clase del submenú | sin `cu-dropdown--nested` | `cu-popover cu-dropdown cu-dropdown--nested` |
| panel del submenú | abajo del trigger, tapando el menú | `left: 100%` + `margin-left: 4px` (cascada), dentro del viewport |
| `Escape` con menú + submenú | cerraba los dos | cierra el submenú; el menú queda |

La cascada también respeta `position` distinto de `bottom` (antes `DropdownMenu` siempre pasaba su
`position`, así que la cascada nunca aplicaba en el menú compartido).

## 3. `Popover`: nombre del panel, flip/clamp, timers

- **Nombre accesible**: `role="menu"`/`dialog`/`alertdialog` no tenían nombre (el lector anunciaba
  "menú" a secas). El panel lo deriva del trigger (`aria-label`, `title`, `label` del CE o su texto).
  Snapshot AX real: `menu "Acciones"` (antes `menu`).
- **Flip/clamp**: `position="right"` en el borde derecho generaba scroll horizontal (`scrollWidth`
  1201 > 900) y `left` daba `x=-308`. Ahora, al abrir, el panel se mide: si se sale del viewport (o
  de un ancestro que recorta) pasa a `fixed`, se **voltea** al lado opuesto si entra y se **clampea**
  al borde. Medición con `<cu-select position="right">` pegado al borde (viewport 900):

  | | antes | después |
  |---|---|---|
  | `document.scrollWidth` | 1201 | **900** |
  | `position` del panel | `absolute` | `fixed` |
  | rect del panel | se salía a la derecha | `left 156 → right 892` (volteado, dentro del viewport) |
- **Timers de hover**: al desmontar dentro del delay corría `open()` sobre un nodo desconectado, que
  sumaba el popover al registry global y a la pila de overlays. `onUnmounted` cancela los dos timers
  y saca la entrada del registry (el template ref ya es `null` ahí: se guarda el elemento al montar).

## 4. `Dropdown` con `items`: filas que no eran menú

Las filas se renderizaban como `button`/`a` sueltos: sin `menuitem`, sin teclado y con una parada de
tabulación por item. Ahora comparten con `DropdownMenu` el composable
`src/composables/useMenuNavigation.ts`: roving tabindex (una sola parada), flechas/Home/End,
typeahead, `Tab` cierra, `Espacio` activa links, `Escape` cierra por la pila. El trigger por defecto
lleva `aria-haspopup`/`aria-expanded`/`aria-controls`. `Select`/`Autocomplete`/`DatePicker` no pasan
`items` y conservan su combobox/diálogo.

## 5. Fallbacks y decoración

- `Button`: una `variant` fuera del set no tenía clase de estilo; cae a `ghost` (`safeVariant`),
  igual que `color` → `neutral` y `type` → `button`.
- Chevrons decorativos con `aria-hidden="true"` y `focusable="false"`: fila de submenú de `Dropdown`
  y trigger compacto de `NavbarList` (mismo criterio que `Collapse`).

## Cómo reproducir el QA

```bash
COMEGEN_NO_ZIP=1 pnpm build:lib
pnpm site:sync                     # tokens para la página de prueba
mkdir -p /tmp/overlays-qa && cp dist-libs/umd-core/Cu{DropdownMenu,Select,Modal,SideOver,Button}.umd.js /tmp/overlays-qa/
cp docs/site/.vitepress/theme/themes.gen.css /tmp/overlays-qa/tokens.css
# index.html con <cu-dropdown-menu id="ddParent"> + submenú light DOM, un <cu-select position="right">
# en el borde y <cu-modal>/<cu-side-over>; abrir con la API y medir getBoundingClientRect/scrollWidth
python3 -m http.server 8791 --directory /tmp/overlays-qa
```

Tests: `overlayStack.test.ts` (pila, cross-componente), `Popover.test.ts` (nombre, flip/clamp,
timers), `Dropdown.test.ts` (items + keyboard + submenú), `ce-real.test.ts` (submenú en CE),
`Modal.test.ts` (Escape/persistent), `SideOver.test.ts`, `Button.test.ts`, `NavbarList.test.ts`.
Mutaciones: `overlay-*`, `modal-escape-*`, `sideover-*`, `popover-*`, `dropdown-items-*`,
`menu-roving-*`, `dropdown-submenu-*`, `flat-tree-*`, `button-variant-*`, `*chevron-sin-aria-hidden`.
