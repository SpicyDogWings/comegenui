<script setup lang="ts">
import { ref } from "vue";
import DatePicker from "@/components/form/DatePicker.vue";

const fecha = ref<Date | null>(null);
const fechaEn = ref<Date | null>(null);
</script>

<template>
  <DatePicker
    v-model="fecha"
    color="primary"
    variant="outlined"
    label="Con etiqueta"
    placeholder="formato y navegación"
    format="dd MMM yyyy"
    month-format="MMM"
    year-format="yy"
    :year-navigation="true"
    :week-start="0"
  />
  <DatePicker
    v-model="fechaEn"
    color="success"
    variant="subtle"
    locale="en"
    month-format="MMMM"
    year-format="yyyy"
    placeholder="locale en"
  />
</template>
