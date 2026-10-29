[← Volver](../README.md)

# `<cu-tabs>`

Pestañas con variantes, tamaños, iconos, tabs deshabilitadas individuales y control programático.
Las pestañas se definen con la propiedad `tabs` (array de objetos) y el tab activo viaja con
`model-value`.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuTabs.umd.js"></script>

<cu-tabs id="misTabs" variant="solid" color="primary">
  <div slot="general">Contenido General</div>
  <div slot="advanced">Contenido Advanced</div>
  <div slot="locked">Contenido Locked</div>
</cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    const tabs = document.getElementById('misTabs');
    tabs.tabs = [
      { key: 'general', label: 'General' },
      { key: 'advanced', label: 'Advanced' },
      { key: 'locked', label: 'Locked', disabled: true },
    ];
  });
</script>
```

<!-- demo:tabs-uso -->

> `tabs` es una prop compleja: se asigna por JavaScript después de `customElements.whenDefined('cu-tabs')`, nunca como atributo.

## Colores

`color` es un nombre semántico, no un hex: tiñe el tab activo y, en `ghost`, la línea inferior.
Un valor fuera del set cae en `primary` (si no, el tab activo quedaría sin fondo y con el texto del
tema encima, invisible en light).

```html
<cu-tabs class="mis-tabs" variant="solid" color="primary"></cu-tabs>
<cu-tabs class="mis-tabs" variant="solid" color="secondary"></cu-tabs>
<cu-tabs class="mis-tabs" variant="solid" color="neutral"></cu-tabs>
<cu-tabs class="mis-tabs" variant="solid" color="success"></cu-tabs>
<cu-tabs class="mis-tabs" variant="solid" color="warning"></cu-tabs>
<cu-tabs class="mis-tabs" variant="solid" color="danger"></cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    const tabs = [{ key: 'uno', label: 'Uno' }, { key: 'dos', label: 'Dos' }];
    document.querySelectorAll('cu-tabs.mis-tabs').forEach((el) => { el.tabs = tabs; });
  });
</script>
```

<!-- demo:tabs-colores -->

## Variantes

`variant` decide el aspecto: `ghost` (underline, **default**), `solid` (pills redondeadas),
`boxed` (contenedor con borde) y `soft` (contenedor tenue con el activo sólido).

```html
<cu-tabs class="mis-variantes" variant="ghost" color="primary"></cu-tabs>
<cu-tabs class="mis-variantes" variant="solid" color="primary"></cu-tabs>
<cu-tabs class="mis-variantes" variant="boxed" color="primary"></cu-tabs>
<cu-tabs class="mis-variantes" variant="soft" color="primary"></cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    const tabs = [{ key: 'uno', label: 'Uno' }, { key: 'dos', label: 'Dos' }];
    document.querySelectorAll('cu-tabs.mis-variantes').forEach((el) => { el.tabs = tabs; });
  });
</script>
```

<!-- demo:tabs-variantes -->

## Tamaños

`size` acepta `sm`, `md` (**default**) y `lg`, y cambia el padding y la tipografía del tab.

```html
<cu-tabs class="mis-tamanos" size="sm" variant="solid" color="primary"></cu-tabs>
<cu-tabs class="mis-tamanos" size="md" variant="solid" color="primary"></cu-tabs>
<cu-tabs class="mis-tamanos" size="lg" variant="solid" color="primary"></cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    const tabs = [{ key: 'uno', label: 'Uno' }, { key: 'dos', label: 'Dos' }];
    document.querySelectorAll('cu-tabs.mis-tamanos').forEach((el) => { el.tabs = tabs; });
  });
</script>
```

<!-- demo:tabs-tamanos -->

## Iconos

Cada tab lleva un ícono por el campo `icon` (string HTML/SVG) o por el slot `tab-icon-{key}`; el SVG
debe usar `currentColor` para heredar el color del tab.

El HTML del campo `icon` **se sanitiza con DOMPurify antes de inyectarse**: los SVG válidos
(`path`, `circle`, `g`, …) se conservan, y se eliminan `<script>`, atributos `on*` y URLs peligrosas
(`javascript:`). El slot `tab-icon-{key}` es contenido del consumidor y no pasa por `v-html`.

```html
<cu-tabs id="iconos" variant="solid" color="primary">
  <svg slot="tab-icon-home" width="14" height="14" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  </svg>
  <div slot="home">Contenido Home</div>
  <div slot="config">Contenido Config</div>
</cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    document.getElementById('iconos').tabs = [
      { key: 'home', label: 'Home' },                                 // ícono por slot `tab-icon-{key}`
      {
        key: 'config',
        label: 'Config',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>',  // ícono por campo `icon`
      },
    ];
  });
</script>
```

<!-- demo:tabs-iconos -->

## Ancho y desbordamiento

El tablist ocupa el ancho disponible y mantiene **una sola fila**. Si el host es más angosto que la
suma de las tabs, el header scrollea en horizontal (`overflow-x: auto` con scrollbar fina) en vez de
desbordar la caja del componente; las tabs no se aplastan: conservan su ancho mínimo de contenido
(`white-space: nowrap`). Las tabs que no entran quedan accesibles desplazando el tablist.

```html
<div style="width: 180px; border: 1px dashed #888">
  <cu-tabs id="angosto" variant="ghost"></cu-tabs>
