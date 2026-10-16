<script setup lang="ts">
import { ref } from "vue";
import Popover from "@/components/overlay/Popover.vue";
import Button from "@/components/buttons/Button.vue";

const log = ref("(abrí y cerrá el popover)");
</script>

<template>
  <Popover @open="log = 'open'" @close="log = 'close'">
    <template #toggle="{ toggle }">
      <Button color="primary" variant="soft" @click="toggle">abrir / cerrar</Button>
    </template>
    <p>El último evento queda registrado abajo.</p>
  </Popover>
  <p class="cu-demo-output">{{ log }}</p>
</template>
