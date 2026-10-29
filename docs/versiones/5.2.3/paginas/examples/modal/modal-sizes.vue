<script setup lang="ts">
// Refleja el ejemplo "Tamaños": los 6 valores de `size` y los 6 de `height`.
import { ref } from "vue";

type ModalEl = HTMLElement & { open: () => void };
const modal = ref<ModalEl | null>(null);
const values = ["auto", "sm", "md", "lg", "xl", "full"] as const;
const size = ref("md");
const height = ref("auto");

function abrir(tipo: "size" | "height", value: string) {
  if (tipo === "size") size.value = value;
  else height.value = value;
  modal.value?.open();
}
</script>

<template>
  <VanillaDemo :use="['CuModal']">
    <div class="cu-demo-controls">
      <button
        v-for="value in values"
        :key="`size-${value}`"
        type="button"
        @click="abrir('size', value)"
      >
        size: {{ value }}
      </button>
    </div>
    <div class="cu-demo-controls">
      <button
        v-for="value in values"
        :key="`height-${value}`"
        type="button"
        @click="abrir('height', value)"
      >
        height: {{ value }}
      </button>
    </div>

    <cu-modal ref="modal" :size="size" :height="height" :title="`size=${size} · height=${height}`">
      <p><code>size</code> controla el ancho y <code>height</code>, el alto.</p>
    </cu-modal>
  </VanillaDemo>
</template>
