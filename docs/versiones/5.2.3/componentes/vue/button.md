[← Volver](../README.md)

# `Button`

Botón con color semántico, 7 variantes, 3 tamaños, estados (`disabled` / `loading`) y modo
link. `variant` define el aspecto, `color` el color y `size` el tamaño; con `to` se renderiza
como un único `<a>` (sin `<button>` adentro) y sin `to`, como `<button>`.

Es el componente con el que están construidos casi todos los demás: si algo se ve raro en otro
componente, suele venir de acá.

## Uso en Vue

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <Button color="primary" variant="solid">Guardar</Button>
</template>
```

En HTML plano, cargá el bundle `CuButton` (ver [ficha vanilla](/componentes/cu-button)).

## Variantes

`variant` decide el aspecto: `solid` (relleno), `outlined` (borde), `soft` (fondo tenue),
`ghost` (transparente; se pinta al pasar el mouse y es el **default**), `subtle` (tenue con
borde), `link` (texto subrayado, sin padding) y `none` (igual que `solid`).

```vue
<Button color="primary" variant="solid">solid</Button>
<Button color="primary" variant="outlined">outlined</Button>
<Button color="primary" variant="soft">soft</Button>
<Button color="primary" variant="ghost">ghost</Button>
<Button color="primary" variant="subtle">subtle</Button>
<Button color="primary" variant="link">link</Button>
<Button color="primary" variant="none">none</Button>
```

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`), así que el mismo nombre se ve distinto en cada tema.

En `solid` y `none` el texto es siempre el del tema (`--cu-color-surface`) y el fondo es la
variante `-solid`: el generador de tokens la ajusta (oscurece en temas claros, aclara en oscuros,
sin cambiar el hue) hasta que ese texto alcanza 4.5:1. `-solid-hover` y `-solid-active` siguen la
misma regla.

```vue
<Button color="primary" variant="solid">primary</Button>
<Button color="secondary" variant="solid">secondary</Button>
<Button color="neutral" variant="solid">neutral</Button>
<Button color="success" variant="solid">success</Button>
<Button color="warning" variant="solid">warning</Button>
<Button color="danger" variant="solid">danger</Button>
```

## Tamaños

`size` acepta `sm`, `md` (**default**) y `lg`, y cambia el tamaño de fuente y el padding.

```vue
<Button size="sm">Chico</Button>
<Button size="md">Medio (default)</Button>
<Button size="lg">Grande</Button>
```

## Estados

`disabled` atenúa el botón y bloquea la interacción. `loading` deshabilita igual y además
antepone un spinner (`LucideLoader` girando) mientras está activo: el contenido sigue visible
debajo, así que sirve para acciones asincrónicas. Con `loading` el botón expone `aria-busy="true"`
y el spinner queda `aria-hidden` para lectores de pantalla.

Con `to`, `disabled`/`loading` también bloquean la navegación: el `<a>` pierde el `href`, queda
`aria-disabled="true"`, sale del tab order (`tabindex="-1"`) y no emite `click`.

```vue
<Button disabled>Deshabilitado</Button>
<Button color="primary" variant="solid" :loading="loading">Guardando…</Button>
```

En Vue, `loading` y `disabled` son props reactivas: manejá `loading` con un `ref` (ver el ejemplo
de interacción).

## Navegación

Sin `to` el botón es un `<button>` y no navega. Con `to`, el componente renderiza un único
`<a>` con las mismas clases, estilos y slot que el botón: es un solo nodo interactivo (antes
había un `<a>` con un `<button>` adentro, que es HTML inválido). `target` pasa a aplicar
(`_blank` abre en otra pestaña y agrega `rel="noopener noreferrer"`). `target` solo, sin `to`,
no hace nada.

`to` acepta cualquier destino navegable. Un esquema ejecutable (`javascript:`, `vbscript:`,
`data:`, incluso con espacios o mayúsculas) no se navega: el botón se renderiza como `<button>`,
así que un `to` que venga de datos del usuario no ejecuta código.

```vue
<Button to="/componentes/cu-button" variant="link">Volver a esta página</Button>
<Button to="https://developer.mozilla.org" target="_blank" variant="link">Sitio externo</Button>
```

En la variante `link` el padding queda en `0` y `size` no lo cambia.

## Formulario

`type` es el atributo del `<button>` de adentro. El default es `type="button"` (**no** envía);
`type="submit"` dispara el submit del `<form>` que lo contiene y `type="reset"` limpia sus
campos. Un `type` inválido cae a `"button"` (el valor inválido de HTML sería `submit`).

```vue
<form>
  <Button type="submit" color="primary" variant="solid">Enviar</Button>
  <Button type="reset" variant="ghost">Limpiar</Button>
</form>
```

### Solo icono

`iconOnly` cambia el padding a cuadrado para un botón sin texto visible. El contenido sigue
siendo el slot, así que el nombre accesible **no** sale del ícono: agregá `aria-label`
(o dejá texto visualmente oculto). Sin nombre accesible el botón queda mudo para lectores de
pantalla.

```vue
<Button icon-only color="primary" variant="solid" aria-label="Cerrar">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
</Button>
```

## Contenido e iconos

El contenido va por el slot `default`: texto, un `<svg>` inline, o los dos. No hay prop ni slot
`icon` — el icono es el mismo marcado del slot, así que hereda el color del botón con
`stroke="currentColor"`.

```vue
<Button color="success" variant="soft">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
  Aceptar
</Button>
```

## Interacción

`click`, `focus`, `blur`, `mouseenter`… son los eventos del DOM (van al `<button>` interno). El
único emit propio es `loading-change`, que se dispara cada vez que `loading` cambia, con el
valor nuevo.

```vue
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

## Props

Props del componente `<Button>`. Son los mismos que los atributos del custom element, en
camelCase: ver [ficha vanilla](/componentes/cu-button#atributos).

<!--@include: ../../partials/button/props-vue.md-->

## Emits

<!--@include: ../../partials/button/eventos.md-->

## Slots

<!--@include: ../../partials/button/slots.md-->

## Expose

<!--@include: ../../partials/button/metodos.md-->
