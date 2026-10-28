<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import SideOver from "@/components/overlay/SideOver.vue";

const abierto = ref(false);
</script>

<template>
  <Button color="primary" @click="abierto = true">Abrir fullscreen</Button>

  <!-- fullscreen ignora `size` y ocupa toda la pantalla. -->
  <SideOver v-model="abierto" fullscreen title="Pantalla completa" position="right">
    <p>El panel ocupa el 100% del viewport.</p>
  </SideOver>
</template>
