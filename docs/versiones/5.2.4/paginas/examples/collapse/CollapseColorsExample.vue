<script setup lang="ts">
import Collapse from "@/components/overlay/Collapse.vue";
</script>

<template>
  <Collapse label="Primary" color="primary" default-open>
    <p>Contenido con color primary.</p>
  </Collapse>
  <Collapse label="Secondary" color="secondary" default-open>
    <p>Contenido con color secondary.</p>
  </Collapse>
  <Collapse label="Success" color="success" default-open>
    <p>Contenido con color success.</p>
  </Collapse>
  <Collapse label="Warning" color="warning" default-open>
    <p>Contenido con color warning.</p>
  </Collapse>
  <Collapse label="Danger" color="danger" default-open>
    <p>Contenido con color danger.</p>
  </Collapse>
  <Collapse label="Neutral (default)" color="neutral" default-open>
    <p>Contenido con color neutral.</p>
  </Collapse>
</template>
