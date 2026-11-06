<template>
  <!-- Refleja el ejemplo "Tipos de input": `type` text, search y email. -->
  <VanillaDemo :use="['CuAutocomplete']">
    <cu-autocomplete type="text" placeholder="Buscar..."></cu-autocomplete>
    <cu-autocomplete type="search" placeholder="Buscar..."></cu-autocomplete>
    <cu-autocomplete type="email" placeholder="Email..."></cu-autocomplete>
  </VanillaDemo>
</template>
