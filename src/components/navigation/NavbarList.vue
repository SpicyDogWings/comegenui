<script setup lang="ts">
import { type PropType } from 'vue'
import Collapse from '@/components/overlay/Collapse.vue'
import Dropdown from '@/components/overlay/Dropdown.vue'
import NavbarMenu from '@/components/navigation/NavbarMenu.vue'
import Button from '@/components/buttons/Button.vue'
import Input from '@/components/form/Input.vue'
import LucideChevronRight from '@/components/icons/LucideChevronRight.vue'
import type { NavItem } from '@/composables/useNavbar'

// Lista interna de la nav (header + items). Se usa en el nav inline y dentro
// del SideOver responsive para no duplicar el markup.
const props = defineProps({
  items: { type: Array as () => NavItem[], required: true },
  search: { type: Boolean, default: false },
  searchPlaceholder: { type: String, default: 'Buscar...' },
  searchMode: { type: String, default: 'filter' },
  searchFields: { type: Array as () => string[], default: () => [] },
  compact: { type: Boolean, default: false },
  compactable: { type: Boolean, default: false },
  collapsed: { type: Boolean, default: false },
  trigger: { type: String as PropType<'click' | 'hover'>, default: 'click' },
  activePath: { type: String, default: '' },
  highlightTarget: { type: Object as () => NavItem | null, default: null },
  activeItem: { type: Object as () => NavItem | null, default: null },
})

const query = defineModel<string>('query', { default: '' })

const emit = defineEmits<{ (e: 'toggle-compact'): void }>()

function itemIcon(item: NavItem): string {
  if (item.icon) return item.icon
  return props.compact ? item.label.charAt(0) : ''
}
</script>

<template>
  <nav class="cu-navbar" :class="{ 'cu-navbar--compact': compact }">
    <div v-if="search || compactable" class="cu-navbar-header">
      <Input
        v-if="search && !compact"
        v-model="query"
        :placeholder="searchPlaceholder"
        class="cu-navbar-search-input"
      />
      <button
        v-if="compactable"
        type="button"
        class="cu-navbar-compact-toggle"
        :title="compact ? 'Expandir' : 'Compactar'"
        :aria-pressed="compact"
        @click="emit('toggle-compact')"
      >
        <span aria-hidden="true">{{ compact ? '»' : '«' }}</span>
      </button>
    </div>

    <template v-for="item in items" :key="item.path || item.label">
      <Dropdown
        v-if="item.children?.length && compact"
        :trigger="props.trigger"
        position="right"
        align="start"
        :class="{ 'cu-navbar-item--match': highlightTarget === item, 'cu-navbar-item--active': activeItem === item }"
        :data-navbar-match="highlightTarget === item ? '' : undefined"
        :data-navbar-active="activeItem === item ? '' : undefined"
      >
        <template #toggle="{ toggle: t }">
          <button
            type="button"
            class="cu-navbar-compact-trigger"
            :title="item.label"
            @click="t"
          >
            <span class="cu-navbar-icon" v-html="itemIcon(item)"></span>
            <LucideChevronRight :width="14" :height="14" class="cu-navbar-compact-chevron" />
          </button>
        </template>
        <NavbarMenu :items="item.children" :trigger="props.trigger" />
      </Dropdown>
      <Collapse
        v-else-if="item.children?.length"
        :label="item.label"
        :icon="itemIcon(item)"
        :defaultOpen="!collapsed"
        :class="{ 'cu-navbar-item--match': highlightTarget === item, 'cu-navbar-item--active': activeItem === item }"
        :data-navbar-match="highlightTarget === item ? '' : undefined"
        :data-navbar-active="activeItem === item ? '' : undefined"
      >
        <NavbarList
          :items="item.children"
          :search="false"
          :search-mode="props.searchMode"
          :search-fields="props.searchFields"
          :compact="compact"
          :collapsed="collapsed"
          :active-path="props.activePath"
          :highlight-target="highlightTarget"
          :active-item="activeItem"
        />
      </Collapse>
      <Button
        v-else
        :to="item.path!"
        :color="activeItem === item ? 'primary' : undefined"
        :variant="activeItem === item ? 'soft' : undefined"
        :title="compact && !item.icon ? item.label : undefined"
        :class="{ 'cu-navbar-item--match': highlightTarget === item, 'cu-navbar-item--active': activeItem === item }"
        :data-navbar-match="highlightTarget === item ? '' : undefined"
        :data-navbar-active="activeItem === item ? '' : undefined"
      >
        <span v-if="itemIcon(item)" class="cu-navbar-icon" v-html="itemIcon(item)"></span>
        <span class="cu-navbar-label">{{ item.label }}</span>
      </Button>
    </template>

    <div
      v-if="search && searchMode === 'filter' && query && items.length === 0"
      class="cu-navbar-empty"
    >
      Sin resultados
    </div>
  </nav>
