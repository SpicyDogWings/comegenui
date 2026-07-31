# `<cu-button>`

Botón con soporte de color, variante, link y estados. Si se define `to`, se renderiza como un `<a>` en vez de un `<button>`.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"ghost"` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `type` | `string` | `"button"` | Tipo del `<button>`: `button`, `submit`, `reset` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `loading` | `boolean` | `false` | Muestra un spinner en lugar del contenido. Deshabilita el botón mientras está activo |
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

## Tipo submit/reset

Usá `type` cuando el botón viva dentro de un `<form>`:

```html
<form>
  <cu-button type="submit" color="primary" variant="solid">Enviar</cu-button>
  <cu-button type="reset" variant="ghost">Limpiar</cu-button>
</form>
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
