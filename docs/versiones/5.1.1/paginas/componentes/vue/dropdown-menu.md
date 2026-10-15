---
title: DropdownMenu
group: Controles
---

<script setup lang="ts">
import DropdownMenuBasicExample from "../../examples/dropdown-menu/DropdownMenuBasicExample.vue";
import DropdownMenuItemsExample from "../../examples/dropdown-menu/DropdownMenuItemsExample.vue";
import DropdownMenuAppearanceExample from "../../examples/dropdown-menu/DropdownMenuAppearanceExample.vue";
import DropdownMenuDisabledExample from "../../examples/dropdown-menu/DropdownMenuDisabledExample.vue";
import DropdownMenuEventsExample from "../../examples/dropdown-menu/DropdownMenuEventsExample.vue";
import DropdownMenuImperativeExample from "../../examples/dropdown-menu/DropdownMenuImperativeExample.vue";
import DropdownMenuSlotsExample from "../../examples/dropdown-menu/DropdownMenuSlotsExample.vue";
</script>

<!--@include: ../../../componentes/vue/dropdown-menu.md-->

## Demos en vivo

### Básico

<ClientOnly>
  <div class="cu-demo">
    <DropdownMenuBasicExample />
  </div>
</ClientOnly>

### Datos: `items` (íconos, colores, divisores, links)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DropdownMenuItemsExample />
  </div>
</ClientOnly>

### Apariencia y posición (color, variant, position, align, offset, fixed, textAlign)

<ClientOnly>
  <div class="cu-demo">
    <DropdownMenuAppearanceExample />
  </div>
</ClientOnly>

### Deshabilitado

<ClientOnly>
  <div class="cu-demo">
    <DropdownMenuDisabledExample />
  </div>
</ClientOnly>

### Eventos (`open`, `close`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DropdownMenuEventsExample />
  </div>
</ClientOnly>

### API imperativa (`open`, `close`, `toggle`, `isOpen`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DropdownMenuImperativeExample />
  </div>
</ClientOnly>

### Slots (`toggle`, `default`)

<ClientOnly>
  <div class="cu-demo">
    <DropdownMenuSlotsExample />
  </div>
</ClientOnly>
