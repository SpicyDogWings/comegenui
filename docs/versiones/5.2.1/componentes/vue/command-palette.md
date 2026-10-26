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
Los que comparten `category` se agrupan bajo una etiqueta; la búsqueda filtra por `label` y
`category`; `icon` se inyecta como HTML y `badges` son píldoras.

```vue
<script setup lang="ts">
import CommandPalette from "@/components/overlay/CommandPalette.vue";
import Button from "@/components/buttons/Button.vue";
import { useTemplateRef } from "vue";

const palette = useTemplateRef("palette");

const iconoSave =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>';

const commands = [
  { id: "guardar", label: "Guardar archivo", description: "Guarda el documento actual", category: "Archivo", badges: ["nuevo"], icon: iconoSave, shortcut: "⌘S", action: () => {} },
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
