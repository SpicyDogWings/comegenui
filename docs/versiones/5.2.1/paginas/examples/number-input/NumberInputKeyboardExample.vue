<script setup lang="ts">
// Refleja el ejemplo "Teclado": ↑ / ↓ con el paso activo y Enter para confirmar.
import NumberInput from "@/components/form/NumberInput.vue";
import { ref } from "vue";

const valor = ref<number | null>(0);
const confirmado = ref("(sin confirmar todavía)");
</script>

<template>
  <NumberInput v-model="valor" placeholder="Enfocá y usá ↑ / ↓" @change="confirmado = `change → ${$event}`" />
  <NumberInput :step="5" placeholder="↑ / ↓ de a 5" />
  <pre class="cu-demo-output">v-model → {{ JSON.stringify(valor) }} · {{ confirmado }}</pre>
</template>
