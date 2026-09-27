<script setup lang="ts">
import { ref } from "vue";
import Select from "@/components/form/Select.vue";

const eventos = ref<string[]>([]);
const options = [
  { value: "a", label: "Opción A" },
  { value: "b", label: "Opción B" },
];
</script>

<template>
  <Select :options="options" disabled placeholder="disabled" @blur="eventos.push('blur')" />
  <Select
    :options="options"
    placeholder="Con foco afuera se emite blur"
    @blur="eventos = [...eventos.slice(-4), 'blur']"
  />
  <pre class="cu-demo-output">{{ eventos.join("\n") || "(sin blur todavía)" }}</pre>
</template>
