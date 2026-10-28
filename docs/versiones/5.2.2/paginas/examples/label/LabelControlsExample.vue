<script setup lang="ts">
import Label from "@/components/form/Label.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Switch from "@/components/form/Switch.vue";
</script>

<template>
  <Label label="Acepto los términos">
    <Checkbox />
  </Label>

  <Label label="Suscripción">
    <Switch />
  </Label>
</template>
