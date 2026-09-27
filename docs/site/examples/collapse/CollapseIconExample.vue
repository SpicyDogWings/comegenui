<script setup lang="ts">
import Collapse from "@/components/overlay/Collapse.vue";

// La prop `icon` acepta un string SVG/HTML que se inyecta antes del label.
const estrella =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 2.5 14 9l6.5.5-5 4.3 1.5 6.4-5.5-3.4L6 20.2l1.5-6.4-5-4.3L9 9z"/></svg>';
</script>

<template>
  <Collapse label="Con icono" :icon="estrella" color="warning" default-open>
    <p>El icono se renderiza con <code>v-html</code> dentro del trigger.</p>
  </Collapse>
</template>
