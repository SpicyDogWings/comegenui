<template>
  <!-- Refleja el ejemplo "Validación": `accept` y `max-size` se anuncian en la
       zona; cada archivo rechazado aparece listado en la alerta danger. -->
  <VanillaDemo :use="['CuFileInputZone']">
    <cu-file-input-zone accept=".txt,.csv" placeholder="Sólo .txt y .csv"></cu-file-input-zone>
    <cu-file-input-zone
      multiple
      accept="image/*"
      max-size="2097152"
      placeholder="Imágenes hasta 2 MB"
    ></cu-file-input-zone>
  </VanillaDemo>
</template>
