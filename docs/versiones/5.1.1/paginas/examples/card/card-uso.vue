<template>
  <!-- Refleja el ejemplo "Uso en HTML plano" de la ficha (footer con un `<cu-button>`). -->
  <VanillaDemo :use="['CuCard', 'CuButton']">
    <cu-card title="Resumen" subtitle="Último corte" color="primary">
      Contenido principal de la tarjeta.
      <div slot="footer">
        <cu-button color="primary" variant="soft">Ver más</cu-button>
      </div>
    </cu-card>
  </VanillaDemo>
</template>
