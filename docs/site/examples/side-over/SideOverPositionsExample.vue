<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import SideOver from "@/components/overlay/SideOver.vue";

const right = ref(false);
const left = ref(false);
const top = ref(false);
const bottom = ref(false);
</script>

<template>
  <Button @click="right = true">position right (default)</Button>
  <Button @click="left = true">position left</Button>
  <Button @click="top = true">position top</Button>
  <Button @click="bottom = true">position bottom</Button>

  <SideOver v-model="right" title="Desde la derecha" position="right">
    <p>Desliza desde el borde derecho.</p>
  </SideOver>
  <SideOver v-model="left" title="Desde la izquierda" position="left">
    <p>Desliza desde el borde izquierdo.</p>
  </SideOver>
  <SideOver v-model="top" title="Desde arriba" position="top" size="40vh">
    <p>Desliza desde el borde superior.</p>
  </SideOver>
  <SideOver v-model="bottom" title="Desde abajo" position="bottom" size="40vh">
    <p>Desliza desde el borde inferior.</p>
  </SideOver>
</template>
