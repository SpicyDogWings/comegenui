<template>
  <!-- Refleja el ejemplo "Estados": `disabled` y `readOnly` cortan click, drag y drop. -->
  <VanillaDemo :use="['CuFileInput']">
    <cu-file-input disabled placeholder="Deshabilitado"></cu-file-input>
    <cu-file-input read-only placeholder="Solo lectura"></cu-file-input>
  </VanillaDemo>
</template>
