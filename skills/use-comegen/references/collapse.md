# Collapse — `<cu-collapse>` / `<Collapse>`

Sección colapsable con trigger (botón + chevron) y transición de altura. Para un panel flotante
anclado usá `cu-dropdown-menu`; para un modal, `cu-modal`.

## Receta

- El trigger lleva `label` (**obligatorio**) y, opcionalmente, `icon` (HTML/SVG como string) y `description`.
- Contenido por el slot default.
- `default-open` arranca abierto; `color` colorea el trigger.
- Escuchá `toggle` (boolean) o usá `open()`, `close()`, `toggle()`, `isOpen()`.
- `disabled` deja el trigger inerte (atributo booleano en HTML plano).

```html
<cu-collapse label="<label>" description="<description>" icon="<svg>" color="<color>" default-open><body></cu-collapse>
```

```vue
<Collapse label="<label>" description="<description>" icon="<svg>" color="<color>" default-open><body></Collapse>
```

Los valores de `color` están en «Atributos» / «Props», abajo.

## Límites

- No tiene `variant` (el trigger siempre es `ghost`) ni `theme`.
- No soporta `v-model` de apertura ni emite `update:open`: el estado inicial es `default-open` y después sólo cambia por el trigger o por métodos.
- Un solo slot (`default`): no se puede cambiar el trigger ni el chevron.
- `label` es obligatorio.
- Con `disabled`, `open()` y `toggle()` son no-op; `close()` sigue funcionando.
- `toggle` sólo se emite cuando el estado cambia.
- `icon` es un string HTML/SVG inyectado crudo; no es un componente ni una URL.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del trigger: `primary`, `neutral`, `success`, `warning`, `danger` |
| `disabled` | `boolean` | `false` | Deshabilita el trigger: no responde al click del usuario |
| `icon` | `string` | `""` | Ícono del trigger (SVG/HTML) |
| `description` | `string` | `""` | Texto secundario que se muestra bajo el label en el trigger |
| `default-open` | `boolean` | `false` | — |
| `label` | `string` | `—` | Texto del trigger |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `toggle` | `boolean` | Alterna el estado del collapse. |
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
| `open` | Abre el collapse |
| `close` | Cierra el collapse |
| `toggle` | Alterna el estado |
| `isOpen` | Devuelve el estado actual (`boolean`) |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `'neutral'` | — |
| `disabled` | `boolean` | `false` | Deshabilita el trigger: no responde al click del usuario. |
| `icon` | `string` | `''` | Ícono del trigger (SVG/HTML). |
| `description` | `string` | `''` | Texto secundario que se muestra bajo el label en el trigger. |
| `defaultOpen` | `boolean` | `false` | — |
| `label` | `string` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `toggle` | `boolean` | Alterna el estado del collapse. |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `open` | Abre el collapse. |
| `close` | Cierra el collapse. |
| `toggle` | Alterna el estado del collapse. |
| `isOpen` | Devuelve true si el collapse está abierto. |
<!-- /@api:expose -->