</div>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    document.getElementById('angosto').tabs = [
      { key: 'uno', label: 'Uno' },
      { key: 'dos', label: 'Dos' },
      { key: 'tres', label: 'Tres' },
      { key: 'cuatro', label: 'Cuatro' },
      { key: 'cinco', label: 'Cinco' },
    ];
  });
</script>
```

## Deshabilitado

`disabled` bloquea el grupo completo; `tabs[].disabled` bloquea una pestaña individual (se saltea en
la navegación por teclado y en `setActive`, y un `model-value` que apunte a ella cae en la primera
habilitada: una tab deshabilitada nunca queda como activa).

```html
<cu-tabs id="parcial" variant="ghost" color="primary"></cu-tabs>
<cu-tabs id="total" variant="soft" color="primary" disabled></cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    document.getElementById('parcial').tabs = [
      { key: 'a', label: 'Habilitada' },
      { key: 'b', label: 'Deshabilitada', disabled: true },
      { key: 'c', label: 'Habilitada' },
    ];
    document.getElementById('total').tabs = [
      { key: 'a', label: 'Una' },
      { key: 'b', label: 'Otra' },
    ];
  });
</script>
```

<!-- demo:tabs-deshabilitado -->

## Paneles persistentes

Con `keepAlive: true` en un tab, su panel queda montado (`v-show` en vez de `v-if`) y conserva el
estado de los componentes internos al cambiar de pestaña.

```html
<cu-tabs id="persistentes" variant="solid" color="primary">
  <div slot="form"><input placeholder="Escribí algo y cambiá de tab" /></div>
  <div slot="otro">Volvé: el formulario sigue como lo dejaste.</div>
</cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    document.getElementById('persistentes').tabs = [
      { key: 'form', label: 'Formulario', keepAlive: true },
      { key: 'otro', label: 'Otro' },
    ];
  });
</script>
```

<!-- demo:tabs-keep-alive -->

## Cambios y control programático

`model-value` refleja el tab activo, el evento `change` avisa cada cambio y los métodos `setActive`,
`getActive`, `next` y `prev` controlan las pestañas desde JavaScript.

```html
<cu-tabs id="ctrl" variant="ghost" color="neutral">
  <div slot="first">Contenido First</div>
  <div slot="second">Contenido Second</div>
  <div slot="third">Contenido Third</div>
</cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    const tabs = document.getElementById('ctrl');
    tabs.tabs = [
      { key: 'first', label: 'First' },
      { key: 'second', label: 'Second' },
      { key: 'third', label: 'Third' },
    ];

    // change (payload = key activa)
    tabs.addEventListener('change', (e) => {
      console.log('Tab activo:', e.detail);
    });

    tabs.setActive('second');       // activa Second
    console.log(tabs.getActive());  // 'second'
  });
</script>
```

<!-- demo:tabs-control-programatico -->

## Accesibilidad y navegación

- Roles ARIA: `tablist`, `tab` y `tabpanel`. Cada tab lleva `aria-selected`, `aria-controls` (apunta
  al panel, que existe cuando la tab está activa o tiene `keepAlive`) y el panel lleva
  `aria-labelledby` apuntando a su tab.
- Los ids de tabs y paneles llevan un prefijo único por instancia, así que varias instancias con las
  mismas `key` no colisionan y cada panel apunta a su propia tab.
- Un solo tab stop: sólo la tab activa tiene `tabindex="0"`; el resto, `-1` (roving tabindex). Las
  flechas mueven el foco y activan la tab a la que llegan.
- Teclado: las flechas ←/→ cambian de tab; `Home` y `End` van al primero/último.
- Las tabs deshabilitadas se saltean en la navegación, en `setActive` y al resolver el tab activo.
- Si la tab enfocada desaparece del array (por ejemplo, se elimina la tab activa), el foco pasa a la
  nueva tab activa en vez de caer al `body`.

## Atributos

<!--@include: ../partials/tabs/props-vanilla.md-->

### Prop `tabs`

Cada item es un objeto con:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `key` | `string` | ✓ | Identificador único (se usa para el tab activo y los slots) |
| `label` | `string` | ✓ | Texto visible del tab |
| `icon` | `string` | — | SVG/HTML del ícono (alternativa al slot `tab-icon-{key}`); se sanitiza antes de renderizar |
| `disabled` | `boolean` | — | Deshabilita solo esa pestaña |
| `keepAlive` | `boolean` | — | Mantiene el panel montado al cambiar de tab |

Un `tabs` `null`/`undefined` se trata como `[]`, y los items sin `key` utilizable se ignoran
conservando el orden del resto (no rompen el render).

> Los arrays/objetos se asignan **via JavaScript como propiedad DOM**, no como atributo HTML (ver [Componentes](../README.md)).

## Eventos

<!--@include: ../partials/tabs/eventos.md-->

## Slots

<!--@include: ../partials/tabs/slots.md-->

En HTML plano se usan con el atributo `slot="..."` sobre el elemento hijo.

## Métodos expuestos

<!--@include: ../partials/tabs/metodos-vanilla.md-->
