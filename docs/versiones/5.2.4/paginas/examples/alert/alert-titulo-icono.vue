<script setup lang="ts">
// Refleja el ejemplo "Título e ícono": sin ninguno, con título, con ícono y con los dos.
</script>

<template>
  <VanillaDemo :use="['CuAlert']">
    <cu-alert color="neutral" variant="soft">Sin título ni ícono.</cu-alert>

    <cu-alert color="primary" variant="soft" title="Con título">
      El título va en la cabecera.
    </cu-alert>

    <cu-alert color="primary" variant="soft">
      <span slot="icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4m0 4h.01" />
        </svg>
      </span>
      Sólo ícono: el slot arma la cabecera.
    </cu-alert>

    <cu-alert color="success" variant="soft" title="Con título e ícono">
      <span slot="icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      Título e ícono juntos.
    </cu-alert>
  </VanillaDemo>
</template>
