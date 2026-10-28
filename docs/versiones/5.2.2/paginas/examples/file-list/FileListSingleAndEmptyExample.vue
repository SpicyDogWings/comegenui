<script setup lang="ts">
import { ref } from "vue";
import FileList from "@/components/FileList.vue";

// files acepta un File suelto, un array o null.
const single = ref<File | null>(new File([new Uint8Array(81920)], "contrato.pdf", { type: "application/pdf" }));
const empty = ref<File[] | null>(null);
</script>

<template>
  <div class="cu-demo-controls">
    <strong>File suelto</strong>
    <FileList :files="single" />
  </div>
  <div class="cu-demo-controls">
    <strong>null (no renderiza nada)</strong>
    <FileList :files="empty" />
  </div>
</template>