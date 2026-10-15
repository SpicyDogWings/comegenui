<script setup lang="ts">
import Dropdown from "@/components/overlay/Dropdown.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const variants = ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"] as const;
</script>

<template>
  <Dropdown v-for="color in colors" :key="color" :label="color" :color="color" variant="solid">
    <p>Panel {{ color }} solid.</p>
  </Dropdown>
  <Dropdown
    v-for="variant in variants"
    :key="variant"
    :label="variant"
    color="primary"
    :variant="variant"
  >
    <p>Panel primary {{ variant }}.</p>
  </Dropdown>
</template>
