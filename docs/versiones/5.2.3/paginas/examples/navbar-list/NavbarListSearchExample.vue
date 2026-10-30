<script setup lang="ts">
import { ref } from "vue";
import NavbarList from "@/components/navigation/NavbarList.vue";

const query = ref("");
const salida = ref("Sin búsquedas todavía.");

const items = [
  { label: "Inicio", path: "#inicio" },
  { label: "Usuarios", path: "#usuarios" },
  { label: "Reportes", path: "#reportes" },
  { label: "Ajustes", path: "#ajustes" },
];

function onUpdateQuery(valor: string) {
  salida.value = `@update:query → "${valor}"`;
}
</script>

<template>
  <!-- searchMode="filter" (default): filtra los items -->
  <NavbarList
    v-model:query="query"
    :items="items"
    search
    search-placeholder="Filtrar…"
    :search-fields="['label']"
    @update:query="onUpdateQuery"
  />

  <!-- searchMode="scroll": no filtra, resalta y desplaza al primer match -->
  <NavbarList
    :items="items"
    search
    search-mode="scroll"
    search-placeholder="Buscar y resaltar…"
  />

  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
