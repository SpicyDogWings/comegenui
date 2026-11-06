<script setup lang="ts">
// Refleja el ejemplo "Cierre": la X va en la cabecera con título/ícono y flota sin ellos.
</script>

<template>
  <VanillaDemo :use="['CuAlert']">
    <cu-alert color="neutral" variant="soft" title="Con cabecera" close>
      La X acompaña al título.
    </cu-alert>

    <cu-alert color="danger" variant="soft" close>
      Sin título ni ícono, la X flota sobre el cuerpo.
    </cu-alert>

    <cu-alert color="neutral" variant="soft">Sin `close` no hay botón de cierre.</cu-alert>
  </VanillaDemo>
</template>
