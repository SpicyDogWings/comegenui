[← Volver](../README.md)

# `Collapse`

Sección colapsable con trigger (botón + chevron animado). El contenido se muestra/oculta con una transición de altura. Útil para acordeones, menús anidados o secciones "más información".

## Uso en Vue

```vue
<script setup lang="ts">
import Collapse from "@/components/overlay/Collapse.vue";
</script>

<template>
  <Collapse label="Más información">
    <p>Este contenido está oculto por defecto.</p>
  </Collapse>
</template>
```

En HTML plano, cargá el bundle `CuCollapse` (ver [ficha vanilla](/componentes/cu-collapse)).

## Colores

`color` es un nombre semántico del trigger (`ghost`), resuelto con los tokens del tema
activo. Los 6 valores son `primary`, `secondary`, `neutral` (**default**), `success`,
`warning` y `danger`.

```vue
<template>
  <Collapse label="primary" color="primary" default-open><p>…</p></Collapse>
  <Collapse label="secondary" color="secondary" default-open><p>…</p></Collapse>
  <Collapse label="neutral" color="neutral" default-open><p>…</p></Collapse>
  <Collapse label="success" color="success" default-open><p>…</p></Collapse>
  <Collapse label="warning" color="warning" default-open><p>…</p></Collapse>
  <Collapse label="danger" color="danger" default-open><p>…</p></Collapse>
</template>
```

## Descripción

`description` agrega una línea de texto secundario bajo el `label`, dentro del mismo trigger.
Es opcional y, si queda vacía (default `''`), no se renderiza nada.

```vue
<template>
  <Collapse label="Plan Pro" description="Facturación mensual, cancela cuando quieras">
    <p>…</p>
  </Collapse>
</template>
```

## Ícono

`icon` acepta un string SVG/HTML que se inyecta **antes del label**, dentro del trigger.

> El HTML del `icon` se sanitiza con **DOMPurify** antes de inyectarse: los SVG válidos se
> conservan y se eliminan `<script>`, handlers `on*` y URLs peligrosas.

```vue
<script setup lang="ts">
const estrella =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 2.5 14 9l6.5.5-5 4.3 1.5 6.4-5.5-3.4L6 20.2l1.5-6.4-5-4.3L9 9z"/></svg>';
</script>

<template>
  <Collapse label="Con ícono" :icon="estrella" color="warning" default-open>
    <p>El ícono se renderiza antes del label, dentro del trigger.</p>
  </Collapse>
</template>
```

## Abierto por defecto

`default-open` arranca el collapse abierto, sin pasar por el evento `toggle` (sólo define el
estado inicial).

```vue
<template>
  <Collapse label="Opciones avanzadas" default-open>
    <p>Visible desde el inicio gracias a <code>default-open</code>.</p>
  </Collapse>
</template>
```

## Deshabilitado

`disabled` deja el trigger inerte: no responde al click y muestra cursor `not-allowed`. `open()` y `toggle()` pasan a ser no-op; `close()` sí sigue funcionando (útil para colapsar desde código un collapse que arrancó con `default-open`).

```vue
<script setup lang="ts">
import Collapse from "@/components/overlay/Collapse.vue";
</script>

<template>
  <Collapse label="Sección bloqueada" disabled>
    <p>El trigger no responde: probá a hacer click.</p>
  </Collapse>
</template>
```

## Anidados

Los collapses se pueden anidar para construir árboles de menú:

```vue
<template>
  <Collapse label="Sección padre" color="primary" default-open>
    <p>Contenido de nivel superior.</p>
    <Collapse label="Hijo">
      <p>Contenido anidado con su propio toggle.</p>
    </Collapse>
  </Collapse>
</template>
```

## Escuchar eventos

```vue
<script setup lang="ts">
import Collapse from "@/components/overlay/Collapse.vue";

function onToggle(abierto: boolean) {
  console.log("abierto:", abierto); // true | false
}
</script>

<template>
  <Collapse label="Mi collapse" @toggle="onToggle">
    ...
  </Collapse>
</template>
```

## Control programático

```vue
<script setup lang="ts">
import Collapse from "@/components/overlay/Collapse.vue";
import { useTemplateRef } from "vue";

const c = useTemplateRef("c");

function demo() {
  c.value?.open();
  c.value?.close();
  c.value?.toggle();
  console.log(c.value?.isOpen()); // boolean
}
</script>

<template>
  <Collapse ref="c" label="Programático">
    <p>Controlado desde JS con open()/close()/toggle().</p>
  </Collapse>
</template>
```

## Ejemplo completo

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import Collapse from "@/components/overlay/Collapse.vue";
import { useTemplateRef } from "vue";

const faq = useTemplateRef("faq");

function onToggle(abierto: boolean) {
  console.log("FAQ abierto:", abierto);
}

function toggleFaq() {
  faq.value?.toggle();
}
</script>

<template>
  <Collapse ref="faq" label="¿Qué es ComegenUI?" color="primary" @toggle="onToggle">
    <p>Una librería de componentes UI como Custom Elements nativos.</p>
  </Collapse>

  <Button @click="toggleFaq">Alternar FAQ</Button>
</template>
```

## Props

<!--@include: ../../partials/collapse/props-vue.md-->

## Emits

<!--@include: ../../partials/collapse/eventos.md-->

## Slots

<!--@include: ../../partials/collapse/slots.md-->

## Expose

<!--@include: ../../partials/collapse/metodos-vue.md-->
