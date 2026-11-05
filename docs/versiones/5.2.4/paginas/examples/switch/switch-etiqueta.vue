<template>
  <!-- Refleja el ejemplo "Etiqueta": el prop `label` y el slot `default` (con marcado). -->
  <VanillaDemo :use="['CuSwitch']">
    <cu-switch color="primary" label="Notificaciones"></cu-switch>
    <cu-switch color="success">Acepto los <strong>términos</strong></cu-switch>
  </VanillaDemo>
</template>
