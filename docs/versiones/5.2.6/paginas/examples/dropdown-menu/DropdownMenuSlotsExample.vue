<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import DropdownMenu from "@/components/controls/DropdownMenu.vue";
</script>

<template>
  <!-- slot toggle scoped: reemplaza el botón del trigger -->
  <DropdownMenu color="primary">
    <template #toggle="{ toggle, isOpen }">
      <Button :color="isOpen ? 'danger' : 'primary'" variant="solid" @click="toggle">
        {{ isOpen ? "Cerrar menú" : "Menú custom" }}
      </Button>
    </template>
  </DropdownMenu>

  <!-- slot default: si no hay items, el panel muestra este contenido -->
  <DropdownMenu label="Contenido libre">
    <div>
      <strong>Sin prop items</strong>
      <p>El panel renderiza el slot <code>default</code>.</p>
    </div>
  </DropdownMenu>
</template>
