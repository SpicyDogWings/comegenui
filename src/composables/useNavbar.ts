import { computed, ref, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { normalizeText, matchesFields } from '@/utils/search'

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
  /** Path activo manual (para vanilla/CE sin vue-router). Si se omite, se usa
   * useRoute() cuando hay router. */
  activePath?: () => string | undefined
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
  // En vanilla (Custom Element) no hay vue-router: useRoute() tira. Se guarda y
  // se usa el path manual (activePath) cuando no hay router.
  let route: { path: string } | null = null
  try {
    route = useRoute()
  } catch {
    route = null
  }
  const query = ref('')
  const navRef = ref<HTMLElement | null>(null)

  /**
   * Items del consumidor. En el Custom Element `items` llega como propiedad JS
   * *después* del upgrade, así que hasta entonces la prop (requerida) es
   * `undefined`: recorrerla tiraba `items is not iterable` dentro del render y el
   * elemento quedaba con el shadow DOM vacío para siempre (no se recuperaba al
   * asignar los items). Mismo patrón que el resto de props "de datos" del CE.
   */
  const navItems = (): NavItem[] => options.items() ?? []

  watch(query, (value) => options.onSearch?.(value))

  const normalizedQuery = computed(() => normalizeText(query.value.trim()))

  const searchActive = computed(() => options.search() && normalizedQuery.value.length > 0)

  function itemMatches(item: NavItem, q: string): boolean {
    const keys = options.searchFields().length
      ? options.searchFields()
      : Object.keys(item).filter((k) => {
          if (k === 'children') return false
          return typeof (item as Record<string, unknown>)[k] !== 'function'
        })
    return matchesFields(item as Record<string, unknown>, q, { fields: keys })
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
    if (!searchActive.value || options.searchMode() !== 'filter') return navItems()
    return filterTree(navItems(), normalizedQuery.value)
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
    return dfs(navItems())
  })

  const highlightTarget = computed<NavItem | null>(() => options.highlightItem?.() ?? firstMatch.value)

  const activeItem = computed(() => {
    const currentPath = options.activePath?.() ?? route?.path
    if (currentPath == null) return null
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
    return findActive(navItems())
  })

  /**
   * Elemento marcado (`data-navbar-active` / `data-navbar-match`), buscado dentro de
   * esta nav: en el Custom Element el marcador vive en un shadow root (desde
   * `document` no se ve, así que el scroll del activo nunca ocurría) y con dos
   * instancias en la misma página el `document.querySelector` global desplazaba la
   * primera. Los consumidores que no exponen `navRef` conservan el alcance de documento.
   */
  function findMarker(attr: 'data-navbar-active' | 'data-navbar-match'): HTMLElement | null {
    const root = navRef.value
    if (root) return root.querySelector<HTMLElement>(`[${attr}]`)
    return document.querySelector<HTMLElement>(`[${attr}]`)
  }

  function scrollToActive() {
    nextTick(() => {
      const el = findMarker('data-navbar-active')
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
    findMarker('data-navbar-match')?.scrollIntoView({ block: 'nearest' })
  })

  onMounted(() => {
    if (activeItem.value) scrollToActive()
  })

  return { query, navRef, displayItems, highlightTarget, activeItem }
}