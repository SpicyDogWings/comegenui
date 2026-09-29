---
title: NavbarMenu
group: Navegación
---

<script setup lang="ts">
import NavbarMenuBasicExample from "../../examples/navbar-menu/NavbarMenuBasicExample.vue";
import NavbarMenuNestedExample from "../../examples/navbar-menu/NavbarMenuNestedExample.vue";
import NavbarMenuTriggerExample from "../../examples/navbar-menu/NavbarMenuTriggerExample.vue";
</script>

<!--@include: ../../../componentes/vue/navbar-menu.md-->

## Demos en vivo

### Básico (items)

<ClientOnly>
  <div class="cu-demo">
    <NavbarMenuBasicExample />
  </div>
</ClientOnly>

### Anidados (children)

<ClientOnly>
  <div class="cu-demo">
    <NavbarMenuNestedExample />
  </div>
</ClientOnly>

### Trigger (click / hover)

<ClientOnly>
  <div class="cu-demo">
    <NavbarMenuTriggerExample />
  </div>
</ClientOnly>
