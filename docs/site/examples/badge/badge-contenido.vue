<script setup lang="ts">
// Refleja el ejemplo "Contenido": el slot default con texto, con ícono y con los dos.
</script>

<template>
  <VanillaDemo :use="['CuBadge']">
    <div class="cu-demo-controls">
      <cu-badge color="neutral" variant="outlined">Sólo texto</cu-badge>

      <cu-badge color="success" variant="soft">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          style="vertical-align: middle"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        Verificado
      </cu-badge>

      <cu-badge color="primary" variant="solid" aria-label="Nuevo">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          style="vertical-align: middle"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </cu-badge>
    </div>
  </VanillaDemo>
</template>
