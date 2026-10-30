<script setup lang="ts">
// Refleja el ejemplo "Eventos": `opened`, `close`, `closed`, `accept` y `cancel`.
import { ref } from "vue";

type ModalEl = HTMLElement & { open: () => void };
const modal = ref<ModalEl | null>(null);
const persistente = ref<ModalEl | null>(null);
const eventos = ref<string[]>([]);

function log(nombre: string) {
  eventos.value = [...eventos.value, nombre];
}
</script>

<template>
  <VanillaDemo :use="['CuModal']">
    <div class="cu-demo-controls">
      <button type="button" @click="modal?.open()">Modal normal</button>
      <button type="button" @click="persistente?.open()">Modal persistente</button>
    </div>

    <cu-modal
      ref="modal"
      title="Todos los eventos"
      @opened="log('opened')"
      @close="log('close')"
      @closed="log('closed')"
    >
      <p>
        Al abrir se emite <code>opened</code>; al cerrar, <code>close</code> y <code>closed</code>.
      </p>
    </cu-modal>

    <cu-modal
      ref="persistente"
      persistent
      title="Persistente"
      color="primary"
      @opened="log('opened (persistent)')"
      @close="log('close (persistent)')"
      @closed="log('closed (persistent)')"
      @accept="log('accept')"
      @cancel="log('cancel')"
    >
      <p>El footer por defecto emite <code>accept</code> y <code>cancel</code>.</p>
    </cu-modal>

    <pre class="cu-demo-output">{{ eventos.join("\n") || "Sin eventos todavía." }}</pre>
  </VanillaDemo>
</template>
