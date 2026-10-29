<script setup lang="ts">
import { ref } from "vue";
import Alert from "@/components/information/Alert.vue";
import Button from "@/components/buttons/Button.vue";

const show = ref(true);
const log = ref<string[]>([]);

function record(entry: string) {
  log.value = [entry, ...log.value].slice(0, 6);
}

function onUpdateShow(value: boolean) {
  show.value = value;
  record(`update:show → ${value}`);
}
</script>

<template>
  <div class="cu-demo-controls">
    <Button color="primary" variant="solid" @click="show = true">show = true</Button>
    <Button color="neutral" variant="ghost" @click="show = false">show = false</Button>
  </div>

  <Alert
    :show="show"
    color="danger"
    variant="soft"
    title="Errores"
    close
    @update:show="onUpdateShow"
    @open="record('open')"
    @close="record('close')"
  >
    `update:show`, `open` y `close` se emiten al cambiar la visibilidad.
  </Alert>

  <p class="cu-demo-output">{{ log.length ? log.join("\n") : "Sin eventos todavía." }}</p>
</template>
