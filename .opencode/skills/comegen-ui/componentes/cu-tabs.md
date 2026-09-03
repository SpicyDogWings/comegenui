# `<cu-tabs>`

Pestañas con variantes, iconos, tabs deshabilitadas individuales y control programático. Acepta `tabs` como array de objetos y `v-model`/`modelValue` para el tab activo.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `tabs` | `{key, label, disabled?}[]` | `[]` | Definición de las pestañas |
| `modelValue` | `string` | `""` | Key del tab activo (controlado) |
| `color` | `string` | `"primary"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"tabs"` | `tabs`, `pills`, `boxed`, `soft` |
| `size` | `string` | `"md"` | `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Deshabilita todas las pestañas |

### Prop `tabs`

Cada item es un objeto con:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `key` | `string` | ✓ | Identificador único (se usa para el tab activo y los slots) |
| `label` | `string` | ✓ | Texto visible del tab |
| `disabled` | `boolean` | — | Deshabilita solo esa pestaña |

> Los arrays/objetos se asignan **via JavaScript como propiedad DOM**, no como atributo HTML. Ver [Arrays y objetos](../SKILL.md#arrays-y-objetos-props-complejas).

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|--------|----------------------|-------------|
| `update:modelValue` | `string` | Key del tab activo al cambiar |
| `change` | `string` | Se emite en cada cambio de tab (payload = key) |

## Slots

Los paneles y los iconos usan **slots nombrados** con el key de cada tab.

| Slot | Contenido |
|------|-----------|
| `{key}` | Panel de contenido de la pestaña `{key}` |
| `tab-icon-{key}` | Icono de la pestaña `{key}` (se renderiza antes del label) |

En HTML plano se usan con el atributo `slot="..."` sobre el elemento hijo.

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.getActive()` | Devuelve la key del tab activo |
| `.setActive(key)` | Activa el tab con esa key |
| `.next()` | Activa el próximo tab habilitado |
| `.prev()` | Activa el tab anterior habilitado |

---

## Uso en HTML plano

```html
<script src="dist/CuTabs.umd.js"></script>

<cu-tabs id="misTabs" variant="pills" color="primary">
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

> Las `tabs` se asignan después de `customElements.whenDefined('cu-tabs')` porque es una prop compleja.

## Variantes

```html
<cu-tabs variant="tabs" :tabs="...">...</cu-tabs>   <!-- underline -->
<cu-tabs variant="pills" :tabs="...">...</cu-tabs>  <!-- pills redondeadas -->
<cu-tabs variant="boxed" :tabs="...">...</cu-tabs>  <!-- contenedor con borde -->
<cu-tabs variant="soft" :tabs="...">...</cu-tabs>   <!-- contenedor soft + activo solid -->
```

En HTML plano reemplazá `:tabs` por la asignación via JS.

## Iconos

Cada tab puede llevar un icono con el slot `tab-icon-{key}`. El SVG debe usar `currentColor` para heredar el color del tab:

```html
<cu-tabs id="iconos" variant="pills" color="primary">
  <svg slot="tab-icon-home" width="14" height="14" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  </svg>
  <div slot="home">Contenido Home</div>
</cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    document.getElementById('iconos').tabs = [
      { key: 'home', label: 'Home' },
    ];
  });
</script>
```

## Escuchar cambios y control programático

```html
<cu-tabs id="ctrl" variant="tabs" color="neutral">
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

## Accesibilidad y navegación

- Roles ARIA: `tablist`, `tab`, `tabpanel`, con `aria-selected`, `aria-controls` y `aria-labelledby`.
- Navegación con teclado: flechas ←/→ para cambiar de tab, `Home` y `End` para ir al primero/último.
- Las tabs deshabilitadas se saltean en la navegación y en `setActive`.

## Ejemplo completo (playground vanilla)

El repositorio incluye una demo en HTML plano: [`playground/pages/tabs/tabs.html`](../../playground/pages/tabs/tabs.html) — abrí el archivo directamente en el navegador (sin server).
