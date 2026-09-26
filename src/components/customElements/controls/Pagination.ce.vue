<script setup lang="ts">
import Pagination from "../../controls/Pagination.vue";
import { getCurrentInstance, type PropType } from "vue";

const props = defineProps({
  /** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  /** `outlined`, `soft`, `ghost`, `subtle`, `none` */
  variant: {
    type: String as PropType<'outlined' | 'soft' | 'ghost' | 'subtle' | 'none'>,
    required: false,
    default: "soft",
  },
  /** Página actual (atributo HTML: `current-page`) */
  currentPage: {
    type: Number,
    required: false,
    default: 1,
  },
  /** Total de páginas (atributo HTML: `total-pages`) */
  totalPages: {
    type: Number,
    required: false,
    default: 1,
  },
  /** Total de items, útil para mostrar "X–Y de Z" (atributo HTML: `total-items`) */
  totalItems: {
    type: Number,
    required: false,
    default: 0,
  },
  /** Items por página (atributo HTML: `items-per-page`) */
  itemsPerPage: {
    type: Number,
    required: false,
    default: 10,
  },
  /** Muestra el selector de tamaño de página (atributo HTML: `show-page-size`) */
  showPageSize: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** Opciones del selector (atributo HTML: `page-size-options`) */
  pageSizeOptions: {
    type: Array as () => number[],
    required: false,
    default: () => [5, 10, 20, 50],
  },
  /** Muestra botones "primera" y "última" página (atributo HTML: `show-first-and-last`) */
  showFirstAndLast: {
    type: Boolean,
    required: false,
    default: false,
  },
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
  <Pagination
    :color="props.color"
    :variant="props.variant"
    :current-page="props.currentPage"
    :total-pages="props.totalPages"
    :total-items="props.totalItems"
    :items-per-page="props.itemsPerPage"
    :show-page-size="props.showPageSize"
    :page-size-options="props.pageSizeOptions"
    :show-first-and-last="props.showFirstAndLast"
    @update:current-page="ceEmit('update:currentPage', $event)"
    @update:items-per-page="ceEmit('update:itemsPerPage', $event)"
  />
</template>

<style scoped>
</style>
