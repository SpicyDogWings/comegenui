<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import SideOver from "@/components/overlay/SideOver.vue";

const abierto = ref(false);
</script>

<template>
  <Button color="warning" @click="abierto = true">Abrir persistente</Button>

  <!-- persistent: sin botón de cerrar; no cierra por backdrop ni Escape.
       Solo se cierra cambiando el v-model desde afuera. -->
  <SideOver v-model="abierto" persistent title="Sin cierre accidental">
    <p>No hay botón de cerrar. Usá el botón de abajo para cerrarlo.</p>
    <Button variant="ghost" @click="abierto = false">Cerrar desde adentro</Button>
  </SideOver>
</template>
