<script setup lang="ts">
// Refleja el ejemplo "Estado de carga (loading)": la barra animada aparece arriba
// del dropdown y el panel se atenúa; se controla con la propiedad `loading`.
import { onMounted, ref } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[]; loading?: boolean };

const select = ref<CuSelectElement | null>(null);

const options = [
  { value: "doc", label: "Documento" },
  { value: "pdf", label: "PDF" },
  { value: "csv", label: "CSV" },
];

onMounted(async () => {
  await customElements.whenDefined("cu-select");
  if (select.value) select.value.options = options;
});

function mostrar() {
  if (select.value) select.value.loading = true;
}

function ocultar() {
  if (select.value) select.value.loading = false;
}
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="select" placeholder="Elegí un formato" loading></cu-select>
    <div class="cu-demo-controls">
      <button type="button" @click="mostrar">loading = true</button>
      <button type="button" @click="ocultar">loading = false</button>
    </div>
  </VanillaDemo>
</template>
