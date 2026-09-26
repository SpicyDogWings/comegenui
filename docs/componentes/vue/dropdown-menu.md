# `DropdownMenu`

Menú desplegable con items declarativos (label, ícono, color, divisor, link). El toggle se puede reemplazar con un slot, y el panel se puede llenar via `items` o con slot por defecto.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import DropdownMenu from "@/components/controls/DropdownMenu.vue";
import { ref } from "vue";

const pencil = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';
const copy = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const trash = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>';

const items = ref([
  { label: 'Editar', icon: pencil, onClick: () => console.log('edit') },
  { label: 'Duplicar', icon: copy, onClick: () => console.log('dup') },
  { divider: true },
  { label: 'Eliminar', icon: trash, color: 'danger', onClick: () => console.log('del') },
]);
</script>

<template>
  <DropdownMenu label="Acciones" color="primary" variant="soft" :items="items" />
</template>
```

> **Importante:** en Vue, `items` se pasa como prop (`:items="items"`), no como atributo HTML.

## Items con link

```vue
<script setup lang="ts">
import DropdownMenu from "@/components/controls/DropdownMenu.vue";
import { ref } from "vue";

const items = ref([
  { label: 'Perfil', href: '/perfil' },
  { label: 'Configuración', href: '/config' },
  { label: 'Cerrar sesión', href: '/logout', color: 'danger' },
]);
</script>

<template>
  <DropdownMenu :items="items" />
</template>
```

## Toggle personalizado

Reemplaza el botón toggle con el slot `toggle`:

```vue
<script setup lang="ts">
import DropdownMenu from "@/components/controls/DropdownMenu.vue";
</script>

<template>
  <DropdownMenu color="primary">
    <template #toggle="{ toggle }">
      <button
        @click="toggle"
        style="background:#3b82f6;color:white;border:none;border-radius:6px;padding:8px 14px;cursor:pointer"
      >
        ☰ Menú
      </button>
    </template>
  </DropdownMenu>
</template>
```

## Contenido libre en el panel (sin `items`)

Si pasás contenido en el slot por defecto, el panel ignora `items` y muestra lo que definas:

```vue
<script setup lang="ts">
import DropdownMenu from "@/components/controls/DropdownMenu.vue";
</script>

<template>
  <DropdownMenu label="Opciones">
    <div style="padding: 12px; min-width: 200px;">
      <p style="margin: 0 0 8px;">Contenido arbitrario</p>
      <a href="/logout">Cerrar sesión</a>
    </div>
  </DropdownMenu>
</template>
```

## Posicionamiento

El dropdown usa tres props combinables:

- `position` + `align`: separados (`bottom` + `start`)

```vue
<script setup lang="ts">
import DropdownMenu from "@/components/controls/DropdownMenu.vue";
</script>

<template>
  <DropdownMenu label="Arriba" position="top" align="end"></DropdownMenu>
  <DropdownMenu label="Alineado" position="bottom" align="end" :offset="8"></DropdownMenu>
</template>
```

## Control programático

```vue
<script setup lang="ts">
import DropdownMenu from "@/components/controls/DropdownMenu.vue";
import { ref } from "vue";

const dd = ref<InstanceType<typeof DropdownMenu> | null>(null);
const items = ref([/* ... */]);

function controlar() {
  dd.value?.open();
  dd.value?.close();
  dd.value?.toggle();
  console.log(dd.value?.isOpen());
}

function onOpen() { console.log('abierto'); }
function onClose() { console.log('cerrado'); }
</script>

<template>
  <DropdownMenu ref="dd" label="Dropdown" :items="items" @open="onOpen" @close="onClose" />
</template>
```

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"ghost"` | — |
| `disabled` | `boolean` | `false` | — |
| `label` | `string` | `""` | — |
| `position` | `"bottom" \| "top" \| "left" \| "right"` | `"bottom"` | — |
| `align` | `"start" \| "center" \| "end"` | `"start"` | — |
| `textAlign` | `"center" \| "left" \| "right"` | `"left"` | — |
| `offset` | `number` | `4` | — |
| `fixed` | `boolean` | `false` | — |
| `items` | `DropdownItem[]` | `[]` | — |
<!-- /@api:props -->

### Items

Cada item del array `items` puede tener:

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `label` | `string` | `""` | Texto visible del item |
| `icon` | `string` | — | SVG completo inline (`<svg>...</svg>`) |
| `onClick` | `function` | — | Callback al hacer clic |
| `color` | `string` | hereda del toggle | Color semántico del item |
| `variant` | `string` | `"ghost"` | Variante del item |
| `disabled` | `boolean` | `false` | Item deshabilitado (no clickeable, atenuado) |
| `divider` | `boolean` | `false` | Si es `true`, renderiza una línea divisoria en vez de un item |
| `href` | `string` | — | Convierte el item en un link (`<a>`) |
| `target` | `string` | `"_self"` | Target del link cuando hay `href` |

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `open` | `any[` | — |
| `close` | `any[` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `toggle` | — |
| `default` | — |
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `open` | Abre el menú. |
| `close` | Cierra el menú. |
| `toggle` | Alterna la visibilidad del menú. |
| `isOpen` | Devuelve true si el menú está abierto. |
<!-- /@api:expose -->
