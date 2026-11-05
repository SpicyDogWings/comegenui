<script setup lang="ts">
// Refleja el ejemplo "Label y contenido (slot)": texto en el atributo `label`,
// contenido rico en el slot (tiene prioridad) y el mismo corte en vertical.
const texto = { display: "flex", alignItems: "center", color: "var(--cu-color-neutral)" };
</script>

<template>
  <VanillaDemo :use="['CuDivider', 'CuBadge']">
    <cu-divider label="O sección"></cu-divider>

    <cu-divider>
      <cu-badge color="primary" variant="soft">Nuevo</cu-badge>
    </cu-divider>

    <div style="display: flex; align-items: stretch; gap: 16px; height: 120px; padding: 0 8px">
      <span :style="texto">Arriba</span>
      <cu-divider orientation="vertical" label="o"></cu-divider>
      <span :style="texto">Abajo</span>
    </div>
  </VanillaDemo>
</template>
