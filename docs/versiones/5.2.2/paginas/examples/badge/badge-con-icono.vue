<template>
  <!-- Refleja el ejemplo "Con ícono": SVG dentro del slot default. -->
  <VanillaDemo :use="['CuBadge']">
    <cu-badge color="success" variant="soft">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block;vertical-align:middle;margin-right:4px">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      Verificado
    </cu-badge>
  </VanillaDemo>
</template>
