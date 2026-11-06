<script setup lang="ts">
import { ref } from "vue";
import CellsImporter from "@/components/form/CellsImporter.vue";

const importer = ref<InstanceType<typeof CellsImporter> | null>(null);
const salida = ref("(sin eventos todavía)");

const columns = [
  { key: "producto", label: "Producto", type: "string", required: true },
  { key: "precio", label: "Precio", type: "number", min: 0 },
];

function onParse(p: { rows: unknown[]; fileName: string }) {
  salida.value = `parse → ${p.rows.length} fila(s) · ${p.fileName}`;
}

function setear() {
  importer.value?.set(
    new File(["Producto,Precio\nTeclado,49.9\nMouse,19.5\n"], "productos.csv", {
      type: "text/csv",
    }),
  );
}

function abrir() {
  importer.value?.trigger();
}

function limpiar() {
  importer.value?.reset();
  salida.value = "reset() → sin archivo";
}

function enfocar() {
  importer.value?.focus();
  salida.value = "focus() → la zona tomó foco";
}
</script>

<template>
  <!-- inputType="zone" usa la zona de arrastre; formats/maxSize se propagan al FileInput/Zone. -->
  <CellsImporter
    ref="importer"
    input-type="zone"
    color="primary"
    variant="outlined"
    :columns="columns"
    :formats="['.csv']"
    :max-size="1048576"
    placeholder="Arrastrá tu CSV de productos (máx 1 MB)"
    @parse="onParse"
  />
  <div class="cu-demo-controls">
    <button type="button" @click="setear">set(File)</button>
    <button type="button" @click="abrir">trigger()</button>
    <button type="button" @click="limpiar">reset()</button>
    <button type="button" @click="enfocar">focus()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
