<script setup lang="ts">
import Dropdown from "@/components/overlay/Dropdown.vue";
</script>

<template>
  <Dropdown label="bottom / start" position="bottom" align="start">
    <p>Abajo, alineado al inicio.</p>
  </Dropdown>
  <Dropdown label="bottom / end" position="bottom" align="end">
    <p>Abajo, alineado al final.</p>
  </Dropdown>
  <Dropdown label="top / center" position="top" align="center">
    <p>Arriba, centrado.</p>
  </Dropdown>
  <Dropdown label="right / start" position="right" align="start">
    <p>A la derecha.</p>
  </Dropdown>
  <Dropdown label="left / offset 12" position="left" align="center" :offset="12">
    <p>A la izquierda, con offset.</p>
  </Dropdown>
  <Dropdown label="panelWidth 320px" :panel-width="'320px'">
    <p>El panel mide 320px de ancho.</p>
  </Dropdown>
  <Dropdown label="fixed" fixed>
    <p>Posicionado contra el viewport.</p>
  </Dropdown>
</template>
