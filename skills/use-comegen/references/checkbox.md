# Checkbox — `<cu-checkbox>` / `<Checkbox>`

Checkbox con label y color, controlable con `v-model`/`modelValue` o con los métodos
`get`/`set`.

## Cuándo usarlo

Para una opción binaria (aceptar, activar, seleccionar). Si querés un interruptor de
encendido/apagado usá `cu-switch`; si es una opción entre varias, usá `cu-select`.

## Receta

1. Controlá el valor con `v-model` (Vue) o `modelValue` + `update:modelValue` (CE).
2. Escuchá `change` para reaccionar al toggle.
3. Por código: `set(true/false)`, `reset()`, `get()` (devuelve el estado) y `focus()`.
4. `color` tiñe el check y `size` (`sm`/`md`) cambia el tamaño; `label` es el texto y
   `disabled` lo deshabilita.

```html
<!-- HTML plano (UMD) -->
<script src="dist/CuCheckbox.umd.js"></script>

<cu-checkbox id="acepto" label="Acepto los términos" color="primary"></cu-checkbox>

<script>
  const chk = document.getElementById('acepto');
  chk.addEventListener('change', () => console.log('estado:', chk.get()));
  chk.set(true);
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Checkbox from "@/components/form/Checkbox.vue";
import { ref } from "vue";

const acepto = ref(false);
</script>

<template>
  <Checkbox v-model="acepto" label="Acepto los términos" color="primary" />
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`),
2 tamaños (`sm`, `md`), `label`, `disabled`, `v-model`/`modelValue` y los métodos
`get`/`set`/`reset`/`focus`.

**No puede:**

- **No tiene `variant`:** el estilo se define con `size` y `color`.
- **No tiene estado indeterminado** ni una prop `checked` separada de `modelValue`.
- **No tiene slot de label:** el texto va por la prop `label` (string).
- **No emite `change` con un booleano limpio.** En el uso normal, el `change` que llega es el
  evento nativo del `<input>`; los `set()`/`reset()` programáticos emiten
  `{ target: { checked: boolean } }`. Para el valor concreto usá `get()` o `update:modelValue`.
- **No participa de formularios nativos:** no tiene `name`, `required` ni submit implícito.
- **No acepta `theme`.**
- **`disabled` no se apaga con `disabled="false"` desde HTML** (es por presencia); por propiedad
  JS sí (`el.disabled = false`).

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `size` | `"sm" \| "md"` | `"md"` | Tamaño del checkbox: `sm`, `md` |
| `disabled` | `boolean` | `—` | Estado deshabilitado |
| `model-value` | `boolean` | `false` | Estado del checkbox (controlado) |
| `label` | `string` | `—` | Texto visible junto al checkbox |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `boolean` | — |
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
| `get` | Devuelve el estado actual (`boolean`) |
| `set` | Asigna el estado (programáticamente) |
| `reset` | Pone el estado en `false` |
| `focus` | Enfoca el checkbox |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `size` | `"sm" \| "md"` | `"md"` | — |
| `disabled` | `boolean` | `false` | — |
| `label` | `string` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `boolean` | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve si el checkbox está marcado. |
| `set` | Setea el estado marcado y emite change. |
| `reset` | Desmarca el checkbox y emite change. |
| `focus` | Enfoca el input nativo. |
<!-- /@api:expose -->
