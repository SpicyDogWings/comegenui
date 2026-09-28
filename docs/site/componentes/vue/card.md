---
title: Card
group: Información
---

<script setup lang="ts">
import CardVariantsExample from "../../examples/card/CardVariantsExample.vue";
import CardMediaExample from "../../examples/card/CardMediaExample.vue";
import CardHorizontalExample from "../../examples/card/CardHorizontalExample.vue";
import CardSlotsExample from "../../examples/card/CardSlotsExample.vue";
</script>

<!--@include: ../../../componentes/vue/card.md-->

## Demos en vivo

### Variantes y color

Matriz: una fila por variante con los seis colores semánticos.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CardVariantsExample />
  </div>
</ClientOnly>

### Media, título y subtítulo

La prop `image` arma la media y `title`/`subtitle` el header.

<ClientOnly>
  <div class="cu-demo">
    <CardMediaExample />
  </div>
</ClientOnly>

### Layout horizontal

Con `layout="horizontal"` la media va al costado.

<ClientOnly>
  <div class="cu-demo">
    <CardHorizontalExample />
  </div>
</ClientOnly>

### Slots

`media`, `header`, `footer` y `default`: los tres primeros pisan a las props equivalentes.

<ClientOnly>
  <div class="cu-demo">
    <CardSlotsExample />
  </div>
</ClientOnly>
