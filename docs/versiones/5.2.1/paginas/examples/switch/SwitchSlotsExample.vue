<script setup lang="ts">
import Switch from "@/components/form/Switch.vue";
</script>

<template>
  <!-- Sin `label`, el contenido del slot default es la etiqueta visible. -->
  <Switch :model-value="true">
    Etiqueta por <strong>slot</strong>
  </Switch>
</template>
