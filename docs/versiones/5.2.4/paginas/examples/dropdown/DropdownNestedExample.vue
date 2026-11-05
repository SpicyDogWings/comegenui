<script setup lang="ts">
import Dropdown from "@/components/overlay/Dropdown.vue";

// `icon` sólo se usa cuando el Dropdown es anidado: se renderiza como fila de
// menú con el ícono a la izquierda del label.
const usuario =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
const engranaje =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>';
</script>

<template>
  <Dropdown label="Menú principal" color="primary" variant="soft">
    <!-- Un Dropdown dentro del panel de otro se detecta como anidado y abre
         en cascada hacia la derecha, con `icon` como fila de menú. -->
    <Dropdown label="Usuarios" :icon="usuario" color="neutral">
      <p>Submenú de usuarios.</p>
    </Dropdown>
    <Dropdown label="Configuración" :icon="engranaje" color="neutral">
      <p>Submenú de configuración.</p>
    </Dropdown>
  </Dropdown>
</template>
