<template>
  <!-- Refleja el ejemplo "Grilla de 7 columnas": ancho fluido vs. ancho fijo. -->
  <VanillaDemo :use="['CuCalendar']">
    <cu-calendar style="width: 100%; max-width: 420px;"></cu-calendar>
    <cu-calendar style="width: 280px;"></cu-calendar>
  </VanillaDemo>
</template>
