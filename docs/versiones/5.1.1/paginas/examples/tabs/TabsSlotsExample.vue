<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";

const tabs = [
  { key: "home", label: "Inicio" },
  { key: "settings", label: "Ajustes" },
];
</script>

<template>
  <Tabs :tabs="tabs" variant="ghost" color="secondary">
    <!-- Slot dinámico de icono: tab-icon-{key} -->
    <template #tab-icon-home>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    </template>
    <template #tab-icon-settings>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </svg>
    </template>

    <!-- Slot dinámico de contenido: tab-{key} -->
    <template #home>
      El icono llega por el slot <code>tab-icon-home</code> y hereda el color del tab.
    </template>
    <template #settings>
      Contenido del panel de ajustes, también por slot dinámico.
    </template>
  </Tabs>
</template>
