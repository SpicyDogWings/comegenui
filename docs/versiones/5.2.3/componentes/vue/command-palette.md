[← Volver](../README.md)

# `CommandPalette`

Paleta de comandos (búsqueda + lista) en un modal, con agrupado por categoría y selección por teclado o click.

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
</script>

<template>
  <Button @click="palette?.open()">Abrir comandos</Button>

  <CommandPalette
    ref="palette"
    title="Comandos"
    color="primary"
    :commands="commands"
  />
</template>
```

En HTML plano, cargá el bundle `CuCommandPalette` (ver [ficha vanilla](/componentes/cu-command-palette)). El modal se controla con `open()` / `close()` sobre la ref.

## Comandos

Cada item acepta `{ id, label, action, description?, category?, badges?, icon?, shortcut? }`.
Los que comparten `category` se agrupan bajo una etiqueta (en el orden en que aparecen); la búsqueda
filtra por `label` y `category`. `icon` es un texto corto —un emoji o un glifo— y se muestra tal
cual: `label`, `description` e `icon` se renderizan **como texto**, nunca como HTML (el marcado se
escapa). `badges` son píldoras.

```vue
<script setup lang="ts">
import CommandPalette from "@/components/overlay/CommandPalette.vue";
import Button from "@/components/buttons/Button.vue";
import { useTemplateRef } from "vue";

const palette = useTemplateRef("palette");

const commands = [
  { id: "guardar", label: "Guardar archivo", description: "Guarda el documento actual", category: "Archivo", badges: ["nuevo"], icon: "💾", shortcut: "⌘S", action: () => {} },
  { id: "exportar", label: "Exportar", description: "Exporta a PDF o PNG", category: "Archivo", shortcut: "⌘E", action: () => {} },
  { id: "buscar", label: "Buscar en el proyecto", description: "Búsqueda global", category: "Navegación", badges: ["global"], shortcut: "⌘K", action: () => {} },
  { id: "tema", label: "Cambiar tema", description: "Abre el Theme Builder", category: "Apariencia", action: () => {} },
];
</script>

<template>
  <Button @click="palette?.open()">Abrir con comandos ricos</Button>

  <CommandPalette ref="palette" title="Comandos agrupados" :commands="commands" />
</template>
```

## Teclado

| Tecla | Con el foco en el buscador | Con el foco en un comando (Tab) |
| ------ | ------ | ------ |
| `↑` / `↓` | Mueve el comando resaltado (con vuelta circular); el listado se desplaza para mantenerlo visible | — |
| `Enter` | Ejecuta el comando resaltado y cierra | Ejecuta el comando enfocado y cierra |
| `Tab` / `Shift+Tab` | Pasa el foco a los comandos y al resto del modal | Recorre los comandos |
| `Escape` | Cierra la paleta | Cierra la paleta |

El resaltado sigue al foco y al mouse: el comando activo es siempre el que ejecuta `Enter`.
Al cerrarse —con `close()`, `Escape`, click en el backdrop o en el botón de cerrar— la búsqueda se
limpia: la próxima apertura arranca vacía, con el primer comando resaltado y el listado arriba.

## Colores

`color` tiñe el modal. Los 6 valores son `primary`, `secondary`, `neutral` (**default**),
`success`, `warning` y `danger`.

```vue
<script setup lang="ts">
import CommandPalette from "@/components/overlay/CommandPalette.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const commands = [
  { id: "guardar", label: "Guardar", shortcut: "⌘S", action: () => {} },
  { id: "buscar", label: "Buscar", shortcut: "⌘K", action: () => {} },
  { id: "salir", label: "Salir", action: () => {} },
];

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const palettes = ref<Record<string, InstanceType<typeof CommandPalette> | null>>({});
</script>

<template>
  <div>
    <Button v-for="color in colors" :key="color" @click="palettes[color]?.open()">
      {{ color }}
    </Button>

    <CommandPalette
      v-for="color in colors"
      :key="color"
      :ref="(el) => { palettes[color] = el as InstanceType<typeof CommandPalette> | null }"
      :title="color"
      :color="color"
      :commands="commands"
    />
  </div>
</template>
```

## Tamaño y alto

`size` y `height` aceptan los mismos 6 valores: `auto` (**default**), `sm`, `md`, `lg`,
`xl` y `full`. `size` define el ancho del modal y `height` su alto.

```vue
<script setup lang="ts">
import CommandPalette from "@/components/overlay/CommandPalette.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const commands = [
  { id: "uno", label: "Comando uno", action: () => {} },
  { id: "dos", label: "Comando dos", action: () => {} },
  { id: "tres", label: "Comando tres", action: () => {} },
];

const sizes = ["auto", "sm", "md", "lg", "xl", "full"] as const;
const palettes = ref<Record<string, InstanceType<typeof CommandPalette> | null>>({});
</script>

<template>
  <div>
    <Button v-for="size in sizes" :key="size" @click="palettes[size]?.open()">
      size / height = {{ size }}
    </Button>

    <CommandPalette
      v-for="size in sizes"
      :key="size"
      :ref="(el) => { palettes[size] = el as InstanceType<typeof CommandPalette> | null }"
      :title="`size ${size}`"
      :size="size"
      :height="size"
      :commands="commands"
    />
  </div>
</template>
```

## Escuchar eventos

```vue
<script setup lang="ts">
import CommandPalette from "@/components/overlay/CommandPalette.vue";
import Button from "@/components/buttons/Button.vue";
import { useTemplateRef } from "vue";

const palette = useTemplateRef("palette");

const commands = [
  { id: "uno", label: "Comando uno", action: () => {} },
  { id: "dos", label: "Comando dos", action: () => {} },
];

function onSelect(cmd: { label: string }) {
  console.log("select →", cmd.label);
}
function onClose() {
  console.log("close");
}
</script>

<template>
  <Button @click="palette?.open()">Abrir paleta</Button>

  <CommandPalette
    ref="palette"
    title="Eventos"
    :commands="commands"
    @select="onSelect"
    @close="onClose"
  />
</template>
```

## Control programático

```vue
<script setup lang="ts">
import CommandPalette from "@/components/overlay/CommandPalette.vue";
import { useTemplateRef } from "vue";

const palette = useTemplateRef("palette");

const commands = [
  { id: "guardar", label: "Guardar", action: () => {} },
  { id: "salir", label: "Salir", action: () => {} },
];

function demo() {
  palette.value?.open();
  palette.value?.close();
  palette.value?.run("guardar"); // ejecuta el comando con ese id
  console.log(palette.value?.getCommands()); // CommandItem[]
  console.log(palette.value?.isOpen()); // boolean
}
</script>

<template>
  <CommandPalette ref="palette" title="API imperativa" :commands="commands" />
</template>
```

## Props

<!--@include: ../../partials/command-palette/props-vue.md-->

## Emits

<!--@include: ../../partials/command-palette/eventos.md-->

## Slots

<!--@include: ../../partials/command-palette/slots.md-->

## Expose

<!--@include: ../../partials/command-palette/metodos-vue.md-->
