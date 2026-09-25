# `<cu-side-over>`

Panel overlay que desliza desde un borde sobre el contenido, con scrim, cierre por backdrop/Escape, opción `fullscreen` y control programático. Bloquea el scroll del body mientras está abierto.

[← Volver](../SKILL.md)

---

---

## Uso en HTML plano

```html
<script src="dist/CuSideOver.umd.js"></script>

<cu-side-over id="side" title="Filtros" position="right">
  <p>Contenido del panel.</p>
</cu-side-over>

<cu-button color="primary" variant="solid"
  onclick="document.getElementById('side').open()">
  Abrir panel
</cu-button>
```

---

## Control programático

```js
const side = document.getElementById('side');

side.open();
side.close();
side.toggle();
console.log(side.isOpen());

side.addEventListener('update:open', (e) => console.log('estado:', e.detail));
side.addEventListener('close', () => console.log('cerrando'));
```

---

## Presets de tamaño

```html
<cu-side-over position="right" size="sm" title="Angosto"></cu-side-over>
<cu-side-over position="left" size="lg" title="Ancho"></cu-side-over>
<cu-side-over position="top" size="md" title="Desde arriba"></cu-side-over>
<cu-side-over position="bottom" fullscreen title="Pantalla completa"></cu-side-over>
```

> Los presets (`sm`/`md`/`lg`/`xl`/`full`) se pueden sobrescribir con las custom properties `--cu-sideover-size-{sm|md|lg|xl|full}` sobre el host.

---

## Vista Vue

### Uso en Vue

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

### Control programático

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

### Presets de tamaño

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

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `modelValue` | `boolean` | `false` |  |
| `title` | `string` | `""` | Título de la cabecera (si está vacío y no es `persistent`, igual muestra el botón de cerrar) |
| `position` | `"left" \| "right" \| "top" \| "bottom"` | `"right"` | Borde desde donde desliza: `left`, `right`, `top`, `bottom` |
| `size` | `string` | `"300px"` | Ancho (`left`/`right`) o alto (`top`/`bottom`) del panel. Valor CSS (`300px`, `40vw`) o preset: `sm`, `md`, `lg`, `xl`, `full`. Ignorado con `fullscreen` |
| `fullscreen` | `boolean` | `false` | Ocupa toda la pantalla |
| `persistent` | `boolean` | `false` | Si es `true`, no se cierra por backdrop, `Escape` ni el botón de cerrar |
| `zIndex` | `number` | `1100` | Z-index del overlay (en HTML se usa como `z-index`) |

> **Atributo `open`:** como `open` es un atributo HTML nativo, para controlarlo desde HTML usalo con valor booleano: `<cu-side-over open>` abre el panel. El estado también se maneja por método.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `close` | — | Se inició el cierre (backdrop, Escape, `.close()`) |
| `update:modelValue` | `value: boolean` |  |

## Slots

| Slot | Descripción |
|------|------|
| `default` | Contenido del cuerpo del panel |

## Métodos expuestos

Ninguno.
