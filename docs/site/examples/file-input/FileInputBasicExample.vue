<script setup lang="ts">
import { ref } from "vue";
import FileInput from "@/components/form/FileInput.vue";

const archivo = ref<File | null>(null);
const eventos = ref<string[]>([]);

function onUpdate(file: File | null) {
  eventos.value = [...eventos.value.slice(-4), `update:modelValue → ${file ? file.name : "null"}`];
}
</script>

<template>
  <FileInput
    v-model="archivo"
    accept="image/*,.pdf"
    placeholder="Elegí una imagen o PDF"
    @update:model-value="onUpdate"
  />
  <pre class="cu-demo-output">v-model: {{ archivo ? archivo.name : "null" }}
{{ eventos.join("\n") || "(sin eventos todavía)" }}</pre>
</template>
