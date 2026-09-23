# `<cu-floating-button>`

Botón flotante (FAB) fijo en la esquina inferior derecha, de forma circular. Pensado para acciones primarias rápidas (agregar, flotante de guardar, etc.). Normalmente se usa con un ícono en el slot.

[← Volver](../SKILL.md)

---

---

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

## Deshabilitado

```html
<cu-floating-button disabled>
  <svg><!-- ícono --></svg>
</cu-floating-button>
```

---

## Notas

- Posición fija (`position: fixed`) en `bottom: 1.5rem; right: 1.5rem`, con `z-index: 1000`.
- Tamaño fijo de 48×48 px, forma circular y sombra elevada.
- El color de fondo usa el color semántico del tema activo; el ícono debe usar `stroke="currentColor"`/`fill="currentColor"` para heredarlo.

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"neutral" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"primary"` | Color semántico del FAB: primary, secondary, neutral, success, warning, danger. |
| `disabled` | `boolean` | `false` | Deshabilita el botón: atenúa el FAB y no emite `click`. |

> El Custom Element **no expone** prop `theme`, `variant` ni `hightContrast`.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `click` | — | Se emite al hacer click. Es un `CustomEvent` (`bubbles: true, composed: true`), se escucha con `addEventListener` |

## Slots

| Slot | Descripción |
|------|------|
| `default` | Ícono o contenido del botón (normalmente un SVG) |

## Métodos expuestos

No expone métodos.
