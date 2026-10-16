<template>
  <!-- Refleja el ejemplo "Anidados" de la ficha. -->
  <VanillaDemo :use="['CuCollapse']">
    <cu-collapse label="Sección padre" color="primary" default-open>
      <p>Contenido de nivel superior.</p>
      <cu-collapse label="Hijo">
        <p>Contenido anidado con su propio toggle.</p>
      </cu-collapse>
    </cu-collapse>
  </VanillaDemo>
</template>
