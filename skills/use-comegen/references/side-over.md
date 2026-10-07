# SideOver — `<cu-side-over>` / `<SideOver>`

Panel overlay que desliza desde un borde sobre el contenido, con scrim, cierre por backdrop/Escape, opción `fullscreen` y bloqueo del scroll del body.

## Cuándo usarlo

Para mostrar contenido secundario al costado (filtros, detalle, formulario) sin dejar la
página. Para un diálogo centrado usá `cu-modal`.

## Receta

1. Controlá la visibilidad con `v-model` (Vue) o `open` + `update:open` (CE).
2. Elegí el borde con `position` (`right` default) y el tamaño con `size`: un valor CSS
   (`300px`, `40vw`) o un preset (`sm`/`md`/`lg`/`xl`/`full`).
3. `fullscreen` ocupa toda la pantalla e ignora `size`.
4. `title` pinta la cabecera; el botón de cerrar aparece salvo `persistent`.
5. `persistent` desactiva el cierre por backdrop, Escape y botón de cerrar.
6. El contenido va al slot default. El panel se teleporta a `body`.
7. En CE: `open()`, `close()`, `toggle()` e `isOpen()`.

```html
<!-- HTML plano (UMD) -->
<script src="dist/CuSideOver.core.umd.js"></script>

<cu-side-over id="side" title="Filtros" position="right">
  <p>Contenido del panel.</p>
</cu-side-over>

<button onclick="document.getElementById('side').open()">Abrir panel</button>
```

```vue
<!-- Vue -->
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

## Qué puede y qué no puede

**Puede:** 4 posiciones (`left`, `right`, `top`, `bottom`), `size` como valor CSS o preset
(`sm`/`md`/`lg`/`xl`/`full`, sobrescribible con `--cu-sideover-size-*`), `fullscreen`,
`zIndex`, `persistent`, cierre por backdrop/Escape/botón, bloqueo del scroll del body, y en CE
`open`/`close`/`toggle`/`isOpen` con eventos `update:open` y `close`.

**No puede:**

- **En Vue no expone métodos** (`SideOver.vue` no tiene `defineExpose`): el control es por
  `v-model`.
- **No tiene focus trap:** el foco no queda encerrado en el panel aunque declare
  `role="dialog"` y `aria-modal`.
- **No emite un evento `open`:** sólo `update:modelValue`/`update:open` y `close`.
- **`persistent` no deja ninguna vía de cierre desde el componente**, ni el botón de cerrar.
- **No tiene slots de header/footer:** `title` es texto y todo lo demás va en el slot default.
- **No acepta `color` ni `variant`.**
- El panel se monta en `body`: no hereda el scoping CSS del lugar donde lo pongas; el
  `z-index` se controla con la prop.
- `size` se ignora por completo con `fullscreen`.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `size` | `string` | `"300px"` | Ancho (`left`/`right`) o alto (`top`/`bottom`) del panel. Valor CSS (`300px`, `40vw`) o preset: `sm`, `md`, `lg`, `xl`, `full`. Ignorado con `fullscreen` |
| `title` | `string` | `""` | Título de la cabecera (si está vacío y no es `persistent`, igual muestra el botón de cerrar) |
| `open` | `boolean` | `false` | Estado de visibilidad (v-model). Ver nota de atributo abajo |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"right"` | Borde desde donde desliza: `left`, `right`, `top`, `bottom` |
| `persistent` | `boolean` | `false` | Si es `true`, no se cierra por backdrop, `Escape` ni el botón de cerrar |
| `z-index` | `number` | `1100` | Z-index del overlay (en HTML se usa como `z-index`) |
| `fullscreen` | `boolean` | `false` | Ocupa toda la pantalla |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:open` | — | — |
| `close` | — | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `open` | Abre el panel |
| `close` | Cierra el panel |
| `toggle` | Alterna visibilidad |
| `isOpen` | — |
<!-- /@api:metodos -->

## API del componente Vue

### Props

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

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `close` | — | — |
| `update:modelValue` | `boolean` | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
