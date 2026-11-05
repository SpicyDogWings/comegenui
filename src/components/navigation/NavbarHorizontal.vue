<script setup lang="ts">
import { type PropType } from 'vue'
import Dropdown from '@/components/overlay/Dropdown.vue'
import NavbarMenu from '@/components/navigation/NavbarMenu.vue'
import Button from '@/components/buttons/Button.vue'
import LucideChevronDown from '@/components/icons/LucideChevronDown.vue'
import { useNavbar, type NavItem } from '@/composables/useNavbar'
import { sanitizeIcon } from '@/utils/sanitizeIcon'
import { useUniqueId } from '@/utils/uniqueId'
import { onNavbarMenuTriggerKeydown } from '@/utils/navbarMenuTrigger'

export interface NavbarHorizontalItem extends NavItem {}

const props = defineProps({
  items: { type: Array as () => NavItem[], required: true },
  // Cómo abren los submenús: "click" (default) o "hover".
  trigger: {
    type: String as PropType<'click' | 'hover'>,
    required: false,
    default: 'click',
  },
  // Path activo manual (para vanilla/CE sin vue-router). Si se omite, se toma
  // de useRoute() cuando hay router.
  activePath: { type: String, required: false, default: '' },
})

const {
  navRef,
  displayItems,
  highlightTarget,
  activeItem,
} = useNavbar({
  items: () => props.items,
  search: () => false,
  searchMode: () => 'filter',
  searchFields: () => [],
  activePath: () => (props.activePath || undefined),
})

// Contrato de la ficha: si el item activo está dentro de un submenú, se resalta el
// padre. `activeItem` devuelve la hoja, así que el ancestro se resuelve por identidad
// sobre el árbol de `children` (los items son los mismos objetos que se renderizan).
function isActiveBranch(item: NavItem): boolean {
  const target = activeItem.value
  if (!target) return false
  if (target === item) return true
  const contains = (children?: NavItem[]): boolean =>
    (children ?? []).some((child) => child === target || contains(child.children))
  return contains(item.children)
}

// ── Menú de cada submenú ──
// El panel es `role="menu"` (lo pone `Dropdown`) y `NavbarMenu` renderiza las filas
// `menuitem` con roving tabindex: el trigger lo referencia con `aria-controls`
// mientras el panel existe y las flechas entran al menú (patrón menu button).
const uid = useUniqueId('cu-navbar-horizontal')

function panelIdOf(index: number): string {
  return `${uid}-panel-${index}`
}
</script>

<template>
  <nav ref="navRef" class="cu-navbar">
    <template v-for="(item, index) in displayItems" :key="item.path || item.label">
      <Dropdown
        v-if="item.children?.length"
        :trigger="props.trigger"
        :panel-id="panelIdOf(index)"
        :class="{ 'cu-navbar-item--match': highlightTarget === item, 'cu-navbar-item--active': isActiveBranch(item) }"
        :data-navbar-match="highlightTarget === item ? '' : undefined"
        :data-navbar-active="isActiveBranch(item) ? '' : undefined"
      >
        <template #toggle="{ toggle: t, isOpen }">
          <button
            type="button"
            class="cu-navbar-dropdown-trigger"
            aria-haspopup="menu"
            :aria-expanded="isOpen ? 'true' : 'false'"
            :aria-controls="isOpen ? panelIdOf(index) : undefined"
            @click="t"
            @keydown="onNavbarMenuTriggerKeydown($event, t)"
          >
            <span v-if="item.icon" class="cu-navbar-icon" v-html="sanitizeIcon(item.icon)"></span>
            {{ item.label }}
            <LucideChevronDown :width="14" :height="14" class="cu-navbar-chevron" />
          </button>
        </template>
        <template #default>
          <NavbarMenu :items="item.children" :trigger="props.trigger" />
        </template>
      </Dropdown>
      <Button
        v-else
        :to="item.path!"
        :color="activeItem === item ? 'primary' : undefined"
        :variant="activeItem === item ? 'soft' : undefined"
        :aria-current="activeItem === item ? 'page' : undefined"
        :class="{ 'cu-navbar-item--match': highlightTarget === item, 'cu-navbar-item--active': activeItem === item }"
        :data-navbar-match="highlightTarget === item ? '' : undefined"
        :data-navbar-active="activeItem === item ? '' : undefined"
      >
        <span v-if="item.icon" class="cu-navbar-icon" v-html="sanitizeIcon(item.icon)"></span>
        <span class="cu-navbar-label">{{ item.label }}</span>
      </Button>
    </template>
  </nav>
</template>

<style scoped>
.cu-navbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--cu-space-2xs);
  padding: var(--cu-space-2xs);
}

.cu-navbar :deep(.cu-button) {
  justify-content: flex-start;
  text-align: left;
  padding: var(--cu-space-sm) var(--cu-space-md);
}

.cu-navbar :deep(.cu-dropdown-panel) {
  padding: var(--cu-space-xs);
}

/* Highlight del modo scroll (clase duplicada → 0,3,0 para pisar el ghost) */
.cu-navbar :deep(.cu-navbar-item--match.cu-navbar-item--match) {
  background-color: var(--cu-color-primary-soft);
}

/* Item activo con submenú: el mismo lenguaje que el Button `primary`+`soft` del
   nivel raíz. Antes la clase se aplicaba al wrapper pero no tenía estilo propio. */
.cu-navbar :deep(.cu-navbar-item--active) .cu-navbar-dropdown-trigger {
  color: var(--cu-color-primary-text-on-soft);
  background-color: var(--cu-color-primary-soft);
}

.cu-navbar-dropdown-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-2xs);
  padding: var(--cu-space-sm) var(--cu-space-md);
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  border-radius: var(--cu-radius-sm);
  transition: background-color 0.15s ease;
}

.cu-navbar-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.25rem;
  font-size: var(--cu-font-size-sm);
  line-height: 1;
}

.cu-navbar-dropdown-trigger:hover {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.cu-navbar-chevron {
  transition: transform 0.2s ease;
}

/* Mismo criterio que `Button`/`Collapse`/`SideOver`: sin movimiento con
   `prefers-reduced-motion`. */
@media (prefers-reduced-motion: reduce) {
  .cu-navbar-dropdown-trigger,
  .cu-navbar-chevron {
    transition: none;
  }
}
</style>