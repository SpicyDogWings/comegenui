<script setup lang="ts">
import Collapse from "@/components/overlay/Collapse.vue";
</script>

<template>
  <Collapse label="Más información">
    <p>Este contenido está oculto por defecto y se revela con una transición de altura.</p>
  </Collapse>

  <Collapse label="Abierto por defecto" default-open>
    <p>Este arranca visible gracias a <code>default-open</code>.</p>
  </Collapse>
</template>
