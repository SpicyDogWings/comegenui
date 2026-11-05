<script setup lang="ts">
// Refleja el ejemplo "Búsqueda": `filter` oculta los que no matchean y `scroll` resalta+desplaza.
import { ref } from "vue";

const items = [
  { label: "Inicio", path: "#inicio" },
  { label: "Usuarios", path: "#usuarios" },
  { label: "Reportes", path: "#reportes" },
  { label: "Ajustes", path: "#ajustes" },
];

const buscando = ref("");

function onSearch(e: Event) {
  buscando.value = (e as CustomEvent<string>).detail;
}
</script>

<template>
  <VanillaDemo :use="['CuNavbar']">
    <!-- searchMode="filter" (default): oculta los items que no matchean -->
    <cu-navbar
      search
      search-placeholder="Buscar y filtrar…"
      :search-fields.prop="['label']"
      :items.prop="items"
      @search="onSearch"
    ></cu-navbar>

    <!-- searchMode="scroll": no filtra; resalta y hace scroll al primero que matchea -->
    <cu-navbar
      search
      search-mode="scroll"
      search-placeholder="Buscar y resaltar…"
      :items.prop="items"
      @search="onSearch"
    ></cu-navbar>

    <pre class="cu-demo-output">@search → {{ buscando || "(sin búsquedas todavía)" }}</pre>
  </VanillaDemo>
</template>
