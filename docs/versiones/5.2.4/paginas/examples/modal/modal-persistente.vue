<script setup lang="ts">
// Refleja el ejemplo "Modal persistente": no se cierra por backdrop ni Escape.
import { ref } from "vue";

type ModalEl = HTMLElement & { open: () => void; close: () => void };
const modal = ref<ModalEl | null>(null);
</script>

<template>
  <VanillaDemo :use="['CuButton', 'CuInput', 'CuModal']">
    <button type="button" @click="modal?.open()">Editar perfil</button>

    <cu-modal ref="modal" persistent title="Editar perfil">
      <cu-input placeholder="Nombre"></cu-input>
      <div slot="footer">
        <cu-button variant="solid" @click="modal?.close()">Guardar</cu-button>
      </div>
    </cu-modal>
  </VanillaDemo>
</template>
