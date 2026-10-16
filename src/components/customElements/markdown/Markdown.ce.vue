<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import Markdown from '../../markdown/Markdown.vue'

// Los tokens del tema los aporta el host (CSS custom properties `--cu-color-*`), no este
// componente: acá antes se inyectaba un `:host { … }` con el tema default, que pisaba el tema
// del host y lo dejaba siempre en `light`. Ver AGENTS.md.
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

const markdownRef = ref<InstanceType<typeof Markdown> | null>(null)

defineExpose({
  headingIds: () => markdownRef.value?.headingIds() ?? [],
})
</script>

<template>
  <Markdown ref="markdownRef" @parsed="ceEmit('parsed', $event)">
    <!-- Contenido markdown a renderizar. Se pasa como texto dentro del tag. -->
    <slot />
  </Markdown>
</template>

<style>
@unocss-placeholder;
</style>
