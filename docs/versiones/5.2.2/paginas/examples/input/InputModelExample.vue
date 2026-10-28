<script setup lang="ts">
import { ref } from "vue";
import Input from "@/components/form/Input.vue";

const nombre = ref("");
const eventos = ref<string[]>([]);

function onUpdate(val: string | number) {
  eventos.value = [...eventos.value.slice(-4), `update:modelValue → "${val}"`];
}
</script>

<template>
  <Input
    v-model="nombre"
    placeholder="Escribí y mirá el evento"
    @update:model-value="onUpdate"
  />
  <!-- `startValue` está declarada en Input.vue pero hoy no se aplica al modelo. -->
  <Input :start-value="'Valor inicial'" placeholder="startValue (sin efecto)" />
  <pre class="cu-demo-output">{{ eventos.join("\n") || "(sin eventos todavía)" }}</pre>
</template>
