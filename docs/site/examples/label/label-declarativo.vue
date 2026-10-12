<template>
  <!-- Refleja el ejemplo "Modo declarativo (prop label)". -->
  <VanillaDemo :use="['CuLabel', 'CuInput']">
    <cu-label label="Correo electrónico" color="primary">
      <cu-input type="email" placeholder="correo@ejemplo.com"></cu-input>
    </cu-label>
  </VanillaDemo>
</template>
