<script setup lang="ts">
// Refleja el ejemplo "Toggle personalizado": slot `toggle` con un botón propio.
import { ref } from "vue";

type MenuEl = HTMLElement & { toggle: () => void };
const dd = ref<MenuEl | null>(null);
</script>

<template>
  <VanillaDemo :use="['CuDropdownMenu']">
    <cu-dropdown-menu ref="dd" color="primary">
      <button
        slot="toggle"
        type="button"
        @click="dd?.toggle()"
        style="background:#3b82f6;color:white;border:none;border-radius:6px;padding:8px 14px;cursor:pointer"
      >
        ☰ Menú
      </button>
    </cu-dropdown-menu>
  </VanillaDemo>
</template>
