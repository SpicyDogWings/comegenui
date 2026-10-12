<template>
  <!-- Refleja el ejemplo "Con `for` apuntando a un input externo". -->
  <VanillaDemo :use="['CuLabel']">
    <cu-label for="miInput" label="Nombre"></cu-label>
    <input id="miInput" type="text" />
  </VanillaDemo>
</template>
