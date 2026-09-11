<script setup lang="ts">
import { computed, inject } from "vue";
import { chromeKey } from "../chrome";
import { playgroundKey } from "../keys";

export interface StyleToken {
  name: string;
}

export interface SubComponentRef {
  label: string;
  path: string;
}

const props = defineProps<{
  tokens: string[];
  classes?: string[];
  subComponents?: SubComponentRef[];
}>();

const chrome = inject(chromeKey)!;
const registry = inject(playgroundKey, null);

const styleColumns = [
  { key: "name", label: "Variable" },
  { key: "description", label: "Uso" },
];

const classColumns = [{ key: "name", label: "Clase" }];

const styleData = computed(() =>
  props.tokens.map((name) => ({
    name,
    description: registry?.getTokenDescription(name) ?? name,
  }))
);

const classData = computed(() => (props.classes ?? []).map((name) => ({ name })));
</script>

<template>
  <section id="style" class="playground-section">
    <h2>Style</h2>

    <template v-if="tokens.length">
      <h3 id="style-variables">CSS Variables</h3>
      <component :is="chrome.table" :columns="styleColumns" :data="styleData" variant="ghost" compact />
    </template>

    <template v-if="!tokens.length && (!subComponents || !subComponents.length)">
      <h3 id="style-variables">CSS Variables</h3>
      <p class="playground-desc">No define tokens propios — usa los tokens compartidos del sistema.</p>
    </template>

    <template v-if="classes && classes.length">
      <h3 id="style-classes">CSS Classes</h3>
      <component :is="chrome.table" :columns="classColumns" :data="classData" variant="ghost" compact>
        <template #cell-name="{ row }">
          <code class="playground-code">{{ row.name }}</code>
        </template>
      </component>
    </template>

    <template v-if="subComponents && subComponents.length">
      <h4 v-if="tokens.length">Sub-componentes con estilos propios</h4>
      <h3 v-else id="style-variables">Estilos de sub-componentes</h3>
      <component
        :is="chrome.table"
        :columns="[{ key: 'label', label: 'Componente' }, { key: 'path', label: 'Estilos' }]"
        :data="subComponents"
        variant="ghost"
        compact
      >
        <template #cell-path="{ row }">
          <component :is="chrome.button" :to="row.path" variant="link" size="sm">Ver estilos</component>
        </template>
      </component>
    </template>
  </section>
</template>

<style>
.playground-desc {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text);
  opacity: 0.7;
  margin-bottom: 1rem;
}
</style>