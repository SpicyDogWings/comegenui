<script setup lang="ts">
import { ref } from "vue";
import Autocomplete from "@/components/form/Autocomplete.vue";

const texto = ref("");
const eventos = ref<string[]>([]);

const items = [
  { label: "Argentina", value: "ar" },
  { label: "Brasil", value: "br" },
  { label: "Chile", value: "cl" },
  { label: "Uruguay", value: "uy" },
  { label: "Paraguay", value: "py" },
];

function onSelect(item: unknown) {
  eventos.value = [...eventos.value.slice(-4), `select → ${JSON.stringify(item)}`];
}

function onBlur() {
  eventos.value = [...eventos.value.slice(-4), "blur"];
}
</script>

<template>
  <Autocomplete
    v-model="texto"
    :items="items"
    :min-chars="1"
    placeholder="Escribí una letra…"
    @select="onSelect"
    @blur="onBlur"
  />
  <pre class="cu-demo-output">v-model: {{ JSON.stringify(texto) }}
{{ eventos.join("\n") || "(sin eventos todavía)" }}</pre>
</template>
