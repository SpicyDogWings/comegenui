# Alert — `<cu-alert>` / `<Alert>`

Alerta con color semántico, título opcional y botón de cerrar; la visibilidad se controla por `show`
o programáticamente.

## Cuándo usarlo

Para dar feedback al usuario: confirmaciones, advertencias, errores o avisos. Si es un rótulo corto
y estático, usá `cu-badge`.

## Receta

1. Elegí `color` (semántico) y `variant` (estilo). El contenido va por el slot default.
2. `title` agrega la cabecera; el slot `icon` se muestra junto al título. `close` muestra la X.
3. La visibilidad se controla con `show` (atributo) o con `v-model:show` en Vue. Al cerrar/abrir se
   emiten `close`, `open` y `update:show` (con el boolean en `e.detail`).
4. Por código: `open()`, `close()`, `toggle()` e `isOpen()`.

```html
<!-- HTML plano (UMD) -->
<script src="dist/CuAlert.core.umd.js"></script>

<cu-alert id="alerta" color="danger" variant="outlined" title="Atención" close show>
  Ha ocurrido un error.
</cu-alert>

<script>
  const alerta = document.getElementById('alerta');

  alerta.addEventListener('close', () => console.log('cerrada'));
  alerta.addEventListener('update:show', (e) => console.log('show =', e.detail));

  alerta.show = false;        // ocultar por propiedad
  alerta.open();              // o por método
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Alert from "@/components/information/Alert.vue";
import { ref } from "vue";

const show = ref(true);
</script>

<template>
  <Alert v-model:show="show" color="danger" variant="outlined" title="Atención" close>
    Ha ocurrido un error.
  </Alert>
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`), 5 variantes
(`solid`, `outlined`, `soft`, `ghost`, `subtle`), `title`, botón de cerrar (`close`), visibilidad
controlada (`show`), slots `icon` y default. Emite `open`, `close` y `update:show`, y expone
`open`, `close`, `toggle` e `isOpen`.

**No puede:**

- **No se autocierra ni tiene timer:** sin `close` no hay botón de cierre y sin manipular `show` (o
  los métodos) la alerta queda visible siempre.
- **El payload cambia según el evento:** `update:show` trae el boolean en `e.detail`; `open` y
  `close` no traen payload.
- **El header no es fijo:** sólo aparece si hay `title`, `close` o contenido en el slot `icon`.
- **No acepta `variant="link"` ni `variant="none"`.** `color="secondary"` sí existe.
- **No tiene `theme`, `size`, `dismissible` ni auto-dismiss.**
- **Sin `title` el slot `icon` se renderiza igual en la cabecera**, pero sin texto de título al lado.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `close` | `boolean` | `—` | Muestra el botón de cerrar (X) |
| `show` | `boolean` | `true` | Controla visibilidad. Cambiar este atributo emite `update:show` |
| `title` | `string` | `—` | Título visible en la cabecera |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `close` | — | — |
| `open` | — | — |
| `update:show` | — | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `icon` | — |
| `default` | — |
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `open` | Muestra la alerta |
| `close` | Oculta la alerta |
| `toggle` | Alterna visibilidad |
| `isOpen` | Devuelve `true`/`false` según la visibilidad actual |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `close` | `boolean` | `false` | — |
| `show` | `boolean` | `true` | — |
| `title` | `string` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `close` | — | — |
| `open` | — | — |
| `update:show` | — | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `icon` | — |
| `default` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `open` | — |
| `close` | — |
| `toggle` | — |
| `isOpen` | — |
<!-- /@api:expose -->
