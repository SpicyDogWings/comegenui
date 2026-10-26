<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import SideOver from "@/components/overlay/SideOver.vue";

const abierto = ref(false);
</script>

<template>
  <Button color="primary" variant="solid" @click="abierto = true">Abrir panel</Button>

  <SideOver v-model="abierto" title="Filtros" position="right">
    <p>Contenido del panel. Se cierra con el botón, el backdrop o Escape.</p>
  </SideOver>
</template>
