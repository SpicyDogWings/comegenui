<script setup lang="ts">
import { ref } from "vue";
import DatePicker from "@/components/form/DatePicker.vue";

const inicio = ref<Date | null>(null);
const fin = ref<Date | null>(null);
</script>

<template>
  <!-- dualCalendar implica rango aunque `mode` quede en single. -->
  <DatePicker
    dual-calendar
    v-model:start-date="inicio"
    v-model:end-date="fin"
    :year-navigation="true"
    placeholder="Rango a dos meses"
  />
</template>
