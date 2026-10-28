<template>
  <!-- Refleja el ejemplo "Slots": el slot `icon`. -->
  <VanillaDemo :use="['CuAlert']">
    <cu-alert color="success" title="Listo">
      <span slot="icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      Operación completada.
    </cu-alert>
  </VanillaDemo>
</template>
