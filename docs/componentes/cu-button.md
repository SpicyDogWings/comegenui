[← Volver](../README.md)

# `Button`

Botón con color semántico, 7 variantes, 3 tamaños, estados (`disabled` / `loading`) y modo
link. `variant` define el aspecto, `color` el color y `size` el tamaño; con `to` se renderiza
como `<a>` (con un `<button>` adentro) y sin `to`, como `<button>`.

Es el componente con el que están construidos casi todos los demás: si algo se ve raro en otro
componente, suele venir de acá.

Cada ejemplo trae el código de las **dos APIs**: `Vanilla` (el custom element `<cu-button>` con
atributos) y `Vue` (el componente `<Button>` con props). Abajo de cada bloque va el custom
element real, cargado del build `esm-shared`.

::: code-group

```html [Vanilla]
<script src="dist-libs/umd-core/CuButton.umd.js"></script>

<cu-button color="primary" variant="solid">Guardar</cu-button>
```

```vue [Vue]
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <Button color="primary" variant="solid">Guardar</Button>
</template>
```

:::

Los ejemplos de abajo muestran sólo el marcado. En Vue, importá `Button` de
`@/components/buttons/Button.vue`; en HTML plano, cargá el bundle `CuButton` como arriba.

## Variantes

`variant` decide el aspecto: `solid` (relleno), `outlined` (borde), `soft` (fondo tenue),
`ghost` (transparente; se pinta al pasar el mouse y es el **default**), `subtle` (tenue con
borde), `link` (texto subrayado, sin padding) y `none` (igual que `solid`).

::: code-group

```html [Vanilla]
<cu-button color="primary" variant="solid">solid</cu-button>
<cu-button color="primary" variant="outlined">outlined</cu-button>
<cu-button color="primary" variant="soft">soft</cu-button>
<cu-button color="primary" variant="ghost">ghost</cu-button>
<cu-button color="primary" variant="subtle">subtle</cu-button>
<cu-button color="primary" variant="link">link</cu-button>
<cu-button color="primary" variant="none">none</cu-button>
```

```vue [Vue]
<Button color="primary" variant="solid">solid</Button>
<Button color="primary" variant="outlined">outlined</Button>
<Button color="primary" variant="soft">soft</Button>
<Button color="primary" variant="ghost">ghost</Button>
<Button color="primary" variant="subtle">subtle</Button>
<Button color="primary" variant="link">link</Button>
<Button color="primary" variant="none">none</Button>
```

:::

<!-- demo:button-variantes -->

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`), así que el mismo nombre se ve distinto en cada tema.

::: code-group

```html [Vanilla]
<cu-button color="primary" variant="solid">primary</cu-button>
<cu-button color="secondary" variant="solid">secondary</cu-button>
<cu-button color="neutral" variant="solid">neutral</cu-button>
<cu-button color="success" variant="solid">success</cu-button>
<cu-button color="warning" variant="solid">warning</cu-button>
<cu-button color="danger" variant="solid">danger</cu-button>
```

```vue [Vue]
<Button color="primary" variant="solid">primary</Button>
<Button color="secondary" variant="solid">secondary</Button>
<Button color="neutral" variant="solid">neutral</Button>
<Button color="success" variant="solid">success</Button>
<Button color="warning" variant="solid">warning</Button>
<Button color="danger" variant="solid">danger</Button>
```

:::

<!-- demo:button-colores -->

## Tamaños

`size` acepta `sm`, `md` (**default**) y `lg`, y cambia el tamaño de fuente y el padding.

::: code-group

```html [Vanilla]
<cu-button size="sm">Chico</cu-button>
<cu-button size="md">Medio (default)</cu-button>
<cu-button size="lg">Grande</cu-button>
```

```vue [Vue]
<Button size="sm">Chico</Button>
<Button size="md">Medio (default)</Button>
<Button size="lg">Grande</Button>
```

:::

<!-- demo:button-tamanos -->

## Estados

`disabled` atenúa el botón y bloquea la interacción. `loading` deshabilita igual y además
antepone un spinner (`LucideLoader` girando) mientras está activo: el contenido sigue visible
debajo, así que sirve para acciones asincrónicas.

::: code-group

```html [Vanilla]
<cu-button disabled>Deshabilitado</cu-button>
<cu-button color="primary" variant="solid" loading>Guardando…</cu-button>
```

```vue [Vue]
<Button disabled>Deshabilitado</Button>
<Button color="primary" variant="solid" loading>Guardando…</Button>
```

:::

<!-- demo:button-loading -->

En HTML plano `loading` y `disabled` también se manejan como propiedad del host
(`btn.loading = true`), que es lo que se hace en el ejemplo de eventos.

## Navegación

Sin `to` el botón es un `<button>` y no navega. Con `to`, se envuelve en un `<a>` que apunta
ahí y `target` pasa a aplicar (`_blank` abre en otra pestaña). `target` solo, sin `to`, no
hace nada.

::: code-group

```html [Vanilla]
<cu-button to="/componentes/cu-button" variant="link">Volver a esta página</cu-button>
<cu-button to="https://developer.mozilla.org" target="_blank" variant="link">Sitio externo</cu-button>
```

```vue [Vue]
<Button to="/componentes/cu-button" variant="link">Volver a esta página</Button>
<Button to="https://developer.mozilla.org" target="_blank" variant="link">Sitio externo</Button>
```

:::

<!-- demo:button-link -->

En la variante `link` el padding queda en `0` y `size` no lo cambia.

## Formulario

`type` es el atributo del `<button>` de adentro. El default es `type="button"` (**no** envía);
`type="submit"` dispara el submit del `<form>` que lo contiene y `type="reset"` limpia sus
campos.

::: code-group

```html [Vanilla]
<form>
  <cu-button type="submit" color="primary" variant="solid">Enviar</cu-button>
  <cu-button type="reset" variant="ghost">Limpiar</cu-button>
