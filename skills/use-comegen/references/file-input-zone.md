# FileInputZone — `<cu-file-input-zone>` / `<FileInputZone>`

Zona amplia de drag & drop para varios archivos o carpetas (recursivo con `directory-deep`), con
lista y preview. Para un único archivo compacto usá `<cu-file-input>`.

## Receta

- Valor `File | File[] | null`: `v-model` en Vue o la propiedad JS `modelValue` / `set(...)` en
  vanilla.
- `multiple` para varios archivos; `directory` (implica `multiple`) + `directory-deep` (`0` sólo
  raíz, `1` un subnivel, `-1` sin límite).
- Acotá con `accept` (tipos) y `max-size` (bytes); `max-height` da scroll al listado.
- La lista (icono por extensión, nombre, tamaño, botón X) se maneja sola; los rechazos se reportan
  en un `Alert`.
- `update:modelValue` trae el/los archivos o `null`; lectura con `get()` / `set()` / `reset()` /
  `focus()` / `trigger()`.

```html
<cu-file-input-zone color="<color>" multiple accept="<tipos>" max-height="<alto>" placeholder="<texto>"></cu-file-input-zone>
```

```vue
<FileInputZone v-model="<ref>" color="<color>" multiple accept="<tipos>" max-height="<alto>" />
```

Los valores de `color` están en «Atributos» / «Props», abajo.

## Límites

- No tiene `variant`: el estilo de la zona es fijo.
- `modelValue` es `File | File[] | null`: va por propiedad JS o `set()`, no como atributo HTML.
- `directory` arrastra `multiple`: en modo carpeta no hay forma de limitar a un solo archivo.
- `directory-deep` sólo aplica con `directory` activo.
- La recursión de carpetas depende del navegador (`webkitGetAsEntry`): donde no esté soportada, las carpetas se ignoran.
- No hay evento de rechazo: los archivos inválidos sólo se listan en el `Alert`.
- `read-only` bloquea todo: no abre el diálogo ni acepta drag/drop.
- El scroll del listado sólo aparece si `max-height` está seteado.
- No acepta `theme`: el tema se define en `<html data-theme="…">` (`theming.md`).

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `max-height` | `string` | `""` | Altura máxima del listado (ej: `"200px"`). Sin scroll si se omite. |
| `disabled` | `boolean` | `—` | Deshabilita interacción |
| `read-only` | `boolean` | `—` | Modo solo lectura |
| `placeholder` | `string` | `"Selecciona un archivo o arrastra aquí"` | Texto cuando no hay archivos |
| `model-value` | `File \| File[] \| null` | `null` | Archivo/s seleccionados |
| `multiple` | `boolean` | `—` | Permite múltiples archivos |
| `directory` | `boolean` | `—` | Activa modo carpeta (incluye `multiple` implícitamente) |
| `directory-deep` | `number` | `0` | Niveles de recursión en carpetas: `0` = solo raíz, `1` = +1 subnivel, `-1` = sin límite |
| `max-size` | `number` | `—` | Tamaño máximo en bytes |
| `accept` | `string` | `—` | Tipos aceptados (ej: `"image/*"`) |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `File \| File[] \| null` | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el/los archivo/s actual/es |
| `set` | Asigna archivos programáticamente |
| `reset` | Limpia la selección |
| `focus` | Enfoca la zona |
| `trigger` | Abre el diálogo nativo |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `maxHeight` | `string` | `""` | — |
| `disabled` | `boolean` | `false` | — |
| `readOnly` | `boolean` | `false` | — |
| `placeholder` | `string` | `"Selecciona un archivo o arrastra aquí"` | — |
| `multiple` | `boolean` | `false` | — |
| `directory` | `boolean` | `false` | — |
| `directoryDeep` | `number` | `0` | — |
| `maxSize` | `number` | `—` | — |
| `accept` | `string` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `File \| File[] \| null` | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el archivo o archivos actuales. |
| `set` | Setea el archivo o archivos actuales. |
| `reset` | Quita los archivos seleccionados. |
| `focus` | Enfoca la zona de carga. |
| `trigger` | Abre el selector de archivos. |
<!-- /@api:expose -->
