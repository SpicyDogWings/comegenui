[← Volver](../README.md)

# `Dropdown`

Motor genérico de panel desplegable (toggle + panel + posicionamiento). Es interno: lo componen `Select`, `Autocomplete`, `DropdownMenu`, `DatePicker` y `Tooltip`.

## Uso en Vue

```vue
<script setup lang="ts">
import Dropdown from "@/components/overlay/Dropdown.vue";
</script>

<template>
  <Dropdown label="Opciones" color="primary" variant="soft">
    <p>El slot <code>default</code> es el contenido del panel.</p>
    <p>El toggle por defecto es un botón con <code>label</code>.</p>
  </Dropdown>
</template>
```

## Colores

`color` es un nombre semántico del trigger. Los 6 valores son `primary`, `secondary`,
`neutral` (**default**), `success`, `warning` y `danger`.

```vue
<template>
  <Dropdown label="primary" color="primary" variant="solid"><p>…</p></Dropdown>
  <Dropdown label="secondary" color="secondary" variant="solid"><p>…</p></Dropdown>
  <Dropdown label="neutral" color="neutral" variant="solid"><p>…</p></Dropdown>
  <Dropdown label="success" color="success" variant="solid"><p>…</p></Dropdown>
  <Dropdown label="warning" color="warning" variant="solid"><p>…</p></Dropdown>
  <Dropdown label="danger" color="danger" variant="solid"><p>…</p></Dropdown>
</template>
```

## Variantes

`variant` acepta las 7 variantes del botón trigger: `solid`, `outlined`, `soft`, `ghost`
(**default**), `subtle`, `link` y `none`.

```vue
<template>
  <Dropdown label="solid" color="primary" variant="solid"><p>…</p></Dropdown>
  <Dropdown label="outlined" color="primary" variant="outlined"><p>…</p></Dropdown>
  <Dropdown label="soft" color="primary" variant="soft"><p>…</p></Dropdown>
  <Dropdown label="ghost" color="primary" variant="ghost"><p>…</p></Dropdown>
  <Dropdown label="subtle" color="primary" variant="subtle"><p>…</p></Dropdown>
  <Dropdown label="link" color="primary" variant="link"><p>…</p></Dropdown>
  <Dropdown label="none" color="primary" variant="none"><p>…</p></Dropdown>
</template>
```

## Items

La prop `items` arma el menú sin escribir el HTML: cada fila acepta `label`, `icon` (SVG inline),
`to`/`href` (navegable), `disabled`, `divider` y `onClick`. El slot `default` agrega contenido
extra debajo.

> El `icon` se sanitiza con un **allowlist de SVG inline** antes de inyectarse: se conservan los
> elementos de dibujo SVG y se eliminan `<script>`, handlers `on*`, `<a>`, `<img>`,
> `<foreignObject>`, `<use>`/`href` y `<style>`.

```vue
<script setup lang="ts">
import { ref } from "vue";
import Dropdown from "@/components/overlay/Dropdown.vue";

const salida = ref("Sin acciones todavía.");

const lapiz =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';
const basura =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';

const items = [
  { label: "Editar", icon: lapiz, onClick: () => (salida.value = "Editar") },
  { label: "Inhabilitado", disabled: true },
  { divider: true },
  { label: "Documentación", href: "https://developer.mozilla.org" },
  { label: "Eliminar", icon: basura, onClick: () => (salida.value = "Eliminar") },
];
</script>

<template>
  <Dropdown label="Acciones" color="neutral" variant="outlined" :items="items">
    <p>La prop <code>items</code> arma el menú; el slot agrega contenido extra.</p>
  </Dropdown>
</template>
```

Con `items` el panel es un menú de verdad: el trigger por defecto lleva
`aria-haspopup="menu"`, `aria-expanded` y `aria-controls` (el panel recibe un `id` propio) y cada
fila es `role="menuitem"`. Las filas **no** son paradas de tabulación: el menú es una sola parada
(el trigger) y adentro se navega con el teclado. Un `<a>` deshabilitado sigue siendo `menuitem`,
con `aria-disabled` y fuera del tab order. `Select`, `Autocomplete` y `DatePicker` no pasan `items`
(usan su propio combobox/diálogo), así que su teclado no cambia.