</form>
```

```vue [Vue]
<form>
  <Button type="submit" color="primary" variant="solid">Enviar</Button>
  <Button type="reset" variant="ghost">Limpiar</Button>
</form>
```

:::

<!-- demo:button-submit -->

## Contenido e iconos

El contenido va por el slot `default`: texto, un `<svg>` inline, o los dos. No hay prop ni slot
`icon` — el icono es el mismo marcado del slot, así que hereda el color del botón con
`stroke="currentColor"`.

::: code-group

```html [Vanilla]
<cu-button color="success" variant="soft">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
  Aceptar
</cu-button>
```

```vue [Vue]
<Button color="success" variant="soft">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
  Aceptar
</Button>
```

:::

<!-- demo:button-iconos -->

## Acciones y eventos

`click`, `focus`, `blur`, `mouseenter`… son eventos del DOM: burbujean desde el shadow DOM
hasta el host, así que se escuchan igual que en un `<button>` común. No hay un CustomEvent
`click` propio: `e.detail` es `undefined` y `e.target` es el elemento interno.

El único evento propio es `loading-change`, que se dispara cada vez que `loading` se prende o
se apaga, con el valor nuevo en `e.detail`.

::: code-group

```html [Vanilla]
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

```vue [Vue]
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const loading = ref(false);

async function guardar() {
  loading.value = true;
  await fetch("/api/guardar", { method: "POST" });
  loading.value = false;
}
</script>

<template>
  <Button
    color="primary"
    variant="solid"
    :loading="loading"
    @click="guardar"
    @loading-change="(e) => console.log('loading:', e)"
  >
    Guardar
  </Button>
</template>
```

:::

<!-- demo:button-click -->

## Atributos

Atributos del custom element `<cu-button>`. En la API Vue son los mismos, en camelCase: ver
[Props](#props).

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

## Props

Props del componente Vue `<Button>`. Son los mismos que los atributos, en camelCase: ver
[Atributos](#atributos).

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `"reset" \| "button" \| "submit"` | `'button'` | Tipo del `<button>`: `button`, `submit`, `reset` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"ghost"` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `loading` | `boolean` | `false` | Antepone un spinner al contenido. Deshabilita el botón mientras está activo |
| `size` | `"sm" \| "md" \| "lg"` | `'md'` | Tamaño: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `target` | `"_self" \| "_blank" \| "_parent" \| "_top"` | `"_self"` | Target del link cuando `to` está definido: `_self`, `_blank`, `_parent`, `_top` |
| `to` | `string` | `—` | Si se especifica, el botón se renderiza como `<a>` |
<!-- /@api:props -->

## Eventos

CustomEvents del custom element. Los del DOM (`click`, `focus`, `blur`, `mouseenter`…) ya
burbujean al host, así que no hace falta declararlos.

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `loading-change` | `boolean` | Se dispara cuando cambia `loading`, con el estado nuevo. |
<!-- /@api:eventos -->

## Emits

Emits del componente Vue.

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `loading-change` | `boolean` | Se dispara cuando cambia `loading`, con el estado nuevo. |
<!-- /@api:emits -->

## Slots

Los mismos en las dos APIs: el custom element forwardea el slot del componente.

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

## Métodos expuestos

<!-- @api:metodos -->
No expone métodos.
<!-- /@api:metodos -->

## Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
