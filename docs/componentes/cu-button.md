# `<cu-button>`

Botón con soporte de color, variante, link y estados. Si se define `to`, se renderiza como un `<a>` en vez de un `<button>`.

[← Volver](../README.md)

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuButton.umd.js"></script>

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

## Cuándo usarlo

Para cualquier acción o navegación: es el componente con el que están hechos casi todos
los demás, así que si algo se ve raro en otro componente, suele venir de acá.

| Querés… | Usá |
|------|------|
| Disparar una acción | `<cu-button>` + `addEventListener('click')` |
| Navegar a una ruta | `to="/ruta"` (se renderiza como `<a>` con un `<button>` adentro) |
| Ir a un sitio externo | `to="https://…"` + `target="_blank"` |
| Una acción asincrónica | `loading` (spinner + deshabilitado mientras dura) |
| Enviar un formulario | `type="submit"` (el default es `type="button"`, que **no** envía) |

## Qué puede y qué no puede

**Puede:** 6 colores, 7 variantes, 3 tamaños, link (`to`/`target`), `type`, `disabled` y
`loading` con evento `loading-change`.

**No puede:**

- **No expone métodos.** No hay `.focus()` ni `.click()` propios: usá la API del DOM.
- **No acepta `theme`.** El tema se define en `<html data-theme="…">`.
- **Con `variant="link"` el padding queda en `0` y `size` no lo cambia** — el CSS lo fuerza
  con `:not(.cu-button--link)`.
- **No emite un evento custom `click`.** El que escuchás es el nativo del DOM, que burbujea
  desde el shadow DOM: `e.detail` es `undefined` y el `e.target` es el elemento interno.
- `disabled` y `loading` deshabilitan igual; `loading` además antepone un spinner: el contenido sigue visible.
- `target` sólo tiene efecto si hay `to`.

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

## Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `"reset" \| "button" \| "submit"` | `'button'` | Tipo del `<button>`: `button`, `submit`, `reset` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"ghost"` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `loading` | `boolean` | `false` | Antepone un spinner al contenido. Deshabilita el botón mientras está activo |
| `size` | `"sm" \| "md" \| "lg"` | `'md'` | Tamaño: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `target` | `"_self" \| "_blank" \| "_parent" \| "_top"` | `"_self"` | Target del link cuando `to` está definido: `_self`, `_blank`, `_parent`, `_top` |
| `to` | `string` | `—` | Si se especifica, el botón se renderiza como `<a>` |
<!-- /@api:atributos -->

## Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `loading-change` | `boolean` | — |
<!-- /@api:eventos -->

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

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

## Métodos expuestos

<!-- @api:metodos -->
No expone métodos.
<!-- /@api:metodos -->
