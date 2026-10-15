[← Volver](../README.md)

# `Popover`

Motor de overlay: un trigger (slot `toggle`) que abre un panel flotante posicionado respecto de
su ancla, con cierre por click afuera y `Escape`. Es la base de `Tooltip`, `Dropdown`,
`DropdownMenu` y `Select`.

## Uso en Vue

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import Popover from "@/components/overlay/Popover.vue";
</script>

<template>
  <Popover>
    <template #toggle="{ toggle }">
      <Button color="primary" variant="soft" @click="toggle">Abrir popover</Button>
    </template>
    <p>Contenido del panel. Click afuera o Escape para cerrar.</p>
  </Popover>
</template>
```

El slot `toggle` recibe `toggle` e `isOpen`; el slot `default` es el contenido del panel.

## Posicionamiento

`position` acepta `bottom` (**default**), `top`, `left` y `right`; `align` acepta `start`
(**default**), `center` y `end`. `offset` es la separación en px entre el ancla y el panel.

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import Popover from "@/components/overlay/Popover.vue";
</script>

<template>
  <Popover position="bottom" align="start">
    <template #toggle="{ toggle }">
      <Button @click="toggle">bottom / start</Button>
    </template>
    <div>Abajo, alineado al inicio.</div>
  </Popover>

  <Popover position="bottom" align="end">
    <template #toggle="{ toggle }">
      <Button @click="toggle">bottom / end</Button>
    </template>
    <div>Abajo, alineado al final.</div>
  </Popover>

  <Popover position="top" align="center">
    <template #toggle="{ toggle }">
      <Button @click="toggle">top / center</Button>
    </template>
    <div>Arriba, centrado.</div>
  </Popover>

  <Popover position="right" align="start">
    <template #toggle="{ toggle }">
      <Button @click="toggle">right / start</Button>
    </template>
    <div>A la derecha.</div>
  </Popover>

  <Popover position="left" align="center" :offset="12">
    <template #toggle="{ toggle }">
      <Button @click="toggle">left / offset 12</Button>
    </template>
    <div>A la izquierda, con offset.</div>
  </Popover>
</template>
```

## Hover

Con `hover` el panel abre al pasar el mouse (`mouseenter`) y cierra al salir
(`mouseleave`); `hover-delay` son los ms de espera antes de abrir (default `200`, `0` abre al
instante).

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import Popover from "@/components/overlay/Popover.vue";
</script>

<template>
  <Popover hover :hover-delay="0">
    <template #toggle>
      <Button color="primary" variant="soft">hover (delay 0)</Button>
    </template>
    <p>Aparece al instante.</p>
  </Popover>

  <Popover hover :hover-delay="600">
    <template #toggle>
      <Button color="primary" variant="soft">hover (delay 600)</Button>
    </template>
    <p>Aparece tras 600 ms.</p>
  </Popover>
</template>
```

## Estado deshabilitado

`disabled` bloquea la apertura: ni el toggle ni `open()` abren el panel.

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import Popover from "@/components/overlay/Popover.vue";
</script>

<template>
  <Popover disabled>
    <template #toggle>
      <Button color="neutral" variant="outlined" disabled>Deshabilitado</Button>
    </template>
    <p>No debería abrirse.</p>
  </Popover>
</template>
```

## Panel

`panel-width` fija el ancho del panel (default: el 100% del ancla), `role` el rol ARIA y
`panel-class` una clase extra (string, array u objeto).

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import Popover from "@/components/overlay/Popover.vue";
</script>

<template>
  <Popover panel-width="280px" role="dialog" :panel-class="['cu-popover-demo']">
    <template #toggle="{ toggle }">
      <Button color="primary" variant="soft" @click="toggle">panel ancho</Button>
    </template>
    <p>panel-width="280px", role="dialog", panel-class="cu-popover-demo".</p>
  </Popover>
</template>
```

## Fixed

Con `fixed` el panel se posiciona en coordenadas del viewport (en vez de absolutas respecto del
ancla) y se recalcula en cada scroll y resize mientras está abierto.

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import Popover from "@/components/overlay/Popover.vue";
</script>

<template>
  <Popover fixed position="bottom" align="start" :offset="8">
    <template #toggle="{ toggle }">
      <Button color="primary" variant="soft" @click="toggle">fixed</Button>
    </template>
    <p>position: fixed, reposicionado en scroll y resize.</p>
  </Popover>
</template>
```

## Interacción

`open` y `close` avisan cada cambio de estado; por código, el `ref` expone
`open()`/`close()`/`toggle()`/`isOpen()`.

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import Popover from "@/components/overlay/Popover.vue";
import { ref, useTemplateRef } from "vue";

const popover = useTemplateRef("popover");

function forzar() {
  popover.value?.open();
  popover.value?.close();
  popover.value?.toggle();
  popover.value?.isOpen();
}
</script>

<template>
  <Popover ref="popover" @open="() => console.log('open')" @close="() => console.log('close')">
    <template #toggle>
      <Button variant="soft">Ancla del popover</Button>
    </template>
    <div>Panel controlado desde la ref.</div>
  </Popover>
</template>
```

## Props

<!--@include: ../../partials/popover/props.md-->

## Emits

<!--@include: ../../partials/popover/eventos.md-->

## Slots

<!--@include: ../../partials/popover/slots.md-->

## Expose

<!--@include: ../../partials/popover/metodos.md-->
