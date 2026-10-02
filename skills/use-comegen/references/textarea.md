# Textarea — `<cu-textarea>` / `<Textarea>`

Área de texto multilínea con color, variante, cantidad de filas y opción de deshabilitar el redimensionado.

## Cuándo usarlo

Para texto libre de varias líneas. Para una sola línea usá `cu-input`.

## Receta

1. El valor lo maneja el propio textarea al tipear; enlazá `v-model` (Vue) o `model-value` (CE)
   sólo si querés controlarlo.
2. Ajustá `rows`, `placeholder`, `disabled`, `read-only` (HTML `readonly`) y `no-resize`.
3. `color` y `variant` (`outlined`/`soft`/`ghost`/`subtle`) definen el estilo.
4. Programático: `get()`, `set(v)`, `reset()`, `focus()`.
5. Los eventos nativos `input`/`change`/`focus`/`blur` burbujean al host; no hay eventos
   custom con esos nombres.

```html
<!-- HTML plano (UMD) -->
<script src="dist/CuTextarea.umd.js"></script>

<cu-textarea id="comentarios" placeholder="Escribe aquí..." rows="5" color="primary" variant="outlined"></cu-textarea>

<script>
  const ta = document.getElementById('comentarios');

  ta.addEventListener('update:modelValue', (e) => console.log('Texto:', e.detail));

  ta.set('Texto predefinido');
  console.log(ta.get()); // "Texto predefinido"
  ta.focus();
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Textarea from "@/components/form/Textarea.vue";
import { ref, useTemplateRef } from "vue";

const comentarios = ref("Texto predefinido");
const campo = useTemplateRef("campo");
</script>

<template>
  <Textarea ref="campo" v-model="comentarios" placeholder="Escribe aquí..." :rows="5" color="primary" variant="outlined" />
  <button @click="campo?.reset()">Limpiar</button>
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores y 4 variantes (`outlined`, `soft`, `ghost`, `subtle`), `rows`,
`placeholder`, `disabled`, `readOnly`, `noResize`; resize vertical por default; `update:modelValue`
en cada input; y los métodos `get`/`set`/`reset`/`focus`.

**No puede:**

- **No tiene auto-resize ni contador de caracteres.**
- **`startValue` no tiene efecto:** la prop está en la API, pero `reset()` limpia a `""` sin
  usarla. Para restaurar un valor, hacelo vos con `set()`.
- **No hay eventos custom `input`/`change`:** los nativos burbujean desde el shadow DOM (su
  payload es el evento nativo, no `e.detail`).
- **`variant` es de formulario:** no admite `solid`, `link` ni `none`.
- **No tiene slots.**
- `set()` acepta `string | number` y siempre guarda un string.
- No expone una propiedad `value` reactiva: se lee con `get()`.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `read-only` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |
| `model-value` | `string` | `""` | Valor actual del textarea. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `rows` | `number` | `3` | Cantidad de filas visibles |
| `no-resize` | `boolean` | `false` | Desactiva el redimensionado manual (atributo HTML: `no-resize`) |
| `placeholder` | `string` | `—` | Placeholder del textarea |
| `start-value` | `string` | `—` | Valor inicial usado por `.reset()` |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `string` | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | — |
| `set` | — |
| `reset` | — |
| `focus` | — |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `disabled` | `boolean` | `false` | — |
| `readOnly` | `boolean` | `false` | — |
| `rows` | `number` | `3` | — |
| `noResize` | `boolean` | `false` | — |
| `placeholder` | `string` | `—` | — |
| `startValue` | `string` | `—` | — |
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
| `get` | — |
| `set` | — |
| `reset` | — |
| `focus` | — |
<!-- /@api:expose -->
