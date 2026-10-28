<script setup lang="ts">
import { ref } from "vue";
import CellsImporter from "@/components/form/CellsImporter.vue";

const importer = ref<InstanceType<typeof CellsImporter> | null>(null);
const salida = ref("(sin eventos todavía)");

const columns = [
  { key: "nombre", label: "Nombre", type: "string", required: true },
  { key: "edad", label: "Edad", type: "integer" },
];

function onParse(p: { rows: unknown[]; headers: string[] }) {
  salida.value = `parse → ${p.rows.length} filas · headers: [${p.headers.join(", ")}]`;
}

function setear() {
  // Sin header, separador `;`: las columnas se mapean por posición.
  importer.value?.set(
    new File(["Ana;30\nBeto;25\n"], "sin-header.csv", { type: "text/csv" }),
  );
}
</script>

<template>
  <CellsImporter
    ref="importer"
    :columns="columns"
    delimiter=";"
    :has-header="false"
    :strict="true"
    :sheet="0"
    placeholder="CSV sin header separado por ;"
    @parse="onParse"
  />
  <div class="cu-demo-controls">
    <button type="button" @click="setear">set(File)</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
