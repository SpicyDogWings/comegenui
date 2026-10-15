<script setup lang="ts">
// Refleja el ejemplo "Eventos y grilla": `events` pinta puntos; `grid` y `border`
// cambian la grilla del calendario interno.
const hoy = new Date();
function iso(offset: number) {
  const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const events = [
  { date: iso(2), color: "primary" },
  { date: iso(5), color: "danger" },
];
</script>

<template>
  <VanillaDemo :use="['CuDatePicker']">
    <cu-date-picker
      :events.prop="events"
      grid
      border
      placeholder="Con eventos y grilla"
    ></cu-date-picker>
  </VanillaDemo>
</template>
