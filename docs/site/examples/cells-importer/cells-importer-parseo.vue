<script setup lang="ts">
// Refleja el ejemplo "Opciones de parseo": `delimiter`, `has-header`, `strict`,
// `sheet`, `formats` y `max-size`.
import { ref } from "vue";

const imp = ref<HTMLElement | null>(null);
const salida = ref("(sin eventos todavía)");

const columns = [
  { key: "nombre", label: "Nombre", type: "string", required: true },
  { key: "edad", label: "Edad", type: "integer" },
];

type ImpEl = HTMLElement & { set: (file: File | null) => void };

function setear() {
  // Separador `;` y sin fila de encabezado: las columnas se mapean por posición.
  (imp.value as ImpEl | null)?.set(
    new File(["Ana;30\nBeto;25\n"], "sin-header.csv", { type: "text/csv" }),
  );
}

function onParse(e: Event) {
  const p = (e as CustomEvent).detail;
  salida.value = `parse → ${p.rows.length} filas · headers: [${p.headers.join(", ")}]`;
}
</script>

<template>
  <VanillaDemo :use="['CuCellsImporter']">
    <cu-cells-importer
      ref="imp"
      color="primary"
      delimiter=";"
      :hasHeader.prop="false"
      :strict="true"
      :sheet="0"
      :formats.prop="['.csv']"
      :max-size="1048576"
      placeholder="CSV sin header separado por ;"
      :columns.prop="columns"
      @parse="onParse"
    ></cu-cells-importer>
    <div class="cu-demo-controls">
      <button type="button" @click="setear">set(File)</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
