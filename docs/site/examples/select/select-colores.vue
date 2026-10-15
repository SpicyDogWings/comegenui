<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos.
import { onMounted, ref } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[] };

const primary = ref<CuSelectElement | null>(null);
const secondary = ref<CuSelectElement | null>(null);
const neutral = ref<CuSelectElement | null>(null);
const success = ref<CuSelectElement | null>(null);
const warning = ref<CuSelectElement | null>(null);
const danger = ref<CuSelectElement | null>(null);

const options = [
  { value: "ok", label: "Aprobado" },
  { value: "pend", label: "Pendiente" },
];

onMounted(async () => {
  await customElements.whenDefined("cu-select");
  for (const el of [
    primary.value,
    secondary.value,
    neutral.value,
    success.value,
    warning.value,
    danger.value,
  ]) {
    if (el) el.options = options;
  }
});
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <cu-select ref="primary" color="primary" placeholder="primary"></cu-select>
    <cu-select ref="secondary" color="secondary" placeholder="secondary"></cu-select>
    <cu-select ref="neutral" color="neutral" placeholder="neutral"></cu-select>
    <cu-select ref="success" color="success" placeholder="success"></cu-select>
    <cu-select ref="warning" color="warning" placeholder="warning"></cu-select>
    <cu-select ref="danger" color="danger" placeholder="danger"></cu-select>
  </VanillaDemo>
</template>
