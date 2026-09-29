---
title: Navbar
group: Navegación
---

<script setup lang="ts">
import NavbarBasicExample from "../../examples/navbar/NavbarBasicExample.vue";
import NavbarSearchExample from "../../examples/navbar/NavbarSearchExample.vue";
import NavbarSearchScrollExample from "../../examples/navbar/NavbarSearchScrollExample.vue";
import NavbarCompactExample from "../../examples/navbar/NavbarCompactExample.vue";
import NavbarCompactableExample from "../../examples/navbar/NavbarCompactableExample.vue";
import NavbarResponsiveExample from "../../examples/navbar/NavbarResponsiveExample.vue";
import NavbarHighlightExample from "../../examples/navbar/NavbarHighlightExample.vue";
</script>

<!--@include: ../../../componentes/vue/navbar.md-->

## Demos en vivo

### Básico (items, activePath)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <NavbarBasicExample />
  </div>
</ClientOnly>

### Búsqueda filtrada (search, searchFields, searchMode="filter")

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <NavbarSearchExample />
  </div>
</ClientOnly>

### Búsqueda con resaltado (searchMode="scroll")

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <NavbarSearchScrollExample />
  </div>
</ClientOnly>

### Compacto (compact, trigger)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <NavbarCompactExample />
  </div>
</ClientOnly>

### Compactable y colapsado (compactable, collapsed)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <NavbarCompactableExample />
  </div>
</ClientOnly>

### Responsive (responsive, responsiveMode, sideOverPosition)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <NavbarResponsiveExample />
  </div>
</ClientOnly>

### Activo y resaltado (activePath, highlightItem)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <NavbarHighlightExample />
  </div>
</ClientOnly>
