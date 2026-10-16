<script setup lang="ts">
// Refleja el ejemplo "Selector": `input-type` elige el `<cu-file-input>` compacto
// o la zona drag & drop (`zone`).
import { ref } from "vue";

const products = ref<HTMLElement | null>(null);
const salida = ref("(sin eventos todavía)");

const columns = [
  { key: "producto", label: "Producto", type: "string", required: true },
  { key: "precio", label: "Precio", type: "number", min: 0 },
];

function onParse(e: Event) {
  const p = (e as CustomEvent).detail;
  salida.value = `parse → ${p.rows.length} fila(s) · ${p.fileName}`;
}
</script>

<template>
  <VanillaDemo :use="['CuCellsImporter']">
    <cu-cells-importer
      input-type="zone"
      color="primary"
      placeholder="Arrastrá tu CSV de productos"
      :formats.prop="['.csv']"
      :max-size="1048576"
      :columns.prop="columns"
      @parse="onParse"
    ></cu-cells-importer>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
