<script setup lang="ts">
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";

export interface ComponentDep {
  label: string;
  path: string;
}

defineProps<{
  deps: ComponentDep[];
}>();

const componentColumns = [
  { key: "label", label: "Componente" },
  { key: "path", label: "Playground" },
];
</script>

<template>
  <h3 id="api-components">Components</h3>
  <Table :columns="componentColumns" :data="deps" variant="ghost" compact>
    <template #cell-path="{ row }">
      <Button :to="row.path" variant="link" size="sm">{{ row.label }}</Button>
    </template>
  </Table>
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
