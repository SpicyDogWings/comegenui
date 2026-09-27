<script setup lang="ts">
import { ref } from "vue";
import DatePicker from "@/components/form/DatePicker.vue";

const fecha = ref<Date | null>(null);
const sinFooter = ref<Date | null>(null);
</script>

<template>
  <DatePicker v-model="fecha" disabled placeholder="disabled" />
  <DatePicker
    v-model="sinFooter"
    :clearable="false"
    :today-button="false"
    placeholder="Sin Hoy ni Limpiar"
  />
</template>
