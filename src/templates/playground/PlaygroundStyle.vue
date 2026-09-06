<script setup lang="ts">
import { computed } from "vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import { getTokenDescription } from "@/config/css-tokens";

export interface StyleToken {
  name: string;
}

export interface SubComponentRef {
  label: string;
  path: string;
}

const props = defineProps<{
  tokens: string[];
  subComponents?: SubComponentRef[];
}>();

const styleColumns = [
  { key: "name", label: "Variable" },
  { key: "description", label: "Uso" },
];

const styleData = computed(() =>
  props.tokens.map((name) => ({
    name,
    description: getTokenDescription(name),
  }))
);
</script>

<template>
  <section id="style" class="playground-section">
    <h2>Style</h2>

    <h3 id="style-variables">CSS Variables</h3>
    <Table :columns="styleColumns" :data="styleData" variant="ghost" compact />

    <template v-if="subComponents && subComponents.length">
      <h4>Sub-componentes con estilos propios</h4>
      <Table
        :columns="[{ key: 'label', label: 'Componente' }, { key: 'path', label: 'Estilos' }]"
        :data="subComponents"
        variant="ghost"
        compact
      >
        <template #cell-path="{ row }">
          <Button :to="row.path" variant="link" size="sm">Ver estilos</Button>
        </template>
      </Table>
    </template>
  </section>
</template>
