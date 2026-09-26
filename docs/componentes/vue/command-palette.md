# `CommandPalette`

Paleta de comandos (búsqueda + lista) en un modal, con agrupado por categoría y selección por teclado o click.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import CommandPalette from "@/components/overlay/CommandPalette.vue";
import Button from "@/components/buttons/Button.vue";
import { useTemplateRef } from "vue";

const palette = useTemplateRef("palette");

const commands = [
  { id: "guardar", label: "Guardar", category: "Archivo", shortcut: "⌘S", action: () => console.log("guardar") },
  { id: "buscar", label: "Buscar", category: "Navegación", shortcut: "⌘K", action: () => console.log("buscar") },
];

function onSelect(cmd: { label: string }) {
  console.log("Seleccionado:", cmd.label);
}
</script>

<template>
  <Button @click="palette?.open()">Abrir comandos</Button>

  <CommandPalette
    ref="palette"
    title="Comandos"
    color="primary"
    :commands="commands"
    @select="onSelect"
  />
</template>
```

> En Vue la prop `commands` provee los comandos y el modal se controla con `open()` / `close()` sobre la ref.

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del modal: `primary`, `neutral`, `success`, `warning`, `danger` |
| `title` | `string` | `""` | Título del modal |
| `placeholder` | `string` | `"Buscar comandos…"` | Placeholder del input de búsqueda |
| `size` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Ancho del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |
| `height` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Alto del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `select` | `CommandItem` | Se seleccionó un comando (por click o `Enter`) |
| `close` | — | Se cerró el modal |

## Slots

Ninguno.

## Expose

Ninguno (el wrapper CE no llama a `defineExpose`).
