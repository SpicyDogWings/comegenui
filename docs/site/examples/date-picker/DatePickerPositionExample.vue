<script setup lang="ts">
import { ref } from "vue";
import DatePicker from "@/components/form/DatePicker.vue";

const fecha = ref<Date | null>(null);
</script>

<template>
  <!-- position: bottom | top | left | right · align: start | center | end -->
  <DatePicker
    v-model="fecha"
    position="top"
    align="end"
    :fixed="true"
    placeholder="position=top / align=end / fixed"
  />
</template>
