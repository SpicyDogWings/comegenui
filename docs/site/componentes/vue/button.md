---
title: Button
group: Buttons
---

<script setup lang="ts">
import ButtonVariantsExample from "../../examples/button/ButtonVariantsExample.vue";
import ButtonStatesExample from "../../examples/button/ButtonStatesExample.vue";
import ButtonFormExample from "../../examples/button/ButtonFormExample.vue";
</script>

<!--@include: ../../../componentes/vue/button.md-->

## Demos en vivo

### Variantes, tamaños y color

Matriz completa: una fila por variante con los seis colores semánticos, más los tres tamaños.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <ButtonVariantsExample />
  </div>
</ClientOnly>

### Estados: loading, disabled y link

El botón con `loading` se deshabilita solo y emite `loading-change`; `to` lo convierte en
`<a>` y `target` sólo aplica con `to`.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <ButtonStatesExample />
  </div>
</ClientOnly>

### Slots y formulario

El único slot es `default` (los íconos son SVG inline). Con `type="submit"`/`type="reset"`
el botón participa del formulario, y `loading-change` avisa el estado de la acción.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <ButtonFormExample />
  </div>
</ClientOnly>
