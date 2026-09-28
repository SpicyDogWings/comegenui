<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import SideOver from "@/components/overlay/SideOver.vue";

const sm = ref(false);
const md = ref(false);
const lg = ref(false);
const xl = ref(false);
const custom = ref(false);
</script>

<template>
  <Button @click="sm = true">size sm (320px)</Button>
  <Button @click="md = true">size md (400px)</Button>
  <Button @click="lg = true">size lg (512px)</Button>
  <Button @click="xl = true">size xl (640px)</Button>
  <Button @click="custom = true">size "40vw"</Button>

  <SideOver v-model="sm" size="sm" title="sm" position="right">
    <p>Preset <code>sm</code>.</p>
  </SideOver>
  <SideOver v-model="md" size="md" title="md" position="right">
    <p>Preset <code>md</code>.</p>
  </SideOver>
  <SideOver v-model="lg" size="lg" title="lg" position="right">
    <p>Preset <code>lg</code>.</p>
  </SideOver>
  <SideOver v-model="xl" size="xl" title="xl" position="right">
    <p>Preset <code>xl</code>.</p>
  </SideOver>
  <SideOver v-model="custom" size="40vw" title="40vw" position="right">
    <p>Un valor CSS arbitrario.</p>
  </SideOver>
</template>
