<script setup lang="ts">
import { ref } from "vue";
import FileInputZone from "@/components/form/FileInputZone.vue";

const archivo = ref<File | File[] | null>(
  new File([new Uint8Array(1024)], "chico.txt", { type: "text/plain" }),
);
</script>

<template>
  <FileInputZone
    v-model="archivo"
    :max-size="2097152"
    accept=".txt,.csv"
    placeholder="Archivos de hasta 2 MB"
  />
</template>
