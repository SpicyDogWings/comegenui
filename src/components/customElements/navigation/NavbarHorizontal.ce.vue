<script setup lang="ts">
import { type PropType } from "vue";
import NavbarHorizontal from "../../navigation/NavbarHorizontal.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  items: { type: Array as () => unknown[], required: true },
  trigger: {
    type: String as PropType<'click' | 'hover'>,
    default: 'click',
  },
});
</script>

<template>
  <NavbarHorizontal
    :items="props.items"
    :trigger="props.trigger"
  />
</template>

<style>
@unocss-placeholder;
</style>