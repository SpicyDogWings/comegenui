# `<cu-command-palette>`

Paleta de comandos (búsqueda + lista) en un modal, con agrupado por categoría y selección por teclado o click.

> **Nota:** el wrapper CE actual no expone la prop `commands` ni métodos (`open`/`close`) — sin `commands` el componente no tiene datos. Ver `docs/notes/05-wrappers-ce-incompletos.md`. La API pública documentada acá es la que el `.ce.vue` expone hoy.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
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

---

## Uso en HTML plano

```html
<script src="dist/CuCommandPalette.umd.js"></script>

<cu-command-palette id="palette" title="Comandos" color="primary"></cu-command-palette>
```

> El componente requiere la prop `commands` para mostrar resultados, pero el wrapper CE todavía no la expone (ver nota al inicio). Mientras tanto, la paleta solo abre como modal vacío.
