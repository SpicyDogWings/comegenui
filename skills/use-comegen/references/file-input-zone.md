# FileInputZone — `<cu-file-input-zone>` / `<FileInputZone>`

Selector de archivos con zona de drag & drop amplia, soporte para carpetas (recursivo con control de
profundidad), múltiples archivos y preview de lista.

## Cuándo usarlo

Cuando el usuario sube **varios archivos** o una **carpeta completa** y querés una zona de carga
visible. Para un único archivo compacto, usá `<cu-file-input>`.

## Receta

1. El valor es `File | File[] | null`: enlazalo con `v-model` en Vue o con la propiedad JS
   `modelValue` en vanilla.
2. Activá `multiple` para varios archivos; `directory` para carpetas (implica `multiple`) y
   `directory-deep` para la profundidad (`0` = sólo raíz, `1` = +1 subnivel, `-1` = sin límite).
3. Acotá con `accept` (tipos) y `max-size` (bytes); `max-height` da scroll vertical al listado.
4. La lista (icono por extensión, nombre, tamaño y botón X por archivo) se maneja sola; los rechazos
   se reportan en un `Alert`.
5. Leé/escribí con `get()` / `set()` / `reset()`; `trigger()` abre el diálogo nativo. El evento
   `update:modelValue` trae el/los archivos o `null`.

```html
<!-- HTML plano (UMD) -->
<cu-file-input-zone
  id="zone"
  color="primary"
  multiple
  accept="image/*"
  max-height="200px"
  placeholder="Subí tus imágenes"
></cu-file-input-zone>

<script src="dist/CuFileInputZone.core.umd.js"></script>
<script>
  const zone = document.getElementById('zone');

  zone.addEventListener('update:modelValue', (e) => {
    const files = e.detail;
    if (Array.isArray(files)) console.log(`${files.length} archivos`);
  });

  zone.trigger();  // abre el diálogo nativo
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import FileInputZone from "@/components/form/FileInputZone.vue";
import { ref } from "vue";

const archivos = ref<File | File[] | null>(null);
</script>

<template>
  <FileInputZone
    v-model="archivos"
    color="primary"
    multiple
    accept="image/*"
    max-height="200px"
    placeholder="Subí tus imágenes"
  />
  <FileInputZone
    v-model="archivos"
    directory
    :directory-deep="-1"
    placeholder="Carpeta completa"
  />
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`), `multiple`,
`directory` + `directory-deep`, `accept`, `max-size`, `max-height`, `placeholder`, `disabled` y
`read-only`; drag & drop de archivos y carpetas; lista con iconos, tamaño y borrado individual.
Expone `get`/`set`/`reset`/`focus`/`trigger` y emite `update:modelValue`.

**No puede:**

- **No tiene `variant`.** El CE lo omite a propósito: el estilo de la zona es fijo.
- **`modelValue` es `File | File[] | null`, no un string.** No se setea como atributo HTML: usá
  `zone.set(...)` o asigná la propiedad JS.
- **`directory` arrastra `multiple`:** en modo carpeta no hay forma de limitar a un solo archivo.
- **`directory-deep` sólo aplica con `directory` activo.** `0` (default) es sólo la raíz y `-1` es
  recursión sin límite.
- **La recursión de carpetas depende del navegador** (`webkitGetAsEntry`): donde no esté soportada,
  las carpetas se ignoran.
- **No hay evento de rechazo.** Los archivos inválidos se listan en el `Alert`; no se emite nada.
- **`read-only` bloquea todo:** no abre el diálogo, no acepta drag ni drop.
- El scroll del listado sólo aparece si `max-height` está seteado.
- **No acepta `theme`.** El tema se define en `<html data-theme="...">`.

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
| `get` | — |
| `set` | — |
| `reset` | — |
| `focus` | — |
| `trigger` | Abre el selector de archivos. |
<!-- /@api:expose -->
