<script setup lang="ts">
import { ref } from "vue";
import EditableTableCell from "@/components/data/EditableTableCell.vue";

const row = ref({ nombre: "Juan Pérez" });
const column = ref({
  key: "nombre",
  label: "Nombre",
  editable: true,
  inputType: "input",
  singleClick: true,
  validator: (value: string) => value.trim().length >= 3,
});
const validation = ref<{ success: boolean; error: string | null }>({ success: false, error: null });
const lastEvent = ref("Hacé click en la celda para editar (Enter guarda, Escape cancela)");

function onStart(e: any) {
  lastEvent.value = `edit-start → index ${e.index}, columna "${e.column.key}"`;
}
function onSave(e: any) {
  row.value.nombre = e.value;
  validation.value = { success: true, error: null };
  lastEvent.value = `edit-save → "${e.value}"`;
}
function onCancel(e: any) {
  validation.value = { success: false, error: null };
  lastEvent.value = `edit-cancel → index ${e.index}`;
}
function onError(e: any) {
  validation.value = { success: false, error: "Mínimo 3 caracteres" };
  lastEvent.value = `edit-error → "${e.value}"`;
}
</script>

<template>
  <EditableTableCell
    :value="row.nombre"
    :row="row"
    :column="column"
    :index="0"
    :validation="validation"
    @edit-start="onStart"
    @edit-save="onSave"
    @edit-cancel="onCancel"
    @edit-error="onError"
  />
  <pre class="cu-demo-output">{{ lastEvent }}</pre>
</template>