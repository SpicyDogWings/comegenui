<script setup lang="ts">
import Textarea from "@/components/form/Textarea.vue";
</script>

<template>
  <Textarea placeholder="soft (default)" color="primary" />
  <Textarea placeholder="outlined" color="success" variant="outlined" />
  <Textarea placeholder="ghost" color="warning" variant="ghost" />
  <Textarea placeholder="subtle" color="danger" variant="subtle" />
</template>
