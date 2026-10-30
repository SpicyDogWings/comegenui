[← Volver](../README.md)

# `FileInput`

Input de archivo compacto con drag & drop, estilo idéntico a `<Input>`. Single file, sin directorio, con validación de tipo y tamaño.

## Uso en Vue

```vue
<script setup lang="ts">
import FileInput from "@/components/form/FileInput.vue";
import { ref } from "vue";

const archivo = ref<File | null>(null);

function onUpdate(file: File | null) {
  console.log("Archivo:", file?.name);
}
</script>

<template>
  <FileInput v-model="archivo" placeholder="Elige un archivo..." color="primary" />
  <FileInput
    v-model="archivo"
    accept="image/*"
    variant="outlined"
    @update:model-value="onUpdate"
  />
  <FileInput disabled placeholder="Deshabilitado" />
</template>
```

> **Drag & drop:** se puede soltar un archivo sobre el componente; durante el arrastre se ilumina el borde y el fondo (también al pasar sobre sus propios íconos y textos). Los directorios se descartan solos (`size === 0 && !type`) y la validación de `accept`/`maxSize` también corre al soltar.

> **Teclado:** Enter o Espacio sobre el campo abren el diálogo; el botón de quitar responde a su propio teclado y no lo abre. El input nativo queda vacío después de procesar una selección, así que se puede volver a elegir el mismo archivo. Con `disabled` el nombre del archivo no abre una pestaña nueva.

## Colores

`color` tiñe el borde, el texto y el fondo según el tema activo, con los 6 nombres semánticos.

```vue
<FileInput color="primary" variant="outlined" placeholder="primary" />
<FileInput color="secondary" variant="outlined" placeholder="secondary" />
<FileInput color="neutral" variant="outlined" placeholder="neutral" />
<FileInput color="success" variant="outlined" placeholder="success" />
<FileInput color="warning" variant="outlined" placeholder="warning" />
<FileInput color="danger" variant="outlined" placeholder="danger" />
```

## Variantes

`variant` decide el aspecto del campo con las 4 variantes de campo (`outlined` es el default).

```vue
<FileInput color="primary" variant="outlined" placeholder="outlined" />
<FileInput color="primary" variant="soft" placeholder="soft" />
<FileInput color="primary" variant="ghost" placeholder="ghost" />
<FileInput color="primary" variant="subtle" placeholder="subtle" />
```

## Estados

`disabled` y `readOnly` cortan click, drag y drop; `disabled` además atenúa el componente y esconde el botón de quitar.

```vue
<FileInput disabled placeholder="Deshabilitado" />
<FileInput read-only placeholder="Solo lectura" />
```

## Validación

`accept` y `maxSize` se anuncian en el placeholder y se aplican tanto en el diálogo nativo como al soltar; si un archivo no pasa, aparece una `Alert` danger debajo con el motivo.

```vue
<FileInput accept="image/*" placeholder="Imagen" />
<FileInput accept=".pdf,.doc,.docx" placeholder="Documento" />
<FileInput accept="image/*,.pdf" :max-size="1048576" placeholder="Imagen o PDF hasta 1 MB" />
```

> No soporta `multiple`, `directory` ni `directory-deep`: para eso está `<FileInputZone>`. Al hacer click en el nombre del archivo, se abre en una pestaña nueva.

## Interacción

`update:modelValue` avisa cada cambio de archivo (con el `File` o `null`) y `get()`, `set()`, `reset()`, `focus()` y `trigger()` se llaman por `ref`.

```vue
<script setup lang="ts">
import FileInput from "@/components/form/FileInput.vue";
import { ref } from "vue";

const fi = ref<InstanceType<typeof FileInput> | null>(null);
const archivo = ref<File | null>(null);

function setear() {
  fi.value?.set(new File(["contenido"], "por-api.txt", { type: "text/plain" }));
  console.log(fi.value?.get()?.name);
}
</script>

<template>
  <FileInput ref="fi" v-model="archivo" placeholder="Archivo por API" />
  <Button size="sm" variant="outlined" @click="setear">set()</Button>
  <Button size="sm" variant="outlined" @click="fi?.reset()">reset()</Button>
  <Button size="sm" variant="outlined" @click="fi?.focus()">focus()</Button>
  <Button size="sm" variant="outlined" @click="fi?.trigger()">trigger()</Button>
</template>
```

## Props

<!--@include: ../../partials/file-input/props-vue.md-->

## Emits

<!--@include: ../../partials/file-input/eventos.md-->

## Slots

<!--@include: ../../partials/file-input/slots.md-->

## Expose

<!--@include: ../../partials/file-input/metodos-vue.md-->
