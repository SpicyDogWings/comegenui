<template>
  <!-- Refleja el ejemplo "Tamaños": `sm` y `md` (default). -->
  <VanillaDemo :use="['CuCheckbox']">
    <div class="cu-demo-controls">
      <cu-checkbox size="sm" label="sm" :model-value="true"></cu-checkbox>
      <cu-checkbox size="md" label="md (default)" :model-value="true"></cu-checkbox>
    </div>
  </VanillaDemo>
</template>
