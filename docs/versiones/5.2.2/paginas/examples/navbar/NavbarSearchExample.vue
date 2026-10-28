<script setup lang="ts">
import { ref } from "vue";
import Navbar from "@/components/navigation/Navbar.vue";

const salida = ref("Sin búsquedas todavía.");

const items = [
  { label: "Inicio", path: "#inicio" },
  { label: "Usuarios", path: "#usuarios" },
  { label: "Reportes", path: "#reportes" },
  { label: "Ajustes", path: "#ajustes" },
];

function onSearch(query: string) {
  salida.value = `@search → "${query}"`;
}
</script>

<template>
  <Navbar
    :items="items"
    search
    search-placeholder="Buscar sección…"
    :search-fields="['label']"
    @search="onSearch"
  />
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
