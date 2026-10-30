[← Volver](../README.md)

# `FileInputZone`

Selector de archivos con zona de drag & drop amplia, soporte para carpetas (recursivo con control de profundidad), múltiples archivos y preview de lista.

## Uso en Vue

```vue
<script setup lang="ts">
import FileInputZone from "@/components/form/FileInputZone.vue";
import { ref } from "vue";

const archivos = ref<File | File[] | null>(null);
</script>

<template>
  <FileInputZone v-model="archivos" placeholder="Arrastrá un archivo o hacé clic" />
  <FileInputZone v-model="archivos" color="primary" multiple accept="image/*" />
  <FileInputZone v-model="archivos" directory max-height="200px" />
</template>
```

## Colores

`color` tiñe el borde, el texto y los íconos según el tema activo, con los 6 nombres semánticos.

```vue
<FileInputZone color="primary" placeholder="primary" />
<FileInputZone color="secondary" placeholder="secondary" />
<FileInputZone color="neutral" placeholder="neutral" />
<FileInputZone color="success" placeholder="success" />
<FileInputZone color="warning" placeholder="warning" />
<FileInputZone color="danger" placeholder="danger" />
```

## Estados

`disabled` y `readOnly` cortan click, drag y drop; `disabled` además atenúa la zona y esconde el botón de quitar de cada archivo.

```vue
<FileInputZone disabled placeholder="Deshabilitado" />
<FileInputZone read-only placeholder="Solo lectura" />
```

## Múltiples archivos y carpetas

`multiple` acepta varios archivos; `directory` activa el modo carpeta (e incluye `multiple` implícitamente) y `directoryDeep` limita la recursión.

| `directoryDeep` | Archivos que entran |
|-----------------|-------------------|
| `0` (default) | Solo archivos directos de la carpeta raíz |
| `1` | Raíz + 1 subnivel |
| `5` | Hasta 5 subniveles |
| `-1` | Sin límite (recursión completa) |

```vue
<FileInputZone multiple accept=".txt,.pdf" placeholder="Varios archivos" />
<FileInputZone directory :directory-deep="0" placeholder="Carpeta (sólo la raíz)" />
<FileInputZone directory :directory-deep="1" placeholder="Carpeta hasta 1 subnivel" />
<FileInputZone directory :directory-deep="-1" placeholder="Carpeta sin límite de profundidad" />
```

> Los archivos con `size === 0 && !type` (directorios sueltos) se filtran solos. El listado usa `<FileList>` por dentro: icono por extensión, nombre, tamaño y botón X para quitar; al hacer click en un archivo se abre en una pestaña nueva.

> Al soltar varios archivos se listan en el orden del drop (aunque la lectura de cada uno termine antes o después) y, si el origen del arrastre no expone `items`, se usan los `files` del `DataTransfer`. Enter/Espacio sobre la zona abren el diálogo; el botón X de cada fila no lo abre. El input nativo queda vacío al procesar, así que se puede volver a elegir el mismo archivo.

## Alto máximo

Sin `maxHeight` el listado crece con los archivos; con `maxHeight` (ej. `"200px"`) scrollea al excederlo.

```vue
<FileInputZone multiple placeholder="Sin maxHeight" />
<FileInputZone multiple max-height="120px" placeholder="maxHeight: 120px" />
```

## Validación

`accept` y `maxSize` se anuncian en la zona y se aplican en el diálogo nativo y al soltar; cada archivo rechazado aparece listado en una `Alert` danger debajo.

```vue
<FileInputZone accept=".txt,.csv" placeholder="Sólo .txt y .csv" />
<FileInputZone multiple accept="image/*" :max-size="2097152" placeholder="Imágenes hasta 2 MB" />
```

## Interacción

`update:modelValue` avisa cada cambio (con un `File`, un `File[]` o `null`) y `get()`, `set()`, `reset()`, `focus()` y `trigger()` se llaman por `ref`.

```vue
<script setup lang="ts">
import FileInputZone from "@/components/form/FileInputZone.vue";
import { ref } from "vue";

const fz = ref<InstanceType<typeof FileInputZone> | null>(null);
const archivos = ref<File | File[] | null>(null);

function setear() {
  fz.value?.set([
    new File(["uno"], "a.txt", { type: "text/plain" }),
    new File(["dos"], "b.txt", { type: "text/plain" }),
  ]);
  console.log(fz.value?.get());
}
</script>

<template>
  <FileInputZone ref="fz" v-model="archivos" multiple placeholder="Archivos por API" />
  <Button size="sm" variant="outlined" @click="setear">set()</Button>
  <Button size="sm" variant="outlined" @click="fz?.reset()">reset()</Button>
  <Button size="sm" variant="outlined" @click="fz?.focus()">focus()</Button>
  <Button size="sm" variant="outlined" @click="fz?.trigger()">trigger()</Button>
</template>
```

## Props

<!--@include: ../../partials/file-input-zone/props-vue.md-->

## Emits

<!--@include: ../../partials/file-input-zone/eventos.md-->

## Slots

<!--@include: ../../partials/file-input-zone/slots.md-->

## Expose

<!--@include: ../../partials/file-input-zone/metodos-vue.md-->
