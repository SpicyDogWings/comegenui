<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";

const nombre = ref("");
const enviado = ref("");

function onSubmit() {
  enviado.value = nombre.value || "(vacío)";
}

function onReset() {
  enviado.value = "";
}
</script>

<template>
  <form @submit.prevent="onSubmit" @reset="onReset">
    <input v-model="nombre" name="nombre" placeholder="Tu nombre" />
    <!-- `submit` dispara el `@submit` del form; el default del componente es `button`. -->
    <Button type="submit" color="primary" variant="solid">Enviar</Button>
    <Button type="reset" variant="ghost">Limpiar</Button>
    <p v-if="enviado">Enviado: {{ enviado }}</p>
  </form>
</template>
