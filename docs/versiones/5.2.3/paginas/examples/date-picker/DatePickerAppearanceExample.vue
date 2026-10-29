<script setup lang="ts">
import { ref } from "vue";
import DatePicker from "@/components/form/DatePicker.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const variants = ["outlined", "soft", "ghost", "subtle"] as const;

const fecha = ref<Date | null>(null);
const fechaEn = ref<Date | null>(null);
</script>

<template>
  <!-- Colores: los 6 nombres semánticos del trigger y del día seleccionado -->
  <DatePicker
    v-for="color in colors"
    :key="color"
    :color="color"
    :label="color"
    model-value="2026-08-11"
  />

  <!-- Variantes del trigger: las 4 (ghost se mapea a soft en el calendario) -->
  <DatePicker
    v-for="variant in variants"
    :key="variant"
    color="primary"
    :variant="variant"
    :label="variant"
    model-value="2026-08-11"
  />

  <!-- Formato, navegación y locale -->
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
