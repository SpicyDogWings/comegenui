---
title: AuthorCard
group: Información
---

<script setup lang="ts">
import AuthorCardSizesExample from "../../examples/author-card/AuthorCardSizesExample.vue";
import AuthorCardColorsExample from "../../examples/author-card/AuthorCardColorsExample.vue";
import AuthorCardImageExample from "../../examples/author-card/AuthorCardImageExample.vue";
</script>

<!--@include: ../../../componentes/vue/author-card.md-->

## Demos en vivo

### Tamaños

`size` se propaga al `Avatar`: `sm`, `md` y `lg`.

<ClientOnly>
  <div class="cu-demo">
    <AuthorCardSizesExample />
  </div>
</ClientOnly>

### Color y rol

Las iniciales se generan del `name`; `role` es opcional.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <AuthorCardColorsExample />
  </div>
</ClientOnly>

### Con imagen

Con `src`, el avatar muestra la imagen en vez de las iniciales.

<ClientOnly>
  <div class="cu-demo">
    <AuthorCardImageExample />
  </div>
</ClientOnly>
