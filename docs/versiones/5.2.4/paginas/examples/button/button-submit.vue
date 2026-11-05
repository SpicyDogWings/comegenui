<script setup lang="ts">
// Refleja el ejemplo "Tipo submit/reset" dentro de un `<form>`.
import { ref } from "vue";

const mensaje = ref("");

function onSubmit() {
  mensaje.value = "Formulario enviado (submit capturado).";
}
</script>

<template>
  <VanillaDemo :use="['CuButton']">
    <form @submit.prevent="onSubmit" @reset="mensaje = ''">
      <cu-button type="submit" color="primary" variant="solid">Enviar</cu-button>
      <cu-button type="reset" variant="ghost">Limpiar</cu-button>
    </form>
    <p v-if="mensaje" class="cu-demo-output">{{ mensaje }}</p>
  </VanillaDemo>
</template>
