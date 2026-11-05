<script setup lang="ts">
import { ref } from "vue";
import Select from "@/components/form/Select.vue";

const valor = ref("");
const eventos = ref<string[]>([]);

const options = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
  { value: "uy", label: "Uruguay", disabled: true },
];

function log(msg: string) {
  eventos.value = [...eventos.value.slice(-4), msg];
}
</script>

<template>
  <Select
    v-model="valor"
    :options="options"
    placeholder="Elegí un país"
    @select="(opt) => log(`select → ${JSON.stringify(opt)}`)"
    @close="log('close')"
    @blur="log('blur')"
  />
  <pre class="cu-demo-output">v-model: {{ JSON.stringify(valor) }}
{{ eventos.join("\n") || "(sin eventos todavía)" }}</pre>
</template>
