<template>
  <!-- Refleja el ejemplo "Posición": los 4 lados y las 3 alineaciones. -->
  <VanillaDemo :use="['CuButton', 'CuTooltip']">
    <cu-tooltip text="Arriba" position="top" align="center" offset="6">
      <cu-button variant="outlined">top</cu-button>
    </cu-tooltip>
    <cu-tooltip text="Abajo" position="bottom" align="center">
      <cu-button variant="outlined">bottom</cu-button>
    </cu-tooltip>
    <cu-tooltip text="Izquierda" position="left" align="start">
      <cu-button variant="outlined">left</cu-button>
    </cu-tooltip>
    <cu-tooltip text="Derecha" position="right" align="end">
      <cu-button variant="outlined">right</cu-button>
    </cu-tooltip>
  </VanillaDemo>
</template>
