<script setup lang="ts">
import { ref } from "vue";
import EditableTableCell from "@/components/data/EditableTableCell.vue";

const row = ref({ nombre: "Sofía Ruiz", email: "sofia@ejemplo.com" });

const nombreColumn = { key: "nombre", editable: true, inputType: "input", singleClick: true };
const emailColumn = { key: "email", editable: true, inputType: "input", singleClick: true };
</script>

<template>
  <div class="cu-demo-controls">
    <strong>disabled</strong>
    <EditableTableCell
      :value="row.nombre"
      :row="row"
      :column="nombreColumn"
      :index="0"
      :disabled="true"
      :validation="{ success: false, error: null }"
    />
  </div>
  <div class="cu-demo-controls">
    <strong>color / variant</strong>
    <EditableTableCell
      :value="row.email"
      :row="row"
      :column="emailColumn"
      :index="0"
      color="primary"
      variant="soft"
      :validation="{ success: false, error: null }"
    />
  </div>
</template>