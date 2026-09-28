---
title: Avatar
group: Información
---

<script setup lang="ts">
import AvatarSizesExample from "../../examples/avatar/AvatarSizesExample.vue";
import AvatarColorsExample from "../../examples/avatar/AvatarColorsExample.vue";
import AvatarImageExample from "../../examples/avatar/AvatarImageExample.vue";
import AvatarSlotExample from "../../examples/avatar/AvatarSlotExample.vue";
</script>

<!--@include: ../../../componentes/vue/avatar.md-->

## Demos en vivo

### Tamaños

`sm`, `md` y `lg`.

<ClientOnly>
  <div class="cu-demo">
    <AvatarSizesExample />
  </div>
</ClientOnly>

### Colores e iniciales

Los seis colores explícitos y, abajo, el color determinístico cuando no se pasa `color`.

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <AvatarColorsExample />
  </div>
</ClientOnly>

### Con imagen

Con `src` muestra la imagen recortada en círculo; `initials` queda ignorado.

<ClientOnly>
  <div class="cu-demo">
    <AvatarImageExample />
  </div>
</ClientOnly>

### Slot default

Sin `initials` ni `src`, el slot `default` es el contenido del avatar.

<ClientOnly>
  <div class="cu-demo">
    <AvatarSlotExample />
  </div>
</ClientOnly>
