<template>
  <!-- Refleja el ejemplo "Filas": `rows` 2 / 3 (default) / 6. -->
  <VanillaDemo :use="['CuTextarea']">
    <cu-textarea placeholder="2 filas" rows="2"></cu-textarea>
    <cu-textarea placeholder="3 filas (default)" rows="3"></cu-textarea>
    <cu-textarea placeholder="6 filas" rows="6"></cu-textarea>
  </VanillaDemo>
</template>
