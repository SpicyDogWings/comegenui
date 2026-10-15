<template>
  <!-- Refleja el ejemplo "Múltiples archivos y carpetas": `multiple`, `directory`
       y `directory-deep` (0 = sólo la raíz, 1 = +1 subnivel, -1 = sin límite). -->
  <VanillaDemo :use="['CuFileInputZone']">
    <cu-file-input-zone
      multiple
      accept=".txt,.pdf"
      placeholder="Varios archivos"
    ></cu-file-input-zone>
    <cu-file-input-zone
      directory
      directory-deep="0"
      placeholder="Carpeta (sólo la raíz)"
    ></cu-file-input-zone>
    <cu-file-input-zone
      directory
      directory-deep="1"
      placeholder="Carpeta hasta 1 subnivel"
    ></cu-file-input-zone>
    <cu-file-input-zone
      directory
      directory-deep="-1"
      placeholder="Carpeta sin límite de profundidad"
    ></cu-file-input-zone>
  </VanillaDemo>
</template>
