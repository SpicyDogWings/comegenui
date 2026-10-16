<template>
  <!-- Refleja el ejemplo "Días deshabilitados": ventana + weekdays y feriados. -->
  <VanillaDemo :use="['CuCalendar']">
    <cu-calendar min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6"></cu-calendar>
    <cu-calendar min="2026-08-10" max="2026-08-25" disabled-dates="2026-08-15,2026-08-16"></cu-calendar>
    <cu-calendar disabled-weekdays="0,6"></cu-calendar>
  </VanillaDemo>
</template>
