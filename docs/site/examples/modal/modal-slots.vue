<script setup lang="ts">
// Refleja el ejemplo "Slots": `icon`, `default` y `footer`.
import { ref } from "vue";

type ModalEl = HTMLElement & { open: () => void; close: () => void };
const modal = ref<ModalEl | null>(null);
</script>

<template>
  <VanillaDemo :use="['CuButton', 'CuModal']">
    <cu-button color="success" variant="soft" @click="modal?.open()">
      Modal con los tres slots
    </cu-button>

    <cu-modal ref="modal" title="Slots del modal" color="success">
      <!-- icon: a la izquierda del título -->
      <svg
        slot="icon"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>

      <!-- default: cuerpo del modal -->
      <p>Este es el slot <code>default</code>.</p>

      <!-- footer: reemplaza los botones por defecto -->
      <div slot="footer">
        <cu-button variant="ghost" @click="modal?.close()">Cancelar</cu-button>
        <cu-button color="success" variant="solid" @click="modal?.close()">Confirmar</cu-button>
      </div>
    </cu-modal>
  </VanillaDemo>
</template>
