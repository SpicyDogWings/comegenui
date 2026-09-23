<script setup lang="ts">
import { computed, inject } from "vue";
import { chromeKey } from "../chrome";

interface TabItem {
  key: string;
  label: string;
  keepAlive?: boolean;
}

const props = defineProps<{
  /** Snippet de uso en Vue (SFC). Si se omite, no se muestra el tab. */
  vueCode?: string;
  /** Snippet de uso en vanilla (HTML plano + custom elements). Si se omite, no se muestra el tab. */
  vanillaCode?: string;
}>();

const chrome = inject(chromeKey)!;

const tabs = computed<TabItem[]>(() => {
  // keepAlive en las 3: el componente en vivo del Preview no pierde estado
  // al mirar el código Vue/Vanilla y volver.
  const items: TabItem[] = [{ key: "preview", label: "Preview", keepAlive: true }];
  if (props.vueCode) items.push({ key: "vue", label: "Vue", keepAlive: true });
  if (props.vanillaCode) items.push({ key: "vanilla", label: "Vanilla", keepAlive: true });
  return items;
});
</script>

<template>
  <component :is="chrome.tabs" color="neutral" :tabs="tabs">
    <template #preview>
      <div class="section-demo-preview">
        <slot />
      </div>
    </template>
    <template v-if="props.vueCode" #vue>
      <component :is="chrome.codeBlock" :code="props.vueCode" language="vue" />
    </template>
    <template v-if="props.vanillaCode" #vanilla>
      <component :is="chrome.codeBlock" :code="props.vanillaCode" language="html" />
    </template>
  </component>
</template>

<style scoped>
/* Wrapper neutro: no altera el layout del contenido del slot */
.section-demo-preview {
  min-width: 0;
}
</style>