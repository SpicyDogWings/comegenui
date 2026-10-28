<template>
  <!-- Refleja el ejemplo "Validación": `accept` y `max-size` se anuncian en el
       placeholder; el rechazo muestra una alerta danger debajo. -->
  <VanillaDemo :use="['CuFileInput']">
    <cu-file-input accept="image/*" placeholder="Imagen"></cu-file-input>
    <cu-file-input accept=".pdf,.doc,.docx" placeholder="Documento"></cu-file-input>
    <cu-file-input accept="image/*,.pdf" max-size="1048576" placeholder="Imagen o PDF hasta 1 MB"></cu-file-input>
  </VanillaDemo>
</template>
