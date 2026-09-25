# `<cu-button>`

Botón con soporte de color, variante, link y estados. Si se define `to`, se renderiza como un `<a>` en vez de un `<button>`.

[← Volver](../SKILL.md)

---

## Uso en HTML plano

```html
<script src="dist/CuButton.umd.js"></script>

<cu-button color="primary" variant="solid">Guardar</cu-button>
<cu-button color="danger" variant="outlined" disabled>Eliminar</cu-button>
<cu-button color="success" variant="soft">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
  Aceptar
</cu-button>
<cu-button to="/inicio" variant="link">Volver al inicio</cu-button>
<cu-button to="https://ejemplo.com" target="_blank" variant="link">Sitio externo</cu-button>
```

---

## Variantes

```html
<cu-button color="primary" variant="solid">solid</cu-button>
<cu-button color="primary" variant="outlined">outlined</cu-button>
<cu-button color="primary" variant="soft">soft</cu-button>
<cu-button color="primary" variant="ghost">ghost</cu-button>
<cu-button color="primary" variant="subtle">subtle</cu-button>
<cu-button color="primary" variant="link">link</cu-button>
```

---

## Tamaños

```html
<cu-button size="sm">Chico</cu-button>
<cu-button size="md">Medio (default)</cu-button>
<cu-button size="lg">Grande</cu-button>
```

> En la variante `link` el padding queda fijo en 0 (el `size` no lo pisa).

---

## Estado de carga

Con `loading` el botón muestra un spinner animado y queda deshabilitado hasta que se apague:

```html
<cu-button color="primary" variant="solid" loading id="guardar">Guardar</cu-button>

<script>
  const btn = document.getElementById('guardar');
  btn.addEventListener('click', async () => {
    btn.loading = true;
    await fetch('/api/guardar', { method: 'POST' });
    btn.loading = false;
  });
</script>
```

---

## Tipo submit/reset

Usá `type` cuando el botón viva dentro de un `<form>`:

```html
<form>
  <cu-button type="submit" color="primary" variant="solid">Enviar</cu-button>
  <cu-button type="reset" variant="ghost">Limpiar</cu-button>
</form>
```

---

## Escuchar clicks

```html
<cu-button color="primary" variant="solid" id="miBoton">
  Haz clic
</cu-button>

<script>
  document.getElementById('miBoton').addEventListener('click', () => {
    alert('¡Click!');
  });
</script>
```

---

## Vista Vue

### Uso en Vue

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <Button color="primary" variant="solid">Guardar</Button>
  <Button color="danger" variant="outlined" disabled>Eliminar</Button>
  <Button color="success" variant="soft">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
    Aceptar
  </Button>
  <Button to="/inicio" variant="link">Volver al inicio</Button>
  <Button to="https://ejemplo.com" target="_blank" variant="link">Sitio externo</Button>
</template>
```

### Variantes

```vue
<template>
  <Button color="primary" variant="solid">solid</Button>
  <Button color="primary" variant="outlined">outlined</Button>
  <Button color="primary" variant="soft">soft</Button>
  <Button color="primary" variant="ghost">ghost</Button>
  <Button color="primary" variant="subtle">subtle</Button>
  <Button color="primary" variant="link">link</Button>
</template>
```

### Tamaños

```vue
<template>
  <Button size="sm">Chico</Button>
  <Button size="md">Medio (default)</Button>
  <Button size="lg">Grande</Button>
</template>
```

> En la variante `link` el padding queda fijo en 0 (el `size` no lo pisa).

### Estado de carga

Con `loading` el botón muestra un spinner animado y queda deshabilitado hasta que se apague:

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const loading = ref(false);

async function guardar() {
  loading.value = true;
  await fetch("/api/guardar", { method: "POST" });
  loading.value = false;
}
</script>

<template>
  <Button color="primary" variant="solid" :loading="loading" @click="guardar">
    Guardar
  </Button>
</template>
```

### Tipo submit/reset

Usá `type` cuando el botón viva dentro de un `<form>`:

```vue
<template>
  <form>
    <Button type="submit" color="primary" variant="solid">Enviar</Button>
    <Button type="reset" variant="ghost">Limpiar</Button>
  </form>
</template>
```

### Escuchar clicks

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";

function onClick() {
  alert("¡Click!");
}
</script>

<template>
  <Button color="primary" variant="solid" @click="onClick">Haz clic</Button>
</template>
```

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"ghost"` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño: `sm`, `md`, `lg` |
| `to` | `string` | — | Si se especifica, el botón se renderiza como `<a>` |
| `target` | `"_self" \| "_blank" \| "_parent" \| "_top"` | `"_self"` | Target del link cuando `to` está definido: `_self`, `_blank`, `_parent`, `_top` |
| `type` | `"reset" \| "button" \| "submit"` | `"button"` | Tipo del `<button>`: `button`, `submit`, `reset` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `loading` | `boolean` | `false` | Muestra un spinner en lugar del contenido. Deshabilita el botón mientras está activo |

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `loading-change` | `boolean` | Se emite cuando `loading` pasa a `true` o `false` (también al setear `el.loading = true` por propiedad) |

Los eventos nativos del DOM (`click`, `focus`, `blur`, `mouseenter`, etc.) burbujean automáticamente al host:

```js
boton.addEventListener('click', (e) => {
  // e.detail es undefined; usá e.target normalmente
});
```

Además emite un evento propio cuando cambia el estado `loading`:

```js
boton.addEventListener('loading-change', (e) => {
  console.log('loading:', e.detail) // true | false
});
```

## Slots

| Slot | Descripción |
|------|------|
| `default` | Contenido del botón (label y/o íconos SVG inline) |

## Métodos expuestos

No expone métodos.
