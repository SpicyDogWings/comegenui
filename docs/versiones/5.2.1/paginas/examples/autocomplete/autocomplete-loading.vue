<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";

const ac = ref<HTMLElement | null>(null);

type AutocompleteEl = HTMLElement & {
  items: { label: string }[];
  loading: boolean;
  open: () => void;
};

let timer: ReturnType<typeof setTimeout> | null = null;

const items = [
  { label: "María López" },
  { label: "Juan Pérez" },
  { label: "Ana Gómez" },
];

/** Simula una búsqueda: abre el panel con el spinner y, a los 2s, muestra los items. */
async function cargar() {
  const el = ac.value as AutocompleteEl | null;
  if (!el) return;
  await customElements.whenDefined("cu-autocomplete");
  el.items = items;
  el.loading = true;
  el.open();
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    el.loading = false;
  }, 2000);
}

onMounted(() => {
  setTimeout(cargar, 400);
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <VanillaDemo :use="['CuAutocomplete', 'CuButton']">
    <div style="display: flex; gap: var(--cu-space-sm); align-items: center; width: 100%">
      <cu-autocomplete
        ref="ac"
        placeholder="Buscá una persona (2s de carga)"
        style="flex: 1"
      ></cu-autocomplete>
      <cu-button @click="cargar">Volver a cargar</cu-button>
    </div>
  </VanillaDemo>
</template>
