[← Volver](../README.md)

# `SideOver`

Panel overlay que desliza desde un borde sobre el contenido, con scrim, cierre por
backdrop/Escape, opción `fullscreen` y control por `v-model`. Bloquea el scroll del body
mientras está abierto.

## Uso en Vue

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import SideOver from "@/components/overlay/SideOver.vue";
import { ref } from "vue";

const abierto = ref(false);
</script>

<template>
  <Button color="primary" variant="solid" @click="abierto = true">Abrir panel</Button>

  <SideOver v-model="abierto" title="Filtros" position="right">
    <p>Contenido del panel. Se cierra con el botón, el backdrop o Escape.</p>
  </SideOver>
</template>
```

En HTML plano, cargá el bundle `CuSideOver` (ver [ficha vanilla](/componentes/cu-side-over)).

## Posiciones

`position` decide el borde desde donde desliza: `right` (**default**), `left`, `top` y
`bottom`. En `top`/`bottom` `size` es el alto, no el ancho.

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import SideOver from "@/components/overlay/SideOver.vue";
import { ref } from "vue";

const derecha = ref(false);
const izquierda = ref(false);
const arriba = ref(false);
const abajo = ref(false);
</script>

<template>
  <Button @click="derecha = true">position right (default)</Button>
  <Button @click="izquierda = true">position left</Button>
  <Button @click="arriba = true">position top</Button>
  <Button @click="abajo = true">position bottom</Button>

  <SideOver v-model="derecha" position="right" title="Desde la derecha" />
  <SideOver v-model="izquierda" position="left" title="Desde la izquierda" />
  <SideOver v-model="arriba" position="top" size="40vh" title="Desde arriba" />
  <SideOver v-model="abajo" position="bottom" size="40vh" title="Desde abajo" />
</template>
```

## Tamaños

`size` acepta los presets `sm` (320px), `md` (400px), `lg` (512px), `xl` (640px) y `full`
(100%), o cualquier valor CSS (`300px`, `40vw`). El default es `'300px'`.

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import SideOver from "@/components/overlay/SideOver.vue";
import { ref } from "vue";

const sm = ref(false);
const md = ref(false);
const lg = ref(false);
const xl = ref(false);
const full = ref(false);
const css = ref(false);
</script>

<template>
  <Button @click="sm = true">sm (320px)</Button>
  <Button @click="md = true">md (400px)</Button>
  <Button @click="lg = true">lg (512px)</Button>
  <Button @click="xl = true">xl (640px)</Button>
  <Button @click="full = true">full (100%)</Button>
  <Button @click="css = true">"40vw"</Button>

  <SideOver v-model="sm" position="right" size="sm" title="sm (320px)" />
  <SideOver v-model="md" position="right" size="md" title="md (400px)" />
  <SideOver v-model="lg" position="right" size="lg" title="lg (512px)" />
  <SideOver v-model="xl" position="right" size="xl" title="xl (640px)" />
  <SideOver v-model="full" position="right" size="full" title="full (100%)" />
  <SideOver v-model="css" position="right" size="40vw" title="40vw" />
</template>
```

> Los presets se pueden sobrescribir con las custom properties `--cu-sideover-size-{sm|md|lg|xl|full}` sobre el host.

## Fullscreen

`fullscreen` ocupa todo el viewport e **ignora** `size`.

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import SideOver from "@/components/overlay/SideOver.vue";
import { ref } from "vue";

const abierto = ref(false);
</script>

<template>
  <Button color="primary" @click="abierto = true">Abrir fullscreen</Button>

  <SideOver v-model="abierto" fullscreen title="Pantalla completa" position="right">
    <p>El panel ocupa el 100% del viewport.</p>
  </SideOver>
</template>
```

## Persistente

Con `persistent` el panel no se cierra por backdrop, `Escape` ni botón de cerrar (tampoco
renderiza el botón): sólo se cierra cambiando el `v-model`.

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import SideOver from "@/components/overlay/SideOver.vue";
import { ref } from "vue";

const abierto = ref(false);
</script>

<template>
  <Button color="warning" @click="abierto = true">Abrir persistente</Button>

  <SideOver v-model="abierto" persistent title="Sin cierre accidental">
    <p>No hay botón de cerrar: se cierra desde adentro.</p>
    <Button variant="ghost" @click="abierto = false">Cerrar desde adentro</Button>
  </SideOver>
</template>
```

## z-index

`z-index` define la capa del overlay (default `1100`); subilo si tenés otro overlay por encima.

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import SideOver from "@/components/overlay/SideOver.vue";
import { ref } from "vue";

const abierto = ref(false);
</script>

<template>
  <Button color="primary" @click="abierto = true">Abrir con z-index 2000</Button>

  <SideOver v-model="abierto" title="z-index alto" :z-index="2000" position="right">
    <p>Se apila por encima de otros overlays con menor <code>z-index</code>.</p>
  </SideOver>
</template>
```

## Interacción

`update:modelValue` (lo que consume `v-model`) avisa cada cambio de estado con el valor nuevo
(`boolean`), y `close` se dispara cada vez que el panel se cierra.

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import SideOver from "@/components/overlay/SideOver.vue";
import { ref } from "vue";

const abierto = ref(false);

function onUpdate(valor: boolean) {
  console.log("estado:", valor);
}
function onClose() {
  console.log("cerrando");
}
</script>

<template>
  <Button color="primary" @click="abierto = true">Abrir panel</Button>

  <SideOver
    v-model="abierto"
    title="Eventos del panel"
    @update:model-value="onUpdate"
    @close="onClose"
  >
    <p>Al cambiar el estado se emite <code>update:modelValue</code>; al cerrar, <code>close</code>.</p>
  </SideOver>
</template>
```

## Props

<!--@include: ../../partials/side-over/props-vue.md-->

## Emits

<!--@include: ../../partials/side-over/eventos-vue.md-->

## Slots

<!--@include: ../../partials/side-over/slots.md-->

## Expose

<!--@include: ../../partials/side-over/metodos-vue.md-->
