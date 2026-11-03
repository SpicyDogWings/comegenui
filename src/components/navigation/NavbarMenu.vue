<script setup lang="ts">
import { computed, nextTick, ref, type PropType } from 'vue'
import Dropdown from '@/components/overlay/Dropdown.vue'
import LucideChevronRight from '@/components/icons/LucideChevronRight.vue'
import { useUniqueId } from '@/utils/uniqueId'
import { sanitizeIcon } from '@/utils/sanitizeIcon'
import type { NavItem } from '@/composables/useNavbar'

// Menú recursivo interno: renderiza un nivel del árbol de navegación como un
// `role="menu"` (el rol lo pone el `Dropdown` que lo contiene) con filas
// `menuitem`. Cada item con children es un Dropdown anidado cuyo panel vuelve a
// renderizar NavbarMenu → anidamiento infinito. Los iconos son HTML/SVG del
// consumidor y se sanitizan con `sanitizeIcon` antes del `v-html` (allowlist de
// solo SVG, mismo criterio en NavbarList/Dropdown/Tabs).

// `item.path` puede venir de datos: un esquema ejecutable no se navega y el item
// cae al render deshabilitado (mismo criterio que `Button.safeTo`). Los
// espacios/controles se ignoran para el chequeo (`java\tscript:`), igual que
// hace el navegador al resolver el esquema.
function safePath(path?: string): string | undefined {
  const value = path?.trim()
  if (!value) return undefined
  const compact = value.replace(/[\u0000-\u0020]+/g, '')
  if (/^(?:javascript|vbscript|data):/i.test(compact)) return undefined
  return path
}
const props = defineProps({
  /** Items del nivel de menú. */
  items: { type: Array as () => NavItem[], required: true },
  /** Disparador de los submenús: click o hover. */
  trigger: {
    type: String as PropType<'click' | 'hover'>,
    required: false,
    default: 'click',
  },
})

const menuEl = ref<HTMLElement | null>(null)
const uid = useUniqueId('cu-navbar-menu')

/** Items del consumidor: el árbol puede llegar incompleto desde datos. */
const levelItems = computed<NavItem[]>(() => (Array.isArray(props.items) ? props.items : []))

/**
 * `id` del panel de cada submenú. El trigger lo referencia con `aria-controls`
 * sólo mientras el panel está montado (Popover lo crea con `v-if`).
 */
const subPanelIds = computed(() => {
  const map = new Map<NavItem, string>()
  levelItems.value.forEach((item, index) => {
    if (item.children?.length) map.set(item, `${uid}-sub-${index}`)
  })
  return map
})

function subPanelId(item: NavItem): string {
  return subPanelIds.value.get(item) ?? `${uid}-sub`
}

// ── Roving tabindex ──
// Patrón menu button: el panel es una sola parada de tabulación; las filas se
// recorren con flechas/Home/End y las letras (typeahead). Una fila deshabilitada
// (item sin `path`) queda fuera del recorrido.
const activeRow = ref(0)

/** Posición de cada fila navegable del nivel, en orden de DOM. */
const rowPositions = computed(() => {
  const map = new Map<NavItem, number>()
  let position = 0
  for (const item of levelItems.value) {
    if (item.children?.length || item.path) map.set(item, position++)
  }
  return map
})

function rowTabindex(item: NavItem): number {
  const position = rowPositions.value.get(item)
  if (position === undefined) return -1
  const active = Math.min(activeRow.value, Math.max(0, rowPositions.value.size - 1))
  return position === active ? 0 : -1
}

/** Filas navegables de ESTE nivel (no las de un submenú abierto). */
function rows(): HTMLElement[] {
  const root = menuEl.value
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>('[data-navbar-row]')).filter(
    (row) => row.closest('.cu-navbar-menu') === root && row.getAttribute('aria-disabled') !== 'true',
  )
}

function focusRow(list: HTMLElement[], index: number) {
  if (list.length === 0) return
  const position = (index + list.length) % list.length
  activeRow.value = position
  const row = list[position]!
  row.focus()
  row.scrollIntoView?.({ block: 'nearest' })
}

/** Abre el submenú de una fila (si hace falta) y deja el foco en su primera fila. */
async function enterSubmenu(row: HTMLElement) {
  if (row.getAttribute('aria-expanded') !== 'true') row.click()
  await nextTick()
  await nextTick()
  // El submenú es el `.cu-navbar-menu` que vive dentro del panel (el `.cu-navbar-menu`
  // de afuera contiene al trigger, así que no sirve como raíz del query).
  const nested = row.parentElement?.querySelector('.cu-navbar-menu .cu-navbar-menu')
  nested?.querySelector<HTMLElement>('[data-navbar-row]')?.focus()
}

// ── Typeahead ──
let typeahead = ''
let typeaheadTimer: ReturnType<typeof setTimeout> | null = null

