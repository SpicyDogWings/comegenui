<template>
  <!-- Refleja el ejemplo "Estado deshabilitado": inerte, marcado o no. -->
  <VanillaDemo :use="['CuCheckbox']">
    <div class="cu-demo-controls">
      <cu-checkbox label="Deshabilitado (marcado)" :model-value="true" disabled></cu-checkbox>
      <cu-checkbox label="Deshabilitado (sin marcar)" disabled></cu-checkbox>
    </div>
  </VanillaDemo>
</template>
