[← Volver](../README.md)

# `Button`

Botón con color semántico, 7 variantes, 3 tamaños, estados (`disabled` / `loading`) y modo
link. `variant` define el aspecto, `color` el color y `size` el tamaño; con `to` se renderiza
como un único `<a>` (sin `<button>` adentro) y sin `to`, como `<button>`.

Es el componente con el que están construidos casi todos los demás: si algo se ve raro en otro
componente, suele venir de acá.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuButton.umd.js"></script>

<cu-button color="primary" variant="solid">Guardar</cu-button>
```

En Vue, importá `Button` de `@/components/buttons/Button.vue` (ver [ficha Vue](/componentes/vue/button)).

## Variantes

`variant` decide el aspecto: `solid` (relleno), `outlined` (borde), `soft` (fondo tenue),
`ghost` (transparente; se pinta al pasar el mouse y es el **default**), `subtle` (tenue con
borde), `link` (texto subrayado, sin padding) y `none` (igual que `solid`).

```html
<cu-button color="primary" variant="solid">solid</cu-button>
<cu-button color="primary" variant="outlined">outlined</cu-button>
<cu-button color="primary" variant="soft">soft</cu-button>
<cu-button color="primary" variant="ghost">ghost</cu-button>
<cu-button color="primary" variant="subtle">subtle</cu-button>
<cu-button color="primary" variant="link">link</cu-button>
<cu-button color="primary" variant="none">none</cu-button>
```

<!-- demo:button-variantes -->

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`), así que el mismo nombre se ve distinto en cada tema.

En `solid` y `none` el texto es siempre el del tema (`--cu-color-surface`) y el fondo es la
variante `-solid`: el generador de tokens la ajusta (oscurece en temas claros, aclara en oscuros,
sin cambiar el hue) hasta que ese texto alcanza 4.5:1. `-solid-hover` y `-solid-active` siguen la
misma regla.

```html
<cu-button color="primary" variant="solid">primary</cu-button>
<cu-button color="secondary" variant="solid">secondary</cu-button>
<cu-button color="neutral" variant="solid">neutral</cu-button>
<cu-button color="success" variant="solid">success</cu-button>
<cu-button color="warning" variant="solid">warning</cu-button>
<cu-button color="danger" variant="solid">danger</cu-button>
```

<!-- demo:button-colores -->

## Tamaños

`size` acepta `sm`, `md` (**default**) y `lg`, y cambia el tamaño de fuente y el padding.

```html
<cu-button size="sm">Chico</cu-button>
<cu-button size="md">Medio (default)</cu-button>
<cu-button size="lg">Grande</cu-button>
```

<!-- demo:button-tamanos -->

### Solo icono

`iconOnly` cambia el padding a cuadrado para un botón sin texto visible. El contenido sigue
siendo el slot, así que el nombre accesible **no** sale del ícono: agregá `aria-label`
(o dejá texto visualmente oculto). Sin nombre accesible el botón queda mudo para lectores de
pantalla.

```html
<cu-button icon-only color="primary" variant="solid" aria-label="Cerrar">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
</cu-button>
```

## Estados

`disabled` atenúa el botón y bloquea la interacción. `loading` deshabilita igual y además
antepone un spinner (`LucideLoader` girando) mientras está activo: el contenido sigue visible
debajo, así que sirve para acciones asincrónicas. Con `loading` el botón expone `aria-busy="true"`
y el spinner queda `aria-hidden` para lectores de pantalla.

Con `to`, `disabled`/`loading` también bloquean la navegación: el `<a>` pierde el `href`, queda
`aria-disabled="true"`, sale del tab order (`tabindex="-1"`) y no emite `click`.

```html
<cu-button disabled>Deshabilitado</cu-button>
<cu-button color="primary" variant="solid" loading>Guardando…</cu-button>
```

<!-- demo:button-loading -->

En HTML plano `loading` y `disabled` también se manejan como propiedad del host
(`btn.loading = true`), que es lo que se hace en el ejemplo de eventos.

## Navegación

Sin `to` el botón es un `<button>` y no navega. Con `to`, el componente renderiza un único
`<a>` con las mismas clases, estilos y slot que el botón: es un solo nodo interactivo (antes
había un `<a>` con un `<button>` adentro, que es HTML inválido). `target` pasa a aplicar
(`_blank` abre en otra pestaña y agrega `rel="noopener noreferrer"`). `target` solo, sin `to`,
no hace nada.

