# ColorPicker — `<cu-color-picker>` / `<ColorPicker>`

Selector de color: swatch (abre el picker nativo del navegador) y campo de texto hex `#RRGGBB`.
Sin paletas, alpha, HSL ni temas.

## Receta

- Valor hex `#RRGGBB`: el control lo sincroniza al elegir; usá `model-value`/`v-model` sólo para
  controlarlo.
- `change` en cada confirmación.
- Programático: `get()` / `set('#rrggbb')` / `reset()` (vuelve a `#000000`) / `focus()`.
- `color` define el acento de borde/foco; `disabled` lo deshabilita.

```html
<cu-color-picker color="<color>" model-value="<#rrggbb>"></cu-color-picker>
```

```vue
<ColorPicker v-model="<ref>" color="<color>" @change="<handler>" />
```

Los valores de `color` están en «Atributos» / «Props», abajo.

## Límites

- Sólo hex `#RRGGBB`: sin alpha, sin `rgb()`/`hsl()` ni nombres de color.
- El texto sólo se confirma si es un hex válido: si no, al perder el foco se restaura el último valor válido.
- `set()` y `reset()` no emiten `change` (para detectarlos escuchá `update:modelValue`).
- No tiene `variant`, `size`, `theme` ni `hightContrast`.
- No tiene slots.
- No hay método para abrir el picker nativo: sólo se abre con click en el swatch.
- No acepta `required` ni validación más allá del formato hex.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` (define el acento del borde/foco) |
| `disabled` | `boolean` | `false` | Deshabilita el control |
| `model-value` | `string` | `"#000000"` | Valor del color en formato hex (`#RRGGBB`) |
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
| `get` | Devuelve el color actual (`string` hex) |
| `set` | Asigna un color programáticamente |
| `reset` | Vuelve al valor por defecto `#000000` |
| `focus` | Enfoca el campo de texto |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `"neutral"` | — |
| `disabled` | `boolean` | `false` | — |
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
| `get` | Devuelve el color actual en formato hex. |
| `set` | Setea el color actual en formato hex. |
| `reset` | Restaura el color al negro (#000000). |
| `focus` | Enfoca el input de texto del color. |
<!-- /@api:expose -->
