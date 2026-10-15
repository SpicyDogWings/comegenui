# CommandPalette — `<cu-command-palette>` / `<CommandPalette>`

Paleta de comandos en un modal: búsqueda + lista agrupada por categoría, con selección por teclado
o click. Para un menú anclado a un botón usá `cu-dropdown-menu`; para un modal de contenido, `cu-modal`.

## Receta

- Definí `commands`: `{ id, label, action }` obligatorios; `description`, `category`, `badges`, `icon`, `shortcut` opcionales.
- En el CE `commands` va como **propiedad JS** (`palette.commands = [...]`): `action` es una función.
- Abrí y cerrá por código: `open()`, `close()`, `isOpen()`; ejecutá un comando con `run(id)`.
- Escuchá `select` (payload: el `CommandItem`) y `close`.
- El atajo global (`⌘K`/`Ctrl+K`) lo cableás vos: el componente no registra ninguno.
- `title`, `placeholder`, `color`, `size` y `height` configuran el modal.

```html
<cu-command-palette id="<id>" title="<title>" placeholder="<placeholder>" color="<color>"></cu-command-palette>
```

```vue
<CommandPalette ref="<ref>" title="<title>" color="<color>" :commands="<commands>" @select="<handler>" />
```

Los valores de `color` / `size` / `height` están en «Atributos» / «Props», abajo.

## Límites

- `commands` es obligatorio y va por propiedad JS: sin comandos la paleta abre vacía.
- No registra atajo global: el `⌘K`/`Ctrl+K` hay que cablearlo aparte.
- `run(id)` no cierra la paleta: ejecuta `action` y emite `select`, sin llamar a `close()`.
- La búsqueda sólo mira `label` y `category` (no `description`, `badges`, `shortcut` ni `id`).
- No tiene slots: los items no se personalizan con markup (`icon` es un string).
- El payload de `select` incluye la función `action` (no serializable; en el CE viaja en `e.detail`).
- No hay agrupado colapsable ni selección múltiple.
- `toggle` no está expuesto: sólo `open`/`close`.

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
