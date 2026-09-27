<script setup lang="ts">
import { ref } from "vue";
import DatePicker from "@/components/form/DatePicker.vue";

const fecha = ref<Date | null>(null);

const hoy = new Date();
function iso(offset: number) {
  const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const eventos = [
  { date: iso(2), color: "primary" },
  { date: iso(5), color: "danger" },
];
</script>

<template>
  <!-- `events` pinta puntos; `grid` y `border` cambian la grilla del calendario. -->
  <DatePicker
    v-model="fecha"
    :events="eventos"
    :grid="true"
    :border="true"
    placeholder="Con eventos y grilla"
  />
</template>
