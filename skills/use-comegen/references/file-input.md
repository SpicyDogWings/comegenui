# FileInput — `<cu-file-input>` / `<FileInput>`

Input de archivo compacto (un solo archivo, sin directorio) con drag & drop, `accept` y
`max-size`, con el estilo de `<cu-input>`. Para varios archivos o carpetas usá
`<cu-file-input-zone>`.

## Receta

- Valor `File | null`: `v-model` en Vue o la propiedad JS `modelValue` / `set(file)` en vanilla.
- `accept` (`"image/*"`, `".pdf,.doc"`) y `max-size` (bytes).
- Selección: diálogo nativo, drag & drop, o `trigger()`.
- `update:modelValue` trae el `File` o `null`; lectura con `get()` / `set()` / `reset()` / `focus()`.
- Un archivo rechazado (vacío, muy pesado o formato no permitido) muestra un `Alert` de error y no
  cambia el valor.

```html
<cu-file-input placeholder="<texto>" color="<color>" variant="<variant>" accept="<tipos>" max-size="<bytes>"></cu-file-input>
```

```vue
<FileInput v-model="<ref>" color="<color>" accept="<tipos>" :max-size="<bytes>" />
```

Los valores de `color` / `variant` están en «Atributos» / «Props», abajo.

## Límites

- Un solo archivo: no hay `multiple`, `directory` ni `directory-deep` (para eso, `<cu-file-input-zone>`).
- `modelValue` es un `File`: va por propiedad JS o `set()`, no como atributo HTML.
- `max-size` va en bytes (2 MB = `2097152`).
- No emite eventos de validación: un archivo rechazado sólo se ve en el `Alert`.
- El `change` nativo del `<input type="file">` interno no se re-emite: escuchá `update:modelValue`.
- `focus()` enfoca el contenedor (`role="button"`), no el `<input type="file">` oculto.
- `read-only` bloquea todo: no abre el diálogo ni acepta drag/drop.
- No acepta `theme`: el tema se define en `<html data-theme="…">` (`theming.md`).
- El nombre del archivo seleccionado se abre en una pestaña nueva al hacer clic.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"outlined"` | `outlined`, `soft`, `ghost`, `subtle` |
| `disabled` | `boolean` | `—` | Deshabilita click, drag y drop |
| `read-only` | `boolean` | `—` | Modo solo lectura |
| `placeholder` | `string` | `"Seleccionar archivo"` | Texto cuando no hay archivo |
| `model-value` | `File \| null` | `null` | Archivo seleccionado (vía JS, no HTML) |
| `max-size` | `number` | `—` | Tamaño máximo en bytes |
| `accept` | `string` | `—` | Tipos aceptados (ej: `"image/*"`, `".pdf,.doc"`) |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `File \| null` | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el `File` actual o `null` |
| `set` | Asigna un archivo programáticamente |
| `reset` | Limpia la selección |
| `focus` | Enfoca el input |
| `trigger` | Abre el diálogo nativo de selección de archivos |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"outlined"` | — |
| `disabled` | `boolean` | `false` | — |
| `readOnly` | `boolean` | `false` | — |
| `placeholder` | `string` | `"Seleccionar archivo"` | — |
| `maxSize` | `number` | `—` | — |
| `accept` | `string` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `File \| null` | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el archivo actual. |
| `set` | Setea el archivo actual. |
| `reset` | Quita el archivo seleccionado. |
| `focus` | Enfoca el contenedor del input. |
| `trigger` | Abre el selector de archivos. |
<!-- /@api:expose -->
