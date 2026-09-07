<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, type PropType } from 'vue'
import { useRoute } from 'vue-router'
import Collapse from '@/components/overlay/Collapse.vue'
import Button from '@/components/buttons/Button.vue'
import Input from '@/components/form/Input.vue'
import { useNavbar, type NavItem } from '@/composables/useNavbar'

export interface NavbarItem extends NavItem {}

const BREAKPOINT = '(max-width: 768px)'

const props = defineProps({
  items: { type: Array as () => NavItem[], required: true },
  search: { type: Boolean, required: false, default: false },
  searchPlaceholder: { type: String, required: false, default: 'Buscar...' },
  searchMode: {
    type: String as PropType<'filter' | 'scroll'>,
    required: false,
    default: 'filter',
    validator: (value: string) => ['filter', 'scroll'].includes(value),
  },
  searchFields: { type: Array as () => string[], required: false, default: () => [] },
  // Compact: muestra solo los iconos (o la inicial del label si no hay icono).
  compact: { type: Boolean, required: false, default: false },
  // compactable: agrega un botón nativo (en la misma row que el search) que
  // alterna el modo compact del componente.
  compactable: { type: Boolean, required: false, default: false },
  // Responsive: bajo el breakpoint, la nav se vuelve un drawer overlay que se
  // abre con un botón hamburguesa. Solo aplica en la instancia raíz.
  responsive: { type: Boolean, required: false, default: false },
  // Interno: item global a resaltar en modo scroll (lo calcula la raíz y se
  // propaga a las instancias recursivas).
  highlightItem: { type: Object as () => NavItem | null, required: false, default: null },
})

const emit = defineEmits<{ (e: 'search', query: string): void }>()

const {
  query,
  navRef,
  displayItems,
  highlightTarget,
  activeItem,
} = useNavbar({
  items: () => props.items,
  search: () => props.search,
  searchMode: () => props.searchMode,
  searchFields: () => props.searchFields,
  highlightItem: () => props.highlightItem,
  onSearch: (q) => emit('search', q),
})

// Modo compact efectivo: si se usa el toggle nativo (compactable), el estado lo
// maneja el componente; si no, se respeta el prop `compact`.
const localCompact = ref(props.compact)
function toggleCompact() {
  localCompact.value = !localCompact.value
}
const effectiveCompact = computed(() => (props.compactable ? localCompact.value : props.compact))

function itemIcon(item: NavItem): string {
  if (item.icon) return item.icon
  return effectiveCompact.value ? item.label.charAt(0) : ''
}

// --- Modo responsive (drawer overlay en mobile) ---
const isMobile = ref(false)
const open = ref(false)
let mq: MediaQueryList | null = null

function onChange(e: MediaQueryListEvent) {
  isMobile.value = e.matches
  if (!e.matches) open.value = false
}

onMounted(() => {
  if (!props.responsive) return
  mq = window.matchMedia(BREAKPOINT)
  isMobile.value = mq.matches
  mq.addEventListener('change', onChange)
})

onUnmounted(() => {
  mq?.removeEventListener('change', onChange)
})

const route = useRoute()
watch(() => route.path, () => { open.value = false })
</script>

<template>
  <div
    class="cu-navbar-responsive"
    :class="{ 'is-responsive': responsive && isMobile }"
  >
    <button
      v-if="responsive && isMobile"
      type="button"
      class="cu-navbar-responsive-toggle"
      :aria-expanded="open"
      aria-label="Abrir menú"
      @click="open = !open"
    >
      ☰
    </button>
    <div
      v-if="responsive && isMobile"
      class="cu-navbar-responsive-scrim"
      :class="{ 'is-visible': open }"
      @click="open = false"
    ></div>

    <nav
      ref="navRef"
      class="cu-navbar"
      :class="{
        'cu-navbar--compact': effectiveCompact,
        'cu-navbar--drawer': responsive && isMobile,
        'is-open': open,
      }"
    >
      <div v-if="search || compactable" class="cu-navbar-header">
        <Input
          v-if="search && !effectiveCompact"
          v-model="query"
          :placeholder="searchPlaceholder"
          class="cu-navbar-search-input"
        />
        <button
          v-if="compactable"
          type="button"
          class="cu-navbar-compact-toggle"
          :title="effectiveCompact ? 'Expandir' : 'Compactar'"
          :aria-pressed="effectiveCompact"
          @click="toggleCompact"
        >
          <span aria-hidden="true">{{ effectiveCompact ? '»' : '«' }}</span>
        </button>
      </div>

      <template v-for="item in displayItems" :key="item.path || item.label">
        <Collapse
          v-if="item.children?.length"
          :label="item.label"
          :icon="itemIcon(item)"
          :defaultOpen="true"
          :class="{ 'cu-navbar-item--match': highlightTarget === item, 'cu-navbar-item--active': activeItem === item }"
          :data-navbar-match="highlightTarget === item ? '' : undefined"
          :data-navbar-active="activeItem === item ? '' : undefined"
        >
          <Navbar
            :items="item.children"
            :search="false"
            :search-mode="props.searchMode"
            :search-fields="props.searchFields"
            :compact="effectiveCompact"
            :highlight-item="highlightTarget"
          />
        </Collapse>
        <Button
          v-else
          :to="item.path!"
          :color="activeItem === item ? 'primary' : undefined"
          :variant="activeItem === item ? 'soft' : undefined"
          :title="effectiveCompact && !item.icon ? item.label : undefined"
          :class="{ 'cu-navbar-item--match': highlightTarget === item, 'cu-navbar-item--active': activeItem === item }"
          :data-navbar-match="highlightTarget === item ? '' : undefined"
          :data-navbar-active="activeItem === item ? '' : undefined"
        >
          <span v-if="itemIcon(item)" class="cu-navbar-icon" v-html="itemIcon(item)"></span>
          <span class="cu-navbar-label">{{ item.label }}</span>
        </Button>
      </template>

      <div
        v-if="props.search && props.searchMode === 'filter' && query && displayItems.length === 0"
        class="cu-navbar-empty"
      >
        Sin resultados
      </div>
    </nav>
  </div>
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
  padding: var(--cu-space-sm) var(--cu-space-md);
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

/* --- Responsive: drawer overlay en mobile --- */
.cu-navbar-responsive {
  display: contents;
}

.cu-navbar-responsive.is-responsive {
  display: block;
  position: relative;
}

.cu-navbar-responsive-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  margin-bottom: var(--cu-space-xs);
  background: transparent;
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-sm);
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  color: var(--cu-color-neutral);
}

.cu-navbar-responsive-toggle:hover {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.cu-navbar-responsive-scrim {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.cu-navbar-responsive-scrim.is-visible {
  opacity: 1;
  pointer-events: auto;
}

.cu-navbar--drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 9999;
  width: 264px;
  max-width: 85vw;
  background-color: var(--cu-color-surface);
  box-shadow: var(--cu-shadow-xl);
  transform: translateX(-100%);
  transition: transform 0.25s ease;
  overflow-y: auto;
  padding: var(--cu-space-sm);
}

.cu-navbar--drawer.is-open {
  transform: translateX(0);
}
</style>