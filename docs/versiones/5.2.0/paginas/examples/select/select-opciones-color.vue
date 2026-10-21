<script setup lang="ts">
// Refleja el ejemplo "Opciones con color y variante individual".
import { ref, watch } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[] };

const select = ref<CuSelectElement | null>(null);

const options = [
  { value: "ok", label: "Aprobado", color: "success" },
  { value: "warn", label: "Pendiente", color: "warning" },
  { value: "err", label: "Rechazado", color: "danger" },
];

// El ref aparece cuando `VanillaDemo` termina de cargar el CE.
watch(select, async (el) => {
  if (!el) return;
  await customElements.whenDefined("cu-select");
  el.options = options;
}, { flush: "post" });
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="select"></cu-select>
  </VanillaDemo>
</template>
