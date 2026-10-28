<script setup lang="ts">
// Refleja el ejemplo "Valor, eventos y confirmación": v-model + change/increment/decrement.
import NumberInput from "@/components/form/NumberInput.vue";
import { ref } from "vue";

const valor = ref<number | null>(0);
const salida = ref("(sin eventos todavía)");

function onChange(final: number | null) {
  salida.value = `change → ${JSON.stringify(final)}`;
}

function onIncrement(next: number) {
  salida.value = `increment → ${next}`;
}

function onDecrement(next: number) {
  salida.value = `decrement → ${next}`;
}
</script>

<template>
  <NumberInput
    v-model="valor"
    :min="0"
    :max="10"
    show-step-select
    @change="onChange"
    @increment="onIncrement"
    @decrement="onDecrement"
  />
  <pre class="cu-demo-output">v-model → {{ JSON.stringify(valor) }}</pre>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
