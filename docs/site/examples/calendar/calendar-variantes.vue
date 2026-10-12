<template>
  <!-- Refleja el ejemplo "Variantes del día seleccionado": solid, outlined y soft. -->
  <VanillaDemo :use="['CuCalendar']">
    <cu-calendar model-value="2026-08-11" variant="solid"></cu-calendar>
    <cu-calendar model-value="2026-08-11" variant="outlined"></cu-calendar>
    <cu-calendar model-value="2026-08-11" variant="soft"></cu-calendar>
  </VanillaDemo>
</template>
