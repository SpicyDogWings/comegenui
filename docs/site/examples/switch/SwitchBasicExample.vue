<script setup lang="ts">
import { ref } from "vue";
import Switch from "@/components/form/Switch.vue";

const activo = ref(true);
const eventos = ref<string[]>([]);

function onChange(val: boolean) {
  eventos.value = [...eventos.value.slice(-4), `change → ${val}`];
}
</script>

<template>
  <Switch v-model="activo" label="Activo" @change="onChange" />
  <pre class="cu-demo-output">{{ eventos.join("\n") || "(sin eventos todavía)" }}</pre>
</template>
