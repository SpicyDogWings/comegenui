[← Volver](../README.md)

# `MonthSlider`

Selector de mes con navegación por chevrons (mes y año), swipe sobre el label, límites
(`min`/`max`) y formato de mes/año configurable.

## Uso en Vue

```vue
<script setup lang="ts">
import MonthSlider from "@/components/controls/MonthSlider.vue";
import { ref } from "vue";

const mes = ref<Date | null>(new Date(2026, 0, 1));
</script>

<template>
  <MonthSlider v-model="mes" color="primary" variant="soft" />
</template>
```

No es un custom element: no hay ficha vanilla ni bundle propio. Es la base del calendario
(`Calendar`/`DualCalendar`) y no tiene slots.

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`), y tiñe los chevrons y el label.

```vue
<script setup lang="ts">
import MonthSlider from "@/components/controls/MonthSlider.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <MonthSlider v-for="color in colors" :key="color" :color="color" variant="soft" />
</template>
```

## Variantes

`variant` decide el aspecto del label: `solid` (relleno), `outlined` (borde), `soft` (fondo
tenue, **default**), `ghost` (transparente) y `subtle` (tenue con borde).

```vue
<script setup lang="ts">
import MonthSlider from "@/components/controls/MonthSlider.vue";

const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
</script>

<template>
  <MonthSlider v-for="variant in variants" :key="variant" color="primary" :variant="variant" />
</template>
```

## Formatos

`monthFormat` acepta `MMMM` (septiembre, **default**), `MMM` (sept), `MM` (09) y `M` (9);
`yearFormat`, `yyyy` (2026, **default**) o `yy` (26); `locale` cambia el idioma de los nombres.

```vue
<script setup lang="ts">
import MonthSlider from "@/components/controls/MonthSlider.vue";
</script>

<template>
  <MonthSlider color="primary" month-format="MMMM" />
  <MonthSlider color="primary" month-format="MMM" />
  <MonthSlider color="primary" month-format="MM" />
  <MonthSlider color="primary" month-format="M" />

  <MonthSlider color="primary" model-value="2024-07-01" year-format="yyyy" />
  <MonthSlider color="primary" model-value="2024-07-01" year-format="yy" />

  <MonthSlider color="primary" locale="en" />
</template>
```

> El badge del año sólo aparece cuando el mes visible no es del año actual: por eso los ejemplos
> de `yearFormat` arrancan en 2024.

## Estados

`disabled` bloquea toda la navegación; `min`/`max` deshabilitan los chevrons en los bordes; y con
`yearNavigation="false"` quedan sólo los saltos de mes.

```vue
<script setup lang="ts">
import MonthSlider from "@/components/controls/MonthSlider.vue";
</script>

<template>
  <MonthSlider color="neutral" disabled />
  <MonthSlider color="primary" min="2026-06-01" max="2026-09-01" />
  <MonthSlider color="primary" :year-navigation="false" />
</template>
```

> `min`/`max` son inclusivos y el valor se recorta (`clamp`) a ese rango apenas se monta.

## Valor

`v-model` (prop `modelValue` + emit `update:modelValue`) acepta `Date`, `string` (`"2026-01-01"`)
o timestamp; sin valor, arranca en el mes actual.

```vue
<script setup lang="ts">
import MonthSlider from "@/components/controls/MonthSlider.vue";
import { ref } from "vue";

const mes = ref<Date | null>(new Date(2026, 0, 1));
</script>

<template>
  <MonthSlider v-model="mes" color="primary" />
  <p>{{ mes }}</p>
</template>
```

## Eventos

`update:modelValue` avisa en cada navegación (v-model lo usa) y `change` se emite junto con él y
recibe el mismo `Date`.

```vue
<script setup lang="ts">
import MonthSlider from "@/components/controls/MonthSlider.vue";
import { ref } from "vue";

const mes = ref<Date | null>(new Date(2026, 0, 1));

function onUpdate(value: Date) {
  mes.value = value;
  console.log("update:modelValue →", value);
}

function onChange(value: Date) {
  console.log("change →", value);
}
</script>

<template>
  <MonthSlider
    :model-value="mes"
    color="primary"
    @update:model-value="onUpdate"
    @change="onChange"
  />
</template>
```

## API imperativa

Sobre la `ref` del componente: `prevMonth`, `nextMonth`, `prevYear`, `nextYear`, `goToMonth`,
`getValue` y `setValue`.

```vue
<script setup lang="ts">
import MonthSlider from "@/components/controls/MonthSlider.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const slider = ref<InstanceType<typeof MonthSlider> | null>(null);
</script>

<template>
  <MonthSlider ref="slider" color="primary" />

  <Button @click="slider?.prevMonth()">prevMonth()</Button>
  <Button @click="slider?.nextMonth()">nextMonth()</Button>
  <Button @click="slider?.prevYear()">prevYear()</Button>
  <Button @click="slider?.nextYear()">nextYear()</Button>
  <Button @click="slider?.goToMonth('2026-03-15')">goToMonth()</Button>
  <Button @click="console.log(slider?.getValue())">getValue()</Button>
  <Button @click="slider?.setValue('2026-12-01')">setValue()</Button>
</template>
```

> `nextMonth`/`prevMonth`/`nextYear`/`prevYear` respetan `min`/`max`: en el borde no se mueven.

## Props

<!--@include: ../../partials/month-slider/props.md-->

## Emits

<!--@include: ../../partials/month-slider/eventos.md-->

## Slots

<!--@include: ../../partials/month-slider/slots.md-->

## Expose

<!--@include: ../../partials/month-slider/metodos.md-->
