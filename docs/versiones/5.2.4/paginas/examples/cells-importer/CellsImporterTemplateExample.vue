<script setup lang="ts">
import { ref } from "vue";
import CellsImporter from "@/components/form/CellsImporter.vue";

const importer = ref<InstanceType<typeof CellsImporter> | null>(null);
const salida = ref("(sin llamadas todavía)");

const columns = [
  { key: "nombre", label: "Nombre", type: "string", required: true },
  { key: "email", label: "Email", type: "email" },
];

const template = { enabled: true, type: "csv" as const, filename: "plantilla-personas" };

function descargar() {
  importer.value?.downloadTemplate();
  salida.value = "downloadTemplate() → plantilla CSV descargada";
}
</script>

<template>
  <!-- Con template.enabled el componente ya renderiza su propio botón; acá se cubre el método. -->
  <CellsImporter
    ref="importer"
    :columns="columns"
    color="success"
    :template="template"
    placeholder="Archivo para importar"
  />
  <div class="cu-demo-controls">
    <button type="button" @click="descargar">downloadTemplate()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
