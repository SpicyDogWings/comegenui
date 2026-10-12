<template>
  <!-- Refleja el ejemplo "Variantes y tamaños": `color`, `variant` y `size`. -->
  <VanillaDemo :use="['CuFloatingButton']">
    <!-- El FAB es `position: fixed`; un ancestro con `transform` lo contiene dentro del demo. -->
    <div style="position: relative; height: 160px; transform: translateZ(0)">
      <cu-floating-button color="success" variant="soft" size="lg">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
      </cu-floating-button>
    </div>
  </VanillaDemo>
</template>
