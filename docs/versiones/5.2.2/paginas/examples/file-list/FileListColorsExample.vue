<script setup lang="ts">
import { ref } from "vue";
import FileList from "@/components/FileList.vue";

function makeFile(name: string, size: number, type = "application/pdf") {
  return new File([new Uint8Array(size)], name, { type });
}

const primary = ref<File[]>([makeFile("propuesta.pdf", 153600)]);
const success = ref<File[]>([makeFile("acta.pdf", 40960)]);
const danger = ref<File[]>([makeFile("backup.zip", 2097152, "application/zip")]);
</script>

<template>
  <div class="cu-demo-controls">
    <strong>primary</strong>
    <FileList :files="primary" color="primary" />
  </div>
  <div class="cu-demo-controls">
    <strong>success</strong>
    <FileList :files="success" color="success" />
  </div>
  <div class="cu-demo-controls">
    <strong>danger</strong>
    <FileList :files="danger" color="danger" />
  </div>
</template>