[← Volver](../README.md)

# `ThemeManagerModal`

Modal de exportación del tema: nombre, import/export JSON, reset y el CSS generado. Se abre y
cierra desde afuera con los métodos `open()` y `close()`, y avisa cada acción por eventos.

## Uso en Vue

```vue
<script setup lang="ts">
import { ref } from "vue";
import ThemeManagerModal from "@/components/theme/ThemeManagerModal.vue";
import Button from "@/components/buttons/Button.vue";

const modalRef = ref<InstanceType<typeof ThemeManagerModal> | null>(null);
const themeName = ref("mi-tema");

const cssOutput = `:root {
  --cu-color-primary: #6366f1;
  --cu-radius: 8px;
}`;

function record(entry: string) {
  console.log(entry);
}
</script>

<template>
  <Button color="primary" variant="solid" @click="modalRef?.open()">Exportar tema</Button>

  <ThemeManagerModal
    ref="modalRef"
    v-model:theme-name="themeName"
    :css-output="cssOutput"
    @reset="record('reset')"
    @import="record('import')"
    @export="record('export')"
    @copy-css="record('copy-css')"
    @download-css="record('download-css')"
  />
</template>
```

## Control del modal

El padre maneja la visibilidad con `open()` y `close()` sobre el `ref`.

```vue
<Button color="primary" variant="solid" @click="modalRef?.open()">open()</Button>
<Button color="neutral" variant="ghost" @click="modalRef?.close()">close()</Button>

<ThemeManagerModal ref="modalRef" v-model:theme-name="themeName" :css-output="cssOutput" />
```

## Eventos

`import` devuelve la `ThemeConfig` leída del JSON; `export`, `reset`, `copy-css` y `download-css`
sólo notifican la acción.

```vue
<ThemeManagerModal
  ref="modalRef"
  v-model:theme-name="themeName"
  :css-output="cssOutput"
  @import="(config) => record('import')"
  @export="record('export')"
  @reset="record('reset')"
  @copy-css="record('copy-css')"
  @download-css="record('download-css')"
/>
```

## Props

<!--@include: ../../partials/theme-manager-modal/props.md-->

## Emits

<!--@include: ../../partials/theme-manager-modal/eventos.md-->

## Slots

<!--@include: ../../partials/theme-manager-modal/slots.md-->

## Expose

<!--@include: ../../partials/theme-manager-modal/metodos.md-->

## Interfaces

### `ThemeConfig`

```ts
interface ThemeConfig {
  themes: Record<string, Record<string, string>>
  typography: Record<string, any>
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: { color: string }
  borders: { width: Record<string, string>, color: Record<string, string> }
}
```
