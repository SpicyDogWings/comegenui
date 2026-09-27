<script setup lang="ts">
import { ref } from "vue";
import FileInput from "@/components/form/FileInput.vue";

const archivo = ref<File | null>(new File([new Uint8Array(2048)], "captura.png", { type: "image/png" }));
</script>

<template>
  <!-- El límite se muestra en el placeholder; `set()` no valida tamaño. -->
  <FileInput
    v-model="archivo"
    accept="image/*"
    :max-size="1048576"
    placeholder="Imagen hasta 1 MB"
  />
</template>
