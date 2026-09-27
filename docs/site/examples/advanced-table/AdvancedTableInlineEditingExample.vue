<script setup lang="ts">
import { ref } from "vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import Button from "@/components/buttons/Button.vue";

const inlineEditing = ref(false);

const columns = ref([
  { key: "nombre", label: "Nombre", editable: true, inlineEdit: true },
  { key: "email", label: "Correo", editable: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, singleClick: true },
  {
    key: "rol",
    label: "Rol",
    editable: true,
    inputType: "select",
    singleClick: true,
    selectOptions: [
      { value: "admin", label: "Administrador" },
      { value: "editor", label: "Editor" },
      { value: "viewer", label: "Visor" },
    ],
  },
  { key: "edad", label: "Edad", editable: /^\d{1,3}$/, align: "center" },
]);

const data = ref([
  { nombre: "Ana Torres", email: "ana@ejemplo.com", rol: "admin", edad: "34" },
  { nombre: "Luis Gómez", email: "luis@ejemplo.com", rol: "editor", edad: "28" },
  { nombre: "Sofía Ruiz", email: "sofia@ejemplo.com", rol: "viewer", edad: "41" },
]);

const lastEdit = ref("Todavía no se editó ninguna celda");

function onEditStart(e: any) {
  lastEdit.value = `edit-start → { index: ${e.index}, column: "${e.column.key}" }`;
}
function onEditSave(e: any) {
  lastEdit.value = `edit-save → { index: ${e.index}, column: "${e.column.key}", value: ${JSON.stringify(e.value)} }`;
}
function onEditCancel(e: any) {
  lastEdit.value = `edit-cancel → { index: ${e.index}, column: "${e.column.key}" }`;
}
function onEditError(e: any) {
  lastEdit.value = `edit-error → { index: ${e.index}, column: "${e.column.key}", value: ${JSON.stringify(e.value)} }`;
}
</script>

<template>
  <div class="cu-demo-controls">
    <Button variant="soft" @click="inlineEditing = !inlineEditing">
      {{ inlineEditing ? "Volver al modo lápiz" : "Editar todas en línea" }}
    </Button>
  </div>
  <AdvancedTable
    :columns="columns"
    :data="data"
    :inline-editing="inlineEditing"
    @edit-start="onEditStart"
    @edit-save="onEditSave"
    @edit-cancel="onEditCancel"
    @edit-error="onEditError"
  />
  <pre class="cu-demo-output">{{ lastEdit }}</pre>
</template>
