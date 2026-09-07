<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, type PropType } from 'vue'
import { useRoute } from 'vue-router'
import SideOver from '@/components/overlay/SideOver.vue'
import NavbarList from '@/components/navigation/NavbarList.vue'
import { useNavbar, type NavItem } from '@/composables/useNavbar'

export interface NavbarItem extends NavItem {}

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
  // collapsed: los Collapse arrancan colapsados en lugar de expandidos.
  collapsed: { type: Boolean, required: false, default: false },
  // Cómo abren los submenús en modo compact (flyout): "click" (default) o "hover".
  trigger: {
    type: String as PropType<'click' | 'hover'>,
    required: false,
    default: 'click',
  },
  // Responsive: mide el ancho del CONTENEDOR (no el viewport). Cuando cae por
  // debajo de minWidth, la nav desaparece y queda solo un botón hamburguesa que
  // abre el menú en un SideOver. Solo aplica en la instancia raíz.
  responsive: { type: Boolean, required: false, default: false },
  // Umbral de ancho del contenedor bajo el cual se activa el modo responsive.
  minWidth: { type: Number, required: false, default: 768 },
  // Cómo se muestra el SideOver en modo responsive:
  //   auto (default): fullscreen en contenedores muy angostos (<480px), lateral en el resto.
  //   side: siempre lateral (izquierda).
  //   fullscreen: siempre pantalla completa.
  responsiveMode: {
    type: String as PropType<'auto' | 'side' | 'fullscreen'>,
    required: false,
    default: 'auto',
    validator: (value: string) => ['auto', 'side', 'fullscreen'].includes(value),
  },
  // Path activo manual (para vanilla/CE sin vue-router). Si se omite, se toma
  // de useRoute() cuando hay router.
  activePath: { type: String, required: false, default: '' },
  // Interno: item global a resaltar en modo scroll (lo calcula la raíz y se
  // propaga a las instancias recursivas).
  highlightItem: { type: Object as () => NavItem | null, required: false, default: null },
})

const emit = defineEmits<{ (e: 'search', query: string): void }>()

const {
  query,
  displayItems,
  highlightTarget,
  activeItem,
} = useNavbar({
  items: () => props.items,
  search: () => props.search,
  searchMode: () => props.searchMode,
  searchFields: () => props.searchFields,
  activePath: () => (props.activePath || undefined),
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

// --- Modo responsive: mide el contenedor y muestra hamburguesa + SideOver ---
const wrapperRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const isNarrow = ref(false)
const open = ref(false)
let ro: ResizeObserver | null = null

function onResize() {
  if (!wrapperRef.value) return
  containerWidth.value = wrapperRef.value.getBoundingClientRect().width
  isNarrow.value = containerWidth.value < props.minWidth
  if (!isNarrow.value) open.value = false
}

onMounted(() => {
  if (!props.responsive) return
  ro = new ResizeObserver(onResize)
  if (wrapperRef.value) ro.observe(wrapperRef.value)
  onResize()
})

onUnmounted(() => {
  ro?.disconnect()
})

const sideOverFullscreen = computed(() =>
  props.responsiveMode === 'fullscreen' || (props.responsiveMode === 'auto' && containerWidth.value < 480),
)

let route: { path: string } | null = null
try {
  route = useRoute()
} catch {
  route = null
}
watch(() => route?.path, () => { open.value = false })
</script>

<template>
  <div
    ref="wrapperRef"
    class="cu-navbar-responsive"
    :class="{ 'is-responsive': responsive }"
  >
    <button
      v-if="responsive && isNarrow"
      type="button"
      class="cu-navbar-responsive-toggle"
      :aria-expanded="open"
      aria-label="Abrir menú"
      @click="open = true"
    >
      ☰
    </button>

    <SideOver
      v-if="responsive && isNarrow"
      v-model:model-value="open"
      position="left"
      size="264px"
      :fullscreen="sideOverFullscreen"
    >
      <NavbarList
        :items="displayItems"
        :search="props.search"
        :search-placeholder="props.searchPlaceholder"
        :search-mode="props.searchMode"
        :search-fields="props.searchFields"
        :compact="effectiveCompact"
        :compactable="props.compactable"
        :collapsed="props.collapsed"
        :trigger="props.trigger"
        :active-path="props.activePath"
        :highlight-target="highlightTarget"
        :active-item="activeItem"
        v-model:query="query"
        @toggle-compact="toggleCompact"
      />
    </SideOver>

    <NavbarList
      v-if="!responsive || !isNarrow"
      :items="displayItems"
      :search="props.search"
      :search-placeholder="props.searchPlaceholder"
      :search-mode="props.searchMode"
      :search-fields="props.searchFields"
      :compact="effectiveCompact"
      :compactable="props.compactable"
      :collapsed="props.collapsed"
      :trigger="props.trigger"
      :active-path="props.activePath"
      :highlight-target="highlightTarget"
      :active-item="activeItem"
      v-model:query="query"
      @toggle-compact="toggleCompact"
    />
  </div>
</template>

<style scoped>
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
</style>