<script setup lang="ts">
import { inject } from "vue";
import { chromeKey } from "../chrome";

export interface ComponentDep {
  label: string;
  path: string;
}

defineProps<{
  deps: ComponentDep[];
}>();

const chrome = inject(chromeKey)!;

const componentColumns = [
  { key: "label", label: "Componente" },
  { key: "path", label: "Playground" },
];
</script>

<template>
  <h3 id="api-components">Components</h3>
  <component :is="chrome.table" :columns="componentColumns" :data="deps" variant="ghost" compact>
    <template #cell-path="{ row }">
      <component :is="chrome.button" :to="row.path" variant="link" size="sm">{{ row.label }}</component>
    </template>
  </component>
  <p class="playground-desc">
    Hacé clic en el componente para ir a su playground.
  </p>
</template>

<style>
.playground-desc {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text);
  opacity: 0.7;
  margin-bottom: 1rem;
}
</style>