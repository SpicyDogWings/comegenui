<template>
  <!-- Refleja el ejemplo "Estado deshabilitado": `disabled` bloquea el click. -->
  <VanillaDemo :use="['CuSwitch']">
    <cu-switch disabled label="Encendido y deshabilitado" :model-value="true"></cu-switch>
    <cu-switch disabled label="Apagado y deshabilitado"></cu-switch>
  </VanillaDemo>
</template>
