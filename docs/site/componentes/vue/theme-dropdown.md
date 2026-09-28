---
title: ThemeDropdown
group: Theme
---

<script setup lang="ts">
import ThemeDropdownExample from "../../examples/theme-dropdown/ThemeDropdownExample.vue";
</script>

<!--@include: ../../../componentes/vue/theme-dropdown.md-->

## Demos en vivo

### Selector de temas

El dropdown lista los 15 temas del `comegen.config.json` con buscador y marca el
activo. **Cambia el tema de todo el sitio** al seleccionar uno: el tema se
guarda en `localStorage` y el dropdown muestra siempre el tema actual.

<ClientOnly>
  <div class="cu-demo">
    <ThemeDropdownExample />
  </div>
</ClientOnly>
