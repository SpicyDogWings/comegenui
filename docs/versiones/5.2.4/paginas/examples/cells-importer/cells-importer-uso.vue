<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": columnas con validaciones, plantilla,
// eventos `parse` / `error` y carga programática con `set()` / `getRows()`.
import { onMounted, ref } from "vue";

const imp = ref<HTMLElement | null>(null);
const salida = ref("(sin eventos todavía)");

const columns = [
  { key: "name", label: "Nombre", required: true },
  { key: "dni", label: "DNI", type: "integer", min: 1000000, unique: true },
  { key: "email", label: "Email", type: "email" },
  { key: "code", label: "Código", pattern: /^[A-Z]{2}-\d{3}$/ },
  { key: "state", label: "Estado", enum: ["Activo", "Inactivo"] },
  {
    key: "note",
    label: "Nota",
    maxLength: 200,
    validate: (value: unknown, row: Record<string, unknown>) =>
      value && Number(row.dni) < 0 ? "El DNI debe ser positivo" : true,
  },
];

const template = { enabled: true, type: "xlsx" as const, filename: "plantilla" };

type ImpEl = HTMLElement & {
  set: (file: File) => void;
  getRows: () => unknown[];
};

function el(): ImpEl | null {
  return imp.value as unknown as ImpEl | null;
}

function log(msg: string) {
  salida.value = msg;
}

function csv() {
  return new File(
    [
      "Nombre,DNI,Email,Código,Estado,Nota\n" +
        "Juan,30500000,juan@x.com,AB-123,Activo,ok\n" +
        "Ana,99999999,correo,ZZ-9,Desconocido,",
    ],
    "demo.csv",
    { type: "text/csv" },
  );
}

function setear() {
  el()?.set(csv());
}

function leerFilas() {
  log(`getRows() → ${JSON.stringify(el()?.getRows() ?? [])}`);
}

onMounted(() => {
  imp.value?.addEventListener("parse", (ev) => {
    log(`parse → ${(ev as CustomEvent).detail.rows.length} filas`);
  });
  imp.value?.addEventListener("error", (ev) => {
    log(`error → ${(ev as CustomEvent).detail.length} error(es)`);
  });
});
</script>

<template>
  <VanillaDemo :use="['CuCellsImporter']">
    <cu-cells-importer
      ref="imp"
      placeholder="Cargá un CSV de personas"
      :columns.prop="columns"
      :template.prop="template"
    ></cu-cells-importer>
    <div class="cu-demo-controls">
      <button type="button" @click="setear">set(File)</button>
      <button type="button" @click="leerFilas">getRows()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
