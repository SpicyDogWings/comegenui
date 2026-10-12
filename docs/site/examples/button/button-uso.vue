<template>
  <!-- Refleja el ejemplo "Uso en HTML plano" de la ficha. -->
  <VanillaDemo :use="['CuButton']">
    <cu-button color="primary" variant="solid">Guardar</cu-button>
    <cu-button color="danger" variant="outlined" disabled>Eliminar</cu-button>
    <cu-button color="success" variant="soft">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      Aceptar
    </cu-button>
    <cu-button to="/componentes/cu-button" variant="link">Volver al inicio</cu-button>
    <cu-button to="https://ejemplo.com" target="_blank" variant="link">Sitio externo</cu-button>
  </VanillaDemo>
</template>
