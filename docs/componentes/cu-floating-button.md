# `<cu-floating-button>`

Botón flotante (FAB) fijo en la esquina inferior derecha. Es un `Button` (hereda color, variante, tamaño y estados) posicionado de forma flotante. Pensado para acciones primarias rápidas (agregar, flotante de guardar, etc.). Normalmente se usa con un ícono en el slot.

[← Volver](../README.md)

## Uso en HTML plano

```html
<script src="dist/CuFloatingButton.umd.js"></script>

<cu-floating-button color="primary" id="fab">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
</cu-floating-button>

<script>
  document.getElementById('fab').addEventListener('click', () => {
    console.log('FAB clickeado');
  });
</script>
```

---

## Variantes y tamaños

```html
<cu-floating-button color="success" variant="soft" size="lg">
  <svg><!-- ícono --></svg>
</cu-floating-button>
```

---

## Deshabilitado

```html
<cu-floating-button disabled>
  <svg><!-- ícono --></svg>
</cu-floating-button>
```

---

## Notas

- Es un `Button` posicionado de forma flotante: `position: fixed` en la esquina inferior derecha (`bottom` y `right`: `var(--cu-space-lg)`) con `z-index: 1000` y sombra elevada.
- **No** fija tamaño ni forma: hereda de `Button` el `padding`, el `size` (default `lg`) y el `border-radius`, y crece con su contenido.
- Hereda de `Button` las props `variant` y `size` (además del estado `loading`); el color semántico se define con `color`.
- El contenido (normalmente un SVG) debe usar `stroke="currentColor"`/`fill="currentColor"` para heredar el color.

---

## Atributos

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"primary"` | Color semántico del FAB: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"solid"` | Variante visual, heredada de `Button`: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `size` | `"sm" \| "md" \| "lg"` | `"lg"` | Tamaño, heredado de `Button`: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Deshabilita el botón. |
| `loading` | `boolean` | `false` | Muestra un spinner y deshabilita el botón mientras está activo. |

> El Custom Element **no expone** prop `theme` ni `hightContrast`.

## Eventos

No emite eventos propios: el `click` es el evento nativo del `<button>` (burbujea y cruza el shadow DOM).

## Slots

| Slot | Descripción |
|------|------|
| `default` | Ícono o contenido del botón (normalmente un SVG) |

## Métodos expuestos

No expone métodos.
