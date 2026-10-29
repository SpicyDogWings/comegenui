<script setup lang="ts">
// Refleja el ejemplo "Posicionamiento": `position` + `align` del dropdown.
import { ref, watch } from "vue";

type CuSelectElement = HTMLElement & { options?: unknown[] };

const abajo = ref<CuSelectElement | null>(null);
const arribaCentro = ref<CuSelectElement | null>(null);
const abajoFinal = ref<CuSelectElement | null>(null);
const arribaInicio = ref<CuSelectElement | null>(null);

const options = [
  { value: "a", label: "Opción A" },
  { value: "b", label: "Opción B" },
];

// El ref aparece cuando `VanillaDemo` termina de cargar el CE.
watch([abajo, arribaCentro, abajoFinal, arribaInicio], async (els) => {
  await customElements.whenDefined("cu-select");
  for (const el of els) {
    if (el) el.options = options;
  }
}, { flush: "post" });
</script>

<template>
  <VanillaDemo :use="['CuSelect']">
    <!-- Con position + align separados -->
    <cu-select ref="abajo" position="bottom" align="end" placeholder="bottom / end"></cu-select>
    <cu-select ref="arribaCentro" position="top" align="center" placeholder="top / center"></cu-select>
    <cu-select ref="abajoFinal" position="bottom" align="end" placeholder="bottom / end"></cu-select>
    <cu-select ref="arribaInicio" position="top" align="start" placeholder="top / start"></cu-select>
  </VanillaDemo>
</template>
