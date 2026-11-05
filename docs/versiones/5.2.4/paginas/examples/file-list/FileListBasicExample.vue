<script setup lang="ts">
import { ref } from "vue";
import FileList from "@/components/FileList.vue";

function makeFile(name: string, size: number, type = "application/pdf") {
  return new File([new Uint8Array(size)], name, { type });
}

const files = ref<File[]>([
  makeFile("informe-anual.pdf", 245760),
  makeFile("presupuesto.xlsx", 51200, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
  makeFile("foto-equipo.png", 1048576, "image/png"),
]);

const lastEvent = ref("—");

function onSelect(index: number) {
  lastEvent.value = `select → ${files.value[index]?.name} (índice ${index})`;
}
function onRemove(index: number) {
  lastEvent.value = `remove → ${files.value[index]?.name} (índice ${index})`;
  files.value.splice(index, 1);
}
</script>

<template>
  <FileList :files="files" @select="onSelect" @remove="onRemove" />
  <pre class="cu-demo-output">{{ lastEvent }}</pre>
</template>