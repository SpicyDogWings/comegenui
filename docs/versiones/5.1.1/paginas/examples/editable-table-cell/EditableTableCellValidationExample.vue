<script setup lang="ts">
import { ref } from "vue";
import EditableTableCell from "@/components/data/EditableTableCell.vue";
import Button from "@/components/buttons/Button.vue";

const row = ref({ precio: "1200.50" });
const column = ref({
  key: "precio",
  editable: /^\d+\.\d{2}$/,
  inputType: "input",
  singleClick: true,
});
const validation = ref<{ success: boolean; error: string | null }>({ success: false, error: null });
const lastEvent = ref("Probá guardar un valor inválido (ej. 1200.555) para ver edit-error");

function onSave(e: any) {
  row.value.precio = e.value;
  validation.value = { success: true, error: null };
  lastEvent.value = `edit-save → "${e.value}"`;
}
function onError(e: any) {
  validation.value = { success: false, error: "Formato inválido" };
  lastEvent.value = `edit-error → "${e.value}"`;
}
function onCancel() {
  validation.value = { success: false, error: null };
  lastEvent.value = "edit-cancel";
}
</script>

<template>
  <div class="cu-demo-controls">
    <Button variant="soft" @click="validation = { success: true, error: null }">validation = success</Button>
    <Button variant="soft" @click="validation = { success: false, error: 'Formato inválido' }">validation = error</Button>
    <Button variant="ghost" @click="validation = { success: false, error: null }">reset</Button>
  </div>
  <EditableTableCell
    :value="row.precio"
    :row="row"
    :column="column"
    :index="0"
    :validation="validation"
    @edit-save="onSave"
    @edit-error="onError"
    @edit-cancel="onCancel"
  />
  <pre class="cu-demo-output">{{ lastEvent }}</pre>
</template>