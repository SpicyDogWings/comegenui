# `<cu-command-palette>`

Paleta de comandos (búsqueda + lista) en un modal, con agrupado por categoría y selección por teclado o click.

> **Nota:** el wrapper CE actual no expone la prop `commands` ni métodos (`open`/`close`) — sin `commands` el componente no tiene datos. Ver `docs/notes/05-wrappers-ce-incompletos.md`. La API pública documentada acá es la que el `.ce.vue` expone hoy.

[← Volver](../SKILL.md)

---

## Uso en HTML plano

```html
<script src="dist/CuCommandPalette.umd.js"></script>

<cu-command-palette id="palette" title="Comandos" color="primary"></cu-command-palette>
```

> El componente requiere la prop `commands` para mostrar resultados, pero el wrapper CE todavía no la expone (ver nota al inicio). Mientras tanto, la paleta solo abre como modal vacío.

---

## Vista Vue

### Uso en Vue

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

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `string` | `"neutral"` | Color semántico del modal: `primary`, `neutral`, `success`, `warning`, `danger` |
| `title` | `string` | `""` | Título del modal |
| `placeholder` | `string` | `"Buscar comandos…"` | Placeholder del input de búsqueda |
| `size` | `string` | `"auto"` | Ancho del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |
| `height` | `string` | `"auto"` | Alto del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `select` | `CommandItem` | Se seleccionó un comando (por click o `Enter`) |
| `close` | — | Se cerró el modal |

## Slots

Ninguno.

## Métodos expuestos

Ninguno (el wrapper CE no llama a `defineExpose`).
