<script setup lang="ts">
// Refleja el ejemplo "Barra de cooldown": variantes de estilo y tiempo de reset.
import { ref, watch } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[] };

const ghost = ref<CuSelectElement | null>(null);
const solid = ref<CuSelectElement | null>(null);
const lento = ref<CuSelectElement | null>(null);

const options = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
];

// El ref aparece cuando `VanillaDemo` termina de cargar el CE.
watch([ghost, solid, lento], async (els) => {
  await customElements.whenDefined("cu-select");
  for (const el of els) {
    if (el) el.options = options;
  }
}, { flush: "post" });
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <!-- Cooldown con color suave (ghost, default) -->
    <cu-select ref="ghost" search-enabled></cu-select>
    <!-- Cooldown con color lleno (solid) -->
    <cu-select ref="solid" search-enabled cooldown-variant="solid"></cu-select>
    <!-- Cooldown personalizado: 3s -->
    <cu-select ref="lento" search-enabled :search-reset-delay="3000"></cu-select>
  </VanillaDemo>
</template>
