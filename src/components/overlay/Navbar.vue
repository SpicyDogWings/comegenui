<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, type PropType } from 'vue'
import { useRoute } from 'vue-router'
import Collapse from '@/components/overlay/Collapse.vue'
import Dropdown from '@/components/overlay/Dropdown.vue'
import Button from '@/components/buttons/Button.vue'
import Input from '@/components/form/Input.vue'
import LucideChevronDown from '@/components/icons/LucideChevronDown.vue'

export interface NavItem {
  label: string
  path?: string
  children?: NavItem[]
}

const props = defineProps({
  items: { type: Array as () => NavItem[], required: true },
  orientation: {
    type: String as PropType<'vertical' | 'horizontal'>,
    required: false,
    default: 'vertical',
    validator: (value: string) => ['vertical', 'horizontal'].includes(value),
  },
  search: { type: Boolean, required: false, default: false },
  searchPlaceholder: { type: String, required: false, default: 'Buscar...' },
  searchMode: {
    type: String as PropType<'filter' | 'scroll'>,
    required: false,
    default: 'filter',
    validator: (value: string) => ['filter', 'scroll'].includes(value),
  },
  searchFields: { type: Array as () => string[], required: false, default: () => [] },
  highlightItem: { type: Object as () => NavItem | null, required: false, default: null },
})

const emit = defineEmits<{ (e: 'search', query: string): void }>()

const route = useRoute()

const query = ref('')

watch(query, (value) => emit('search', value))

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
      el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' })
      return
    }

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

onMounted(() => {
  if (activeItem.value) scrollToActive()
})

const isHorizontal = computed(() => props.orientation === 'horizontal')
</script>

<template>
  <nav
    ref="navRef"
    class="cu-navbar"
    :class="{
      'cu-navbar--vertical': !isHorizontal,
      'cu-navbar--horizontal': isHorizontal,
    }"
  >
    <div v-if="search" class="cu-navbar-search">
      <Input v-model="query" :placeholder="searchPlaceholder" />
    </div>

    <!-- Vertical orientation: Collapse for submenus -->
    <template v-if="!isHorizontal">
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
            orientation="vertical"
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
    </template>

    <!-- Horizontal orientation: Dropdown for submenus -->
    <template v-else>
      <template v-for="item in displayItems" :key="item.path || item.label">
        <Dropdown
          v-if="item.children?.length"
          :class="{ 'cu-navbar-item--match': highlightTarget === item, 'cu-navbar-item--active': activeItem === item }"
          :data-navbar-match="highlightTarget === item ? '' : undefined"
          :data-navbar-active="activeItem === item ? '' : undefined"
        >
          <template #toggle="{ toggle: t }">
            <button class="cu-navbar-dropdown-trigger" @click="t">
              {{ item.label }}
              <LucideChevronDown :width="14" :height="14" class="cu-navbar-chevron" />
            </button>
          </template>
          <div class="cu-navbar-dropdown-menu">
            <template v-for="child in item.children" :key="child.path || child.label">
              <Dropdown
                v-if="child.children?.length"
                position="right"
                align="start"
              >
                <template #toggle="{ toggle: t2 }">
                  <button class="cu-navbar-dropdown-item" @click="t2">
                    {{ child.label }}
                    <span class="cu-navbar-arrow">›</span>
                  </button>
                </template>
                <div class="cu-navbar-dropdown-menu">
                  <Button
                    v-for="subchild in child.children"
                    :key="subchild.path || subchild.label"
                    :to="subchild.path!"
                    variant="ghost"
                    class="cu-navbar-dropdown-item"
                  >
                    {{ subchild.label }}
                  </Button>
                </div>
              </Dropdown>
              <Button
                v-else
                :to="child.path!"
                variant="ghost"
                class="cu-navbar-dropdown-item"
              >
                {{ child.label }}
              </Button>
            </template>
          </div>
        </Dropdown>
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
  gap: var(--cu-space-2xs);
  padding: var(--cu-space-2xs);
}

.cu-navbar--vertical {
  flex-direction: column;
}

.cu-navbar--horizontal {
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
}

.cu-navbar :deep(.cu-button) {
  justify-content: flex-start;
  text-align: left;
  padding: var(--cu-space-sm) var(--cu-space-md);
}

.cu-navbar--vertical :deep(.cu-button) {
  justify-content: flex-start;
  text-align: left;
  padding: var(--cu-space-sm) var(--cu-space-md);
}

.cu-navbar-search {
  margin-bottom: var(--cu-space-xs);
}

.cu-navbar--horizontal .cu-navbar-search {
  width: 100%;
  margin-bottom: 0;
  margin-right: var(--cu-space-sm);
}

.cu-navbar--vertical :deep(.cu-collapse-content) {
  margin-top: var(--cu-space-xs);
}

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

/* Horizontal dropdown styles */
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
  color: var(--cu-color-neutral-text);
  border-radius: var(--cu-radius-sm);
  transition: background-color 0.15s ease;
}

.cu-navbar-dropdown-trigger:hover {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.cu-navbar-chevron {
  transition: transform 0.2s ease;
}

.cu-navbar-dropdown-menu {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-2xs);
  min-width: 180px;
}

.cu-navbar-dropdown-item {
  justify-content: space-between;
  width: 100%;
  text-align: left;
  padding: var(--cu-space-xs) var(--cu-space-sm);
  font-size: var(--cu-font-size-sm);
  border-radius: var(--cu-radius-sm);
}

.cu-navbar-dropdown-item:hover {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.cu-navbar-arrow {
  font-size: var(--cu-font-size-lg);
  line-height: 1;
  opacity: 0.5;
}

.cu-navbar--horizontal :deep(.cu-dropdown-panel) {
  padding: var(--cu-space-xs);
}
</style>
