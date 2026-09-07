import { computed, ref, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export interface NavItem {
  label: string
  path?: string
  icon?: string
  children?: NavItem[]
}

interface UseNavbarOptions {
  items: () => NavItem[]
  search: () => boolean
  searchMode: () => 'filter' | 'scroll'
  searchFields: () => string[]
  /** Item global a resaltar en modo scroll (lo calcula la raíz y lo propagan
   * las instancias recursivas). Si no se pasa, lo calcula el composable. */
  highlightItem?: () => NavItem | null
  onSearch?: (query: string) => void
}

/**
 * Lógica compartida entre las navs vertical (Collapse) y horizontal (Dropdown):
 * búsqueda (filter/scroll), item activo por ruta, resaltado y scroll automático.
 */
export function useNavbar(options: UseNavbarOptions) {
  const route = useRoute()
  const query = ref('')
  const navRef = ref<HTMLElement | null>(null)

  watch(query, (value) => options.onSearch?.(value))

  const normalize = (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u0302\u0304-\u036f]/g, '').toLowerCase()

  const normalizedQuery = computed(() => normalize(query.value.trim()))

  const searchActive = computed(() => options.search() && normalizedQuery.value.length > 0)

  function itemMatches(item: NavItem, q: string): boolean {
    const keys = options.searchFields().length
      ? options.searchFields()
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
    if (!searchActive.value || options.searchMode() !== 'filter') return options.items()
    return filterTree(options.items(), normalizedQuery.value)
  })

  const firstMatch = computed<NavItem | null>(() => {
    if (!options.search() || options.searchMode() !== 'scroll') return null
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
    return dfs(options.items())
  })

  const highlightTarget = computed<NavItem | null>(() => options.highlightItem?.() ?? firstMatch.value)

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
    return findActive(options.items())
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

  return { query, navRef, displayItems, highlightTarget, activeItem }
}