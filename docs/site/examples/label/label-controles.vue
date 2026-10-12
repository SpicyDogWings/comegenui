<template>
  <!-- Refleja el ejemplo "Con cualquier control como hijo". -->
  <VanillaDemo :use="['CuLabel', 'CuCheckbox', 'CuSwitch']">
    <cu-label label="Acepto los términos">
      <cu-checkbox></cu-checkbox>
    </cu-label>

    <cu-label label="Suscripción">
      <cu-switch></cu-switch>
    </cu-label>
  </VanillaDemo>
</template>
