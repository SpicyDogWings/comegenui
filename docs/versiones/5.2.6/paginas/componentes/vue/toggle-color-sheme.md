---
title: ToggleColorSheme
group: Buttons
---

<script setup lang="ts">
import ToggleColorShemeVariantsExample from "../../examples/toggle-color-sheme/ToggleColorShemeVariantsExample.vue";
import ToggleColorShemeSizesExample from "../../examples/toggle-color-sheme/ToggleColorShemeSizesExample.vue";
</script>

<!--@include: ../../../componentes/vue/toggle-color-sheme.md-->

## Demos en vivo

### Variantes

Las siete variantes del `Button` interno. Al hacer click **alterna el tema claro/oscuro
de todo el sitio** (guarda la preferencia y cambia el ícono sol/luna).

<ClientOnly>
  <div class="cu-demo">
    <ToggleColorShemeVariantsExample />
  </div>
</ClientOnly>

### Tamaños

`size` es el lado del ícono en píxeles.

<ClientOnly>
  <div class="cu-demo">
    <ToggleColorShemeSizesExample />
  </div>
</ClientOnly>
