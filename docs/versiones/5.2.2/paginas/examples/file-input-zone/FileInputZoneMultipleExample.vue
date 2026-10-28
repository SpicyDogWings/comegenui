<script setup lang="ts">
import { ref } from "vue";
import FileInputZone from "@/components/form/FileInputZone.vue";

const archivos = ref<File[]>([
  new File(["uno"], "documento-1.txt", { type: "text/plain" }),
  new File(["dos"], "documento-2.txt", { type: "text/plain" }),
  new File(["tres"], "documento-3.txt", { type: "text/plain" }),
]);
</script>

<template>
  <FileInputZone
    v-model="archivos"
    multiple
    max-height="140px"
    accept=".txt,.pdf"
    placeholder="Soltá varios archivos acá"
  />
</template>
