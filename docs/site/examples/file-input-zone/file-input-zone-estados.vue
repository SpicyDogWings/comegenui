<template>
  <!-- Refleja el ejemplo "Estados": `disabled` y `readOnly` cortan click, drag y drop. -->
  <VanillaDemo :use="['CuFileInputZone']">
    <cu-file-input-zone disabled placeholder="Deshabilitado"></cu-file-input-zone>
    <cu-file-input-zone read-only placeholder="Solo lectura"></cu-file-input-zone>
  </VanillaDemo>
</template>
