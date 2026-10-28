[← Volver](../README.md)

# `<cu-badge>`

Etiqueta pequeña para estados, categorías o metadata. `color` define el color semántico,
`variant` el aspecto y el slot `default` el contenido (texto, un ícono o los dos).

Es de presentación pura: no emite eventos ni expone métodos.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuBadge.umd.js"></script>

<cu-badge color="primary" variant="soft">Nuevo</cu-badge>
```

En Vue, importá `Badge` de `@/components/information/Badge.vue` (ver [ficha Vue](/componentes/vue/badge)).

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`), así que el mismo nombre se ve distinto en cada tema.

```html
<cu-badge color="primary" variant="soft">primary</cu-badge>
<cu-badge color="secondary" variant="soft">secondary</cu-badge>
<cu-badge color="neutral" variant="soft">neutral</cu-badge>
<cu-badge color="success" variant="soft">success</cu-badge>
<cu-badge color="warning" variant="soft">warning</cu-badge>
<cu-badge color="danger" variant="soft">danger</cu-badge>
```

<!-- demo:badge-colores -->

## Variantes

`variant` decide el aspecto: `solid` (relleno), `outlined` (borde), `soft` (fondo tenue y el
**default**), `ghost` (transparente) y `subtle` (tenue con borde).

```html
<cu-badge color="primary" variant="solid">solid</cu-badge>
<cu-badge color="primary" variant="outlined">outlined</cu-badge>
<cu-badge color="primary" variant="soft">soft</cu-badge>
<cu-badge color="primary" variant="ghost">ghost</cu-badge>
<cu-badge color="primary" variant="subtle">subtle</cu-badge>
```

<!-- demo:badge-variantes -->

## Contenido

El contenido va por el slot `default`: texto, un `<svg>` inline, o los dos. No hay prop ni
slot `icon` — el ícono es el mismo marcado del slot, así que hereda el color del badge con
`stroke="currentColor"`.

```html
<cu-badge color="neutral" variant="outlined">Sólo texto</cu-badge>

<cu-badge color="success" variant="soft">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
  Verificado
</cu-badge>

<cu-badge color="primary" variant="solid" aria-label="Nuevo">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <path d="M12 5v14M5 12h14" />
  </svg>
</cu-badge>
```

<!-- demo:badge-contenido -->

> Un badge sin texto necesita `aria-label` para no quedar sin nombre accesible.

## Atributos

<!--@include: ../partials/badge/props.md-->

## Eventos

<!--@include: ../partials/badge/eventos.md-->

## Slots

<!--@include: ../partials/badge/slots.md-->

## Métodos expuestos

<!--@include: ../partials/badge/metodos.md-->
