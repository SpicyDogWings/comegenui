<script setup lang="ts">
import { getCurrentInstance, type PropType } from "vue";
import Card from "../../information/Card.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
  variant: {
    type: String,
    default: "ghost",
  },
  layout: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: "vertical",
  },
  title: String,
  subtitle: String,
  image: String,
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
  <Card
    :color="props.color"
    :variant="props.variant"
    :layout="props.layout"
    :title="props.title"
    :subtitle="props.subtitle"
    :image="props.image"
    @click="ceEmit('click', $event)"
  >
    <template #media>
      <slot name="media"></slot>
    </template>
    <template #header>
      <slot name="header"></slot>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
    <slot></slot>
  </Card>
</template>

<style>
@unocss-placeholder;
:host {
  display: block;
  width: 100%;
}
</style>
