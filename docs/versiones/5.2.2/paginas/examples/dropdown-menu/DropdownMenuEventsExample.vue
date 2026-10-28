<script setup lang="ts">
import { ref } from "vue";
import DropdownMenu from "@/components/controls/DropdownMenu.vue";

const salida = ref("Sin eventos todavía.");
const items = [{ label: "Opción" }];

function onOpen() {
  salida.value = "@open";
}
function onClose() {
  salida.value = "@close";
}
</script>

<template>
  <DropdownMenu label="Escuchar eventos" color="primary" variant="soft" :items="items" @open="onOpen" @close="onClose" />
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
