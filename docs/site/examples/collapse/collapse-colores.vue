<template>
  <!-- Refleja el ejemplo "Colores" de la ficha. -->
  <VanillaDemo :use="['CuCollapse']">
    <cu-collapse label="Información" color="primary">
      <p>Contenido con color primary.</p>
    </cu-collapse>
    <cu-collapse label="Éxito" color="success">
      <p>Contenido con color success.</p>
    </cu-collapse>
    <cu-collapse label="Advertencia" color="warning">
      <p>Contenido con color warning.</p>
    </cu-collapse>
    <cu-collapse label="Peligro" color="danger">
      <p>Contenido con color danger.</p>
    </cu-collapse>
  </VanillaDemo>
</template>
