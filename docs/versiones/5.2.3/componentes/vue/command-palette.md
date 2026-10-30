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

El foco se queda en el buscador: los comandos no son paradas de tab y la navegación pasa por el
comando activo.

| Tecla | Acción |
| ------ | ------ |
| `↑` / `↓` | Mueve el comando activo (con vuelta circular); el listado se desplaza para mantenerlo visible. |
| `Home` / `End` | Salta al primer / último comando. |
| `Enter` | Ejecuta el comando activo y cierra. |
| `Escape` | Cierra la paleta. |
| `Tab` / `Shift+Tab` | Sale del buscador hacia los botones del modal (los comandos no reciben foco). |

El comando activo sigue al mouse (hover) y es siempre el que ejecuta `Enter`. Con click, cada
comando se ejecuta con su propio botón.
Al cerrarse —con `close()`, `Escape`, click en el backdrop o en el botón de cerrar— la búsqueda se
limpia: la próxima apertura arranca vacía, con el primer comando activo y el listado arriba.

## Accesibilidad

El buscador es un `combobox` (`role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`,
`aria-controls` apuntando al listado) y el listado es un `listbox` con un `option` por comando.
El comando activo se anuncia con `aria-activedescendant` en el buscador y `aria-selected="true"`
en su opción; el foco nunca sale del buscador (las opciones llevan `tabindex="-1"`).

Los comandos con la misma `category` se agrupan en `role="group"` con `aria-label` (la etiqueta
visual queda `aria-hidden` para no anunciarse dos veces). El listado toma su nombre del `title` del
modal, o "Comandos" si no hay título. Cuando la búsqueda no devuelve nada, el listbox no se
renderiza y el mensaje "No se encontraron comandos" es `role="status"`: el buscador tampoco tiene
`aria-activedescendant`. Los ids del listbox y las opciones salen de `useId`: no colisionan dentro de
una misma app y, en el custom element, cada instancia vive en su propio shadow root.

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
