<script setup lang="ts">
// Refleja el ejemplo "Label y contenido (slot)": texto en `label`, contenido rico
// en el slot (tiene prioridad) y el mismo corte en vertical.
import Divider from "@/components/information/Divider.vue";
import Badge from "@/components/information/Badge.vue";
</script>

<template>
  <Divider label="O sección" />

  <Divider>
    <Badge color="primary" variant="soft">Nuevo</Badge>
  </Divider>

  <div style="display: flex; align-items: stretch; gap: 16px; height: 120px; padding: 0 8px">
    <span style="display: flex; align-items: center; color: var(--cu-color-neutral)">Arriba</span>
    <Divider orientation="vertical" label="o" />
    <span style="display: flex; align-items: center; color: var(--cu-color-neutral)">Abajo</span>
  </div>
</template>
