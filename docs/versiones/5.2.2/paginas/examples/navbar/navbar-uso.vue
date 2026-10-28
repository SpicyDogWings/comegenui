<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": `items` va como array y se escucha la
// búsqueda. Los `path` usan anclas para no salir de la doc.
import { ref } from "vue";

const items = [
  { label: "Inicio", path: "#inicio" },
  {
    label: "Usuarios",
    children: [
      { label: "Lista", path: "#usuarios-lista" },
      { label: "Roles", path: "#usuarios-roles" },
    ],
  },
  { label: "Ajustes", path: "#ajustes" },
];

const buscando = ref("");

function onSearch(e: Event) {
  buscando.value = `buscando: ${(e as CustomEvent).detail}`;
}
</script>

<template>
  <VanillaDemo :use="['CuNavbar']">
    <cu-navbar
      id="nav"
      search
      active-path="#usuarios-lista"
      :items.prop="items"
      @search="onSearch"
    ></cu-navbar>
    <p class="cu-demo-output">{{ buscando }}</p>
  </VanillaDemo>
</template>
