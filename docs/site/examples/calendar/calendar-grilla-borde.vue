<template>
  <!-- Refleja el ejemplo "Grilla y borde": líneas interiores (`grid`), marco exterior (`border`) y ambos. -->
  <VanillaDemo :use="['CuCalendar']">
    <cu-calendar grid></cu-calendar>
    <cu-calendar border></cu-calendar>
    <cu-calendar grid border></cu-calendar>
  </VanillaDemo>
</template>
