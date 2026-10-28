<script setup lang="ts">
import { ref } from "vue";
import FileInputZone from "@/components/form/FileInputZone.vue";

const archivo = ref<File | File[] | null>(null);
const eventos = ref<string[]>([]);

function onUpdate(files: File | File[] | null) {
  const name = Array.isArray(files) ? files.map((f) => f.name).join(", ") : files?.name ?? "null";
  eventos.value = [...eventos.value.slice(-4), `update:modelValue → ${name}`];
}
</script>

<template>
  <FileInputZone
    v-model="archivo"
    accept="image/*,.pdf"
    placeholder="Arrastrá un archivo o hacé clic"
    @update:model-value="onUpdate"
  />
  <pre class="cu-demo-output">{{ eventos.join("\n") || "(sin eventos todavía)" }}</pre>
</template>
