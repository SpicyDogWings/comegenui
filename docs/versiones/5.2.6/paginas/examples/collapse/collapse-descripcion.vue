<template>
  <!-- Refleja el ejemplo "Descripción" de la ficha. -->
  <VanillaDemo :use="['CuCollapse']">
    <cu-collapse label="Plan Pro" description="Facturación mensual, cancela cuando quieras">
      <p>La descripción aparece bajo el label, dentro del mismo trigger.</p>
    </cu-collapse>
  </VanillaDemo>
</template>
