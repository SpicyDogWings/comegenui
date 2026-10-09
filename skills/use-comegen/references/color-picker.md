# ColorPicker — `<cu-color-picker>` / `<ColorPicker>`

Selector de color con swatch (abre el picker nativo del navegador) y campo de texto hex
`#RRGGBB`.

## Cuándo usarlo

Para elegir un color puntual en un formulario. Si necesitás paletas, alpha, HSL o temas, este
componente no alcanza.

## Receta

1. El valor lo maneja el propio control: al elegir un color se refleja solo. Enlazá
   `modelValue` sólo si querés controlarlo (`v-model` en Vue). El valor siempre es un hex
   `#RRGGBB`.
2. Escuchá `change` para reaccionar a cada confirmación.
3. Por código: `get()`, `set('#ff5733')`, `reset()` (vuelve a `#000000`) y `focus()`.
4. `color` define el acento de borde/foco del control y `disabled` lo deshabilita.

```html
<!-- HTML plano (UMD) -->
<script src="dist-libs/umd-core/CuColorPicker.umd.js"></script>

<cu-color-picker id="miColor" color="primary" model-value="#ff5733"></cu-color-picker>

<script>
  const cp = document.getElementById('miColor');
  cp.addEventListener('change', (e) => console.log('color:', e.detail));
  cp.set('#1774A4');
  console.log(cp.get()); // "#1774A4"
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import ColorPicker from "@/components/form/ColorPicker.vue";
import { ref } from "vue";

const color = ref("#ff5733");
</script>

<template>
  <ColorPicker v-model="color" color="primary" @change="(c) => console.log('color:', c)" />
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores de acento (`primary`, `secondary`, `neutral`, `success`, `warning`,
`danger`), `disabled`, `v-model`/`modelValue`, swatch que abre el selector nativo, entrada
manual de hex y los métodos `get`/`set`/`reset`/`focus`.

**No puede:**

- **Sólo hex `#RRGGBB`:** sin alpha, sin `rgb()`/`hsl()` ni nombres de color.
- **El texto sólo se confirma si es un hex válido:** si no lo es al perder el foco, se restaura
  el último valor válido.
- **`set()` y `reset()` no emiten `change`** (sólo actualizan el valor); para detectarlos escuchá
  `update:modelValue`.
- **No tiene `variant`, `size`, `theme` ni `hightContrast`.**
- **No tiene slots.**
- **No hay método para abrir el picker nativo:** sólo se abre con click en el swatch.
- **No acepta `required` ni validación** más allá del formato hex.

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
