<script setup lang="ts">
import { ref } from "vue";
import FileInputZone from "@/components/form/FileInputZone.vue";

const archivos = ref<File[]>([]);
</script>

<template>
  <!-- `directory` selecciona carpetas; `directoryDeep` limita la profundidad (0 = solo la raíz). -->
  <FileInputZone
    v-model="archivos"
    directory
    :directory-deep="1"
    placeholder="Elegí una carpeta (hasta 1 nivel de subcarpetas)"
  />
</template>
