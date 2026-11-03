// src/utils/flatTree.ts — ancestros en el *flat tree*: lo que el usuario ve.
//
// Un elemento sloteado es hijo, en el DOM, del consumidor, pero se pinta dentro del
// shadow root que lo proyecta: `parentElement` frena en esa frontera. El salto lo dan
// `assignedSlot` (elemento → slot que lo proyecta) y `getRootNode().host` (shadow root
// → host). Sin esto, dos piezas del mismo overlay no se reconocían como anidadas
// (un submenú dentro del panel de su menú padre en un custom element, un popover
// dentro de una card) y el hover de un submenú cerraba a su padre.

/** Siguiente ancestro en el flat tree (cruza slots y shadow roots). */
export function parentInFlatTree(el: Element): Element | null {
  const slotted = (el as Element & { assignedSlot?: Element | null }).assignedSlot;
  if (slotted) return slotted;
  if (el.parentElement) return el.parentElement;
  const root = el.getRootNode() as ShadowRoot | Document;
  return "host" in root ? (root.host as Element) : null;
}

/** Primer ancestro (sin contar a `el`) que cumple el predicado, en el flat tree. */
export function ancestorInFlatTree(
  el: Element,
  predicate: (node: Element) => boolean,
): Element | null {
  for (let node = parentInFlatTree(el); node; node = parentInFlatTree(node)) {
    if (predicate(node)) return node;
  }
  return null;
}
