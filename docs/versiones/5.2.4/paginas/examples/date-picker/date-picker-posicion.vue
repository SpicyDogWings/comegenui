<template>
  <!-- Refleja el ejemplo "Posición": position, align y fixed. -->
  <VanillaDemo :use="['CuDatePicker']">
    <cu-date-picker position="bottom" align="start" placeholder="bottom / start"></cu-date-picker>
    <cu-date-picker position="top" align="end" placeholder="top / end"></cu-date-picker>
    <cu-date-picker position="left" align="center" placeholder="left / center"></cu-date-picker>
    <cu-date-picker position="right" align="start" fixed placeholder="right / start / fixed"></cu-date-picker>
  </VanillaDemo>
</template>