`to` acepta cualquier destino navegable. Un esquema ejecutable (`javascript:`, `vbscript:`,
`data:`, incluso con espacios o mayúsculas) no se navega: el botón se renderiza como `<button>`,
así que un `to` que venga de datos del usuario no ejecuta código.

```html
<cu-button to="/componentes/cu-button" variant="link">Volver a esta página</cu-button>
<cu-button to="https://developer.mozilla.org" target="_blank" variant="link">Sitio externo</cu-button>
```

<!-- demo:button-link -->

En la variante `link` el padding queda en `0` y `size` no lo cambia.

## Formulario

`type` es el atributo del `<button>` de adentro. El default es `type="button"` (**no** envía);
`type="submit"` dispara el submit del `<form>` que lo contiene y `type="reset"` limpia sus
campos. Un `type` inválido cae a `"button"` (el valor inválido de HTML sería `submit`).

En HTML plano el `<button>` vive en el shadow DOM y no es form-associated, así que el componente
replica el submit/reset nativo contra el `<form>` del host (o el apuntado por el atributo
`form`). Dos límites de esa réplica: el botón no aporta `name`/`value` al payload y no aplica
`formaction`/`formmethod`. `formnovalidate` sí se respeta.

```html
<form>
  <cu-button type="submit" color="primary" variant="solid">Enviar</cu-button>
  <cu-button type="reset" variant="ghost">Limpiar</cu-button>
</form>
```

<!-- demo:button-submit -->

## Contenido e iconos

El contenido va por el slot `default`: texto, un `<svg>` inline, o los dos. No hay prop ni slot
`icon` — el icono es el mismo marcado del slot, así que hereda el color del botón con
`stroke="currentColor"`.

```html
<cu-button color="success" variant="soft">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
  Aceptar
</cu-button>
```

<!-- demo:button-iconos -->

## Interacción

`click`, `focus`, `blur`, `mouseenter`… son eventos del DOM: burbujean desde el shadow DOM
hasta el host, así que se escuchan igual que en un `<button>` común. No hay un CustomEvent
`click` propio y `e.detail` es `undefined`. Ojo con el target: desde el host, el shadow DOM hace
*retargeting* y `e.target` es el `<cu-button>`, no el `<button>` interno; el elemento interno
está en `e.composedPath()[0]`.

El único evento propio es `loading-change`, que se dispara cada vez que `loading` se prende o
se apaga, con el valor nuevo en `e.detail`.

```html
<cu-button id="guardar" color="primary" variant="solid">Guardar</cu-button>

<script>
  const btn = document.getElementById('guardar');

  // del DOM: el spinner lo maneja el componente, acá se simula la acción
  btn.addEventListener('click', async () => {
    btn.loading = true;
    await fetch('/api/guardar', { method: 'POST' });
    btn.loading = false;
  });

  // propio del componente: avisa cada cambio de `loading`
  btn.addEventListener('loading-change', (e) => {
    console.log('loading:', e.detail); // true | false
  });
</script>
```

<!-- demo:button-click -->

## Atributos

Atributos del custom element `<cu-button>`. En la API Vue son los mismos, en camelCase: ver
[ficha Vue](/componentes/vue/button#props).

Los atributos del host que **no** son props (`aria-*`, `data-*` y cualquier `kebab-case`) se
copian al control renderizado con el nombre original exacto: `aria-describedby="help"` llega
como `aria-describedby` al `<button>`/`<a>` interno (no como `ariadescribedby`), así que
`aria-labelledby`/`aria-describedby` resuelven el nombre y la descripción del control. Se
actualizan también en altas, cambios y bajas dinámicas. Dos excepciones deliberadas:

- `id` se queda en el host: copiarlo al nodo interno duplicaría el id del documento.
- `tabindex` se reenvía al control real y en el host queda `-1`, para que haya **una sola**
  parada de tab (el control) con el orden pedido.

<!--@include: ../partials/button/props-vanilla.md-->

## Eventos

CustomEvents del custom element. Los del DOM (`click`, `focus`, `blur`, `mouseenter`…) ya
burbujean al host, así que no hace falta declararlos.

<!--@include: ../partials/button/eventos.md-->

## Slots

Los mismos en las dos APIs: el custom element forwardea el slot del componente.

<!--@include: ../partials/button/slots.md-->

## Métodos expuestos

<!--@include: ../partials/button/metodos.md-->
