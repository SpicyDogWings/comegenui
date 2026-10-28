<script setup lang="ts">
import { ref } from "vue";
import Collapse from "@/components/overlay/Collapse.vue";

const log = ref("(abrí y cerrá el collapse)");
</script>

<template>
  <Collapse
    label="Escuchá el toggle"
    color="primary"
    @toggle="(abierto) => (log = `toggle → ${abierto}`)"
  >
    <p>El estado se registra abajo.</p>
  </Collapse>
  <p class="cu-demo-output">{{ log }}</p>
</template>
