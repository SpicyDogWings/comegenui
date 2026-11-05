<template>
  <!-- Refleja el ejemplo "Controles de mes": saltos de año y solo mes (drag). -->
  <VanillaDemo :use="['CuCalendar']">
    <cu-calendar year-navigation month-format="MMM" year-format="yy"></cu-calendar>
    <cu-calendar></cu-calendar>
  </VanillaDemo>
</template>
