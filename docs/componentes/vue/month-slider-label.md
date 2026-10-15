[← Volver](../README.md)

# `MonthSliderLabel`

Etiqueta del `MonthSlider`: muestra el mes (y opcionalmente el año, como badge) y se puede
**arrastrar** para navegar. Es un componente interno del `MonthSlider`, pero se puede usar solo.

## Uso en Vue

```vue
<script setup lang="ts">
import MonthSliderLabel from "@/components/controls/month-slider/MonthSliderLabel.vue";
</script>

<template>
  <MonthSliderLabel label="Septiembre" year="2026" color="primary" variant="soft" />
</template>
```

No es un custom element: no hay ficha vanilla ni bundle propio. No tiene slots.

## Colores

`color` es un nombre semántico, no un hex: tiñe el texto y el badge del año
(`--cu-color-{color}*`).

```vue
<script setup lang="ts">
import MonthSliderLabel from "@/components/controls/month-slider/MonthSliderLabel.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <MonthSliderLabel
    v-for="color in colors"
    :key="color"
    :label="color"
    year="2024"
    :color="color"
    variant="soft"
  />
</template>
```

## Variantes

`variant` decide el aspecto: `solid` (relleno), `outlined` (borde), `soft` (fondo tenue,
**default**), `ghost` (transparente) y `subtle` (tenue con borde).

```vue
<script setup lang="ts">
import MonthSliderLabel from "@/components/controls/month-slider/MonthSliderLabel.vue";

const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
</script>

<template>
  <MonthSliderLabel
    v-for="variant in variants"
    :key="variant"
    label="Septiembre"
    year="2024"
    color="primary"
    :variant="variant"
  />
</template>
```

## Año

`year` es opcional: si viene, se muestra como badge al lado del mes (y el `aria-label` lo
incluye). Sobre `variant="solid"` el badge se invierte para no perderse contra el fondo.

```vue
<script setup lang="ts">
import MonthSliderLabel from "@/components/controls/month-slider/MonthSliderLabel.vue";
</script>

<template>
  <MonthSliderLabel label="Septiembre" year="2024" color="primary" variant="soft" />
  <MonthSliderLabel label="Diciembre" color="neutral" variant="subtle" />
</template>
```

## Arrastrar

Con `draggable` (default), arrastrar el label un `threshold` de píxeles emite `navigate` con la
dirección (`-1`/`1` multiplicado por `steps`); también funcionan las flechas ←/→.

```vue
<script setup lang="ts">
import MonthSliderLabel from "@/components/controls/month-slider/MonthSliderLabel.vue";

function onNavigate(direction: number) {
  console.log("navigate →", direction);
}
</script>

<template>
  <MonthSliderLabel
    label="Septiembre"
    year="2024"
    color="primary"
    draggable
    :threshold="40"
    :steps="2"
    @navigate="onNavigate"
  />
</template>
```

> Un gesto consume **un** paso (`steps` meses) sin importar la distancia: hay que soltar y volver
> a arrastrar para seguir navegando.

## Estados

`disabled` apaga la interacción, `draggable="false"` deja el label como texto y
`canNavigatePrev`/`canNavigateNext` bloquean los gestos hacia un lado.

```vue
<script setup lang="ts">
import MonthSliderLabel from "@/components/controls/month-slider/MonthSliderLabel.vue";
</script>

<template>
  <MonthSliderLabel label="Deshabilitado" year="2024" color="neutral" disabled />
  <MonthSliderLabel label="Sin drag" year="2024" color="primary" :draggable="false" />
  <MonthSliderLabel
    label="Borde"
    year="2024"
    color="primary"
    :can-navigate-prev="false"
    :can-navigate-next="false"
  />
</template>
```

> Cuando un gesto intenta cruzar un límite, el label “choca” contra la pared en vez de consumir el
> paso: para volver atrás, se invierte la dirección.

## Props

<!--@include: ../../partials/month-slider-label/props.md-->

## Emits

<!--@include: ../../partials/month-slider-label/eventos.md-->

## Slots

<!--@include: ../../partials/month-slider-label/slots.md-->

## Expose

<!--@include: ../../partials/month-slider-label/metodos.md-->
