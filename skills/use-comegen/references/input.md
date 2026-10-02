# Input — `<cu-input>` / `<Input>`

Input de texto con color, variante, tipos HTML5 y métodos `get`/`set`/`reset`. Es la base de los
campos de formulario.

## Cuándo usarlo

Para capturar texto, números, email, teléfono, URL o búsqueda en una línea. Para multilínea usá
`<cu-textarea>`; para elegir entre opciones, `<cu-select>`.

## Receta

1. El valor lo maneja el propio campo al tipear; enlazá `v-model` en Vue o `model-value` en
   vanilla sólo si querés controlarlo. El valor es un **string** (también con `type="number"`).
2. Elegí el `type` (`text`, `password`, `email`, `number`, `tel`, `url`, `search`).
3. Estilá con `color` (default `neutral`), `variant` (default `soft`) y `size` (`sm`/`md`/`lg`,
   default `md`).
4. Leé/escribí con `get()` / `set()`; `reset()` limpia el campo y `focus()` lo enfoca.
5. Los eventos nativos (`input`, `change`, `focus`, `blur`) burbujean desde el shadow DOM; el cambio
   de valor custom llega por `update:modelValue`.
6. `disabled` y `readonly` deshabilitan la edición; `readonly` en HTML se escribe con la convención
   nativa.

```html
<!-- HTML plano (UMD) -->
<cu-input
  id="email"
  type="email"
  placeholder="correo@ejemplo.com"
  color="primary"
  variant="outlined"
></cu-input>

<script src="dist/CuInput.umd.js"></script>
<script>
  const input = document.getElementById('email');

  input.addEventListener('update:modelValue', (e) => {
    console.log('Valor:', e.detail);
  });

  input.set('usuario@dominio.com');
  console.log(input.get());
  input.focus();
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Input from "@/components/form/Input.vue";
import { ref } from "vue";

const email = ref("");
</script>

<template>
  <Input
    v-model="email"
    type="email"
    placeholder="correo@ejemplo.com"
    color="primary"
    variant="outlined"
  />
  <Input v-model="email" type="search" size="sm" @update:model-value="(v: string) => console.log(v)" />
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`), 4 variantes
(`outlined`, `soft`, `ghost`, `subtle`), 3 tamaños (`sm`, `md`, `lg`), 7 tipos HTML5, `placeholder`,
`disabled` y `read-only`. Expone `get`/`set`/`reset`/`focus` y emite `update:modelValue`.

**No puede:**

- **No hay evento custom `input` ni `change`.** Esos son nativos y burbujean; el evento custom de
  valor es `update:modelValue`.
- **`start-value` no funciona con `reset()`.** El CE lo declara y lo reenvía, pero el `.vue` no lo
  usa: `reset()` deja el campo **vacío**, no vuelve al valor inicial.
- **`model-value` no es el atributo `value`.** El CE no declara `value`; usá `model-value` (o
  `v-model`, o `.set()`). Un `value="..."` suelto no se refleja.
- **No hay slots.** No se puede inyectar un ícono o sufijo.
- **No acepta `theme`.** El tema se define en `<html data-theme="...">`.
- **El valor siempre es string:** con `type="number"`, `get()` devuelve un string, no un number.
- **No hay variante `none`:** el default es `soft`.
- `readOnly` en HTML se escribe `readonly`; `size` no se expone como kebab distinto (es un solo
  token).

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `"number" \| "text" \| "password" \| "email" \| "tel" \| "url" \| "search"` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `read-only` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |
| `model-value` | `string` | `""` | Valor actual del input. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `placeholder` | `string` | `—` | Placeholder del input |
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
| `focus` | Enfoca el input. |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `"number" \| "text" \| "password" \| "email" \| "tel" \| "url" \| "search"` | `"text"` | — |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del input (sm \| md \| lg). |
| `disabled` | `boolean` | `false` | — |
| `readOnly` | `boolean` | `false` | — |
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
| `focus` | Enfoca el input. |
<!-- /@api:expose -->
