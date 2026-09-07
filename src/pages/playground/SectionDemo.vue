<script setup lang="ts">
import { computed } from "vue";
import Tabs from "@/components/Tabs.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";

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
  <Tabs color="neutral" :tabs="tabs">
    <template #preview>
      <div class="section-demo-preview">
        <slot />
      </div>
    </template>
    <template v-if="props.vueCode" #vue>
      <CodeBlock :code="props.vueCode" language="vue" variant="solid" />
    </template>
    <template v-if="props.vanillaCode" #vanilla>
      <CodeBlock :code="props.vanillaCode" language="html" variant="solid" />
    </template>
  </Tabs>
</template>

<style scoped>
/* Wrapper neutro: no altera el layout del contenido del slot */
.section-demo-preview {
  min-width: 0;
}
</style>
