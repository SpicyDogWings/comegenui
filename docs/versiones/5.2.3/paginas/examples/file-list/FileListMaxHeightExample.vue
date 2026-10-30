<script setup lang="ts">
import { ref } from "vue";
import FileList from "@/components/FileList.vue";

const names = [
  "informe-anual.pdf",
  "presupuesto.xlsx",
  "foto-equipo.png",
  "contrato.pdf",
  "backup.zip",
  "presentacion.pptx",
  "notas.txt",
  "planilla.csv",
];

const files = ref<File[]>(
  names.map((name, i) => new File([new Uint8Array((i + 1) * 20480)], name)),
);
</script>

<template>
  <!-- maxHeight: la lista scrollea al superar esa altura -->
  <FileList :files="files" max-height="160px" />
</template>