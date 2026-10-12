<script setup lang="ts">
// Refleja el ejemplo "Escuchar cambios y control programático": evento `change`
// y los métodos setActive()/getActive() desde JS.
import { ref } from "vue";

type CuTabsEl = HTMLElement & {
  getActive(): string;
  setActive(key: string): void;
  next(): void;
  prev(): void;
};

const tabs = [
  { key: "first", label: "First" },
  { key: "second", label: "Second" },
  { key: "third", label: "Third" },
];

const ctrl = ref<CuTabsEl | null>(null);
const salida = ref("");

function onChange(e: Event) {
  salida.value = `change → ${(e as CustomEvent).detail}`;
}
function setActive() {
  ctrl.value?.setActive("second");
  salida.value = 'setActive("second")';
}
function getActive() {
  salida.value = `getActive() → "${ctrl.value?.getActive()}"`;
}
</script>

<template>
  <VanillaDemo :use="['CuTabs']">
    <cu-tabs
      ref="ctrl"
      id="ctrl"
      variant="ghost"
      color="neutral"
      :tabs.prop="tabs"
      @change="onChange"
    >
      <div slot="first">Contenido First</div>
      <div slot="second">Contenido Second</div>
      <div slot="third">Contenido Third</div>
    </cu-tabs>
    <div class="cu-demo-controls">
      <button type="button" @click="setActive">setActive("second")</button>
      <button type="button" @click="getActive">getActive()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
