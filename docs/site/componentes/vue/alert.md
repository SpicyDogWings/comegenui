---
title: Alert
group: Información
---

<script setup lang="ts">
import AlertVariantsExample from "../../examples/alert/AlertVariantsExample.vue";
import AlertSlotsExample from "../../examples/alert/AlertSlotsExample.vue";
import AlertImperativeExample from "../../examples/alert/AlertImperativeExample.vue";
import AlertEventsExample from "../../examples/alert/AlertEventsExample.vue";
</script>

<!--@include: ../../../componentes/vue/alert.md-->

## Demos en vivo

### Variantes y color

Las cinco variantes (color primary) y los seis colores (variante soft).

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <AlertVariantsExample />
  </div>
</ClientOnly>

### Título, icono y cierre

`close` agrega el botón de cierre y el slot `icon` el ícono del header.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <AlertSlotsExample />
  </div>
</ClientOnly>

### API imperativa

Con un `ref` se llaman `open()`, `close()`, `toggle()` e `isOpen()`.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <AlertImperativeExample />
  </div>
</ClientOnly>

### Eventos

`v-model:show` + `update:show`, `open` y `close`.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <AlertEventsExample />
  </div>
</ClientOnly>
