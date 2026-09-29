<script setup lang="ts">
import { getCurrentInstance, type PropType } from "vue";
import Navbar from "../../navigation/Navbar.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  /** Estructura de navegación. **Se asigna como propiedad JS** */
  items: { type: Array as () => unknown[], required: true },
  /** Muestra el input de búsqueda */
  search: { type: Boolean, default: false },
  /** Placeholder del input de búsqueda */
  searchPlaceholder: { type: String, default: 'Buscar...' },
  /** `filter` (oculta los que no matchean) o `scroll` (resalta y hace scroll al primero que matchea) */
  searchMode: {
    type: String as PropType<'filter' | 'scroll'>,
    default: 'filter',
  },
  /** Campos del item a buscar. **Se asigna como propiedad JS.** Vacío = busca en todos los campos string */
  searchFields: { type: Array as () => string[], default: () => [] },
  /** Modo compacto: muestra solo iconos (o la inicial del label) */
  compact: { type: Boolean, default: false },
  /** Agrega un botón nativo que alterna el modo compacto */
  compactable: { type: Boolean, default: false },
  /** Los submenús arrancan colapsados en lugar de expandidos */
  collapsed: { type: Boolean, default: false },
  /** Cómo abren los submenús en modo compact (flyout): `click` o `hover` */
  trigger: {
    type: String as PropType<'click' | 'hover'>,
    default: 'click',
  },
  /** En lugar de la nav inline, muestra una hamburguesa que abre el menú en un panel lateral */
  responsive: { type: Boolean, default: false },
  /** `auto` (fullscreen en pantallas muy chicas, lateral en el resto), `side` (siempre lateral) o `fullscreen` (siempre pantalla completa) */
  responsiveMode: {
    type: String as PropType<'auto' | 'side' | 'fullscreen'>,
    default: 'auto',
  },
  /** Borde desde donde desliza el panel del responsive: `left`, `right`, `top`, `bottom` */
  sideOverPosition: {
    type: String as PropType<'left' | 'right' | 'top' | 'bottom'>,
    default: 'left',
  },
  /** Path activo manual. Si se omite, se toma de la ruta (cuando hay router) */
  activePath: { type: String, default: '' },
});

const instance = getCurrentInstance();
function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = el?.getRootNode()?.host || el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}
</script>

<template>
  <Navbar
    :items="props.items"
    :search="props.search"
    :search-placeholder="props.searchPlaceholder"
    :search-mode="props.searchMode"
    :search-fields="props.searchFields"
    :compact="props.compact"
    :compactable="props.compactable"
    :collapsed="props.collapsed"
    :trigger="props.trigger"
    :responsive="props.responsive"
    :responsive-mode="props.responsiveMode"
    :side-over-position="props.sideOverPosition"
    :active-path="props.activePath"
    @search="ceEmit('search', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>