---
title: CommandPalette
group: Overlay
---

<script setup lang="ts">
import CommandPaletteBasicExample from "../../examples/command-palette/CommandPaletteBasicExample.vue";
import CommandPaletteAppearanceExample from "../../examples/command-palette/CommandPaletteAppearanceExample.vue";
import CommandPaletteCommandsExample from "../../examples/command-palette/CommandPaletteCommandsExample.vue";
import CommandPaletteEventsExample from "../../examples/command-palette/CommandPaletteEventsExample.vue";
import CommandPaletteImperativeExample from "../../examples/command-palette/CommandPaletteImperativeExample.vue";
</script>

<!--@include: ../../../componentes/vue/command-palette.md-->

## Demos en vivo

### Básico

<ClientOnly>
  <div class="cu-demo">
    <CommandPaletteBasicExample />
  </div>
</ClientOnly>

### Apariencia (color, size, title, placeholder, height)

<ClientOnly>
  <div class="cu-demo">
    <CommandPaletteAppearanceExample />
  </div>
</ClientOnly>

### Datos: comandos ricos

<ClientOnly>
  <div class="cu-demo">
    <CommandPaletteCommandsExample />
  </div>
</ClientOnly>

### Eventos (`select`, `close`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CommandPaletteEventsExample />
  </div>
</ClientOnly>

### API imperativa (`open`, `close`, `run`, `getCommands`, `isOpen`)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <CommandPaletteImperativeExample />
  </div>
</ClientOnly>
