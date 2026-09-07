<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, type PropType } from 'vue'
import { useRoute } from 'vue-router'
import Collapse from '@/components/overlay/Collapse.vue'
import Button from '@/components/buttons/Button.vue'
import Input from '@/components/form/Input.vue'

export interface NavItem {
  label: string
  path?: string
  children?: NavItem[]
}

const props = defineProps({
  items: { type: Array as () => NavItem[], required: true },
  // Search (como searchEnabled de AdvancedTable): input arriba del menú que
  // filtra/resalta items automáticamente. Solo la instancia raíz lo renderiza.
  search: { type: Boolean, required: false, default: false },
  searchPlaceholder: { type: String, required: false, default: 'Buscar...' },
  searchMode: {
    type: String as PropType<'filter' | 'scroll'>,
    required: false,
    default: 'filter',
    validator: (value: string) => ['filter', 'scroll'].includes(value),
  },
  // Campos por los que busca. Vacío = toda la interfaz del item (todos sus
  // campos menos children), no solo el label.
  searchFields: { type: Array as () => string[], required: false, default: () => [] },
  // Interno: item global a resaltar en modo scroll (lo calcula la raíz y se
  // propaga a las instancias recursivas).
  highlightItem: { type: Object as () => NavItem | null, required: false, default: null },
})

const emit = defineEmits<{ (e: 'search', query: string): void }>()

const route = useRoute()

const query = ref('')

watch(query, (value) => emit('search', value))

// Misma normalización que useSearch (acentos y mayúsculas fuera).
const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u0302\u0304-\u036f]/g, '').toLowerCase()

const normalizedQuery = computed(() => normalize(query.value.trim()))

const searchActive = computed(() => props.search && normalizedQuery.value.length > 0)

function itemMatches(item: NavItem, q: string): boolean {
  const keys = props.searchFields.length
    ? props.searchFields
    : Object.keys(item).filter((k) => {
        if (k === 'children') return false
        return typeof (item as Record<string, unknown>)[k] !== 'function'
      })
  return keys.some((k) => {
    const value = (item as Record<string, unknown>)[k]
    return value != null && normalize(String(value)).includes(q)
  })
}

// filter: un item que matchea se muestra con TODO su subárbol; si matchea un
// subitem, se conservan sus ancestros → se ve su árbol entero.
function filterTree(items: NavItem[], q: string): NavItem[] {
  const out: NavItem[] = []
  for (const item of items) {
    if (itemMatches(item, q)) {
      out.push(item)
    } else if (item.children?.length) {
      const kids = filterTree(item.children, q)
      if (kids.length) out.push({ ...item, children: kids })
    }
  }
  return out
}

const displayItems = computed(() => {
  if (!searchActive.value || props.searchMode !== 'filter') return props.items
  return filterTree(props.items, normalizedQuery.value)
})

// scroll: primer match global en DFS. La raíz lo calcula; las recursivas usan
// el que les llega por highlightItem.
const firstMatch = computed<NavItem | null>(() => {
  if (!props.search || props.searchMode !== 'scroll') return null
  const q = normalizedQuery.value
  if (!q) return null
  const dfs = (items: NavItem[]): NavItem | null => {
    for (const item of items) {
      if (itemMatches(item, q)) return item
      if (item.children?.length) {
        const found = dfs(item.children)
        if (found) return found
      }
    }
    return null
  }
  return dfs(props.items)
})

const highlightTarget = computed<NavItem | null>(() => props.highlightItem ?? firstMatch.value)

const navRef = ref<HTMLElement | null>(null)

// Scroll al item que matchea la ruta actual (item activo)
const activeItem = computed(() => {
  const currentPath = route.path
  const findActive = (items: NavItem[]): NavItem | null => {
    for (const item of items) {
      if (item.path === currentPath) return item
      if (item.children?.length) {
        const found = findActive(item.children)
        if (found) return found
      }
    }
    return null
  }
  return findActive(props.items)
})

function scrollToActive() {
  nextTick(() => {
    const el = document.querySelector('[data-navbar-active]')
    if (!el) return

    // Encontrar el contenedor scrollable
    let parent = el.parentElement
    let scrollContainer: HTMLElement | null = null
    while (parent) {
      const overflow = getComputedStyle(parent).overflow
      if (overflow === 'auto' || overflow === 'scroll') {
        scrollContainer = parent
        break
      }
      parent = parent.parentElement
    }

    if (!scrollContainer) {
      // Fallback: centrar en el viewport
      el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' })
      return
    }

    // Centrar el elemento dentro del contenedor scrollable
    const containerRect = scrollContainer.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const scrollOffset = elRect.top - containerRect.top + scrollContainer.scrollTop
    const centerOffset = scrollOffset - (containerRect.height / 2) + (elRect.height / 2)

    scrollContainer.scrollTo({ top: centerOffset, behavior: 'smooth' })
  })
}

watch(activeItem, (item) => {
  if (item) scrollToActive()
})

watch(firstMatch, async (item) => {
  if (!item) return
  await nextTick()
  navRef.value?.querySelector('[data-navbar-match]')?.scrollIntoView({ block: 'nearest' })
})

// Scroll también al montar (para la ruta inicial)
onMounted(() => {
  if (activeItem.value) scrollToActive()
})
</script>

<template>
  <nav ref="navRef" class="cu-navbar">
    <div v-if="search" class="cu-navbar-search">
      <Input v-model="query" :placeholder="searchPlaceholder" />
    </div>
    <template v-for="item in displayItems" :key="item.path || item.label">
      <Collapse
        v-if="item.children?.length"
        :label="item.label"
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
          :highlight-item="highlightTarget"
        />
      </Collapse>
      <Button
        v-else
        :to="item.path!"
        :color="route.path === item.path ? 'primary' : undefined"
        :variant="route.path === item.path ? 'soft' : undefined"
        :class="{ 'cu-navbar-item--match': highlightTarget === item, 'cu-navbar-item--active': activeItem === item }"
        :data-navbar-match="highlightTarget === item ? '' : undefined"
        :data-navbar-active="activeItem === item ? '' : undefined"
      >
        {{ item.label }}
      </Button>
    </template>
    <div
      v-if="props.search && props.searchMode === 'filter' && query && displayItems.length === 0"
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
  padding: var(--cu-space-sm) var(--cu-space-md);
}

.cu-navbar :deep(.cu-collapse-content) {
  margin-top: var(--cu-space-xs);
}

.cu-navbar-search {
  margin-bottom: var(--cu-space-xs);
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
</style>
