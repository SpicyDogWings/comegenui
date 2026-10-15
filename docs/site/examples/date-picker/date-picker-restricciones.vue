<template>
  <!-- Refleja el ejemplo "Restricciones": min/max, disabled-weekdays (0=dom) y disabled-dates. -->
  <VanillaDemo :use="['CuDatePicker']">
    <cu-date-picker
      min="2026-01-01"
      max="2026-12-31"
      disabled-weekdays="0,6"
      disabled-dates="2026-08-15,2026-08-16"
      placeholder="Sin fines de semana ni el 15/16 de agosto"
    ></cu-date-picker>
  </VanillaDemo>
</template>
