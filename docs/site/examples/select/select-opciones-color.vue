<script setup lang="ts">
// Refleja el ejemplo "Opciones con color y variante individual".
import { onMounted, ref } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[] };

const select = ref<CuSelectElement | null>(null);

const options = [
  { value: "ok", label: "Aprobado", color: "success" },
  { value: "warn", label: "Pendiente", color: "warning" },
  { value: "err", label: "Rechazado", color: "danger" },
];

onMounted(async () => {
  await customElements.whenDefined("cu-select");
  if (select.value) select.value.options = options;
});
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="select"></cu-select>
  </VanillaDemo>
</template>
