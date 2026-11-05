<script setup lang="ts">
// Refleja el ejemplo "Items": con `icon`, con `value` distinto del `label` y deshabilitado.
import { ref } from "vue";

const icon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';

const items = [
  { label: "Administrador", icon },
  { label: "Editor de contenido", icon },
  { label: "Juan Pérez (juan@mail.com)", value: "Juan Pérez" },
  { label: "Invitado externo", disabled: true },
];

const elegido = ref("");

function onSelect(e: Event) {
  const item = (e as CustomEvent).detail;
  if (item) elegido.value = item.value ?? item.label;
}
</script>

<template>
  <VanillaDemo :use="['CuAutocomplete']">
    <cu-autocomplete
      placeholder="Elegí un item..."
      :items.prop="items"
      @select="onSelect"
    ></cu-autocomplete>
    <p class="cu-demo-output">value elegido: {{ elegido || "(ninguno)" }}</p>
  </VanillaDemo>
</template>
