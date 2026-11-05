<template>
  <!-- Refleja el ejemplo "Estados": `disabled`, `read-only` y habilitado. -->
  <VanillaDemo :use="['CuTextarea']">
    <cu-textarea model-value="Deshabilitado" disabled></cu-textarea>
    <cu-textarea model-value="Solo lectura" read-only></cu-textarea>
    <cu-textarea placeholder="Habilitado"></cu-textarea>
  </VanillaDemo>
</template>
