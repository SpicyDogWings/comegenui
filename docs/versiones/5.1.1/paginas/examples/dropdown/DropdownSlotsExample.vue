<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import Dropdown from "@/components/overlay/Dropdown.vue";
</script>

<template>
  <!-- slot toggle scoped: recibe `toggle` e `isOpen` -->
  <Dropdown position="bottom" align="start">
    <template #toggle="{ toggle, isOpen }">
      <Button :color="isOpen ? 'danger' : 'primary'" variant="solid" @click="toggle">
        {{ isOpen ? "Cerrar" : "Toggle custom" }}
      </Button>
    </template>
    <p>Toggle reemplazado por el slot <code>toggle</code>.</p>
  </Dropdown>

  <!-- slot default: contenido libre del panel -->
  <Dropdown label="Panel libre">
    <div>
      <strong>Contenido arbitrario</strong>
      <p>Podés poner cualquier HTML en el slot <code>default</code>.</p>
    </div>
  </Dropdown>
</template>
