<script setup lang="ts">
// Refleja el ejemplo "Ejemplo completo": un collapse + un botón que llama toggle().
import { ref } from "vue";

type CuCollapseEl = HTMLElement & { toggle(): void };

const faq = ref<CuCollapseEl | null>(null);
const abierto = ref("");

function toggleFaq() {
  faq.value?.toggle();
}

function onToggle(e: Event) {
  abierto.value = `FAQ abierto: ${(e as CustomEvent).detail}`;
}
</script>

<template>
  <VanillaDemo :use="['CuCollapse', 'CuButton']">
    <cu-collapse id="faq" ref="faq" label="¿Qué es ComegenUI?" color="primary" @toggle="onToggle">
      <p>Una librería de componentes UI como Custom Elements nativos.</p>
    </cu-collapse>
    <cu-button @click="toggleFaq">Alternar FAQ</cu-button>
    <p class="cu-demo-output">{{ abierto }}</p>
  </VanillaDemo>
</template>
