// src/utils/navbarMenuTrigger.ts — teclado del trigger de un menú de navegación.
//
// Patrón menu button: ArrowDown/ArrowUp sobre el trigger abre el submenú (si hace
// falta) y deja el foco en la primera/última fila `menuitem`. Las filas las renderiza
// `NavbarMenu` dentro del panel del `Dropdown` que envuelve al trigger, así que el
// borde las busca por DOM después de abrir (el panel se monta con `v-if`).
import { nextTick } from 'vue'

/**
 * Filas navegables del primer nivel del menú. Se excluyen las de un submenú ya
 * abierto (pertenecen a otro `.cu-navbar-menu`) y las deshabilitadas.
 */
export function firstLevelRows(dropdownRoot: Element | null): HTMLElement[] {
  const menu = dropdownRoot?.querySelector('.cu-dropdown-panel > .cu-navbar-menu')
  if (!menu) return []
  return Array.from(menu.querySelectorAll<HTMLElement>('[data-navbar-row]')).filter(
    (row) => row.closest('.cu-navbar-menu') === menu && row.getAttribute('aria-disabled') !== 'true',
  )
}

/** ArrowDown/ArrowUp en el trigger: abre el menú y enfoca el borde correspondiente. */
export async function onNavbarMenuTriggerKeydown(event: KeyboardEvent, toggle: () => void) {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  event.preventDefault()
  const root = (event.currentTarget as HTMLElement | null)?.closest('.cu-dropdown') ?? null
  if (!root?.querySelector('.cu-dropdown-panel')) toggle()
  await nextTick()
  await nextTick()
  const rows = firstLevelRows(root)
  if (rows.length === 0) return
  rows[event.key === 'ArrowUp' ? rows.length - 1 : 0]!.focus()
}
