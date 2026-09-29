# FloatingButton — `<cu-floating-button>` / `<FloatingButton>`

Botón flotante (FAB) fijo en la esquina inferior derecha. Es un `Button` posicionado de forma
flotante, pensado para acciones primarias rápidas; normalmente lleva un ícono en el slot.

## Cuándo usarlo

Para una acción primaria global (crear, guardar, agregar) que tiene que quedar siempre a mano. Para
acciones en línea dentro de un formulario o una fila, usá `<cu-button>`.

## Receta

1. El contenido va por el slot default: normalmente un SVG con `stroke="currentColor"` o
   `fill="currentColor"` para heredar el color.
2. Elegí el color semántico con `color` (default `primary`), la forma con `variant` (default
   `solid`) y el tamaño con `size` (default `lg`).
3. Escuchá el `click` nativo (burbujea desde el shadow DOM) para disparar la acción.
4. Si la acción es asincrónica, usá `loading`: muestra un spinner y deshabilita el botón.
5. No hace falta ubicarlo: ya es `position: fixed` abajo a la derecha, con `z-index: 1000` y sombra.

```html
<!-- HTML plano (UMD) -->
<cu-floating-button id="fab" color="primary" variant="solid">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14" /><path d="M12 5v14" />
  </svg>
</cu-floating-button>

<script src="dist/CuFloatingButton.umd.js"></script>
<script>
  document.getElementById('fab').addEventListener('click', () => {
    console.log('FAB clickeado');
  });
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import FloatingButton from "@/components/buttons/FloatingButton.vue";

function crear() {
  console.log("crear");
}
</script>

<template>
  <FloatingButton color="primary" @click="crear">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  </FloatingButton>
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (default `primary`), 7 variantes (`solid`, `outlined`, `soft`, `ghost`,
`subtle`, `link`, `none`), 3 tamaños (`sm`, `md`, `lg`, default `lg`), `disabled` y `loading` con
spinner.

**No puede:**

- **No expone métodos.** Nada de `.focus()` ni `.click()` propios: usá la API del DOM.
- **No emite eventos custom.** El `click` que escuchás es el nativo del DOM, que burbujea desde el
  shadow DOM; `e.detail` es `undefined` y `e.target` es el interno.
- **No acepta `theme` ni `hightContrast`.** El tema se define en `<html data-theme="...">`.
- **No fija tamaño ni forma propios:** hereda de `Button` el `padding`, el `border-radius` y el
  `size`, y crece con su contenido.
- **La posición es fija** (esquina inferior derecha): no se configura.
- **No tiene `type` ni `to`.** No sirve como `submit` de un `<form>` ni como link de navegación; es
  un botón de acción.
- **`variant="link"` no tiene sentido acá:** un link flotante y fijo no aporta navegación.
- **`disabled` y `loading` se parecen para el usuario:** ambos deshabilitan, pero `loading` además
  cambia el contenido por el spinner.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"primary"` | Color semántico del FAB: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"solid"` | Variante visual, heredada de `Button`: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `loading` | `boolean` | `false` | Muestra un spinner y deshabilita el botón mientras está activo. |
| `size` | `"sm" \| "md" \| "lg"` | `"lg"` | Tamaño, heredado de `Button`: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Deshabilita el botón. |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
Ninguno.
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
No expone métodos.
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"primary"` | Color semántico del FAB: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"solid"` | Variante visual, heredada de `Button`: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `loading` | `boolean` | `false` | Muestra un spinner y deshabilita el botón mientras está activo. |
| `size` | `"sm" \| "md" \| "lg"` | `"lg"` | Tamaño, heredado de `Button`: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Deshabilita el botón. |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
Ninguno.
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
