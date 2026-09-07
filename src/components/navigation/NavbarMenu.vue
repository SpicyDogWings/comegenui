<script setup lang="ts">
import { type PropType } from 'vue'
import Dropdown from '@/components/overlay/Dropdown.vue'
import type { NavItem } from '@/composables/useNavbar'

// Menú recursivo interno: renderiza un nivel del árbol de navegación como una
// columna de items de menú. Cada item con children es un Dropdown anidado cuyo
// panel vuelve a renderizar NavbarMenu → anidamiento infinito.
const props = defineProps({
  items: { type: Array as () => NavItem[], required: true },
  trigger: {
    type: String as PropType<'click' | 'hover'>,
    required: false,
    default: 'click',
  },
})
</script>

<template>
  <div class="cu-navbar-menu">
    <template v-for="item in props.items" :key="item.path || item.label">
      <Dropdown v-if="item.children?.length" :label="item.label" :icon="item.icon" :trigger="props.trigger">
        <NavbarMenu :items="item.children" :trigger="props.trigger" />
      </Dropdown>
      <a
        v-else-if="item.path"
        :href="item.path"
        class="cu-navbar-menu-item"
      >
        <span v-if="item.icon" class="cu-navbar-menu-icon" v-html="item.icon"></span>
        <span class="cu-navbar-menu-item-label">{{ item.label }}</span>
      </a>
      <span
        v-else
        class="cu-navbar-menu-item cu-navbar-menu-item--disabled"
      >
        <span v-if="item.icon" class="cu-navbar-menu-icon" v-html="item.icon"></span>
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
  opacity: 0.5;
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
</style>