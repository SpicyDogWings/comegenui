<template>
  <!-- Refleja el ejemplo "Formato y locale": format, locale, month-format,
       year-format, week-start y year-navigation. -->
  <VanillaDemo :use="['CuDatePicker']">
    <cu-date-picker
      model-value="2026-08-11"
      label="Con formato"
      format="dd MMM yyyy"
      month-format="MMM"
      year-format="yy"
      year-navigation
      :week-start="0"
    ></cu-date-picker>
    <cu-date-picker
      model-value="2026-08-11"
      label="locale en"
      locale="en"
      month-format="MMMM"
      year-format="yyyy"
      placeholder="locale en"
    ></cu-date-picker>
  </VanillaDemo>
</template>
