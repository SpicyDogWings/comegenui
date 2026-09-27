<script setup lang="ts">
import CopyButton from "@/components/buttons/CopyButton.vue";
</script>

<template>
  <CopyButton text="primary" label="primary" color="primary" variant="solid" />
  <CopyButton text="success" label="success" color="success" variant="soft" />
  <CopyButton text="danger" label="danger" color="danger" variant="outlined" />
  <CopyButton text="ghost" label="ghost" color="neutral" variant="ghost" />
</template>
