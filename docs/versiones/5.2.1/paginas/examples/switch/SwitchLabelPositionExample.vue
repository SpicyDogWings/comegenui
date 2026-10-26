<script setup lang="ts">
import { ref } from "vue";
import Switch from "@/components/form/Switch.vue";

const izquierda = ref(true);
const derecha = ref(true);
</script>

<template>
  <Switch
    v-model="izquierda"
    color="primary"
    label-position="start"
    label="A la izquierda"
  />
  <Switch v-model="derecha" color="primary" label="A la derecha (default)" />
</template>
