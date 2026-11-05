<template>
  <!-- Refleja el ejemplo "Delay y deshabilitado": `delay` 0 / 1000 y `disabled`. -->
  <VanillaDemo :use="['CuButton', 'CuTooltip']">
    <cu-tooltip text="Aparece casi al instante" delay="0">
      <cu-button>delay 0</cu-button>
    </cu-tooltip>
    <cu-tooltip text="Aparece tras 1 segundo" delay="1000">
      <cu-button>delay 1000</cu-button>
    </cu-tooltip>
    <cu-tooltip text="No deberías verme" disabled>
      <cu-button variant="ghost">disabled</cu-button>
    </cu-tooltip>
  </VanillaDemo>
</template>
