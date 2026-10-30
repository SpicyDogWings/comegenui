<script setup lang="ts">
import { ref } from "vue";
import FileInputZone from "@/components/form/FileInputZone.vue";

const uno = ref<File | File[] | null>(null);
const dos = ref<File | File[] | null>(null);
const tres = ref<File | File[] | null>(null);
</script>

<template>
  <FileInputZone v-model="uno" color="primary" placeholder="color=primary" />
  <FileInputZone v-model="dos" disabled placeholder="disabled" />
  <FileInputZone v-model="tres" read-only placeholder="readOnly" />
</template>
