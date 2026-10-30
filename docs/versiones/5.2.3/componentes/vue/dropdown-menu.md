[← Volver](../README.md)

# `DropdownMenu`

Menú desplegable con items declarativos (label, ícono, color, divisor, link). El toggle se puede reemplazar con un slot, y el panel se puede llenar via `items` o con slot por defecto.

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

## Colores

`color` pinta el toggle con los 6 nombres semánticos, que se resuelven con los tokens del tema activo.

```vue
<DropdownMenu label="primary" color="primary" variant="solid" :items="items" />
<DropdownMenu label="secondary" color="secondary" variant="solid" :items="items" />
<DropdownMenu label="neutral" color="neutral" variant="solid" :items="items" />
<DropdownMenu label="success" color="success" variant="solid" :items="items" />
<DropdownMenu label="warning" color="warning" variant="solid" :items="items" />
<DropdownMenu label="danger" color="danger" variant="solid" :items="items" />
```

## Variantes

`variant` decide el aspecto del toggle con las 7 variantes de `Button`; `ghost` es el default.

```vue
<DropdownMenu label="solid" color="primary" variant="solid" :items="items" />
<DropdownMenu label="outlined" color="primary" variant="outlined" :items="items" />
<DropdownMenu label="soft" color="primary" variant="soft" :items="items" />
<DropdownMenu label="ghost" color="primary" variant="ghost" :items="items" />
<DropdownMenu label="subtle" color="primary" variant="subtle" :items="items" />
<DropdownMenu label="link" color="primary" variant="link" :items="items" />
<DropdownMenu label="none" color="primary" variant="none" :items="items" />
```

## Estados

`disabled` atenúa el toggle y bloquea el menú: no abre ni por click ni por teclado.

```vue
<DropdownMenu label="Deshabilitado" color="primary" variant="solid" disabled :items="items" />
```

## Posicionamiento

`position` (`bottom` default, además `top`, `left` y `right`) y `align` (`start` default, `center`, `end`) eligen dónde se abre el panel y cómo queda alineado con el toggle; `offset` (default `4`) es la separación en píxeles y `fixed` usa `position: fixed`.

```vue
<DropdownMenu label="bottom / start" position="bottom" align="start" :items="items" />
<DropdownMenu label="bottom / center" position="bottom" align="center" :items="items" />
<DropdownMenu label="bottom / end" position="bottom" align="end" :items="items" />
<DropdownMenu label="top / start" position="top" align="start" :items="items" />
<DropdownMenu label="top / center" position="top" align="center" :items="items" />
<DropdownMenu label="top / end" position="top" align="end" :items="items" />
<DropdownMenu label="left / start" position="left" align="start" :items="items" />
<DropdownMenu label="right / start" position="right" align="start" :items="items" />
<DropdownMenu label="offset 16" :offset="16" :items="items" />
<DropdownMenu label="fixed" fixed :items="items" />
```

> `left` y `right` sólo existen en la API Vue: el custom element acepta `bottom` o `top`.

## Alineación del texto

`textAlign` (`left` **default**, `center`, `right`) alinea el **bloque de contenido** de los items
del panel: el ícono y el label se mueven juntos (el ícono no se descentra) y, si el label ocupa
más de una línea, el texto queda alineado dentro del ancho del item.

No confundir con `align`: `align` ubica el **panel** respecto del toggle; `textAlign` alinea el
contenido **dentro** de cada item. El toggle no se ve afectado (su ancho lo define su contenido).

```vue
<DropdownMenu label="text-align: left" color="primary" variant="outlined" text-align="left" :items="items" />
<DropdownMenu label="text-align: center" color="primary" variant="outlined" text-align="center" :items="items" />
<DropdownMenu label="text-align: right" color="primary" variant="outlined" text-align="right" :items="items" />
```

## Items

`items` es el array declarativo: cada item puede llevar `label`, `icon` (SVG inline), `color`, `variant`, `disabled`, `divider`, `href` con `target`, `selected` (check al final) y `onClick`, que se dispara al elegirlo.

```vue
<script setup lang="ts">
import DropdownMenu from "@/components/controls/DropdownMenu.vue";
import { ref } from "vue";

const pencil = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';
const copy = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const trash = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>';

const items = ref([
  { label: 'Editar', icon: pencil, selected: true, onClick: () => console.log('editar') },
  { label: 'Duplicar', icon: copy, variant: 'soft', onClick: () => console.log('duplicar') },
  { label: 'Deshabilitado', disabled: true },
  { divider: true },
  { label: 'Sitio externo', href: 'https://developer.mozilla.org', target: '_blank' },
  { label: 'Eliminar', icon: trash, color: 'danger', onClick: () => console.log('eliminar') },
]);
</script>

<template>
  <DropdownMenu label="Acciones" color="neutral" variant="outlined" :items="items" />
</template>
```

## Slots

El slot `toggle` reemplaza el botón del trigger (scoped: `toggle` e `isOpen`); el slot por defecto rellena el panel y sólo se usa cuando `items` está vacío.

```vue
<template>
  <DropdownMenu color="primary">
    <template #toggle="{ toggle, isOpen }">
      <Button :color="isOpen ? 'danger' : 'primary'" variant="solid" @click="toggle">
        {{ isOpen ? 'Cerrar menú' : 'Menú custom' }}
      </Button>
    </template>
  </DropdownMenu>

  <DropdownMenu label="Contenido libre">
    <div style="padding: 12px; min-width: 200px;">
      <p style="margin: 0 0 8px;">Contenido arbitrario</p>
      <a href="/logout">Cerrar sesión</a>
    </div>
  </DropdownMenu>
</template>
```

## Interacción

`open` y `close` son los dos emits propios, y `open()`, `close()`, `toggle()` e `isOpen()` se llaman por `ref`. El panel se anuncia como `role="menu"`; al cerrarse con `Escape` (o al elegir un item), el foco vuelve al trigger.

```vue
<script setup lang="ts">
import DropdownMenu from "@/components/controls/DropdownMenu.vue";
import { ref } from "vue";

const dd = ref<InstanceType<typeof DropdownMenu> | null>(null);
const items = ref([{ label: "Editar" }, { label: "Eliminar", color: "danger" }]);
const salida = ref("");

function controlar() {
  dd.value?.open();
  dd.value?.close();
  dd.value?.toggle();
  salida.value = `isOpen() → ${dd.value?.isOpen()}`;
}
</script>

<template>
  <DropdownMenu
    ref="dd"
    label="Dropdown"
    :items="items"
    @open="salida = 'evento open'"
    @close="salida = 'evento close'"
  />
  <Button size="sm" variant="outlined" @click="controlar">open / close / toggle / isOpen</Button>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
```

## Props

<!--@include: ../../partials/dropdown-menu/props-vue.md-->

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
| `selected` | `boolean` | `false` | Muestra el check de lucide al final del item (estado de selección) |

## Emits

<!--@include: ../../partials/dropdown-menu/eventos-vue.md-->

## Slots

<!--@include: ../../partials/dropdown-menu/slots.md-->

## Expose

<!--@include: ../../partials/dropdown-menu/metodos.md-->
