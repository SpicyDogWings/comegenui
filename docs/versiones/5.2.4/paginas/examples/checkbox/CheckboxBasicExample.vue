<script setup lang="ts">
import { ref } from "vue";
import Checkbox from "@/components/form/Checkbox.vue";

const marcado = ref(true);
const eventos = ref<string[]>([]);

function onChange(valor: boolean) {
  eventos.value = [...eventos.value.slice(-4), `change → ${valor}`];
}
</script>

<template>
  <Checkbox v-model="marcado" label="Acepto los términos" @change="onChange" />
  <pre class="cu-demo-output">{{ eventos.join("\n") || "(sin eventos todavía)" }}</pre>
</template>
