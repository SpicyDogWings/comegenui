<template>
  <!-- Refleja el ejemplo "Estados": `disabled` (atenuado, sin click) y `loading`
       (spinner + deshabilitado mientras está activo). -->
  <VanillaDemo :use="['CuFloatingButton']">
    <div class="cu-demo-controls">
      <div style="position: relative; width: 88px; height: 88px; transform: translateZ(0)">
        <cu-floating-button disabled color="neutral" variant="soft" size="sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </cu-floating-button>
      </div>
      <div style="position: relative; width: 88px; height: 88px; transform: translateZ(0)">
        <cu-floating-button loading color="primary" variant="solid" size="sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </cu-floating-button>
      </div>
    </div>
  </VanillaDemo>
</template>
