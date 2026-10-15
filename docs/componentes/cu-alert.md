[← Volver](../README.md)

# `<cu-alert>`

Alerta con color semántico, 5 variantes, título opcional, ícono y botón de cerrar. `color`
elige el color, `variant` el aspecto y `title` / el slot `icon` la cabecera; se controla con
el atributo `show` o con los métodos `open()` / `toggle()` / `isOpen()`.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuAlert.umd.js"></script>

<cu-alert color="primary" variant="soft" title="Aviso">
  El contenido va en el slot `default`.
</cu-alert>
```

En Vue, importá `Alert` de `@/components/information/Alert.vue` (ver [ficha Vue](/componentes/vue/alert)).

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`), así que el mismo nombre se ve distinto en cada tema.

```html
<cu-alert color="primary" variant="soft">primary</cu-alert>
<cu-alert color="secondary" variant="soft">secondary</cu-alert>
<cu-alert color="neutral" variant="soft">neutral</cu-alert>
<cu-alert color="success" variant="soft">success</cu-alert>
<cu-alert color="warning" variant="soft">warning</cu-alert>
<cu-alert color="danger" variant="soft">danger</cu-alert>
```

<!-- demo:alert-colores -->

## Variantes

`variant` decide el aspecto: `solid` (relleno), `outlined` (borde), `soft` (fondo tenue y el
**default**), `ghost` (transparente) y `subtle` (tenue con borde).

```html
<cu-alert color="primary" variant="solid">solid</cu-alert>
<cu-alert color="primary" variant="outlined">outlined</cu-alert>
<cu-alert color="primary" variant="soft">soft</cu-alert>
<cu-alert color="primary" variant="ghost">ghost</cu-alert>
<cu-alert color="primary" variant="subtle">subtle</cu-alert>
```

<!-- demo:alert-variantes -->

## Título e ícono

`title` escribe el título de la cabecera. El slot `icon` pone un ícono ahí mismo y **también
arma la cabecera** aunque no haya `title`; sin ninguno de los dos sólo se ve el cuerpo.

```html
<cu-alert color="neutral" variant="soft">Sin título ni ícono.</cu-alert>

<cu-alert color="primary" variant="soft" title="Con título">
  El título va en la cabecera.
</cu-alert>

<cu-alert color="primary" variant="soft">
  <span slot="icon">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4m0 4h.01" />
    </svg>
  </span>
  Sólo ícono: el slot arma la cabecera.
</cu-alert>

<cu-alert color="success" variant="soft" title="Con título e ícono">
  <span slot="icon">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  </span>
  Título e ícono juntos.
</cu-alert>
```

<!-- demo:alert-titulo-icono -->

## Cierre

`close` agrega el botón de cerrar (X). Con cabecera (hay `title` o ícono) la X va dentro de
ella; sin cabecera flota sobre la primera fila del cuerpo.

```html
<cu-alert color="neutral" variant="soft" title="Con cabecera" close>
  La X acompaña al título.
</cu-alert>

<cu-alert color="danger" variant="soft" close>
  Sin título ni ícono, la X flota sobre el cuerpo.
</cu-alert>

<cu-alert color="neutral" variant="soft">Sin `close` no hay botón de cierre.</cu-alert>
```

<!-- demo:alert-cierre -->

> El botón no desmonta la alerta: la **oculta** (`show` pasa a `false`) y emite `close`. Para
> volver a mostrarla, llamá a `open()` o cambiá la prop `show` a `true`.

## Visibilidad

`show` controla si se ve (default `true`); `open()` y `toggle()` hacen lo mismo desde JS e
`isOpen()` devuelve el estado actual.

```html
<cu-alert id="aviso" color="primary" variant="soft" title="Control">
  Se muestra u oculta sin desmontarse.
</cu-alert>

<script>
  const aviso = document.getElementById('aviso');

  aviso.show = false; // oculta por propiedad
  aviso.open();       // …o por método
  aviso.toggle();     // alterna (también cierra)
  aviso.isOpen();     // → true | false
</script>
```

<!-- demo:alert-visibilidad -->

> En el custom element, `close` es el nombre del **atributo** que muestra la X y ocupa el del
> método: para ocultarlo por código usá `show = false` o `toggle()`.

## Interacción

`open` y `close` avisan cada vez que la alerta se muestra o se oculta; `update:show` avisa
cualquier cambio de visibilidad, con el valor nuevo en `e.detail`.

```html
<cu-alert id="aviso" color="danger" variant="soft" title="Errores" close>
  …
</cu-alert>

<script>
  const aviso = document.getElementById('aviso');

  aviso.addEventListener('update:show', (e) => console.log('show:', e.detail));
  aviso.addEventListener('open', () => console.log('abierta'));
  aviso.addEventListener('close', () => console.log('cerrada'));
</script>
```

<!-- demo:alert-eventos -->

## Atributos

<!--@include: ../partials/alert/props-vanilla.md-->

> **Atributos booleanos:** en HTML se usan sin valor: `<cu-alert close show>...`

## Eventos

<!--@include: ../partials/alert/eventos.md-->

> Los eventos custom se escuchan con `addEventListener` y el payload está en `e.detail`.

## Slots

<!--@include: ../partials/alert/slots.md-->

```html
<cu-alert color="success" title="Listo">
  <span slot="icon">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  </span>
  Operación completada.
</cu-alert>
```

<!-- demo:alert-slots -->

## Métodos expuestos

<!--@include: ../partials/alert/metodos-vanilla.md-->

El control también puede hacerse via el atributo `show` o escuchando los eventos `open`/`close`.
