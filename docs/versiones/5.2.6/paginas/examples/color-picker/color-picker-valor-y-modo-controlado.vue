<script setup lang="ts">
// Refleja el ejemplo "Valor y modo controlado": escuchás `update:modelValue` y
// decidís qué color queda (acá el "host" es una caja de preview, no `<body>`).
import { onMounted, ref } from "vue";

const cp = ref<HTMLElement | null>(null);
const color = ref("#3b82f6");

onMounted(async () => {
  await customElements.whenDefined("cu-color-picker");
  cp.value?.addEventListener("update:modelValue", (e) => {
    color.value = (e as CustomEvent<string>).detail;
  });
});
</script>

<template>
  <VanillaDemo :use="['CuColorPicker']">
    <cu-color-picker ref="cp" :model-value="color"></cu-color-picker>
    <div
      class="cu-demo-output"
      :style="{ borderColor: color, borderWidth: '4px', borderStyle: 'solid' }"
    >
      update:modelValue → {{ color }} (aplicado al borde de esta caja)
    </div>
  </VanillaDemo>
</template>
