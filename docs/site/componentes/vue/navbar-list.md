---
title: NavbarList
group: Navegación
---

<script setup lang="ts">
import NavbarListBasicExample from "../../examples/navbar-list/NavbarListBasicExample.vue";
import NavbarListSearchExample from "../../examples/navbar-list/NavbarListSearchExample.vue";
import NavbarListCompactExample from "../../examples/navbar-list/NavbarListCompactExample.vue";
import NavbarListCollapsedExample from "../../examples/navbar-list/NavbarListCollapsedExample.vue";
import NavbarListActiveExample from "../../examples/navbar-list/NavbarListActiveExample.vue";
</script>

<!--@include: ../../../componentes/vue/navbar-list.md-->

## Demos en vivo

### Básico (items)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <NavbarListBasicExample />
  </div>
</ClientOnly>

### Búsqueda (search, searchFields, `update:query`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <NavbarListSearchExample />
  </div>
</ClientOnly>

### Compactable (`toggle-compact`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <NavbarListCompactExample />
  </div>
</ClientOnly>

### Colapsado y trigger (collapsed, trigger)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <NavbarListCollapsedExample />
  </div>
</ClientOnly>

### Activo y resaltado (activePath, activeItem, highlightTarget)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <NavbarListActiveExample />
  </div>
</ClientOnly>
