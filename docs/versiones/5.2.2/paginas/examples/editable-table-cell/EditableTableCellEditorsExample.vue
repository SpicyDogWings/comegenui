<script setup lang="ts">
import { ref } from "vue";
import EditableTableCell from "@/components/data/EditableTableCell.vue";

const row = ref({
  nombre: "Ana Torres",
  descripcion: "Cliente mayorista con envío mensual.",
  rol: "admin",
  ciudad: "Buenos Aires",
  fecha: "2026-03-15",
  activo: true,
});

// Un editor por inputType soportado.
const fields = [
  {
    key: "nombre",
    label: "input",
    column: { key: "nombre", editable: true, inputType: "input", singleClick: true },
  },
  {
    key: "descripcion",
    label: "textarea",
    column: {
      key: "descripcion",
      editable: true,
      inputType: "textarea",
      singleClick: true,
      textarea: { rows: 2 },
    },
  },
  {
    key: "rol",
    label: "select",
    column: {
      key: "rol",
      editable: true,
      inputType: "select",
      singleClick: true,
      selectOptions: [
        { value: "admin", label: "Administrador" },
        { value: "editor", label: "Editor" },
        { value: "viewer", label: "Visor" },
      ],
    },
  },
  {
    key: "ciudad",
    label: "autocomplete",
    column: {
      key: "ciudad",
      editable: true,
      inputType: "autocomplete",
      singleClick: true,
      autocompleteItems: [
        { label: "Buenos Aires", value: "Buenos Aires" },
        { label: "Córdoba", value: "Córdoba" },
        { label: "Rosario", value: "Rosario" },
      ],
    },
  },
  {
    key: "fecha",
    label: "date",
    column: {
      key: "fecha",
      editable: true,
      inputType: "date",
      singleClick: true,
      date: { format: "dd/MM/yyyy" },
    },
  },
  {
    key: "activo",
    label: "switch",
    column: {
      key: "activo",
      editable: true,
      inputType: "switch",
      switch: { size: "sm", color: "success" },
    },
  },
];

const lastEvent = ref("—");

function onSave(e: any) {
  row.value[e.column.key] = e.value;
  lastEvent.value = `edit-save → ${e.column.key} = ${JSON.stringify(e.value)}`;
}
</script>

<template>
  <div v-for="field in fields" :key="field.key" class="cu-demo-controls">
    <strong>{{ field.label }}</strong>
    <EditableTableCell
      :value="(row as any)[field.key]"
      :row="row"
      :column="field.column"
      :index="0"
      :validation="{ success: false, error: null }"
      @edit-save="onSave"
    />
  </div>
  <pre class="cu-demo-output">{{ lastEvent }}</pre>
</template>