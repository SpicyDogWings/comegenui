// src/composables/useMenuNavigation.ts — teclado y roving tabindex de los menús.
//
// Patrón menu button compartido por `DropdownMenu` y por el `Dropdown` con `items`:
// el panel es UNA parada de tabulación (roving tabindex), las filas se recorren con
// flechas/Home/End, las letras buscan por label (typeahead), `Tab` sale del menú
// (y lo cierra cuando el foco ya salió) y `Escape` lo cierra devolviendo el foco al
// trigger (eso lo hace `Popover`).
//
// Antes `Dropdown` renderizaba las filas de `items` como botones sueltos: sin rol, sin
// teclado y con tantas paradas de tabulación como items. La lógica vive acá para que
// los dos menús no se separen.

import { computed, ref, type Ref } from "vue";

export interface MenuNavigationOptions {
  /** Raíz del menú: contiene el trigger y el panel. */
  root: () => HTMLElement | null;
  /** Panel del menú; sin él no hay filas. */
  panel: () => HTMLElement | null;
  /** Selector de las filas dentro del panel. */
  rowSelector: string;
  /** Índice (en la lista de items) de cada fila navegable, en orden de DOM. */
  enabledIndices: Ref<number[]>;
  /** ¿El menú está abierto? */
  isOpen: () => boolean;
  /** Cierra el menú (lo llama el cierre diferido de `Tab`). */
  close: () => void;
  /** Gate extra: `false` deja el teclado del menú inerte (p. ej. `Dropdown` sin `items`). */
  enabled?: () => boolean;
}

/** Texto comparable del typeahead (sin acentos ni mayúsculas). */
function foldMenuText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function useMenuNavigation(options: MenuNavigationOptions) {
  /** Fila activa: índice dentro de las filas elegibles. */
  const activeRow = ref(0);
  const effectiveActiveRow = computed(() =>
    Math.min(activeRow.value, Math.max(0, options.enabledIndices.value.length - 1)),
  );

  let root: HTMLElement | null = null;

  /**
   * Filas elegibles de ESTE menú: sin deshabilitar, en orden de DOM y sin las de un
   * submenú anidado (viven en otro dropdown y tienen su propio handler).
   */
  function enabledRows(): HTMLElement[] {
    const panel = options.panel();
    const owner = options.root();
    if (!panel || !owner) return [];
    return Array.from(panel.querySelectorAll<HTMLElement>(options.rowSelector)).filter(
      (row) =>
        row.closest(".cu-dropdown") === owner &&
        !row.hasAttribute("disabled") &&
        row.getAttribute("aria-disabled") !== "true",
    );
  }

  /** Índice en `items` → `tabindex` (la fila activa es la única parada del panel). */
  function itemTabindex(index: number): number {
    const position = options.enabledIndices.value.indexOf(index);
    return position >= 0 && position === effectiveActiveRow.value ? 0 : -1;
  }

  function focusRow(rows: HTMLElement[], index: number) {
    const position = (index + rows.length) % rows.length;
    const row = rows[position];
    if (!row) return;
    activeRow.value = position;
    row.focus();
    row.scrollIntoView?.({ block: "nearest" });
  }

  // ── Typeahead ──
  let typeahead = "";
  let typeaheadTimer: ReturnType<typeof setTimeout> | null = null;

  function clearTypeahead() {
    typeahead = "";
    if (typeaheadTimer) {
      clearTimeout(typeaheadTimer);
      typeaheadTimer = null;
    }
  }

  function searchByPrefix(char: string, rows: HTMLElement[], from: number) {
    typeahead += foldMenuText(char);
    if (typeaheadTimer) clearTimeout(typeaheadTimer);
    typeaheadTimer = setTimeout(clearTypeahead, 500);

    const start = from >= 0 ? from : 0;
    for (let step = 1; step <= rows.length; step++) {
      const index = (start + step) % rows.length;
      if (foldMenuText(rows[index]!.textContent ?? "").startsWith(typeahead)) {
        focusRow(rows, index);
        return;
      }
    }
  }

  // `Tab` tiene que cerrar el menú, pero el cierre se decide cuando el foco ya se movió:
  // cerrar en el `keydown` haría que `Popover` devolviera el foco al trigger y se tragara
  // el Tab.
  let tabLeaving = false;

  function handleKeydown(e: KeyboardEvent) {
    if (!options.isOpen() || options.enabled?.() === false) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const panel = options.panel();
    const target = e.target as HTMLElement | null;
    if (!panel || !target || !panel.contains(target)) return;
    // Una tecla nacida en un submenú la atiende el submenú, no el menú padre.
    if (target.closest(".cu-dropdown") !== options.root()) return;

    const rows = enabledRows();
    if (rows.length === 0) return;
    const current = rows.indexOf(target.closest(options.rowSelector) as HTMLElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusRow(rows, current < 0 ? 0 : current + 1);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      focusRow(rows, current < 0 ? rows.length - 1 : current - 1);
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      focusRow(rows, 0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      focusRow(rows, rows.length - 1);
      return;
    }
    if (e.key === "Tab") {
      // El foco sigue su camino y el menú se cierra en `focusout`, cuando ya salió.
      tabLeaving = true;
      return;
    }
    if (e.key === " ") {
      // Un link no se activa con Espacio (el navegador scrollea): se replica el click.
      const row = target.closest(options.rowSelector) as HTMLElement | null;
      if (row && row.tagName === "A") {
        e.preventDefault();
        row.click();
      }
      return;
    }
    if (e.key.length === 1) {
      e.preventDefault();
      searchByPrefix(e.key, rows, current);
    }
  }

  /** Un gesto de puntero no es Tab: descarta el cierre pendiente por foco. */
  function handlePointerDown() {
    tabLeaving = false;
  }

  function handleFocusOut(e: FocusEvent) {
    if (!tabLeaving || !options.isOpen()) return;
    tabLeaving = false;
    const next = e.relatedTarget as Node | null;
    if (next && options.root()?.contains(next)) return;
    setTimeout(() => {
      if (options.isOpen()) options.close();
    }, 0);
  }

  /** El roving tabindex sigue al foco real (click o teclado). */
  function handleFocusIn(e: FocusEvent) {
    const target = e.target as HTMLElement | null;
    const row = target?.closest?.(options.rowSelector) as HTMLElement | null;
    if (!row) return;
    const position = enabledRows().indexOf(row);
    if (position >= 0) activeRow.value = position;
  }

  function attach(el: HTMLElement | null) {
    detach();
    root = el;
    if (!root) return;
    root.addEventListener("keydown", handleKeydown);
    root.addEventListener("focusout", handleFocusOut);
    root.addEventListener("focusin", handleFocusIn);
    root.addEventListener("pointerdown", handlePointerDown);
  }

  function detach() {
    if (!root) return;
    root.removeEventListener("keydown", handleKeydown);
    root.removeEventListener("focusout", handleFocusOut);
    root.removeEventListener("focusin", handleFocusIn);
    root.removeEventListener("pointerdown", handlePointerDown);
    root = null;
  }

  /** Estado de navegación a cero (al cerrar el menú). */
  function reset() {
    tabLeaving = false;
    clearTypeahead();
  }

  return { activeRow, enabledRows, itemTabindex, focusRow, attach, detach, reset };
}
