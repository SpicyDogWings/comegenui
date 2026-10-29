<template>
  <!-- Refleja el ejemplo "Semana y locale": semana desde domingo y mes en inglés. -->
  <VanillaDemo :use="['CuCalendar']">
    <cu-calendar week-start="0"></cu-calendar>
    <cu-calendar locale="en"></cu-calendar>
  </VanillaDemo>
</template>
