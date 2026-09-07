<script setup lang="ts">
import { getCurrentInstance, type PropType } from "vue";
import Navbar from "../../navigation/Navbar.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  items: { type: Array as () => unknown[], required: true },
  search: { type: Boolean, default: false },
  searchPlaceholder: { type: String, default: 'Buscar...' },
  searchMode: {
    type: String as PropType<'filter' | 'scroll'>,
    default: 'filter',
  },
  searchFields: { type: Array as () => string[], default: () => [] },
  compact: { type: Boolean, default: false },
  compactable: { type: Boolean, default: false },
  collapsed: { type: Boolean, default: false },
  trigger: {
    type: String as PropType<'click' | 'hover'>,
    default: 'click',
  },
  responsive: { type: Boolean, default: false },
  minWidth: { type: Number, default: 768 },
  responsiveMode: {
    type: String as PropType<'auto' | 'side' | 'fullscreen'>,
    default: 'auto',
  },
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
    :min-width="props.minWidth"
    :responsive-mode="props.responsiveMode"
    :active-path="props.activePath"
    @search="ceEmit('search', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>