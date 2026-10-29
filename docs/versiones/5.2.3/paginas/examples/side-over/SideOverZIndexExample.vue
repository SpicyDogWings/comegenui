<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import SideOver from "@/components/overlay/SideOver.vue";

const abierto = ref(false);
</script>

<template>
  <Button color="primary" @click="abierto = true">Abrir con zIndex 2000</Button>

  <!-- zIndex define la capa del overlay (default 1100). -->
  <SideOver v-model="abierto" title="zIndex alto" :z-index="2000" position="right">
    <p>Este panel se apila por encima de otros overlays con menor <code>zIndex</code>.</p>
  </SideOver>
</template>
