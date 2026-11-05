<script setup lang="ts">
import Checkbox from "@/components/form/Checkbox.vue";
</script>

<template>
  <Checkbox label="deshabilitado (marcado)" disabled :model-value="true" />
  <Checkbox label="deshabilitado (sin marcar)" disabled :model-value="false" />
</template>
