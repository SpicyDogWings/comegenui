# Alert — `<cu-alert>` / `<Alert>`

Alerta con color semántico, título opcional y botón de cerrar; la visibilidad se controla por `show`
o programáticamente. Para un rótulo corto y estático, usá `cu-badge`.

## Receta

- Contenido por el **slot default**; `title` arma la cabecera y el slot `icon` va junto al título.
- `close` muestra la X.
- Visibilidad: `show` (atributo) o `v-model:show` en Vue.
- Al abrir/cerrar emite `close`, `open` y `update:show` (boolean en `e.detail`).
- Por código: `open()`, `close()`, `toggle()`, `isOpen()`.

```html
<cu-alert color="<color>" variant="<variant>" title="<title>" close show><label></cu-alert>
```

```vue
<Alert v-model:show="<bool>" color="<color>" variant="<variant>" title="<title>" close><label></Alert>
```

Los valores de `color` / `variant` están en «Atributos» / «Props», abajo.

## Límites

- No se autocierra ni tiene timer: sin `close` no hay X y sin tocar `show` (o los métodos) queda visible.
- `update:show` trae el boolean en `e.detail`; `open` y `close` no traen payload.
- El header sólo aparece si hay `title`, `close` o slot `icon`.
- No acepta `variant="link"` ni `variant="none"`.
- Sin `title` el slot `icon` se renderiza igual en la cabecera, sin texto al lado.
- No tiene `theme`, `size`, `dismissible` ni auto-dismiss.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `close` | `boolean` | `—` | Muestra el botón de cerrar (X) |
| `show` | `boolean` | `true` | Controla visibilidad. Cambiar este atributo emite `update:show` |
| `title` | `string` | `—` | Título visible en la cabecera |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `close` | — | — |
| `open` | — | — |
| `update:show` | — | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `icon` | — |
| `default` | — |
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `open` | Muestra la alerta |
| `close` | Oculta la alerta |
| `toggle` | Alterna visibilidad |
| `isOpen` | Devuelve `true`/`false` según la visibilidad actual |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `close` | `boolean` | `false` | — |
| `show` | `boolean` | `true` | — |
| `title` | `string` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `close` | — | — |
| `open` | — | — |
| `update:show` | — | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `icon` | — |
| `default` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `open` | — |
| `close` | — |
| `toggle` | — |
| `isOpen` | — |
<!-- /@api:expose -->
