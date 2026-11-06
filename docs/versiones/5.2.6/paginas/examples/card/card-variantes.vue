<template>
  <!-- Refleja el ejemplo "Variantes visuales": ghost (default), outlined, soft, subtle y solid. -->
  <VanillaDemo :use="['CuCard']">
    <div class="cu-demo-controls">
      <cu-card title="Ghost">ghost (default)</cu-card>
      <cu-card title="Outlined" variant="outlined" color="primary">outlined</cu-card>
      <cu-card title="Soft" variant="soft" color="primary">soft</cu-card>
      <cu-card title="Subtle" variant="subtle" color="primary">subtle</cu-card>
      <cu-card title="Solid" variant="solid" color="primary">solid</cu-card>
    </div>
  </VanillaDemo>
</template>
