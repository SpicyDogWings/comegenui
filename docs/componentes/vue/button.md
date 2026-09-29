# `Button`

Botón con soporte de color, variante, link y estados. Si se define `to`, se renderiza como un `<a>` en vez de un `<button>`.

[← Volver](../README.md)

---

## Uso en Vue

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

## Cuándo usarlo

Para cualquier acción o navegación: es el componente con el que están hechos casi todos
los demás, así que si algo se ve raro en otro componente, suele venir de acá.

| Querés… | Usá |
|------|------|
| Disparar una acción | `@click="…"` |
| Navegar a una ruta | `to="/ruta"` (se renderiza como `<a>` con un `<button>` adentro) |
| Ir a un sitio externo | `to="https://…"` + `target="_blank"` |
| Una acción asincrónica | `:loading="ref"` (spinner + deshabilitado mientras dura) |
| Enviar un formulario | `type="submit"` (el default es `type="button"`, que **no** envía) |

## Qué puede y qué no puede

**Puede:** 6 colores, 7 variantes, 3 tamaños, link (`to`/`target`), `type`, `disabled` y
`loading` con evento `loading-change`.

**No puede:**

- **No expone métodos.** No hay `.focus()` ni `.click()` vía ref: usá la API del DOM.
- **No acepta `theme`.** El tema se define en `<html data-theme="…">`.
- **Con `variant="link"` el padding queda en `0` y `size` no lo cambia** — el CSS lo fuerza
  con `:not(.cu-button--link)`.
- **No emite un evento custom `click`.** `@click` es el evento nativo del DOM, no un emit.
- `disabled` y `loading` deshabilitan igual; `loading` además antepone un spinner: el contenido sigue visible.
- `target` sólo tiene efecto si hay `to`.

## Variantes

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

## Tamaños

```vue
<template>
  <Button size="sm">Chico</Button>
  <Button size="md">Medio (default)</Button>
  <Button size="lg">Grande</Button>
</template>
```

> En la variante `link` el padding queda fijo en 0 (el `size` no lo pisa).

## Estado de carga

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

## Tipo submit/reset

Usá `type` cuando el botón viva dentro de un `<form>`:

```vue
<template>
  <form>
    <Button type="submit" color="primary" variant="solid">Enviar</Button>
    <Button type="reset" variant="ghost">Limpiar</Button>
  </form>
</template>
```

## Escuchar clicks

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

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `"reset" \| "button" \| "submit"` | `'button'` | Tipo del `<button>`: `button`, `submit`, `reset` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"ghost"` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `loading` | `boolean` | `false` | Antepone un spinner al contenido. Deshabilita el botón mientras está activo |
| `size` | `"sm" \| "md" \| "lg"` | `'md'` | Tamaño: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `target` | `"_self" \| "_blank" \| "_parent" \| "_top"` | `"_self"` | Target del link cuando `to` está definido: `_self`, `_blank`, `_parent`, `_top` |
| `to` | `string` | `—` | Si se especifica, el botón se renderiza como `<a>` |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `loading-change` | `boolean` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
