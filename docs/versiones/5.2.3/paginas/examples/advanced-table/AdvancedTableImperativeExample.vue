<script setup lang="ts">
import { ref } from "vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import Button from "@/components/buttons/Button.vue";

const tableRef = ref<any>(null);

const columns = ref([
  { key: "id", label: "ID", width: "64px" },
  { key: "nombre", label: "Nombre" },
  { key: "rol", label: "Rol" },
]);

const data = ref([
  { id: 1, nombre: "Ana", rol: "Admin" },
  { id: 2, nombre: "Luis", rol: "Editor" },
  { id: 3, nombre: "Sofía", rol: "Visor" },
]);

const output = ref("—");
let nextId = 4;

function getData() {
  output.value = JSON.stringify(tableRef.value?.getData(), null, 2);
}
function getRow() {
  output.value = JSON.stringify(tableRef.value?.getRow(0), null, 2);
}
function updateRow() {
  tableRef.value?.updateRow(0, { rol: "Superadmin" });
  output.value = 'updateRow(0, { rol: "Superadmin" }) aplicado';
}
function removeRow() {
  output.value = `removeRow(0) → ${tableRef.value?.removeRow(0)}`;
}
function addRow() {
  const ok = tableRef.value?.addRow({ id: nextId, nombre: `Nueva ${nextId}`, rol: "Visor" });
  output.value = `addRow({ id: ${nextId}, … }) → ${ok}`;
  nextId += 1;
}
function pushData() {
  const ok = tableRef.value?.pushData([
    { id: nextId, nombre: `Lote ${nextId}`, rol: "Visor" },
    { id: nextId + 1, nombre: `Lote ${nextId + 1}`, rol: "Editor" },
  ]);
  output.value = `pushData([2 filas]) → ${ok}`;
  nextId += 2;
}
</script>

<template>
  <div class="cu-demo-controls">
    <Button variant="soft" @click="getData">getData()</Button>
    <Button variant="soft" @click="getRow">getRow(0)</Button>
    <Button variant="soft" @click="updateRow">updateRow(0, …)</Button>
    <Button variant="soft" @click="removeRow">removeRow(0)</Button>
    <Button variant="soft" @click="addRow">addRow(…)</Button>
    <Button variant="soft" @click="pushData">pushData([…])</Button>
  </div>
  <AdvancedTable ref="tableRef" :columns="columns" :data="data" :pagination="false" />
  <pre class="cu-demo-output">{{ output }}</pre>
</template>