## Teclado

| Tecla | Acción |
|-------|--------|
| <kbd>Flecha abajo</kbd> / <kbd>Flecha arriba</kbd> | Fila siguiente / anterior (salteando deshabilitadas, con vuelta al extremo). Cerrado, abre el menú con la primera / última fila |
| <kbd>Home</kbd> / <kbd>End</kbd> | Primera / última fila habilitada |
| Letras | Typeahead: enfoca la fila cuyo label empieza con lo tipeado |
| <kbd>Enter</kbd> / <kbd>Espacio</kbd> | Activa la fila enfocada (acción o link) |
| <kbd>Tab</kbd> | Cierra el menú y sigue el orden de tabulación |
| <kbd>Escape</kbd> | Cierra el menú (sólo si es el overlay de arriba) y devuelve el foco al trigger |

## Posición

`position` (`bottom` default, `top`, `left`, `right`), `align` (`start` default, `center`,
`end`), `offset` (px), `panelWidth` (ancho CSS del panel) y `fixed` (panel contra el viewport)
controlan dónde y cómo se abre.

Si el panel se saldría del área visible de un ancestro con `overflow` distinto de `visible` (una
card, una tabla), se posiciona contra el viewport solo, igual que con `fixed`: no hay que pasarlo a
mano. El único caso en que no: un ancestro con `transform`, `filter` o `contain`, que ancla a sus
descendientes `fixed`.

Contra el viewport el panel se **voltea** al lado opuesto si no entra (`right` → `left`,
`bottom` → `top`) y se **clampea** al borde: nada de scroll horizontal ni coordenadas negativas.

```vue
<template>
  <Dropdown label="bottom / start" position="bottom" align="start"><p>Abajo, alineado al inicio.</p></Dropdown>
  <Dropdown label="bottom / end" position="bottom" align="end"><p>Abajo, alineado al final.</p></Dropdown>
  <Dropdown label="top / center" position="top" align="center"><p>Arriba, centrado.</p></Dropdown>
  <Dropdown label="right / start" position="right" align="start"><p>A la derecha.</p></Dropdown>
  <Dropdown label="left / offset 12" position="left" align="center" :offset="12"><p>A la izquierda, con offset.</p></Dropdown>
  <Dropdown label="panelWidth 320px" :panel-width="'320px'"><p>El panel mide 320px de ancho.</p></Dropdown>
  <Dropdown label="fixed" :fixed="true"><p>Posicionado contra el viewport.</p></Dropdown>
</template>
```

## Trigger

`trigger` elige cómo se abre: `click` (**default**) o `hover` (abre al pasar el mouse y cierra
al salir). `disabled` deja el trigger inerte.

```vue
<template>
  <Dropdown label="click" trigger="click" color="primary" variant="soft"><p>Se abre con un click.</p></Dropdown>
  <Dropdown label="hover" trigger="hover" color="secondary" variant="soft"><p>Se abre al pasar el mouse y cierra al salir.</p></Dropdown>
  <Dropdown label="disabled" disabled><p>No se abre.</p></Dropdown>
</template>
```

## Loading y cooldown

`loading` reemplaza el contenido por un spinner y bloquea el panel. `cooldown` muestra un
loader de enfriamiento con `delay` (ms) y `cooldownKey` lo remonta para reiniciar la
animación.

```vue
<template>
  <Dropdown label="loading" color="primary" :loading="true"><p>No se ve mientras carga.</p></Dropdown>
  <Dropdown label="cooldown (2s)" color="warning" :cooldown="true" :delay="2000" :cooldown-key="1"><p>El loader de cooldown dura 2 segundos.</p></Dropdown>
  <Dropdown label="cooldown key 2" color="danger" :cooldown="true" :delay="3000" :cooldown-key="2"><p>Cambiar <code>cooldownKey</code> reinicia la animación.</p></Dropdown>
</template>
```

## Eventos

`v-model` guarda el valor seleccionado (`update:modelValue`); `open` y `close` avisan al
abrir/cerrar el panel.

