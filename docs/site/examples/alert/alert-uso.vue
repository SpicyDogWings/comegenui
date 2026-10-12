<template>
  <!-- Refleja el ejemplo "Uso en HTML plano" de la ficha. -->
  <VanillaDemo :use="['CuAlert']">
    <cu-alert color="success" variant="solid" title="Operación exitosa" close>
      Los datos se guardaron correctamente.
    </cu-alert>
    <cu-alert color="danger" variant="outlined">
      <span slot="icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        </svg>
      </span>
      Ha ocurrido un error.
    </cu-alert>
  </VanillaDemo>
</template>
