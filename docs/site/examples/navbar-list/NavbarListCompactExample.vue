<script setup lang="ts">
import { ref } from "vue";
import NavbarList from "@/components/navigation/NavbarList.vue";

const salida = ref("Sin toggles todavía.");

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

function onToggleCompact() {
  salida.value = "@toggle-compact";
}
</script>

<template>
  <!-- compact: modo compacto fijo (sólo iconos o la inicial) -->
  <NavbarList :items="items" compact />

  <!-- compactable: botón nativo que alterna compact/expandido -->
  <NavbarList :items="items" compactable @toggle-compact="onToggleCompact" />
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
