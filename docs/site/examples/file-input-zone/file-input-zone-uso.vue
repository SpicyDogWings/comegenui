<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": básico, múltiple + imágenes y modo
// carpeta, con el evento `update:modelValue` sobre la primera zona.
import { onMounted, ref } from "vue";

const zona = ref<HTMLElement | null>(null);
const salida = ref("(sin eventos todavía)");

onMounted(async () => {
  await customElements.whenDefined("cu-file-input-zone");
  zona.value?.addEventListener("update:modelValue", (e) => {
    const files = (e as CustomEvent<File | File[] | null>).detail;
    if (Array.isArray(files)) salida.value = `${files.length} archivos seleccionados`;
    else salida.value = files ? `1 archivo: ${files.name}` : "sin archivos";
  });
});
</script>

<template>
  <VanillaDemo :use="['CuFileInputZone']">
    <cu-file-input-zone ref="zona" placeholder="Arrastra un archivo"></cu-file-input-zone>
    <cu-file-input-zone
      color="primary"
      multiple
      accept="image/*"
      placeholder="Subí tus imágenes"
    ></cu-file-input-zone>
    <cu-file-input-zone
      directory
      max-height="200px"
      placeholder="Carpeta de documentos"
    ></cu-file-input-zone>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