function foldText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function searchByPrefix(char: string, list: HTMLElement[], from: number) {
  typeahead += foldText(char)
  if (typeaheadTimer) clearTimeout(typeaheadTimer)
  typeaheadTimer = setTimeout(() => {
    typeahead = ''
  }, 500)

  const start = from >= 0 ? from : 0
  for (let step = 1; step <= list.length; step++) {
    const index = (start + step) % list.length
    if (foldText(list[index]!.textContent ?? '').startsWith(typeahead)) {
      focusRow(list, index)
      return
    }
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey) return
  const target = event.target as HTMLElement | null
  if (!target || target.closest('.cu-navbar-menu') !== menuEl.value) return
  const list = rows()
  if (list.length === 0) return
  const row = target.closest<HTMLElement>('[data-navbar-row]')
  const current = row ? list.indexOf(row) : -1

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusRow(list, current < 0 ? 0 : current + 1)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusRow(list, current < 0 ? list.length - 1 : current - 1)
    return
  }
  if (event.key === 'Home') {
    event.preventDefault()
    focusRow(list, 0)
    return
  }
  if (event.key === 'End') {
    event.preventDefault()
    focusRow(list, list.length - 1)
    return
  }
  if ((event.key === 'ArrowRight' || event.key === 'Enter') && row?.getAttribute('aria-haspopup') === 'menu') {
    event.preventDefault()
    void enterSubmenu(row)
    return
  }
  if (event.key === ' ') {
    // Un enlace no se activa con Espacio (el navegador scrollea): se replica el click.
    if (row?.tagName === 'A') {
      event.preventDefault()
      row.click()
    }
    return
  }
  if (event.key.length === 1) {
    event.preventDefault()
    searchByPrefix(event.key, list, current)
  }
}

/** El roving tabindex sigue al foco real (click o teclado). */
function onFocusin(event: FocusEvent) {
  const target = event.target as HTMLElement | null
  const row = target?.closest?.('[data-navbar-row]') as HTMLElement | null
  if (!row || row.closest('.cu-navbar-menu') !== menuEl.value) return
  const position = rows().indexOf(row)
  if (position >= 0) activeRow.value = position
}
</script>

<template>
  <div
    ref="menuEl"
    class="cu-navbar-menu"
    role="none"
    @keydown="onKeydown"
    @focusin="onFocusin"
  >
    <template v-for="item in levelItems" :key="item.path || item.label">
      <Dropdown
        v-if="item.children?.length"
        :trigger="props.trigger"
        :panel-id="subPanelId(item)"
      >
        <template #toggle="{ toggle: t, isOpen }">
          <button
            type="button"
            class="cu-navbar-menu-item cu-navbar-menu-item--submenu"
            role="menuitem"
            aria-haspopup="menu"
            :aria-expanded="isOpen ? 'true' : 'false'"
            :aria-controls="isOpen ? subPanelId(item) : undefined"
            data-navbar-row
            :tabindex="rowTabindex(item)"
            @click="t"
          >
            <span v-if="item.icon" class="cu-navbar-menu-icon" v-html="sanitizeIcon(item.icon)"></span>
            <span class="cu-navbar-menu-item-label">{{ item.label }}</span>
            <LucideChevronRight
              :width="14"
              :height="14"
              class="cu-navbar-menu-chevron"
              aria-hidden="true"
              focusable="false"
            />
          </button>
        </template>
        <NavbarMenu :items="item.children" :trigger="props.trigger" />
      </Dropdown>
      <a
        v-else-if="safePath(item.path)"
        :href="safePath(item.path)"
        class="cu-navbar-menu-item"
        role="menuitem"
        data-navbar-row
        :tabindex="rowTabindex(item)"
      >
        <span v-if="item.icon" class="cu-navbar-menu-icon" v-html="sanitizeIcon(item.icon)"></span>
        <span class="cu-navbar-menu-item-label">{{ item.label }}</span>
      </a>
      <span
        v-else
        class="cu-navbar-menu-item cu-navbar-menu-item--disabled"
        role="menuitem"
        aria-disabled="true"
      >
        <span v-if="item.icon" class="cu-navbar-menu-icon" v-html="sanitizeIcon(item.icon)"></span>
        <span class="cu-navbar-menu-item-label">{{ item.label }}</span>
      </span>
    </template>
  </div>
</template>

<style scoped>
.cu-navbar-menu {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-2xs);
  min-width: 180px;
}

.cu-navbar-menu-item {
  display: flex;
  align-items: center;
  gap: var(--cu-space-md);
  width: 100%;
  padding: var(--cu-space-sm) var(--cu-space-md);
  box-sizing: border-box;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  text-decoration: none;
  border-radius: var(--cu-radius-sm);
  transition: background-color 150ms ease;
}

.cu-navbar-menu-item:hover:not(.cu-navbar-menu-item--disabled) {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.cu-navbar-menu-item--disabled {
  color: var(--cu-color-neutral-text-muted);
  cursor: not-allowed;
}

.cu-navbar-menu-item-label {
  text-align: left;
  white-space: nowrap;
}

.cu-navbar-menu-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.25rem;
  line-height: 1;
}

/* Fila de submenú: el chevron va al final, como en el resto de los menús. */
.cu-navbar-menu-item--submenu {
  justify-content: space-between;
}

.cu-navbar-menu-chevron {
  flex-shrink: 0;
  color: var(--cu-color-neutral-text-muted);
}

@media (prefers-reduced-motion: reduce) {
  .cu-navbar-menu-item {
    transition: none;
  }
}
</style>
