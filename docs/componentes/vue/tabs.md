# `Tabs`

Pestañas con variantes, iconos, tabs deshabilitadas individuales y control programático. Acepta `tabs` como array de objetos y `v-model`/`modelValue` para el tab activo.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";
import { ref } from "vue";

const active = ref('general');

const tabs = ref([
  { key: 'general', label: 'General' },
  { key: 'advanced', label: 'Advanced' },
  { key: 'locked', label: 'Locked', disabled: true },
]);
</script>

<template>
  <Tabs v-model="active" variant="solid" color="primary" :tabs="tabs">
    <template #general>Contenido General</template>
    <template #advanced>Contenido Advanced</template>
    <template #locked>Contenido Locked</template>
  </Tabs>
</template>
```

## Variantes

```vue
<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";
import { ref } from "vue";

const tabs = ref([/* ... */]);
</script>

<template>
  <Tabs :tabs="tabs" variant="ghost"><!-- underline --></Tabs>
  <Tabs :tabs="tabs" variant="solid"><!-- pills redondeadas --></Tabs>
  <Tabs :tabs="tabs" variant="boxed"><!-- contenedor con borde --></Tabs>
  <Tabs :tabs="tabs" variant="soft"><!-- contenedor soft + activo solid --></Tabs>
</template>
```

> `tabs` es una prop requerida (array de objetos); pasala con `:tabs="tabs"`.

## Iconos

Cada tab puede llevar un icono con el slot `tab-icon-{key}`. El SVG debe usar `currentColor` para heredar el color del tab:

```vue
<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";
import { ref } from "vue";

const tabs = ref([{ key: 'home', label: 'Home' }]);
</script>

<template>
  <Tabs variant="solid" color="primary" :tabs="tabs">
    <template #tab-icon-home>
      <svg width="14" height="14" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
    </template>
    <template #home>Contenido Home</template>
  </Tabs>
</template>
```

## Escuchar cambios y control programático

```vue
<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";
import { ref } from "vue";

const active = ref('first');
const tabsRef = ref<InstanceType<typeof Tabs> | null>(null);

const tabs = ref([
  { key: 'first', label: 'First' },
  { key: 'second', label: 'Second' },
  { key: 'third', label: 'Third' },
]);

function onChange(key: string) {
  console.log('Tab activo:', key);
}

function irASecond() {
  tabsRef.value?.setActive('second');       // activa Second
  console.log(tabsRef.value?.getActive());  // 'second'
}
</script>

<template>
  <Tabs ref="tabsRef" v-model="active" variant="ghost" color="neutral" :tabs="tabs" @change="onChange">
    <template #first>Contenido First</template>
    <template #second>Contenido Second</template>
    <template #third>Contenido Third</template>
  </Tabs>
</template>
```

## Accesibilidad y navegación

- Roles ARIA: `tablist`, `tab`, `tabpanel`, con `aria-selected`, `aria-controls` y `aria-labelledby`.
- Navegación con teclado: flechas ←/→ para cambiar de tab, `Home` y `End` para ir al primero/último.
- Las tabs deshabilitadas se saltean en la navegación y en `setActive`.

## Ejemplo completo (playground vanilla)

El repositorio incluye una demo en HTML plano: [`playground/pages/tabs/tabs.html`](../../playground/pages/tabs/tabs.html) — abrí el archivo directamente en el navegador (sin server).

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `tabs` | `{ key: string; label: string; icon?: string; disabled?: boolean; keepAlive?: boolean; }[]` | `[]` | Definición de las pestañas |
| `modelValue` | `string` | `""` | Key del tab activo (controlado) |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"primary"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "soft" \| "ghost" \| "boxed"` | `"ghost"` | `ghost`, `solid`, `boxed`, `soft` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | `sm`, `md`, `lg` |
| `disabled` | `boolean` | — | Deshabilita todas las pestañas |

### Prop `tabs`

Cada item es un objeto con:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `key` | `string` | ✓ | Identificador único (se usa para el tab activo y los slots) |
| `label` | `string` | ✓ | Texto visible del tab |
| `disabled` | `boolean` | — | Deshabilita solo esa pestaña |

> Los arrays/objetos se asignan **via JavaScript como propiedad DOM**, no como atributo HTML (ver [Componentes](../README.md)).

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `update:modelValue` | `string` | Key del tab activo al cambiar |
| `change` | `string` | Se emite en cada cambio de tab (payload = key) |

## Slots

Los paneles y los iconos usan **slots nombrados** con el key de cada tab.

En HTML plano se usan con el atributo `slot="..."` sobre el elemento hijo.

## Expose

| Método | Descripción |
|------|------|
| `.getActive()` | Devuelve la key del tab activo |
| `.setActive(key: string)` | Activa el tab con esa key |
| `.next()` | Activa el próximo tab habilitado |
| `.prev()` | Activa el tab anterior habilitado |
