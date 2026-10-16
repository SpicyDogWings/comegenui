<script setup lang="ts">
// Refleja el ejemplo "Validación": reglas de `CellColumn` y el Collapse de errores.
// Al montar carga un CSV con errores para mostrar la tabla de validación.
import { onMounted, ref } from "vue";

const imp = ref<HTMLElement | null>(null);

const columns = [
  { key: "name", label: "Nombre", required: true },
  { key: "dni", label: "DNI", type: "integer", min: 1000000, unique: true },
  { key: "email", label: "Email", type: "email" },
  { key: "code", label: "Código", pattern: /^[A-Z]{2}-\d{3}$/ },
  { key: "state", label: "Estado", enum: ["Activo", "Inactivo"] },
];

const csvConErrores =
  "Nombre,DNI,Email,Código,Estado\n" +
  "Juan,999,juan@x.com,AB-123,Activo\n" +
  "Ana,30500000,correo,ZZ-9,Desconocido\n" +
  "Juan,30500000,otro@x.com,AB-123,Activo\n";

type ImpEl = HTMLElement & { set: (file: File | null) => void };

onMounted(() => {
  (imp.value as ImpEl | null)?.set(
    new File([csvConErrores], "con-errores.csv", { type: "text/csv" }),
  );
});
</script>

<template>
  <VanillaDemo :use="['CuCellsImporter']">
    <cu-cells-importer
      ref="imp"
      color="primary"
      placeholder="Cargá un CSV de personas"
      :columns.prop="columns"
    ></cu-cells-importer>
  </VanillaDemo>
</template>
