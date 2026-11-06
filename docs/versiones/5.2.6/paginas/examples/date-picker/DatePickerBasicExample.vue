<script setup lang="ts">
import { ref } from "vue";
import DatePicker from "@/components/form/DatePicker.vue";

const fecha = ref<Date | null>(null);
const eventos = ref<string[]>([]);

function fmt(v: unknown): string {
  if (v instanceof Date) {
    const d = String(v.getDate()).padStart(2, "0");
    const m = String(v.getMonth() + 1).padStart(2, "0");
    return `${d}/${m}/${v.getFullYear()}`;
  }
  return JSON.stringify(v);
}
</script>

<template>
  <DatePicker
    v-model="fecha"
    placeholder="Elegí una fecha"
    @select="(v) => (eventos = [...eventos.slice(-4), `select → ${fmt(v)}`])"
    @change="(v) => (eventos = [...eventos.slice(-4), `change → ${fmt(v)}`])"
    @open="eventos = [...eventos.slice(-4), 'open']"
    @close="eventos = [...eventos.slice(-4), 'close']"
  />
  <pre class="cu-demo-output">v-model: {{ fmt(fecha) }}
{{ eventos.join("\n") || "(sin eventos todavía)" }}</pre>
</template>
