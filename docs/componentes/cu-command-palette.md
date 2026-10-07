# `<cu-command-palette>`

Paleta de comandos (búsqueda + lista) en un modal, con agrupado por categoría y selección por teclado o click.

> **Ojo:** `commands` es obligatoria (array de `CommandItem`) y se asigna como **propiedad JS**: sin ella la paleta abre vacía. Ver `docs/notes/05-wrappers-ce-incompletos.md`.

[← Volver](../README.md)

## Uso en HTML plano

```html
<script src="dist/CuCommandPalette.core.umd.js"></script>

<cu-command-palette id="palette" title="Comandos" color="primary"></cu-command-palette>
```

> El componente requiere `commands` para mostrar resultados: asignala como propiedad JS después de cargar el UMD.

---

## Atributos

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

## Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `select` | — | — |
| `close` | — | — |
<!-- /@api:eventos -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `open` | — |
| `close` | — |
| `run` | — |
| `getCommands` | — |
| `isOpen` | — |
<!-- /@api:metodos -->
