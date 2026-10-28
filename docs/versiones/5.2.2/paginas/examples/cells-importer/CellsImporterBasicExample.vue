<script setup lang="ts">
import { ref } from "vue";
import CellsImporter from "@/components/form/CellsImporter.vue";

const importer = ref<InstanceType<typeof CellsImporter> | null>(null);
const eventos = ref<string[]>([]);

const columns = [
  { key: "nombre", label: "Nombre", type: "string", required: true },
  { key: "edad", label: "Edad", type: "integer", min: 0, max: 120 },
  { key: "email", label: "Email", type: "email" },
];

function log(msg: string) {
  eventos.value = [...eventos.value.slice(-6), msg];
}

const csv = () =>
  new File(
    ["Nombre,Edad,Email\nAna,30,ana@example.com\nBeto,200,no-email\n"],
    "personas.csv",
    { type: "text/csv" },
  );

function onParse(p: { rows: unknown[]; headers: string[]; fileName: string }) {
  log(`parse → ${p.rows.length} filas · headers: [${p.headers.join(", ")}] · ${p.fileName}`);
}

function onError(errors: unknown[]) {
  log(`error → ${errors.length} error(es)`);
}

function onChange(file: File | null) {
  log(`change → ${file?.name ?? "null"}`);
}

function setear() {
  importer.value?.set(csv());
}

function leerFilas() {
  log(`getRows() → ${JSON.stringify(importer.value?.getRows() ?? [])}`);
}

function leerHeaders() {
  log(`getHeaders() → [${(importer.value?.getHeaders() ?? []).join(", ")}]`);
}

function leerErrores() {
  log(`getErrors() → ${JSON.stringify(importer.value?.getErrors() ?? [])}`);
}

function leerArchivo() {
  log(`getFile() → ${importer.value?.getFile()?.name ?? "null"}`);
}

function revalidar() {
  log(`validate() → ${importer.value?.validate().length ?? 0} error(es)`);
}
</script>

<template>
  <CellsImporter
    ref="importer"
    :columns="columns"
    placeholder="Cargá un CSV de personas"
    @parse="onParse"
    @error="onError"
    @change="onChange"
  />
  <div class="cu-demo-controls">
    <button type="button" @click="setear">set(File)</button>
    <button type="button" @click="leerFilas">getRows()</button>
    <button type="button" @click="leerHeaders">getHeaders()</button>
    <button type="button" @click="leerErrores">getErrors()</button>
    <button type="button" @click="leerArchivo">getFile()</button>
    <button type="button" @click="revalidar">validate()</button>
  </div>
  <pre class="cu-demo-output">{{ eventos.join("\n") || "(sin eventos todavía)" }}</pre>
</template>