</template>

<style scoped>
.cu-navbar {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-2xs);
  padding: var(--cu-space-2xs);
}

.cu-navbar :deep(.cu-button) {
  justify-content: flex-start;
  text-align: left;
  width: 100%;
  padding: var(--cu-space-sm) var(--cu-space-md);
}

/* La row completa del item es hovereable: el trigger del Collapse y los items
   ocupan todo el ancho del contenedor (no solo el texto). */
.cu-navbar :deep(.cu-collapse-trigger) {
  width: 100%;
}

.cu-navbar :deep(.cu-dropdown) {
  width: 100%;
}

.cu-navbar-header {
  display: flex;
  align-items: center;
  gap: var(--cu-space-xs);
  margin-bottom: var(--cu-space-xs);
}

.cu-navbar-search-input {
  flex: 1;
  min-width: 0;
}

.cu-navbar-compact-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-sm);
  cursor: pointer;
  font-size: var(--cu-font-size-sm);
  line-height: 1;
  color: var(--cu-color-neutral);
}

.cu-navbar-compact-toggle:hover {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.cu-navbar :deep(.cu-collapse-content) {
  margin-top: var(--cu-space-xs);
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

.cu-navbar-label {
  min-width: 0;
}

/* Highlight del modo scroll (clase duplicada → 0,3,0 para pisar el ghost) */
.cu-navbar :deep(.cu-navbar-item--match.cu-navbar-item--match) {
  background-color: var(--cu-color-primary-soft);
}

.cu-navbar :deep(.cu-collapse.cu-navbar-item--match.cu-navbar-item--match > .cu-collapse-trigger) {
  background-color: var(--cu-color-primary-soft);
}

.cu-navbar-empty {
  padding: var(--cu-space-sm) var(--cu-space-md);
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text);
  opacity: 0.6;
}

/* Compact: solo iconos (o la inicial), sin labels */
.cu-navbar--compact {
  width: fit-content;
}

.cu-navbar--compact :deep(.cu-button) {
  justify-content: center;
  padding: var(--cu-space-sm);
}

.cu-navbar--compact :deep(.cu-collapse-trigger) {
  justify-content: center;
  padding: var(--cu-space-sm);
}

.cu-navbar--compact :deep(.cu-navbar-label) {
  display: none;
}

.cu-navbar--compact :deep(.cu-collapse-label) {
  display: none;
}

.cu-navbar--compact :deep(.cu-collapse-content) {
  padding-left: var(--cu-space-sm);
}

.cu-navbar--compact :deep(.cu-navbar-icon) {
  width: auto;
}

/* Trigger de submenú en modo compact: icono centrado + chevron a la derecha
   que abre un flyout (Dropdown) con NavbarMenu adentro */
.cu-navbar-compact-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: var(--cu-space-sm);
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  border-radius: var(--cu-radius-sm);
  transition: background-color 150ms ease;
}

.cu-navbar-compact-trigger:hover {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.cu-navbar-compact-chevron {
  position: absolute;
  right: var(--cu-space-2xs);
  flex-shrink: 0;
  opacity: 0.65;
}
</style>