# Tabs — `<cu-tabs>` / `<Tabs>`

Pestañas con variantes, iconos, tabs deshabilitadas y control programático. Cada panel se asocia a una
tab por su `key`.

## Receta

- `tabs` (array requerido) de `{ key, label, icon?, disabled?, keepAlive? }`; en HTML asignalo como propiedad JS.
- El panel de cada tab va en un slot con el **nombre de la key** (`slot="<key>"` / `<template #<key>>`).
- Icono por el campo `icon` (string HTML) o por el slot `tab-icon-<key>`.
- Activo: `model-value` + `update:modelValue` (`v-model` en Vue); escuchá `change` (payload = key).
- `keepAlive: true` mantiene el panel montado (`v-show`) y conserva el estado interno.
- Programático: `getActive()`, `setActive(key)`, `next()`, `prev()`; teclado ←/→, `Home`, `End`.

```html
<cu-tabs model-value="<key>" variant="<variant>" color="<color>" size="<size>"><div slot="<key>"><panel></div></cu-tabs>
```

```vue
<Tabs v-model="<key>" :tabs="<items>" variant="<variant>" color="<color>" size="<size>"><template #<key>><panel></template></Tabs>
```

Los valores de `variant` / `color` / `size` están en «Atributos» / «Props», abajo.

## Límites

- Sólo hay slots por key y `tab-icon-<key>`: no hay header, footer ni badge.
- El slot del panel depende de la key: si no coincide con ninguna tab, no se renderiza.
- `tabs` es un array: sólo como propiedad JS, no como atributo HTML.
- `setActive` ignora keys inexistentes y tabs deshabilitadas.
- `keepAlive` usa `v-show`, no `<KeepAlive>`: no es una caché semántica de componentes.
- No expone el activo como propiedad reactiva: se lee con `getActive()`.
- `icon` es HTML crudo (`v-html`), no un componente ni un nodo Vue.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"primary"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "soft" \| "ghost" \| "boxed"` | `"ghost"` | `ghost`, `solid`, `boxed`, `soft` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | `sm`, `md`, `lg` |
| `disabled` | `boolean` | `—` | Deshabilita todas las pestañas |
| `model-value` | `string` | `""` | Key del tab activo (controlado) |
| `tabs` | `{ key: string; label: string; icon?: string \| undefined; disabled?: boolean \| undefined; keepAlive?: boolean \| undefined; }[]` | `[]` | Definición de las pestañas |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `string` | — |
| `change` | — | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `getActive` | Devuelve la key del tab activo |
| `setActive` | Activa el tab con esa key |
| `next` | Activa el próximo tab habilitado |
| `prev` | Activa el tab anterior habilitado |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `modelValue` | `string` | `""` | — |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"primary"` | — |
| `variant` | `"solid" \| "soft" \| "ghost" \| "boxed"` | `"ghost"` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | — |
| `disabled` | `boolean` | `false` | — |
| `tabs` | `TabItem[]` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `string` | — |
| `change` | — | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `getActive` | Devuelve la clave del tab activo. |
| `setActive` | Activa el tab con la clave indicada. |
| `next` | Avanza al siguiente tab habilitado. |
| `prev` | Retrocede al tab habilitado anterior. |
<!-- /@api:expose -->
