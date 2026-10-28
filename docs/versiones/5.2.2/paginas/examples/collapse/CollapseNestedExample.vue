<script setup lang="ts">
import Collapse from "@/components/overlay/Collapse.vue";
</script>

<template>
  <Collapse label="Sección padre" color="primary" default-open>
    <p>Contenido de nivel superior.</p>
    <Collapse label="Hijo anidado" color="secondary">
      <p>Un collapse dentro del contenido del padre (slot default).</p>
      <Collapse label="Nieto">
        <p>Tercer nivel de anidamiento.</p>
      </Collapse>
    </Collapse>
  </Collapse>
</template>