```vue
<script setup lang="ts">
import { ref } from "vue";
import Dropdown from "@/components/overlay/Dropdown.vue";

const seleccionado = ref("");
const salida = ref("Sin eventos todavía.");

const items = [
  { label: 'Elegir "A"', onClick: () => (seleccionado.value = "A") },
  { label: 'Elegir "B"', onClick: () => (seleccionado.value = "B") },
  { label: 'Elegir "C"', onClick: () => (seleccionado.value = "C") },
];
</script>

<template>
  <Dropdown
    v-model="seleccionado"
    label="Elegí una opción"
    color="primary"
    variant="soft"
    :items="items"
    @open="salida = '@open'"
    @close="salida = '@close'"
  >
    <p>El contenido del slot se agrega debajo de los items.</p>
  </Dropdown>
</template>
```

## Control programático

```vue
<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import Dropdown from "@/components/overlay/Dropdown.vue";

const dropdownRef = useTemplateRef("dropdownRef");
const seleccionado = ref("inicial");

function demo() {
  dropdownRef.value?.open();
  dropdownRef.value?.close();
  dropdownRef.value?.toggle();
  dropdownRef.value?.get();
  dropdownRef.value?.set("nuevo");
  dropdownRef.value?.reset();
  dropdownRef.value?.isOpen(); // boolean
}
</script>

<template>
  <Dropdown ref="dropdownRef" v-model="seleccionado" label="Panel" color="primary" variant="soft">
    <p>Abierto/cerrado y valor controlados desde la ref.</p>
  </Dropdown>
</template>
```

## Slots personalizados

El slot `toggle` (scoped: recibe `toggle` e `isOpen`) reemplaza el botón por defecto; el slot
`default` es el contenido libre del panel.

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import Dropdown from "@/components/overlay/Dropdown.vue";
</script>

<template>
  <Dropdown position="bottom" align="start">
    <template #toggle="{ toggle, isOpen }">
      <Button :color="isOpen ? 'danger' : 'primary'" variant="solid" @click="toggle">
        {{ isOpen ? "Cerrar" : "Toggle custom" }}
      </Button>
    </template>
    <p>Toggle reemplazado por el slot <code>toggle</code>.</p>
  </Dropdown>

  <Dropdown label="Panel libre">
    <div>
      <strong>Contenido arbitrario</strong>
      <p>Podés poner cualquier HTML en el slot <code>default</code>.</p>
    </div>
  </Dropdown>
</template>
```

## Submenús anidados

Un `Dropdown` dentro del panel de otro se detecta como **anidado**: se renderiza como fila de
menú (con `icon` y `role="menuitem"` si el panel padre es un `menu`), con `aria-haspopup` y
`aria-expanded`, y abre en cascada hacia la derecha manteniendo el padre abierto. La detección
cruza slots y shadow roots (`assignedSlot` / `getRootNode().host`), así que funciona igual en Vue y
dentro de un custom element; `position="bottom"` (el default) es el que produce la cascada, y un
`position` distinto (`top`, `left`, `right`) manda.

Si el submenú no entra a la derecha, se voltea a la izquierda (ver [Posición](#posicion)) en vez de
salirse de la pantalla.

```vue
<script setup lang="ts">
import Dropdown from "@/components/overlay/Dropdown.vue";

const usuario =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
const engranaje =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>';
</script>

<template>
  <Dropdown label="Menú principal" color="primary" variant="soft">
    <Dropdown label="Usuarios" :icon="usuario" color="neutral">
      <p>Submenú de usuarios.</p>
    </Dropdown>
    <Dropdown label="Configuración" :icon="engranaje" color="neutral">
      <p>Submenú de configuración.</p>
    </Dropdown>
  </Dropdown>
</template>
```

## Props

<!--@include: ../../partials/dropdown/props.md-->

## Emits

<!--@include: ../../partials/dropdown/eventos.md-->

## Slots

<!--@include: ../../partials/dropdown/slots.md-->

## Expose

<!--@include: ../../partials/dropdown/metodos.md-->

## Interfaces

### `DropdownMenuItem`

```ts
export interface DropdownMenuItem {
  label?: string;
  to?: string;
  href?: string;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}
```
