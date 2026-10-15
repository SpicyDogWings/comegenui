# SideOver — `<cu-side-over>` / `<SideOver>`

Panel overlay que desliza desde un borde, con scrim, cierre por backdrop/Escape, `fullscreen` y
bloqueo del scroll del body. Para un diálogo centrado usá `<cu-modal>`.

## Receta

- Visibilidad: `v-model` (Vue) o `open` + `update:open` (CE).
- `position` elige el borde (default `right`); `size` acepta un valor CSS (`300px`, `40vw`) o un preset (`sm`/`md`/`lg`/`xl`/`full`).
- `fullscreen` ocupa toda la pantalla e ignora `size`.
- `title` pinta la cabecera; el botón de cerrar aparece salvo `persistent`.
- El contenido va al slot default; el panel se teleporta a `body`.
- En el CE: `open()`, `close()`, `toggle()` e `isOpen()`.

```html
<cu-side-over id="<id>" title="<title>" position="<position>" size="<size>"><p><content></p></cu-side-over>
```

```vue
<SideOver v-model="<open>" title="<title>" position="<position>" size="<size>"><p><content></p></SideOver>
```

Los valores de `position` / `size` / `z-index` están en «Atributos» / «Props», abajo.

## Límites

- En Vue no expone métodos (`SideOver.vue` no tiene `defineExpose`): el control es por `v-model`.
- No tiene focus trap, aunque declare `role="dialog"` y `aria-modal`.
- No emite `open`: sólo `update:modelValue`/`update:open` y `close`.
- `persistent` no deja ninguna vía de cierre desde el componente, ni el botón de cerrar.
- No tiene slots de header/footer: `title` es texto y el resto va al slot default.
- No acepta `color` ni `variant`.
- El panel se monta en `body`: no hereda el scoping CSS del lugar donde lo pongas; el `z-index` se controla con la prop.
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
| `isOpen` | Devuelve el estado actual (`boolean`) |
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
