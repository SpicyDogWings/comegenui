<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";

const nombre = ref("");
const enviado = ref("");
const guardando = ref(false);
const evento = ref("Sin loading-change todavía.");

function onLoadingChange(value: boolean) {
  evento.value = `loading-change → ${value}`;
}

async function onSubmit() {
  guardando.value = true;
  // Reemplazá esto por tu llamada real (fetch, etc.).
  await new Promise((resolve) => setTimeout(resolve, 1200));
  enviado.value = nombre.value || "(vacío)";
  guardando.value = false;
}

function onReset() {
  enviado.value = "";
  evento.value = "Sin loading-change todavía.";
}
</script>

<template>
  <form @submit.prevent="onSubmit" @reset="onReset">
    <input v-model="nombre" name="nombre" placeholder="Tu nombre" />

    <!-- Los íconos van como SVG inline dentro del slot default (no hay slots con nombre). -->
    <Button type="submit" color="primary" variant="solid" :loading="guardando" @loading-change="onLoadingChange">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {{ guardando ? "Enviando…" : "Enviar" }}
    </Button>

    <Button type="reset" variant="ghost">
      Limpiar
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </Button>
  </form>

  <p class="cu-demo-output">Enviado: {{ enviado || "—" }}</p>
  <p class="cu-demo-output">{{ evento }}</p>
</template>
