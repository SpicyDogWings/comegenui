<script setup lang="ts">
import Label from "@/components/form/Label.vue";
</script>

<template>
  <Label label="primary" color="primary" />
  <Label label="success" color="success" />
  <Label label="warning" color="warning" />
  <Label label="danger" color="danger" />
  <Label label="hightContrast (alta prioridad de texto)" color="neutral" :hight-contrast="true" />
</template>
