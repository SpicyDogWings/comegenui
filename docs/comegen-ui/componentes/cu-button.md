# `<cu-button>`

Botón con soporte de color, variante, link y estados. Si se define `to`, se renderiza como un `<a>` en vez de un `<button>`.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"none"` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `hightContrast` | `boolean` | `false` | Modo de alto contraste para el texto |
| `to` | `string` | — | Si se especifica, el botón se renderiza como `<a>` |
| `target` | `string` | `"_self"` | Target del link cuando `to` está definido: `_self`, `_blank`, `_parent`, `_top` |

## Slots

| Slot | Descripción |
|------|-------------|
| `default` | Contenido del botón (label y/o íconos SVG inline) |

## Eventos

No re-emite eventos custom. Los eventos nativos del DOM (`click`, `focus`, `blur`, `mouseenter`, etc.) burbujean automáticamente al host:

```js
boton.addEventListener('click', (e) => {
  // e.detail es undefined; usá e.target normalmente
});
```

## Métodos

No expone métodos.

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

## Variantes

```html
<cu-button color="primary" variant="solid">solid</cu-button>
<cu-button color="primary" variant="outlined">outlined</cu-button>
<cu-button color="primary" variant="soft">soft</cu-button>
<cu-button color="primary" variant="ghost">ghost</cu-button>
<cu-button color="primary" variant="subtle">subtle</cu-button>
<cu-button color="primary" variant="link">link</cu-button>
```

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
