<template>
  <!-- Refleja el ejemplo "Nombre y rol": `role` es opcional y las iniciales salen de `name`. -->
  <VanillaDemo :use="['CuAuthorCard']">
    <div class="cu-demo-controls">
      <cu-author-card name="Ana Pérez"></cu-author-card>
      <cu-author-card name="Ana Pérez" role="Desarrolladora"></cu-author-card>
      <cu-author-card name="Ana"></cu-author-card>
    </div>
  </VanillaDemo>
</template>
