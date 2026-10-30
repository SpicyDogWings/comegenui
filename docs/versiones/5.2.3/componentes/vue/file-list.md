[← Volver](../README.md)

# `FileList`

Listado de archivos con icono por extensión, nombre, tamaño y botón de quitar. Es interna: la usa `<FileInputZone>` y también se puede montar sola con un `File`, un array o `null`.

## Uso en Vue

```vue
<script setup lang="ts">
import { ref } from "vue";
import FileList from "@/components/FileList.vue";

const files = ref<File[]>([
  new File([new Uint8Array(245760)], "informe-anual.pdf", { type: "application/pdf" }),
  new File([new Uint8Array(51200)], "presupuesto.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  }),
]);

function onRemove(index: number) {
  files.value.splice(index, 1);
}
</script>

<template>
  <FileList :files="files" @remove="onRemove" />
</template>
```

## Colores

`color` tiñe el nombre, el tamaño y el hover de cada fila con los 6 nombres semánticos del tema activo.

```vue
<FileList :files="files" color="primary" />
<FileList :files="files" color="secondary" />
<FileList :files="files" color="neutral" />
<FileList :files="files" color="success" />
<FileList :files="files" color="warning" />
<FileList :files="files" color="danger" />
```

## Datos

`files` acepta un `File` suelto (lista de uno), un `File[]` o `null`. Sin archivos no renderiza nada.

```vue
<script setup lang="ts">
import { ref } from "vue";

const suelto = ref<File | null>(new File([new Uint8Array(81920)], "contrato.pdf", { type: "application/pdf" }));
const varios = ref<File[]>([new File(["uno"], "a.txt"), new File(["dos"], "b.txt")]);
const vacio = ref<File[] | null>(null);
</script>

<template>
  <FileList :files="suelto" />
  <FileList :files="varios" />
  <FileList :files="vacio" />
</template>
```

## Estados

`disabled` esconde el botón de quitar de cada fila; el click de selección sigue emitiendo `select` (pero sin `remove`).

```vue
<FileList :files="files" disabled />
```

## Alto máximo

`maxHeight` limita la altura del listado y lo vuelve scrolleable al excederla; sin `maxHeight` crece con los archivos.

```vue
<FileList :files="files" max-height="160px" />
<FileList :files="files" />
```

## Interacción

`select` se dispara al hacer click en una fila (con el índice) o al activar el nombre —un botón real, así que funciona con click, Enter o Espacio—; `remove` se dispara al tocar la X (con el índice). El componente no saca el archivo de la lista, eso lo hace el consumidor. La fila **no** es un botón: el nombre y la X son controles hermanos (nada interactivo anidado) y la X tiene nombre accesible (`Quitar <archivo>`).

```vue
<script setup lang="ts">
function onSelect(index: number) {
  console.log("select", index, files.value[index]?.name);
}
function onRemove(index: number) {
  console.log("remove", index);
  files.value.splice(index, 1);
}
</script>

<template>
  <FileList :files="files" @select="onSelect" @remove="onRemove" />
</template>
```

## Props

<!--@include: ../../partials/file-list/props.md-->

## Emits

<!--@include: ../../partials/file-list/eventos.md-->

## Slots

<!--@include: ../../partials/file-list/slots.md-->

## Expose

<!--@include: ../../partials/file-list/metodos.md-->
