# `SideOver`

Panel overlay que desliza desde un borde sobre el contenido, con scrim, cierre por backdrop/Escape, opción `fullscreen` y control programático. Bloquea el scroll del body mientras está abierto.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import SideOver from "@/components/overlay/SideOver.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <SideOver v-model="open" title="Filtros" position="right">
    <p>Contenido del panel.</p>
  </SideOver>

  <Button color="primary" variant="solid" @click="open = true">Abrir panel</Button>
</template>
```

## Control programático

```vue
<script setup lang="ts">
import SideOver from "@/components/overlay/SideOver.vue";
import { ref } from "vue";

const open = ref(false);

function abrir() { open.value = true; }
function cerrar() { open.value = false; }
function alternar() { open.value = !open.value; }
</script>

<template>
  <SideOver
    v-model="open"
    @update:model-value="(val) => console.log('estado:', val)"
    @close="() => console.log('cerrando')"
  />
</template>
```

## Presets de tamaño

```vue
<script setup lang="ts">
import SideOver from "@/components/overlay/SideOver.vue";
</script>

<template>
  <SideOver position="right" size="sm" title="Angosto"></SideOver>
  <SideOver position="left" size="lg" title="Ancho"></SideOver>
  <SideOver position="top" size="md" title="Desde arriba"></SideOver>
  <SideOver position="bottom" fullscreen title="Pantalla completa"></SideOver>
</template>
```

> Los presets (`sm`/`md`/`lg`/`xl`/`full`) se pueden sobrescribir con las custom properties `--cu-sideover-size-{sm|md|lg|xl|full}` sobre el host.

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `size` | `string` | `'300px'` | — |
| `title` | `string` | `''` | — |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `'right'` | — |
| `modelValue` | `boolean` | `false` | — |
| `persistent` | `boolean` | `false` | — |
| `zIndex` | `number` | `1100` | — |
| `fullscreen` | `boolean` | `false` | — |
<!-- /@api:props -->

> **Atributo `open`:** como `open` es un atributo HTML nativo, para controlarlo desde HTML usalo con valor booleano: `<cu-side-over open>` abre el panel. El estado también se maneja por método.

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `close` | `` | — |
| `update:modelValue` | `boolean` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
