# Switch — `<cu-switch>` / `<Switch>`

Toggle booleano con color semántico, dos tamaños y label opcional.

## Cuándo usarlo

Para prender o apagar una opción. Si necesitás un estado intermedio (sí/no/tal vez), no
aplica: el switch sólo maneja `true`/`false`.

## Receta

1. El estado lo maneja el propio switch: al clickearlo se mueve solo. Enlazá `modelValue`
   sólo si querés controlarlo (`v-model` en Vue).
2. Escuchá `change` para reaccionar al toggle (payload `boolean`); se emite tanto por
   interacción como al llamar `set()`/`reset()`.
3. El texto va en `label` o en el slot default; el label nativo hace que el texto sea
   clickeable.
4. Ajustá `color`, `size` (`sm`/`md`) y `disabled`.
5. Programático: `get()`, `set(v)`, `reset()`, `focus()`.

```html
<!-- HTML plano (UMD) -->
<script src="dist/CuSwitch.umd.js"></script>

<cu-switch id="miSwitch" color="primary" size="md"></cu-switch>

<script>
  const sw = document.getElementById('miSwitch');

  sw.addEventListener('update:modelValue', (e) => console.log('Estado:', e.detail));
  sw.addEventListener('change', (e) => console.log('Toggle a:', e.detail));

  sw.set(true);
  console.log(sw.get()); // true
  sw.reset();            // vuelve a false
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Switch from "@/components/form/Switch.vue";
import { ref } from "vue";

const activo = ref(true);

function onChange(estado: boolean) {
  console.log("Toggle a:", estado);
}
</script>

<template>
  <Switch v-model="activo" color="primary" size="md" label="Notificaciones" @change="onChange" />
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores, 2 tamaños (`sm` 32×20 px, `md` 48×32 px), `disabled`, `label` y slot
default como texto, `change` con el boolean nuevo, y los métodos `get`/`set`/`reset`/`focus`
(tanto en CE como en Vue).

**No puede:**

- **No existe prop `checked`:** el estado se llama `modelValue` (aunque el `<input>` interno sea
  un checkbox).
- **No tiene `variant`, `theme` ni `hightContrast`.**
- **No expone `toggle()`:** para alternar programáticamente usá `set(!get())`.
- **`reset()` siempre apaga** (`false`), no vuelve a un valor inicial.
- **`change` también se dispara con `set()`/`reset()`**, no sólo cuando el usuario lo toca.
- **`disabled` bloquea la interacción pero no `set()`:** por código podés cambiarlo igual.
- El `<input>` interno tiene `tabindex="-1"`: no se enfoca con Tab, sólo con `focus()`.
- No hay `name`/`value` para enviarlo por un `<form>`.
- No tiene slots con nombre: sólo el default.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `size` | `"sm" \| "md"` | `"md"` | Tamaño del switch: `sm`, `md` |
| `disabled` | `boolean` | `—` | Estado deshabilitado |
| `model-value` | `boolean` | `false` | Estado del toggle. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `label` | `string` | `""` | — |
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
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el estado actual (`boolean`) |
| `set` | Asigna el estado |
| `reset` | Pone el estado en `false` |
| `focus` | Enfoca el switch |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `size` | `"sm" \| "md"` | `"md"` | — |
| `disabled` | `boolean` | `false` | — |
| `label` | `string` | `""` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
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
| Método | Descripción |
| ------ | ------ |
| `get` | — |
| `set` | — |
| `reset` | — |
| `focus` | Enfoca el input nativo. |
<!-- /@api:expose -->
