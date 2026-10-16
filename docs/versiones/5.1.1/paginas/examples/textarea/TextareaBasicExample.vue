<script setup lang="ts">
import { ref } from "vue";
import Textarea from "@/components/form/Textarea.vue";

const texto = ref("");
const eventos = ref<string[]>([]);

function onUpdate(val: string | number) {
  eventos.value = [...eventos.value.slice(-4), `update:modelValue → "${val}"`];
}
</script>

<template>
  <Textarea
    v-model="texto"
    :rows="4"
    placeholder="Escribí una descripción…"
    @update:model-value="onUpdate"
  />
  <Textarea :rows="2" no-resize placeholder="no-resize (2 filas)" />
  <!-- `startValue` está declarada en Textarea.vue pero hoy no se aplica al modelo. -->
  <Textarea :rows="2" :start-value="'Valor inicial'" placeholder="startValue (sin efecto)" />
  <pre class="cu-demo-output">{{ eventos.join("\n") || "(sin eventos todavía)" }}</pre>
</template>
