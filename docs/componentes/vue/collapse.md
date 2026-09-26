# `Collapse`

Sección colapsable con trigger (botón + chevron animado). El contenido se muestra/oculta con una transición de altura. Útil para acordeones, menús anidados o secciones "más información".

[← Volver](../README.md)

---

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

## Abierto por defecto

```vue
<template>
  <Collapse label="Opciones avanzadas" default-open>
    <p>Visible desde el inicio gracias a <code>default-open</code>.</p>
  </Collapse>
</template>
```

## Colores

```vue
<template>
  <Collapse label="Información" color="primary">...</Collapse>
  <Collapse label="Éxito" color="success">...</Collapse>
  <Collapse label="Advertencia" color="warning">...</Collapse>
  <Collapse label="Peligro" color="danger">...</Collapse>
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

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `label` | `string` | — | Texto del trigger |
| `defaultOpen` | `boolean` | `false` |  |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del trigger: `primary`, `neutral`, `success`, `warning`, `danger` |

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `toggle` | `boolean` | Se emite al cambiar el estado abierto/cerrado. El payload es el nuevo estado (`true` = abierto) |

## Slots

| Slot | Descripción |
|------|------|
| `default` | Contenido colapsable |

## Expose

| Método | Descripción |
|------|------|
| `.open()` | Abre el collapse |
| `.close()` | Cierra el collapse |
| `.toggle()` | Alterna el estado |
| `.isOpen()` | Devuelve el estado actual (`boolean`) |
