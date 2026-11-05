<template>
  <!-- Refleja el ejemplo "Deshabilitado" de la ficha. -->
  <VanillaDemo :use="['CuCollapse']">
    <cu-collapse label="Sección bloqueada" disabled>
      <p>El trigger no responde: probá a hacer click.</p>
    </cu-collapse>
  </VanillaDemo>
</template>
