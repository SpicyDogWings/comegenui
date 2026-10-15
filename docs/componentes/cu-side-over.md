[← Volver](../README.md)

# `<cu-side-over>`

Panel overlay que desliza desde un borde sobre el contenido, con scrim, cierre por
backdrop/Escape, opción `fullscreen` y control programático. Bloquea el scroll del body mientras
está abierto.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuSideOver.umd.js"></script>
<script src="dist-libs/umd-core/CuButton.umd.js"></script>

<cu-side-over id="side" title="Filtros" position="right">
  <p>Contenido del panel.</p>
</cu-side-over>

<cu-button color="primary" variant="solid"
  onclick="document.getElementById('side').open()">
  Abrir panel
</cu-button>
```

<!-- demo:side-over-uso -->

El panel se teleporta al `body`, así que podés declararlo en cualquier parte del documento.

## Posiciones

`position` decide el borde desde donde desliza: `right` (**default**), `left`, `top` y
`bottom`. En `top`/`bottom` `size` es el alto, no el ancho.

```html
<cu-side-over position="right" title="Desde la derecha"></cu-side-over>
<cu-side-over position="left" title="Desde la izquierda"></cu-side-over>
<cu-side-over position="top" size="40vh" title="Desde arriba"></cu-side-over>
<cu-side-over position="bottom" size="40vh" title="Desde abajo"></cu-side-over>
```

<!-- demo:side-over-posiciones -->

## Tamaños

`size` acepta los presets `sm` (320px), `md` (400px), `lg` (512px), `xl` (640px) y `full`
(100%), o cualquier valor CSS (`300px`, `40vw`). El default es `300px`.

```html
<cu-side-over position="right" size="sm" title="sm (320px)"></cu-side-over>
<cu-side-over position="right" size="md" title="md (400px)"></cu-side-over>
<cu-side-over position="right" size="lg" title="lg (512px)"></cu-side-over>
<cu-side-over position="right" size="xl" title="xl (640px)"></cu-side-over>
<cu-side-over position="right" size="full" title="full (100%)"></cu-side-over>
<cu-side-over position="right" size="40vw" title="40vw"></cu-side-over>
```

<!-- demo:side-over-presets-de-tamano -->

> Los presets se pueden sobrescribir con las custom properties `--cu-sideover-size-{sm|md|lg|xl|full}` sobre el host.

## Fullscreen

`fullscreen` ocupa todo el viewport e **ignora** `size`.

```html
<cu-side-over position="right" fullscreen title="Pantalla completa">
  <p>El panel ocupa el 100% del viewport.</p>
</cu-side-over>
```

<!-- demo:side-over-fullscreen -->

## Persistente

Con `persistent` el panel no se cierra por backdrop, `Escape` ni botón de cerrar (tampoco
renderiza el botón): sólo se cierra desde el código, con `close()`.

```html
<cu-side-over id="obligatorio" position="right" persistent title="Sin cierre accidental">
  <p>No hay botón de cerrar: se cierra sólo por código, con <code>close()</code>.</p>
  <button type="button" onclick="document.getElementById('obligatorio').close()">
    Cerrar desde adentro
  </button>
</cu-side-over>
```

<!-- demo:side-over-persistente -->

## z-index

`z-index` define la capa del overlay (default `1100`); subilo si tenés otro overlay por encima.

```html
<cu-side-over position="right" z-index="2000" title="z-index alto"></cu-side-over>
```

<!-- demo:side-over-z-index -->

## Interacción

Los métodos `open()`, `close()`, `toggle()` e `isOpen()` manejan el panel; `update:open` avisa
cada cambio de estado y `close` se dispara al cerrarse.

```html
<cu-side-over id="side" title="Eventos del panel"></cu-side-over>

<script>
  const side = document.getElementById('side');

  side.open();
  side.close();
  side.toggle();
  console.log(side.isOpen());

  side.addEventListener('update:open', (e) => console.log('estado:', e.detail));
  side.addEventListener('close', () => console.log('cerrando'));
</script>
```

<!-- demo:side-over-interaccion -->

## Atributos

<!--@include: ../partials/side-over/props-vanilla.md-->

> **Atributo `open`:** como `open` es un atributo HTML nativo, para controlarlo desde HTML usalo con valor booleano: `<cu-side-over open>` abre el panel. El estado también se maneja por método.

## Eventos

<!--@include: ../partials/side-over/eventos-vanilla.md-->

## Slots

<!--@include: ../partials/side-over/slots.md-->

## Métodos expuestos

<!--@include: ../partials/side-over/metodos-vanilla.md-->
