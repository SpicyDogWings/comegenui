<template>
  <!-- Refleja el ejemplo "Rango dual": `dual-calendar` implica rango (2 meses). -->
  <VanillaDemo :use="['CuDatePicker']">
    <cu-date-picker
      dual-calendar
      year-navigation
      start-date="2026-09-03"
      end-date="2026-09-15"
      placeholder="Rango a dos meses"
    ></cu-date-picker>
  </VanillaDemo>
</template>
