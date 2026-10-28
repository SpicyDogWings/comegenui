<script setup lang="ts">
import { ref } from "vue";
import EditableTableCell from "@/components/data/EditableTableCell.vue";

const row = ref({ nombre: "Luis Gómez", rol: "editor" });

const nombreColumn = {
  key: "nombre",
  editable: true,
  inputType: "input",
  inlineEdit: true,
};
const rolColumn = {
  key: "rol",
  editable: true,
  inputType: "select",
  inlineEdit: true,
  selectOptions: [
    { value: "admin", label: "Administrador" },
    { value: "editor", label: "Editor" },
    { value: "viewer", label: "Visor" },
  ],
};

const lastEvent = ref("Con inlineEdit el editor queda siempre visible (sin lápiz)");

function onSave(e: any) {
  row.value[e.column.key] = e.value;
  lastEvent.value = `edit-save → ${e.column.key} = ${JSON.stringify(e.value)}`;
}
function onCancel(e: any) {
  lastEvent.value = `edit-cancel → ${e.column.key} (el editor sigue visible)`;
}
</script>

<template>
  <div class="cu-demo-controls">
    <strong>input</strong>
    <EditableTableCell
      :value="row.nombre"
      :row="row"
      :column="nombreColumn"
      :index="0"
      :inline-edit="true"
      :validation="{ success: false, error: null }"
      @edit-save="onSave"
      @edit-cancel="onCancel"
    />
  </div>
  <div class="cu-demo-controls">
    <strong>select</strong>
    <EditableTableCell
      :value="row.rol"
      :row="row"
      :column="rolColumn"
      :index="0"
      :inline-edit="true"
      :validation="{ success: false, error: null }"
      @edit-save="onSave"
      @edit-cancel="onCancel"
    />
  </div>
  <pre class="cu-demo-output">{{ lastEvent }}</pre>
</template>