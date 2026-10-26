<script setup lang="ts">
import Collapse from "@/components/overlay/Collapse.vue";
</script>

<template>
  <Collapse
    label="Plan Pro"
    description="Facturación mensual, cancela cuando quieras"
    color="primary"
  >
    <p>La descripción aparece bajo el label, dentro del mismo trigger.</p>
  </Collapse>

  <Collapse label="Sin descripción">
    <p>Sin <code>description</code> el trigger sólo muestra el label.</p>
  </Collapse>
</template>
