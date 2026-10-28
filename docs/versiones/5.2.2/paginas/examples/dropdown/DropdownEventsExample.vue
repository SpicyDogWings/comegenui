<script setup lang="ts">
import { ref } from "vue";
import Dropdown from "@/components/overlay/Dropdown.vue";

const seleccionado = ref("");
const salida = ref("Sin eventos todavía.");

const items = [
  { label: 'Elegir "A"', onClick: () => (seleccionado.value = "A") },
  { label: 'Elegir "B"', onClick: () => (seleccionado.value = "B") },
  { label: 'Elegir "C"', onClick: () => (seleccionado.value = "C") },
];

function onOpen() {
  salida.value = "@open";
}
function onClose() {
  salida.value = "@close";
}
</script>

<template>
  <!-- v-model: el valor seleccionado (string) actualiza por update:modelValue -->
  <Dropdown
    v-model="seleccionado"
    label="Elegí una opción"
    color="primary"
    variant="soft"
    :items="items"
    @open="onOpen"
    @close="onClose"
  >
    <p>El contenido del slot se agrega debajo de los items.</p>
  </Dropdown>

  <pre class="cu-demo-output">v-model: "{{ seleccionado }}"
{{ salida }}</pre>
</template>
