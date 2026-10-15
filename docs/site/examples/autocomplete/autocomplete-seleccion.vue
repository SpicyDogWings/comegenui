<script setup lang="ts">
// Refleja el ejemplo "Selección": los eventos `select` (al elegir un item) y `blur`
// (al salir del campo).
import { ref } from "vue";

const items = [
  { label: "Argentina" },
  { label: "Brasil" },
  { label: "Chile" },
];

const salida = ref("(sin eventos todavía)");

function onSelect(e: Event) {
  salida.value = `select → ${JSON.stringify((e as CustomEvent).detail)}`;
}

function onBlur() {
  salida.value = "blur → el foco salió del campo";
}
</script>

<template>
  <VanillaDemo :use="['CuAutocomplete']">
    <cu-autocomplete
      placeholder="Buscá un país..."
      :items.prop="items"
      @select="onSelect"
      @blur="onBlur"
    ></cu-autocomplete>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
