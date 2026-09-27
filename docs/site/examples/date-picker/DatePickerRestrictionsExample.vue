<script setup lang="ts">
import { ref } from "vue";
import DatePicker from "@/components/form/DatePicker.vue";

const fecha = ref<Date | null>(null);

const hoy = new Date();
const min = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
const max = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 60);

function iso(offset: number) {
  const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
</script>

<template>
  <!-- min/max acotan; 0 = domingo, 6 = sábado; disabledDates bloquea días puntuales. -->
  <DatePicker
    v-model="fecha"
    :min="min"
    :max="max"
    :disabled-weekdays="[0, 6]"
    :disabled-dates="[iso(3), iso(4)]"
    placeholder="Entre hoy y +60 días, sin fines de semana"
  />
</template>
