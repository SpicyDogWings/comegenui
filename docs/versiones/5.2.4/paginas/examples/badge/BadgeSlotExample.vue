<script setup lang="ts">
import Badge from "@/components/information/Badge.vue";
</script>

<template>
  <div class="cu-demo-controls">
    <Badge color="success" variant="soft">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      Verificado
    </Badge>

    <Badge color="danger" variant="solid">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
      Error
    </Badge>

    <Badge color="neutral" variant="outlined">Sólo texto</Badge>
  </div>
</template>
