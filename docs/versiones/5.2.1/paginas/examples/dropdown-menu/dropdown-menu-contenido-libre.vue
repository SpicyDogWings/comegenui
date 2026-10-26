<script setup lang="ts">
// Refleja el ejemplo "Contenido libre en el panel (sin `items`)": el slot por
// defecto reemplaza a la lista de items.
</script>

<template>
  <VanillaDemo :use="['CuDropdownMenu']">
    <cu-dropdown-menu label="Opciones">
      <div style="padding: 12px; min-width: 200px;">
        <p style="margin: 0 0 8px;">Contenido arbitrario</p>
        <a href="#">Cerrar sesión</a>
      </div>
    </cu-dropdown-menu>
  </VanillaDemo>
</template>
