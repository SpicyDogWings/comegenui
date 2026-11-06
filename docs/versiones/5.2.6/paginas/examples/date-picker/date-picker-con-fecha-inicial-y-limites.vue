<template>
  <!-- Refleja el sub-ejemplo "Con fecha inicial y límites": `model-value`,
       `min`, `max` y `format`. -->
  <VanillaDemo :use="['CuDatePicker']">
    <cu-date-picker
      model-value="2026-08-11"
      min="2026-01-01"
      max="2026-12-31"
      format="dd/MM/yyyy"
    ></cu-date-picker>
  </VanillaDemo>
</template>
