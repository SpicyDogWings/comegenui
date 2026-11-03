// src/utils/dropdownNesting.ts — ¿este dropdown se pinta dentro del panel de otro?
//
// `Dropdown` y `DropdownMenu` necesitan la misma respuesta: el motor decide cascada y
// fila nativa, y el menú decide si deja que el motor dibuje esa fila (en vez de su
// `Button`). Antes cada uno miraba `parentElement`, que frena en la frontera del shadow
// root: dentro de un custom element el submenú quedaba como un dropdown suelto.

import { ancestorInFlatTree, parentInFlatTree } from "./flatTree";

/** Hosts cuyo contenido light (salvo el slot `toggle`) se proyecta en el panel. */
const NESTED_HOST_TAGS: Record<string, true> = { "CU-DROPDOWN-MENU": true };

export interface DropdownNesting {
  /** Se pinta dentro del panel de otro dropdown (es un submenú). */
  nested: boolean;
  /** El panel que lo contiene es un `menu`: su fila de submenú es `menuitem`. */
  inMenu: boolean;
}

/**
 * Dos caminos:
 *
 * 1. *Flat tree*: hay un `.cu-dropdown` entre sus ancestros. Cubre el anidado en Vue y
 *    el contenido ya proyectado por un slot (`assignedSlot` / `getRootNode().host`).
 * 2. *Light DOM*: su ancestro es un `<cu-dropdown-menu>`, que proyecta todo su contenido
 *    en el panel salvo el slot `toggle`. Al montar, el panel del padre todavía no existe
 *    (`v-if`, cerrado), así que `assignedSlot` es `null` y el camino 1 no llega.
 */
export function detectDropdownNesting(el: Element | null): DropdownNesting {
  if (!el) return { nested: false, inMenu: false };

  const parentDropdown = ancestorInFlatTree(el, (node) =>
    node.classList.contains("cu-dropdown"),
  );
  if (parentDropdown) {
    return {
      nested: true,
      inMenu:
        parentDropdown.querySelector(".cu-popover-panel")?.getAttribute("role") === "menu",
    };
  }

  // El primer salto desde el nodo raíz del componente cae en el host de su propio
  // shadow root (`<cu-dropdown-menu>` de este mismo componente): eso no es un padre.
  let start = parentInFlatTree(el);
  while (start && (start as HTMLElement).shadowRoot?.contains(el)) {
    start = parentInFlatTree(start);
  }

  let inToggleSlot = false;
  for (let node = start; node; node = parentInFlatTree(node)) {
    if (node.getAttribute("slot") === "toggle") inToggleSlot = true;
    if (NESTED_HOST_TAGS[node.tagName]) return { nested: !inToggleSlot, inMenu: true };
  }

  return { nested: false, inMenu: false };
}
