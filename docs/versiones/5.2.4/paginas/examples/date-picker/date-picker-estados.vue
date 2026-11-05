<template>
  <!-- Refleja el ejemplo "Estados y footer": disabled, clearable y today-button. -->
  <VanillaDemo :use="['CuDatePicker']">
    <cu-date-picker disabled model-value="2026-08-11" placeholder="disabled"></cu-date-picker>
    <cu-date-picker :clearable="false" :today-button="false" placeholder="Sin Hoy ni Limpiar"></cu-date-picker>
  </VanillaDemo>
</template>
