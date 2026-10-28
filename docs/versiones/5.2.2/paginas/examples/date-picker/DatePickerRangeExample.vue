<script setup lang="ts">
import { ref } from "vue";
import DatePicker from "@/components/form/DatePicker.vue";

const inicio = ref<Date | null>(null);
const fin = ref<Date | null>(null);
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
    mode="range"
    v-model:start-date="inicio"
    v-model:end-date="fin"
    placeholder="Elegí el rango"
    @change="(v) => (eventos = [...eventos.slice(-4), `change → ${JSON.stringify(v)}`])"
    @select="(v) => (eventos = [...eventos.slice(-4), `select → ${JSON.stringify(v)}`])"
  />
  <pre class="cu-demo-output">inicio: {{ fmt(inicio) }} · fin: {{ fmt(fin) }}
{{ eventos.join("\n") || "(sin eventos todavía)" }}</pre>
</template>
