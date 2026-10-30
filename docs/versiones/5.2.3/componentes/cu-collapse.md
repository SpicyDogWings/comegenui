[← Volver](../README.md)

# `<cu-collapse>`

Sección colapsable con trigger (botón + chevron animado). El contenido se muestra/oculta con una transición de altura. Útil para acordeones, menús anidados o secciones "más información".

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuCollapse.umd.js"></script>

<cu-collapse label="Más información">
  <p>Este contenido está oculto por defecto.</p>
</cu-collapse>
```

<!-- demo:collapse-uso -->

En Vue, importá `Collapse` de `@/components/overlay/Collapse.vue` (ver [ficha Vue](/componentes/vue/collapse)).

## Colores

`color` es un nombre semántico del trigger (`ghost`), resuelto con los tokens del tema
activo. Los 6 valores son `primary`, `secondary`, `neutral` (**default**), `success`,
`warning` y `danger`.

```html
<cu-collapse label="primary" color="primary" default-open><p>…</p></cu-collapse>
<cu-collapse label="secondary" color="secondary" default-open><p>…</p></cu-collapse>
<cu-collapse label="neutral" color="neutral" default-open><p>…</p></cu-collapse>
<cu-collapse label="success" color="success" default-open><p>…</p></cu-collapse>
<cu-collapse label="warning" color="warning" default-open><p>…</p></cu-collapse>
<cu-collapse label="danger" color="danger" default-open><p>…</p></cu-collapse>
```

<!-- demo:collapse-colores -->

## Descripción

`description` agrega una línea de texto secundario bajo el `label`, dentro del mismo trigger.
Es opcional y, si queda vacía, no se renderiza nada.

```html
<cu-collapse label="Plan Pro" description="Facturación mensual, cancela cuando quieras">
  <p>…</p>
</cu-collapse>
```

<!-- demo:collapse-descripcion -->

## Ícono

`icon` acepta un string SVG/HTML que se inyecta **antes del label**, dentro del trigger. En
HTML plano se asigna como propiedad (el atributo no tolera el markup inline).

> El HTML del `icon` se sanitiza con **DOMPurify** antes de inyectarse: los SVG válidos se
> conservan y se eliminan `<script>`, handlers `on*` y URLs peligrosas.

```html
<cu-collapse id="conIcono" label="Con ícono" color="warning" default-open>
  <p>El ícono se renderiza antes del label, dentro del trigger.</p>
</cu-collapse>

<script>
  const estrella =
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 2.5 14 9l6.5.5-5 4.3 1.5 6.4-5.5-3.4L6 20.2l1.5-6.4-5-4.3L9 9z"/></svg>';
  document.getElementById('conIcono').icon = estrella;
</script>
```

<!-- demo:collapse-icono -->

## Abierto por defecto

`default-open` arranca el collapse abierto, sin pasar por el evento `toggle` (sólo define el
estado inicial).

```html
<cu-collapse label="Opciones avanzadas" default-open>
  <p>Visible desde el inicio gracias a <code>default-open</code>.</p>
</cu-collapse>
```

<!-- demo:collapse-abierto-por-defecto -->

## Deshabilitado

El atributo booleano `disabled` deja el trigger inerte: no responde al click y muestra cursor `not-allowed`. `open()` y `toggle()` pasan a ser no-op; `close()` sí sigue funcionando (útil para colapsar desde código un collapse que arrancó con `default-open`).

```html
<cu-collapse label="Sección bloqueada" disabled>
  <p>El trigger no responde: probá a hacer click.</p>
</cu-collapse>
```

<!-- demo:collapse-deshabilitado -->

## Anidados

Los collapses se pueden anidar para construir árboles de menú:

```html
<cu-collapse label="Sección padre" color="primary" default-open>
  <p>Contenido de nivel superior.</p>
  <cu-collapse label="Hijo">
    <p>Contenido anidado con su propio toggle.</p>
  </cu-collapse>
</cu-collapse>
```

<!-- demo:collapse-anidados -->

## Escuchar eventos

```html
<cu-collapse id="miCollapse" label="Escuchá el toggle" color="primary">
  <p>El estado se registra abajo.</p>
</cu-collapse>

<script>
  const collapse = document.getElementById('miCollapse');
  collapse.addEventListener('toggle', (e) => {
    console.log('abierto:', e.detail); // true | false
  });
</script>
```

<!-- demo:collapse-eventos -->

## Control programático

```html
<cu-collapse id="miCollapse" label="Programático">
  <p>Controlado desde JS con open()/close()/toggle().</p>
</cu-collapse>

<script>
  const c = document.getElementById('miCollapse');
  c.open();
  c.close();
  c.toggle();
  c.isOpen(); // boolean
</script>
```

<!-- demo:collapse-control-programatico -->

## Ejemplo completo

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Collapse Demo</title>
</head>
<body>
  <cu-collapse id="faq" label="¿Qué es ComegenUI?" color="primary">
    <p>Una librería de componentes UI como Custom Elements nativos.</p>
  </cu-collapse>

  <cu-button onclick="toggleFaq()">Alternar FAQ</cu-button>

  <script src="dist-libs/umd-core/CuCollapse.umd.js"></script>
  <script src="dist-libs/umd-core/CuButton.umd.js"></script>
  <script>
    const faq = document.getElementById('faq');

    faq.addEventListener('toggle', (e) => {
      console.log('FAQ abierto:', e.detail);
    });

    function toggleFaq() {
      faq.toggle();
    }
  </script>
</body>
</html>
```

<!-- demo:collapse-completo -->

## Atributos

<!--@include: ../partials/collapse/props-vanilla.md-->

> El Custom Element **no expone** prop `variant` ni `theme`. El trigger siempre usa la variante `ghost` y el color se controla con `color`.

## Eventos

<!--@include: ../partials/collapse/eventos.md-->

## Slots

<!--@include: ../partials/collapse/slots.md-->

## Métodos expuestos

<!--@include: ../partials/collapse/metodos-vanilla.md-->
