<template>
  <!-- Refleja el ejemplo "Tipos soportados". -->
  <VanillaDemo :use="['CuInput']">
    <cu-input type="text" placeholder="Texto"></cu-input>
    <cu-input type="password" placeholder="Contraseña"></cu-input>
    <cu-input type="email" placeholder="correo@ejemplo.com"></cu-input>
    <cu-input type="number" placeholder="0"></cu-input>
    <cu-input type="tel" placeholder="+54 11 1234-5678"></cu-input>
    <cu-input type="url" placeholder="https://..."></cu-input>
    <cu-input type="search" placeholder="Buscar..."></cu-input>
  </VanillaDemo>
</template>
