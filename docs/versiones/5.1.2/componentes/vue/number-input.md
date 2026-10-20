[← Volver](../README.md)

# `NumberInput`

Input numérico con botones − / +, paso configurable, límites `min`/`max` y los métodos
`get`/`set`/`reset`/`focus`/`increment`/`decrement`. Hereda el campo de `Input` (color, variante,
tamaño, estados) y usa `Button` para los controles. El valor es un `v-model` numérico
(`modelValue` + `update:modelValue`); `null` es el campo vacío.

## Uso en Vue

```vue
<script setup lang="ts">
import NumberInput from "@/components/form/NumberInput.vue";
import { ref } from "vue";

const cantidad = ref<number | null>(null);
</script>

<template>
  <NumberInput v-model="cantidad" placeholder="Cantidad" color="primary" variant="outlined" />
  <NumberInput v-model="cantidad" :min="1" :max="10" :step="2" show-step-select />
</template>
```

En HTML plano, cargá el bundle `CuNumberInput` (ver [ficha vanilla](/componentes/cu-number-input)).

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`). Pinta el campo, los botones y el select de paso.

```vue
<NumberInput color="primary" placeholder="primary" />
<NumberInput color="secondary" placeholder="secondary" />
<NumberInput color="neutral" placeholder="neutral" />
<NumberInput color="success" placeholder="success" />
<NumberInput color="warning" placeholder="warning" />
<NumberInput color="danger" placeholder="danger" />
```

## Variantes

`variant` decide el fondo y el borde del campo: `outlined` (borde), `soft` (fondo tenue,
**default**), `ghost` (transparente) y `subtle` (tenue con borde).

```vue
<NumberInput color="primary" variant="outlined" placeholder="outlined" />
<NumberInput color="primary" variant="soft" placeholder="soft (default)" />
<NumberInput color="primary" variant="ghost" placeholder="ghost" />
<NumberInput color="primary" variant="subtle" placeholder="subtle" />
```

## Tamaños

`size` acepta `sm`, `md` (**default**) y `lg`; se aplica al campo, a los botones y al select de
paso, así que el control queda parejo.

```vue
<NumberInput size="sm" placeholder="sm" />
<NumberInput size="md" placeholder="md (default)" />
<NumberInput size="lg" placeholder="lg" />
```

## Controles (− / +)

`showControls` (**default** `true`) muestra los botones a los costados del campo; con `false` el
campo queda solo y el valor se cambia tipeando o por API.

```vue
<NumberInput placeholder="con controles" />
<NumberInput :show-controls="false" placeholder="sin controles" />
```

## Paso

`step` (**default** `1`) es lo que suman y restan los botones y las flechas del teclado. Con
`showStepSelect` aparece un select para elegirlo en caliente, con las opciones de `steps`
(**default** `[1, 5, 10]`); `step` siempre es la primera opción, aunque no esté en la lista.
Cambiar el paso **no** cambia el valor. El select es el componente `Select` de la librería (no un
`<select>` nativo), así que comparte color, variante y estados con el resto del campo.

```vue
<NumberInput :step="1" placeholder="paso 1" />
<NumberInput :step="5" placeholder="paso 5" />
<NumberInput :step="10" show-step-select placeholder="paso 10 + select" />
<NumberInput :steps="[2, 4, 8]" show-step-select placeholder="steps custom" />
```

## Límites (min / max)

`min` y `max` son inclusive y se respetan en todos los caminos: al tipear (el campo muestra el
límite, no el número tipeado), al setear por API y al incrementar o decrementar. En el límite el
botón correspondiente queda deshabilitado y no emite eventos, así que el valor nunca se sale del
rango.

```vue
<NumberInput :min="0" :max="10" placeholder="0 a 10" />
<NumberInput :min="1" :max="5" :step="1" placeholder="1 a 5" />
<NumberInput :min="0" :max="100" :step="10" show-step-select placeholder="0 a 100, paso 10" />
```

> Con el campo vacío los botones parten de `min` (o de `0` si no hay `min`): `+` da
> `min + step` y `−` da `min`.

## Teclado

Con el campo enfocado, `↑` incrementa y `↓` decrementa con el paso activo (el del select si está
visible). `Enter` confirma el valor tipeado. Con `disabled` o `readOnly` las flechas no hacen nada.

```vue
<NumberInput placeholder="Enfocá y usá ↑ / ↓" />
<NumberInput :step="5" placeholder="↑ / ↓ de a 5" />
```

## Valor, eventos y confirmación

`v-model` cubre el ida y vuelta. `update:model-value` avisa en cada cambio (con el número);
`change` llega con el **valor final** al confirmar (Enter o blur), al usar los botones y con
`set()`/`reset()`; tipear no lo dispara. `increment` y `decrement` traen el valor nuevo.

```vue
<script setup lang="ts">
import NumberInput from "@/components/form/NumberInput.vue";
import { ref } from "vue";

const valor = ref<number | null>(0);

function onChange(final: number | null) {
  console.log("change", final);
}
</script>

<template>
  <NumberInput
    v-model="valor"
    :min="0"
    :max="10"
    show-step-select
    @change="onChange"
    @increment="(n) => console.log('increment', n)"
    @decrement="(n) => console.log('decrement', n)"
  />
</template>
```

> El `<input>` interno también burbujea sus eventos nativos (`input`, `focus`, `blur`); el
> `change` nativo se detiene para no pisar el `change` del componente.

## API imperativa

`get()`, `set(valor)`, `reset()`, `focus()`, `increment()` y `decrement()` se llaman sobre la
`ref` del componente. `set()` clampea a `min`/`max`.

```vue
<script setup lang="ts">
import NumberInput from "@/components/form/NumberInput.vue";
import { ref, useTemplateRef } from "vue";

const valor = ref<number | null>(null);
const campo = useTemplateRef("campo");

function usar() {
  campo.value?.set(4);        // 4
  campo.value?.increment();   // 5
  console.log(campo.value?.get()); // 5
  campo.value?.reset();       // null
  campo.value?.focus();
}
</script>

<template>
  <NumberInput ref="campo" v-model="valor" :min="0" :max="10" />
</template>
```

## Props

<!--@include: ../../partials/number-input/props-vue.md-->

## Emits

<!--@include: ../../partials/number-input/eventos.md-->

## Slots

<!--@include: ../../partials/number-input/slots.md-->

## Expose

<!--@include: ../../partials/number-input/metodos.md-->
