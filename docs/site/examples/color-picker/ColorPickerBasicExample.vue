<script setup lang="ts">
import { ref } from "vue";
import ColorPicker from "@/components/form/ColorPicker.vue";

const color = ref("#3b82f6");
const eventos = ref<string[]>([]);

function onChange(hex: string) {
  eventos.value = [...eventos.value.slice(-4), `change → ${hex}`];
}
</script>

<template>
  <ColorPicker v-model="color" @change="onChange" />
  <pre class="cu-demo-output">valor: {{ color }}
{{ eventos.join("\n") || "(sin eventos todavía)" }}</pre>
</template>
