<script setup lang="ts">
import FileInput from "@/components/form/FileInput.vue";
</script>

<template>
  <FileInput color="primary" variant="outlined" placeholder="outlined" />
  <FileInput color="success" variant="soft" placeholder="soft" />
  <FileInput color="warning" variant="ghost" placeholder="ghost" />
  <FileInput color="danger" variant="subtle" placeholder="subtle" />
</template>
