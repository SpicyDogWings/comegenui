[← Volver](../README.md)

# `YearSlider`

Selector de año: dos chevrons con el año al medio. Soporta `v-model`, color, variante, rango
(`min` / `max`) y control programático.

## Uso en Vue

```vue
<script setup lang="ts">
import YearSlider from "@/components/controls/YearSlider.vue";
import { ref } from "vue";

const anio = ref<number | null>(2026);
</script>

<template>
  <YearSlider v-model="anio" color="primary" variant="soft" />
</template>
```

## Colores

`color` es un nombre semántico: tiñe el label central y los chevrons con los tokens del tema.

```vue
<YearSlider color="primary" variant="soft" />
<YearSlider color="secondary" variant="soft" />
<YearSlider color="neutral" variant="soft" />
<YearSlider color="success" variant="soft" />
<YearSlider color="warning" variant="soft" />
<YearSlider color="danger" variant="soft" />
```

## Variantes

`variant` es la variante del label del año: `solid`, `outlined`, `soft` (**default**), `ghost` y
`subtle`.

```vue
<YearSlider color="primary" variant="solid" />
<YearSlider color="primary" variant="outlined" />
<YearSlider color="primary" variant="soft" />
<YearSlider color="primary" variant="ghost" />
<YearSlider color="primary" variant="subtle" />
```

## Rango

`min` y `max` acotan el año navegable; en los bordes el chevron correspondiente queda deshabilitado.

```vue
<YearSlider color="primary" :min="2024" :max="2026" />
```

## Deshabilitado

`disabled` bloquea los chevrons y el label.

```vue
<YearSlider color="neutral" disabled />
```

## v-model

`v-model` refleja el año elegido; acepta número, string numérico o fecha `"YYYY-MM-DD"` (se toma el
año).

```vue
<YearSlider v-model="anio" color="primary" />
<p>modelValue: {{ anio ?? "—" }}</p>
```

## Cambios

`update:modelValue` se emite al navegar y `change` en cada cambio de año.

```vue
<YearSlider
  :model-value="anio"
  color="primary"
  @update:model-value="(value) => (anio = value)"
  @change="(value) => console.log('change', value)"
/>
```

## Métodos

El `ref` expone `nextYear`, `prevYear`, `goToYear`, `getValue` y `setValue`.

```vue
<script setup lang="ts">
import { useTemplateRef } from "vue";
import YearSlider from "@/components/controls/YearSlider.vue";
import Button from "@/components/buttons/Button.vue";

const slider = useTemplateRef("slider");
</script>

<template>
  <Button size="sm" variant="outlined" @click="slider?.prevYear()">prevYear()</Button>
  <Button size="sm" variant="outlined" @click="slider?.nextYear()">nextYear()</Button>
  <Button size="sm" variant="outlined" @click="slider?.goToYear(2020)">goToYear(2020)</Button>
  <Button size="sm" variant="outlined" @click="console.log(slider?.getValue())">getValue()</Button>
  <Button size="sm" variant="outlined" @click="slider?.setValue('2026')">setValue('2026')</Button>

  <YearSlider ref="slider" color="primary" />
</template>
```

## Props

<!--@include: ../../partials/year-slider/props.md-->

## Emits

<!--@include: ../../partials/year-slider/eventos.md-->

## Slots

<!--@include: ../../partials/year-slider/slots.md-->

## Expose

<!--@include: ../../partials/year-slider/metodos.md-->
