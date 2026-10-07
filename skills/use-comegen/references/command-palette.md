# CommandPalette — `<cu-command-palette>` / `<CommandPalette>`

Paleta de comandos en un modal (búsqueda + lista agrupada por categoría), con selección por
teclado o click.

## Cuándo usarlo

Para acciones rápidas tipo "⌘K": buscar y ejecutar comandos. Si querés un menú anclado a un
botón usá `cu-dropdown-menu`; si querés un modal de contenido, `cu-modal`.

## Receta

1. Definí `commands`: array de `CommandItem` (`id`, `label` y `action` obligatorios;
   `description`, `category`, `badges`, `icon`, `shortcut` opcionales).
2. En HTML plano asigná `palette.commands = [...]` como **propiedad JS**: `action` es una
   función y no puede ir por atributo.
3. Abrí y cerrá por código: `open()`, `close()`, `isOpen()`; o ejecutá un comando con `run(id)`.
4. Escuchá `select` (recibe el `CommandItem`) y `close`.
5. El atajo global (`⌘K`/`Ctrl+K`) lo cableás vos: el componente no registra ninguno.
6. `title`, `placeholder`, `color`, `size` y `height` configuran el modal.

```html
<!-- HTML plano (UMD) -->
<script src="dist/CuCommandPalette.core.umd.js"></script>

<cu-command-palette id="palette" title="Comandos" color="primary"></cu-command-palette>

<script>
  const palette = document.getElementById('palette');
  palette.commands = [
    { id: 'guardar', label: 'Guardar', category: 'Archivo', shortcut: '⌘S', action: () => console.log('guardar') },
    { id: 'buscar',  label: 'Buscar',  category: 'Navegación', shortcut: '⌘K', action: () => console.log('buscar') },
  ];
  palette.addEventListener('select', (e) => console.log('elegido:', e.detail.label));

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette.open();
    }
  });
</script>
```

```vue
<!-- Vue -->
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
    @select="(c) => console.log('elegido:', c.label)"
  />
</template>
```

## Qué puede y qué no puede

**Puede:** búsqueda sobre `label` y `category`, agrupado por `category`, navegación por teclado
(↑/↓/Enter), `description`/`badges`/`shortcut`/`icon` por item, `color`, `title`, `placeholder`,
`size`/`height` y los métodos `open`/`close`/`run`/`getCommands`/`isOpen`.

**No puede:**

- **`commands` es obligatorio y va por propiedad JS:** sin comandos la paleta abre vacía, y
  `action` (función) nunca pasa por atributo.
- **No registra atajo global:** el `⌘K`/`Ctrl+K` hay que cablearlo aparte.
- **`run(id)` no cierra la paleta:** ejecuta `action` y emite `select`, pero no llama a `close()`;
  el cierre lo hacen `select()` (click/Enter) o `close()` explícito.
- **La búsqueda no mira `description`, `badges`, `shortcut` ni `id`** (sólo `label` y `category`).
- **No tiene slots:** los items no se personalizan con markup (sólo `icon` como string).
- **El payload de `select` incluye la función `action`:** no es serializable; en el CE viaja en
  `e.detail`.
- **No hay agrupado colapsable ni selección múltiple.**
- **`toggle` no está expuesto:** sólo `open`/`close`.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del modal: `primary`, `neutral`, `success`, `warning`, `danger` |
| `size` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Ancho del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |
| `title` | `string` | `""` | Título del modal |
| `placeholder` | `string` | `"Buscar comandos…"` | Placeholder del input de búsqueda |
| `height` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Alto del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |
| `commands` | `CommandItem[]` | `[]` | Comandos disponibles: `{ id, label, action, description?, category?, badges?, icon?, shortcut? }[]`. Se asigna como propiedad JS |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `select` | — | — |
| `close` | — | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `open` | — |
| `close` | — |
| `run` | — |
| `getCommands` | — |
| `isOpen` | — |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `"neutral"` | — |
| `size` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | — |
| `title` | `string` | `""` | — |
| `placeholder` | `string` | `"Buscar comandos…"` | — |
| `height` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | — |
| `commands` | `CommandItem[]` | `[]` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `select` | — | — |
| `close` | — | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `open` | — |
| `close` | — |
| `run` | Ejecuta el comando con ese id. |
| `getCommands` | — |
| `isOpen` | — |
<!-- /@api:expose -->
