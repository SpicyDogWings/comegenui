# `<cu-command-palette>`

Paleta de comandos (búsqueda + lista) en un modal, con agrupado por categoría y selección por teclado o click.

> **Ojo:** `commands` es obligatoria (array de `CommandItem`) y se asigna como **propiedad JS**: sin ella la paleta abre vacía. Ver `docs/notes/05-wrappers-ce-incompletos.md`.

[← Volver](../README.md)

## Uso en HTML plano

```html
<script src="dist/CuCommandPalette.umd.js"></script>

<cu-command-palette id="palette" title="Comandos" color="primary"></cu-command-palette>
```

> El componente requiere `commands` para mostrar resultados: asignala como propiedad JS después de cargar el UMD.

---

## Atributos

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `commands` | `CommandItem[]` | `[]` | Comandos a mostrar (se agrupan por `category`). **Obligatoria**; se asigna como propiedad JS: `palette.commands = [...]` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del modal: `primary`, `neutral`, `success`, `warning`, `danger` |
| `title` | `string` | `""` | Título del modal |
| `placeholder` | `string` | `"Buscar comandos…"` | Placeholder del input de búsqueda |
| `size` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Ancho del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |
| `height` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Alto del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `select` | `CommandItem` | Se seleccionó un comando (por click o `Enter`) |
| `close` | — | Se cerró el modal |

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.open()` | Abre la paleta |
| `.close()` | Cierra la paleta |
| `.run(command)` | Ejecuta el `onSelect` de un comando |
| `.getCommands()` | Devuelve los comandos actuales |
| `.isOpen()` | `true` si está abierta |
