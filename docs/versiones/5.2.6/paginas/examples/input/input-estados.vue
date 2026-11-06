<template>
  <!-- Refleja el ejemplo "Estados": `disabled` y `readonly` (atributo HTML en el CE). -->
  <VanillaDemo :use="['CuInput']">
    <cu-input model-value="deshabilitado" disabled></cu-input>
    <cu-input model-value="solo lectura (readonly)" readonly></cu-input>
    <cu-input placeholder="habilitado"></cu-input>
  </VanillaDemo>
</template>
