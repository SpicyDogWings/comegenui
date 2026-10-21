<script setup lang="ts">
// Refleja el ejemplo "Estado de carga (loading)": la barra animada aparece arriba
// del dropdown y el panel se atenúa; se controla con la propiedad `loading`.
import { ref, watch } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[]; loading?: boolean };

const select = ref<CuSelectElement | null>(null);

const options = [
  { value: "doc", label: "Documento" },
  { value: "pdf", label: "PDF" },
  { value: "csv", label: "CSV" },
];

// El ref aparece cuando `VanillaDemo` termina de cargar el CE.
watch(select, async (el) => {
  if (!el) return;
  await customElements.whenDefined("cu-select");
  el.options = options;
}, { flush: "post" });

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
