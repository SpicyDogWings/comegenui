[← Volver](../README.md)

# `Button`

Botón con color semántico, 7 variantes, 3 tamaños, estados (`disabled` / `loading`) y modo
link. `variant` define el aspecto, `color` el color y `size` el tamaño; con `to` se renderiza
como `<a>` (con un `<button>` adentro) y sin `to`, como `<button>`.

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
debajo, así que sirve para acciones asincrónicas.

```vue
<Button disabled>Deshabilitado</Button>
<Button color="primary" variant="solid" :loading="loading">Guardando…</Button>
```

En Vue, `loading` y `disabled` son props reactivas: manejá `loading` con un `ref` (ver el ejemplo
de interacción).

## Navegación

Sin `to` el botón es un `<button>` y no navega. Con `to`, se envuelve en un `<a>` que apunta
ahí y `target` pasa a aplicar (`_blank` abre en otra pestaña). `target` solo, sin `to`, no
hace nada.

```vue
<Button to="/componentes/cu-button" variant="link">Volver a esta página</Button>
<Button to="https://developer.mozilla.org" target="_blank" variant="link">Sitio externo</Button>
```

En la variante `link` el padding queda en `0` y `size` no lo cambia.

## Formulario

`type` es el atributo del `<button>` de adentro. El default es `type="button"` (**no** envía);
`type="submit"` dispara el submit del `<form>` que lo contiene y `type="reset"` limpia sus
campos.

```vue
<form>
  <Button type="submit" color="primary" variant="solid">Enviar</Button>
  <Button type="reset" variant="ghost">Limpiar</Button>
</form>
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

<!--@include: ../../partials/button/props.md-->

## Emits

<!--@include: ../../partials/button/eventos.md-->

## Slots

<!--@include: ../../partials/button/slots.md-->

## Expose

<!--@include: ../../partials/button/metodos.md-->
