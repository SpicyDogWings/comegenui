<template>
  <!-- Refleja el ejemplo "Colores": los 6 nombres semánticos, abiertos. -->
  <VanillaDemo :use="['CuCollapse']">
    <cu-collapse label="primary" color="primary" default-open>
      <p>Contenido con color primary.</p>
    </cu-collapse>
    <cu-collapse label="secondary" color="secondary" default-open>
      <p>Contenido con color secondary.</p>
    </cu-collapse>
    <cu-collapse label="neutral (default)" color="neutral" default-open>
      <p>Contenido con color neutral.</p>
    </cu-collapse>
    <cu-collapse label="success" color="success" default-open>
      <p>Contenido con color success.</p>
    </cu-collapse>
    <cu-collapse label="warning" color="warning" default-open>
      <p>Contenido con color warning.</p>
    </cu-collapse>
    <cu-collapse label="danger" color="danger" default-open>
      <p>Contenido con color danger.</p>
    </cu-collapse>
  </VanillaDemo>
</template>
