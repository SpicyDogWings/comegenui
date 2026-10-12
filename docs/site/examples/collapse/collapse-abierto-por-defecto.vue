<template>
  <!-- Refleja el ejemplo "Abierto por defecto" de la ficha. -->
  <VanillaDemo :use="['CuCollapse']">
    <cu-collapse label="Opciones avanzadas" default-open>
      <p>Visible desde el inicio gracias a <code>default-open</code>.</p>
    </cu-collapse>
  </VanillaDemo>
</template>
