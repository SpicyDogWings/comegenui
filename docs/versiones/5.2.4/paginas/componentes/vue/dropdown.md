---
title: Dropdown
group: Controles
---

<script setup lang="ts">
import DropdownBasicExample from "../../examples/dropdown/DropdownBasicExample.vue";
import DropdownVariantsExample from "../../examples/dropdown/DropdownVariantsExample.vue";
import DropdownItemsExample from "../../examples/dropdown/DropdownItemsExample.vue";
import DropdownPositionExample from "../../examples/dropdown/DropdownPositionExample.vue";
import DropdownTriggerExample from "../../examples/dropdown/DropdownTriggerExample.vue";
import DropdownLoadingExample from "../../examples/dropdown/DropdownLoadingExample.vue";
import DropdownEventsExample from "../../examples/dropdown/DropdownEventsExample.vue";
import DropdownImperativeExample from "../../examples/dropdown/DropdownImperativeExample.vue";
import DropdownSlotsExample from "../../examples/dropdown/DropdownSlotsExample.vue";
import DropdownNestedExample from "../../examples/dropdown/DropdownNestedExample.vue";
</script>

<!--@include: ../../../componentes/vue/dropdown.md-->

## Demos en vivo

### Básico

<ClientOnly>
  <div class="cu-demo">
    <DropdownBasicExample />
  </div>
</ClientOnly>

### Apariencia (color, variant)

<ClientOnly>
  <div class="cu-demo">
    <DropdownVariantsExample />
  </div>
</ClientOnly>

### Datos: `items`

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DropdownItemsExample />
  </div>
</ClientOnly>

### Posición (position, align, offset, panelWidth, fixed)

<ClientOnly>
  <div class="cu-demo">
    <DropdownPositionExample />
  </div>
</ClientOnly>

### Trigger (click / hover / disabled)

<ClientOnly>
  <div class="cu-demo">
    <DropdownTriggerExample />
  </div>
</ClientOnly>

### Loading y cooldown

<ClientOnly>
  <div class="cu-demo">
    <DropdownLoadingExample />
  </div>
</ClientOnly>

### Eventos (`v-model` + `open` / `close`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DropdownEventsExample />
  </div>
</ClientOnly>

### API imperativa (`open`, `close`, `toggle`, `get`, `set`, `reset`, `isOpen`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DropdownImperativeExample />
  </div>
</ClientOnly>

### Slots (`toggle`, `default`)

<ClientOnly>
  <div class="cu-demo">
    <DropdownSlotsExample />
  </div>
</ClientOnly>

### Submenús anidados (`icon` en dropdown anidado)

<ClientOnly>
  <div class="cu-demo">
    <DropdownNestedExample />
  </div>
</ClientOnly>
