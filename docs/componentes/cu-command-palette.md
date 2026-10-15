[← Volver](../README.md)

# `<cu-command-palette>`

Paleta de comandos (búsqueda + lista) en un modal, con agrupado por categoría y selección por teclado o click.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuCommandPalette.umd.js"></script>

<button id="abrir">Abrir paleta</button>
<cu-command-palette id="palette" title="Comandos" color="primary"></cu-command-palette>

<script>
  const palette = document.getElementById('palette');

  // `commands` es obligatoria y se asigna como propiedad JS (sin ella abre vacía).
  palette.commands = [
    { id: 'guardar', label: 'Guardar', shortcut: '⌘S', action: () => console.log('guardar') },
    { id: 'buscar', label: 'Buscar', shortcut: '⌘K', action: () => console.log('buscar') },
    { id: 'salir', label: 'Salir', action: () => console.log('salir') },
  ];

  document.getElementById('abrir').addEventListener('click', () => palette.open());
</script>
```

<!-- demo:command-palette-uso -->

> `commands` es obligatoria (array de `CommandItem`) y se asigna como **propiedad JS**: sin ella la paleta abre vacía.

En Vue, importá `CommandPalette` de `@/components/overlay/CommandPalette.vue` (ver [ficha Vue](/componentes/vue/command-palette)).

## Comandos

Cada item acepta `{ id, label, action, description?, category?, badges?, icon?, shortcut? }`.
Los que comparten `category` se agrupan bajo una etiqueta; la búsqueda filtra por `label` y
`category`; `icon` se inyecta como HTML y `badges` son píldoras.

```html
<button id="abrir">Abrir con comandos ricos</button>
<cu-command-palette id="palette" title="Comandos agrupados"></cu-command-palette>

<script>
  const palette = document.getElementById('palette');
  palette.commands = [
    { id: 'guardar', label: 'Guardar archivo', description: 'Guarda el documento actual', category: 'Archivo', badges: ['nuevo'], icon: '<svg …></svg>', shortcut: '⌘S', action: () => {} },
    { id: 'exportar', label: 'Exportar', description: 'Exporta a PDF o PNG', category: 'Archivo', shortcut: '⌘E', action: () => {} },
    { id: 'buscar', label: 'Buscar en el proyecto', description: 'Búsqueda global', category: 'Navegación', badges: ['global'], shortcut: '⌘K', action: () => {} },
    { id: 'tema', label: 'Cambiar tema', description: 'Abre el Theme Builder', category: 'Apariencia', action: () => {} },
  ];
  document.getElementById('abrir').addEventListener('click', () => palette.open());
</script>
```

<!-- demo:command-palette-comandos -->

## Colores

`color` tiñe el modal. Los 6 valores son `primary`, `secondary`, `neutral` (**default**),
`success`, `warning` y `danger`.

```html
<button id="abrir-primary">primary</button>
<cu-command-palette id="p-primary" title="primary" color="primary"></cu-command-palette>
<!-- …secondary, neutral, success, warning, danger -->

<script>
  const commands = [
    { id: 'guardar', label: 'Guardar', shortcut: '⌘S', action: () => {} },
    { id: 'buscar', label: 'Buscar', shortcut: '⌘K', action: () => {} },
    { id: 'salir', label: 'Salir', action: () => {} },
  ];
  ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'].forEach((color) => {
    const p = document.getElementById(`p-${color}`);
    p.commands = commands;
    document.getElementById(`abrir-${color}`).addEventListener('click', () => p.open());
  });
</script>
```

<!-- demo:command-palette-colores -->

## Tamaño y alto

`size` y `height` aceptan los mismos 6 valores: `auto` (**default**), `sm`, `md`, `lg`,
`xl` y `full`. `size` define el ancho del modal y `height` su alto.

```html
<button id="abrir-md">size / height = md</button>
<cu-command-palette id="p-md" title="size md" size="md" height="md"></cu-command-palette>
<!-- …auto, sm, lg, xl, full -->

<script>
  const commands = [
    { id: 'uno', label: 'Comando uno', action: () => {} },
    { id: 'dos', label: 'Comando dos', action: () => {} },
    { id: 'tres', label: 'Comando tres', action: () => {} },
  ];
  ['auto', 'sm', 'md', 'lg', 'xl', 'full'].forEach((size) => {
    const p = document.getElementById(`p-${size}`);
    p.commands = commands;
    document.getElementById(`abrir-${size}`).addEventListener('click', () => p.open());
  });
</script>
```

<!-- demo:command-palette-tamano-y-alto -->

## Escuchar eventos

```html
<button id="abrir">Abrir paleta</button>
<cu-command-palette id="palette" title="Eventos"></cu-command-palette>

<script>
  const palette = document.getElementById('palette');
  palette.commands = [
    { id: 'uno', label: 'Comando uno', action: () => {} },
    { id: 'dos', label: 'Comando dos', action: () => {} },
  ];

  // El comando elegido (con click o Enter) llega en e.detail
  palette.addEventListener('select', (e) => console.log('select →', e.detail.label));
  // El modal avisa cuando se cierra
  palette.addEventListener('close', () => console.log('close'));

  document.getElementById('abrir').addEventListener('click', () => palette.open());
</script>
```

<!-- demo:command-palette-eventos -->

## Control programático

```html
<cu-command-palette id="palette" title="API imperativa"></cu-command-palette>

<script>
  const palette = document.getElementById('palette');
  palette.commands = [
    { id: 'guardar', label: 'Guardar', action: () => {} },
    { id: 'salir', label: 'Salir', action: () => {} },
  ];

  palette.open();
  palette.close();
  palette.run('guardar');   // ejecuta el comando con ese id
  palette.getCommands();    // CommandItem[]
  palette.isOpen();         // boolean
</script>
```

<!-- demo:command-palette-control-programatico -->

## Atributos

<!--@include: ../partials/command-palette/props-vanilla.md-->

## Eventos

<!--@include: ../partials/command-palette/eventos.md-->

## Slots

<!--@include: ../partials/command-palette/slots.md-->

## Métodos expuestos

<!--@include: ../partials/command-palette/metodos-vanilla.md-->
