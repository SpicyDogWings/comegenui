<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import Popover from "@/components/overlay/Popover.vue";
</script>

<template>
  <Popover position="bottom" align="start">
    <template #toggle="{ toggle }">
      <Button @click="toggle">bottom / start</Button>
    </template>
    <div>Abajo, alineado al inicio.</div>
  </Popover>

  <Popover position="bottom" align="end">
    <template #toggle="{ toggle }">
      <Button @click="toggle">bottom / end</Button>
    </template>
    <div>Abajo, alineado al final.</div>
  </Popover>

  <Popover position="top" align="center">
    <template #toggle="{ toggle }">
      <Button @click="toggle">top / center</Button>
    </template>
    <div>Arriba, centrado.</div>
  </Popover>

  <Popover position="right" align="start">
    <template #toggle="{ toggle }">
      <Button @click="toggle">right / start</Button>
    </template>
    <div>A la derecha.</div>
  </Popover>

  <Popover position="left" align="center" :offset="12">
    <template #toggle="{ toggle }">
      <Button @click="toggle">left / offset 12</Button>
    </template>
    <div>A la izquierda, con offset.</div>
  </Popover>
</template>
