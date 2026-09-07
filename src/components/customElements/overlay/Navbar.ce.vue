<script setup lang="ts">
import { ref, getCurrentInstance, type PropType } from "vue";
import Navbar from "../../overlay/Navbar.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  items: { type: Array as () => unknown[], required: true },
  orientation: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'vertical',
  },
  search: { type: Boolean, default: false },
  searchPlaceholder: { type: String, default: 'Buscar...' },
  searchMode: {
    type: String as PropType<'filter' | 'scroll'>,
    default: 'filter',
  },
  searchFields: { type: Array as () => string[], default: () => [] },
});

const navbarRef = ref<InstanceType<typeof Navbar> | null>(null);

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
    ref="navbarRef"
    :items="props.items"
    :orientation="props.orientation"
    :search="props.search"
    :search-placeholder="props.searchPlaceholder"
    :search-mode="props.searchMode"
    :search-fields="props.searchFields"
    @search="ceEmit('search', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>
