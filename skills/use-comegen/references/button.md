# Button — `<cu-button>` / `<Button>`

Botón con color, variante, tamaño, link y estados. Si definís `to`, se renderiza como un
`<a>` (con un `<button>` adentro) en vez de un `<button>` suelto.

## Cuándo usarlo

Para cualquier acción o navegación. Es el componente con el que están construidos casi
todos los demás, así que si algo se ve "raro" en otro componente, suele venir de acá.

## Receta

1. El contenido va por el slot default: texto, un `<svg>` inline, o los dos.
2. Para navegar: `to="/ruta"` (+ `target="_blank"` si es externo). Para un acción: `@click`.
3. Si la acción es asincrónica, manejá `loading`: muestra un spinner y deshabilita el botón.
4. Dentro de un `<form>`, poné `type="submit"` (el default es `type="button"`, que no envía).

```html
<!-- HTML plano (UMD) -->
<cu-button id="guardar" color="primary" variant="solid" loading>Guardar</cu-button>

<script>
  document.getElementById('guardar').addEventListener('click', async (e) => {
    e.target.loading = true;          // propiedad: arranca el spinner
    await fetch('/api/guardar', { method: 'POST' });
    e.target.loading = false;
  });
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const loading = ref(false);
const guardar = async () => {
  loading.value = true;
  await fetch("/api/guardar", { method: "POST" });
  loading.value = false;
};
</script>

<template>
  <Button color="primary" variant="solid" :loading="loading" @click="guardar">Guardar</Button>
  <Button to="/inicio" variant="link">Volver</Button>
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`),
7 variantes (`solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none`), 3 tamaños,
link (`to` + `target`), `type` (`button`/`submit`/`reset`), `disabled` y `loading` con
spinner + `loading-change`.

**No puede:**

- **No expone métodos.** Nada de `.focus()` ni `.click()` propios: usá la API del DOM.
- **No acepta `theme`.** El tema se define en `<html data-theme="...">` (ver `theming.md`).
- **Con `variant="link"` el padding queda en `0` y `size` no lo cambia** (el CSS lo fuerza
  con `:not(.cu-button--link)`). Si necesitás un link con tamaño, no lo vas a tener.
- **No hay un evento custom `click`.** El `click` que escuchás es el nativo del DOM, que
  burbujea desde el shadow DOM; `e.detail` es `undefined` y el `e.target` es el interno.
- **`disabled` y `loading` son lo mismo para el usuario:** ambos deshabilitan, pero
  `loading` además cambia el contenido por el spinner.
- `target` sólo tiene efecto si hay `to`.

## API del custom element

### Atributos

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"ghost"` | Estilo visual |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño (no aplica a `link`) |
| `to` | `string` | — | Si está, se renderiza como `<a>` |
| `target` | `"_self" \| "_blank" \| "_parent" \| "_top"` | `"_self"` | Target del link (sólo con `to`) |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Tipo del `<button>` |
| `disabled` | `boolean` | `false` | Deshabilitado (en HTML: `<cu-button disabled>`) |
| `loading` | `boolean` | `false` | Spinner + deshabilitado mientras está activo |

### Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `loading-change` | `boolean` | Cambió `loading` (también al setear `el.loading = true` por propiedad) |

Los nativos (`click`, `focus`, `blur`, `mouseenter`…) burbujean al host sin hacer nada.

### Slots

| Slot | Descripción |
|------|------|
| `default` | Contenido del botón: label y/o íconos SVG inline |

### Métodos expuestos

Ninguno.

## API del componente Vue

### Props

Las mismas ocho de arriba, en camelCase y con estos defaults: `color` `"neutral"`,
`variant` `"ghost"`, `size` `"md"`, `to` `—`, `target` `"_self"`, `type` `"button"`,
`disabled` `false`, `loading` `false`.

### Emits

| Evento | Payload | Descripción |
|------|------|------|
| `loading-change` | `boolean` | Cambió `loading` |

### Slots

| Slot | Descripción |
|------|------|
| `default` | Contenido del botón |

### Expose

Ninguno.
