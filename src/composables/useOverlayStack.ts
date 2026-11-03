// src/composables/useOverlayStack.ts — pila compartida de overlays.
//
// Cada overlay (`Modal`, `SideOver`, `Popover`/`Dropdown`) se registra al abrirse y se
// da de baja al cerrarse. `Escape` se atiende UNA sola vez, sobre el tope de la pila:
// antes cada componente escuchaba con su propio listener y una pulsación cerraba el
// menú y su submenú a la vez (o un `Modal` y el `SideOver` de al lado).
//
// El bloqueo del scroll del body también es uno solo: lo piden los overlays que lo
// necesitan (`SideOver`) y se suelta cuando el último que lo pidió se cierra, así dos
// paneles abiertos no se devuelven el `overflow` entre ellos.
//
// El estado vive en `globalThis`: cada componente del zip se bundlea por separado
// (un UMD/ESM por componente), así que este módulo puede evaluarse más de una vez en
// la misma página y cada copia tendría su propia pila. `globalThis` es el único lugar
// donde la pila es la misma para todas. Mismo criterio que el registry de hover de
// `Popover`.

export type OverlayId = symbol;

export interface OverlayHandle {
  /** Cierra el overlay. `Escape` lo llama sólo sobre el tope de la pila. */
  close: () => void;
  /** Bloquea el scroll del body mientras el overlay esté abierto. */
  lockScroll?: boolean;
}

interface OverlayEntry extends OverlayHandle {
  id: OverlayId;
}

interface OverlayStack {
  entries: OverlayEntry[];
  /** Overlays abiertos que piden bloqueo; el lock se suelta al quedar en 0. */
  scrollLocks: number;
  previousBodyOverflow: string;
  listening: boolean;
}

const STACK_KEY = "__cu_overlay_stack__";

function overlayStack(): OverlayStack {
  const g = globalThis as unknown as Record<string, OverlayStack | undefined>;
  return (g[STACK_KEY] ??= {
    entries: [],
    scrollLocks: 0,
    previousBodyOverflow: "",
    listening: false,
  });
}

function lockScroll(stack: OverlayStack) {
  if (typeof document === "undefined") return;
  if (stack.scrollLocks === 0) {
    stack.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  stack.scrollLocks += 1;
}

function unlockScroll(stack: OverlayStack) {
  if (stack.scrollLocks === 0) return;
  stack.scrollLocks -= 1;
  if (stack.scrollLocks === 0 && typeof document !== "undefined") {
    document.body.style.overflow = stack.previousBodyOverflow;
  }
}

/** Escape: sólo el overlay de arriba reacciona (y uno solo por pulsación). */
function onEscape(event: KeyboardEvent) {
  if (event.key !== "Escape") return;
  const stack = overlayStack();
  stack.entries[stack.entries.length - 1]?.close();
}

/**
 * Suma un overlay abierto a la pila. Devuelve su id, que es lo que después se pasa a
 * `unregisterOverlay`/`isTopmostOverlay`.
 */
export function registerOverlay(handle: OverlayHandle): OverlayId {
  const stack = overlayStack();
  const id: OverlayId = Symbol("cu-overlay");
  stack.entries.push({ ...handle, id });
  if (handle.lockScroll) lockScroll(stack);
  if (!stack.listening && typeof document !== "undefined") {
    document.addEventListener("keydown", onEscape);
    stack.listening = true;
  }
  return id;
}

/** Saca un overlay de la pila (idempotente: cerrar dos veces no rompe nada). */
export function unregisterOverlay(id: OverlayId): void {
  const stack = overlayStack();
  const index = stack.entries.findIndex((entry) => entry.id === id);
  if (index === -1) return;
  const [entry] = stack.entries.splice(index, 1);
  if (entry?.lockScroll) unlockScroll(stack);
  if (stack.entries.length === 0 && stack.listening && typeof document !== "undefined") {
    document.removeEventListener("keydown", onEscape);
    stack.listening = false;
  }
}

/** ¿Este overlay es el de arriba? (trampa de foco / Tab del `SideOver`). */
export function isTopmostOverlay(id: OverlayId): boolean {
  const entries = overlayStack().entries;
  return entries.length > 0 && entries[entries.length - 1]!.id === id;
}
