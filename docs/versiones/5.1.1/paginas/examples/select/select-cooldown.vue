<script setup lang="ts">
// Refleja el ejemplo "Barra de cooldown": variantes de estilo y tiempo de reset.
import { onMounted, ref } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[] };

const ghost = ref<CuSelectElement | null>(null);
const solid = ref<CuSelectElement | null>(null);
const lento = ref<CuSelectElement | null>(null);

const options = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
];

onMounted(async () => {
  await customElements.whenDefined("cu-select");
  for (const el of [ghost.value, solid.value, lento.value]) {
    if (el) el.options = options;
  }
});
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <!-- Cooldown con color suave (ghost, default) -->
    <cu-select ref="ghost" search-enabled></cu-select>
    <!-- Cooldown con color lleno (solid) -->
    <cu-select ref="solid" search-enabled cooldown-variant="solid"></cu-select>
    <!-- Cooldown personalizado: 3s -->
    <cu-select ref="lento" search-enabled search-reset-delay="3000"></cu-select>
  </VanillaDemo>
</template>
