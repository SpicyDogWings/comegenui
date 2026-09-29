<script setup lang="ts">
import { ref } from "vue";
import FileList from "@/components/FileList.vue";

const files = ref<File[]>([
  new File([new Uint8Array(245760)], "informe-anual.pdf", { type: "application/pdf" }),
  new File([new Uint8Array(51200)], "presupuesto.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  }),
]);

const lastEvent = ref("—");

function onSelect(index: number) {
  lastEvent.value = `select → ${files.value[index]?.name} (índice ${index})`;
}
</script>

<template>
  <!-- disabled: oculta el botón de quitar; el click de selección sigue emitiendo -->
  <FileList :files="files" disabled @select="onSelect" />
  <pre class="cu-demo-output">{{ lastEvent }}</pre>
</template>