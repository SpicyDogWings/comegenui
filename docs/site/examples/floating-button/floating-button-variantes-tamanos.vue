<script setup lang="ts">
// Refleja el ejemplo "Variantes y tamaños": las 7 variantes y los 3 tamaños.
const variants = ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"] as const;
const sizes = ["sm", "md", "lg"] as const;
</script>

<template>
  <VanillaDemo :use="['CuFloatingButton']">
    <div class="cu-demo-controls">
      <!-- Las 7 variantes, con color primary y size md. -->
      <div
        v-for="variant in variants"
        :key="variant"
        style="position: relative; width: 88px; height: 88px; transform: translateZ(0)"
      >
        <cu-floating-button :variant="variant" color="primary" size="md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </cu-floating-button>
      </div>
    </div>
    <div class="cu-demo-controls">
      <!-- Los 3 tamaños, con color primary y variant solid. -->
      <div
        v-for="size in sizes"
        :key="size"
        style="position: relative; width: 96px; height: 96px; transform: translateZ(0)"
      >
        <cu-floating-button :size="size" color="primary" variant="solid">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </cu-floating-button>
      </div>
    </div>
  </VanillaDemo>
</template>
