<template>
  <!-- Refleja el ejemplo "Contenido enriquecido": slot `content` con HTML. -->
  <VanillaDemo :use="['CuTooltip']">
    <cu-tooltip position="right" align="start" delay="300">
      <span>Elemento con tooltip rico</span>
      <span slot="content">
        <strong>Más contexto</strong> con HTML
      </span>
    </cu-tooltip>
  </VanillaDemo>
</template>
