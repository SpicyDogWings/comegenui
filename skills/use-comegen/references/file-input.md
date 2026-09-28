# FileInput — `<cu-file-input>` / `<FileInput>`

Input de archivo compacto con drag & drop, estilo idéntico a `<cu-input>`. Single file, sin
directorio, con validación de tipo (`accept`) y tamaño (`maxSize`).

## Cuándo usarlo

Para adjuntar **un solo archivo** en un formulario compacto, cuando querés el mismo look que un
input de texto. Si necesitás varios archivos o una carpeta completa, usá `<cu-file-input-zone>`.

## Receta

1. El valor es un `File | null` (no un string): enlazalo con `v-model` en Vue o con la propiedad JS
   `modelValue` en vanilla.
2. Limitá lo aceptado con `accept` (`"image/*"`, `".pdf,.doc"`) y el peso con `max-size` (en bytes).
3. El usuario elige con el diálogo nativo o **arrastra** el archivo sobre el control. Para abrir el
   diálogo desde código, llamá a `trigger()`.
4. Leé/escribí el valor con `get()` / `set()` / `reset()`; el evento `update:modelValue` trae el
   `File` o `null`.
5. Un archivo rechazado (vacío, muy pesado o formato no permitido) muestra un `Alert` de error y no
   cambia el valor.

```html
<!-- HTML plano (UMD) -->
<cu-file-input
  id="cv"
  placeholder="Elige un archivo..."
  color="primary"
  accept=".pdf,.doc"
  max-size="2097152"
></cu-file-input>

<script src="dist/CuFileInput.umd.js"></script>
<script>
  const cv = document.getElementById('cv');

  cv.addEventListener('update:modelValue', (e) => {
    console.log('Archivo:', e.detail?.name ?? 'ninguno');
  });

  cv.trigger();                 // abre el diálogo nativo
  console.log(cv.get()?.name);  // lee el File actual
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import FileInput from "@/components/form/FileInput.vue";
import { ref } from "vue";

const archivo = ref<File | null>(null);
</script>

<template>
  <FileInput
    v-model="archivo"
    placeholder="Elige un archivo..."
    color="primary"
    accept=".pdf,.doc"
    :max-size="2097152"
  />
  <FileInput disabled placeholder="Deshabilitado" />
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`), 4 variantes
(`outlined`, `soft`, `ghost`, `subtle`), `placeholder`, `disabled`, `read-only`, `accept`, `max-size`
(bytes) y drag & drop de un archivo. Expone `get`/`set`/`reset`/`focus`/`trigger` y emite
`update:modelValue`.

**No puede:**

- **Un solo archivo.** No hay `multiple`, `directory` ni `directory-deep`: para eso usá
  `<cu-file-input-zone>`.
- **`modelValue` es un `File`, no un string.** No se puede setear como atributo HTML: asignalo por
  propiedad JS (`input.modelValue = new File(...)`) o con `input.set(file)`.
- **`max-size` va en bytes** (ej: 2 MB = `2097152`).
- **No emite eventos de validación.** Un archivo rechazado sólo se ve (el `Alert` de error); no hay
  evento custom que lo notifique.
- **El `change` nativo del `<input type="file">` interno no se re-emite.** Escuchá
  `update:modelValue`.
- **`focus()` enfoca el contenedor** (que tiene `role="button"`), no el `<input type="file">`
  oculto.
- **`read-only` bloquea todo:** no abre el diálogo, no acepta drag ni drop.
- **No acepta `theme`.** El tema se define en `<html data-theme="...">`.
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
| `get` | — |
| `set` | — |
| `reset` | — |
| `focus` | — |
| `trigger` | Abre el selector de archivos. |
<!-- /@api:expose -->
