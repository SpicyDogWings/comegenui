<script setup lang="ts">
import { ref } from "vue";
import Loader from "@/components/information/Loader.vue";
import Button from "@/components/buttons/Button.vue";

// `cooldown` se agota una vez; para repetirlo se remonta con otra `key`.
const run = ref(0);

function repetir() {
  run.value++;
}
</script>

<template>
  <div class="cu-demo-controls">
    <code style="min-width: 120px">animation="loading"</code>
    <div style="position: relative; flex: 1; height: 12px">
      <Loader animation="loading" color="primary" />
    </div>
  </div>

  <div class="cu-demo-controls">
    <code style="min-width: 120px">animation="cooldown"</code>
    <div style="position: relative; flex: 1; height: 12px">
      <Loader :key="run" animation="cooldown" :delay="3000" color="success" />
    </div>
    <Button size="sm" variant="outlined" @click="repetir">Repetir</Button>
  </div>
</template>
