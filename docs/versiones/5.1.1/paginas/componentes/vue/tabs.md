---
title: Tabs
group: Navegación
---

<script setup lang="ts">
import TabsVariantsExample from "../../examples/tabs/TabsVariantsExample.vue";
import TabsColorsExample from "../../examples/tabs/TabsColorsExample.vue";
import TabsSizesExample from "../../examples/tabs/TabsSizesExample.vue";
import TabsIconsExample from "../../examples/tabs/TabsIconsExample.vue";
import TabsSlotsExample from "../../examples/tabs/TabsSlotsExample.vue";
import TabsEventsExample from "../../examples/tabs/TabsEventsExample.vue";
import TabsImperativeExample from "../../examples/tabs/TabsImperativeExample.vue";
import TabsDisabledExample from "../../examples/tabs/TabsDisabledExample.vue";
</script>

<!--@include: ../../../componentes/vue/tabs.md-->

## Demos en vivo

### Variantes (ghost, solid, boxed, soft)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TabsVariantsExample />
  </div>
</ClientOnly>

### Colores

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TabsColorsExample />
  </div>
</ClientOnly>

### Tamaños (sm, md, lg)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TabsSizesExample />
  </div>
</ClientOnly>

### Iconos (campo `icon` y slot `tab-icon-{key}`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TabsIconsExample />
  </div>
</ClientOnly>

### Slots dinámicos (`tab-{key}`, `tab-icon-{key}`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TabsSlotsExample />
  </div>
</ClientOnly>

### Eventos (`change` + v-model)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TabsEventsExample />
  </div>
</ClientOnly>

### API imperativa (`getActive`, `setActive`, `next`, `prev`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TabsImperativeExample />
  </div>
</ClientOnly>

### Deshabilitadas (global y por tab)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <TabsDisabledExample />
  </div>
</ClientOnly>
