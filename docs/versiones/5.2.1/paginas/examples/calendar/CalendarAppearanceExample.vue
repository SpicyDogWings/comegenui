<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";
</script>

<template>
  <Calendar color="primary" variant="soft" />
  <Calendar color="success" variant="outlined" />
  <Calendar color="warning" variant="solid" />
  <!-- grid: separadores entre días · border: marco alrededor de la grilla -->
  <Calendar color="neutral" variant="subtle" grid border />
</template>
