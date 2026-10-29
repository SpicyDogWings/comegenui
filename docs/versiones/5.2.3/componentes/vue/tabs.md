[← Volver](../README.md)

# `Tabs`

Pestañas con variantes, tamaños, iconos, tabs deshabilitadas individuales y control programático.
Las pestañas se definen con la prop `tabs` (array de objetos) y el tab activo viaja con `v-model`.

## Uso en Vue

```vue
<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";
import { ref } from "vue";

const active = ref("general");

const tabs = ref([
  { key: "general", label: "General" },
  { key: "advanced", label: "Advanced" },
  { key: "locked", label: "Locked", disabled: true },
]);
</script>

<template>
  <Tabs v-model="active" :tabs="tabs" variant="solid" color="primary">
    <template #general>Contenido General</template>
    <template #advanced>Contenido Advanced</template>
    <template #locked>Contenido Locked</template>
  </Tabs>
</template>
```

## Colores

`color` es un nombre semántico, no un hex: tiñe el tab activo y, en `ghost`, la línea inferior.
Un valor fuera del set cae en `primary`. (`tabs` es el array del ejemplo de arriba.)

```vue
<Tabs :tabs="tabs" variant="solid" color="primary" />
<Tabs :tabs="tabs" variant="solid" color="secondary" />
<Tabs :tabs="tabs" variant="solid" color="neutral" />
<Tabs :tabs="tabs" variant="solid" color="success" />
<Tabs :tabs="tabs" variant="solid" color="warning" />
<Tabs :tabs="tabs" variant="solid" color="danger" />
```

## Variantes

`variant` decide el aspecto: `ghost` (underline, **default**), `solid` (pills redondeadas),
`boxed` (contenedor con borde) y `soft` (contenedor tenue con el activo sólido).

```vue
<Tabs :tabs="tabs" variant="ghost" />
<Tabs :tabs="tabs" variant="solid" />
<Tabs :tabs="tabs" variant="boxed" />
<Tabs :tabs="tabs" variant="soft" />
```

## Tamaños

`size` acepta `sm`, `md` (**default**) y `lg`, y cambia el padding y la tipografía del tab.

```vue
<Tabs :tabs="tabs" size="sm" />
<Tabs :tabs="tabs" size="md" />
<Tabs :tabs="tabs" size="lg" />
```

## Iconos

Cada tab lleva un ícono por el campo `icon` (string HTML/SVG que se renderiza con `v-html`) o por el
slot `tab-icon-{key}`; el SVG debe usar `currentColor` para heredar el color del tab.

```vue
<script setup lang="ts">
const tabs = [
  { key: "home", label: "Home" },
  {
    key: "config",
    label: "Config",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>',
  },
];
</script>

<template>
  <Tabs :tabs="tabs" variant="solid" color="primary">
    <template #tab-icon-home>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    </template>
    <template #home>Contenido Home</template>
    <template #config>Contenido Config</template>
  </Tabs>
</template>
```

## Deshabilitado

`disabled` bloquea el grupo completo; `tabs[].disabled` bloquea una pestaña individual (se saltea en
la navegación por teclado y en `setActive`, y un `v-model` que apunte a ella cae en la primera
habilitada: una tab deshabilitada nunca queda como activa).

```vue
<script setup lang="ts">
const conDeshabilitada = [
  { key: "a", label: "Habilitada" },
  { key: "b", label: "Deshabilitada", disabled: true },
  { key: "c", label: "Habilitada" },
];
const todas = [
  { key: "a", label: "Una" },
  { key: "b", label: "Otra" },
];
</script>

<template>
  <Tabs :tabs="conDeshabilitada" variant="ghost" color="primary" />
  <Tabs :tabs="todas" variant="soft" color="primary" disabled />
</template>
```

## Paneles persistentes

Con `keepAlive: true` en un tab, su panel queda montado (`v-show` en vez de `v-if`) y conserva el
estado de los componentes internos al cambiar de pestaña.

```vue
<script setup lang="ts">
const tabs = [
  { key: "form", label: "Formulario", keepAlive: true },
  { key: "otro", label: "Otro" },
];
</script>

<template>
  <Tabs :tabs="tabs" variant="solid" color="primary">
    <template #form>
      <input placeholder="Escribí algo y cambiá de tab" />
    </template>
    <template #otro>Volvé: el formulario sigue como lo dejaste.</template>
  </Tabs>
</template>
```

## Cambios y control programático

`v-model` refleja el tab activo, el evento `change` avisa cada cambio y el `ref` expone `setActive`,
`getActive`, `next` y `prev`.

```vue
<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";
import { ref, useTemplateRef } from "vue";

const active = ref("first");
const tabs = [
  { key: "first", label: "First" },
  { key: "second", label: "Second" },
  { key: "third", label: "Third" },
];
const tabsRef = useTemplateRef("tabsRef");

function irASecond() {
  tabsRef.value?.setActive("second");
  console.log(tabsRef.value?.getActive()); // 'second'
}
</script>

<template>
  <Tabs ref="tabsRef" v-model="active" :tabs="tabs" variant="ghost" color="neutral"
        @change="(key) => console.log('Tab activo:', key)">
    <template #first>Contenido First</template>
    <template #second>Contenido Second</template>
    <template #third>Contenido Third</template>
  </Tabs>
</template>
```

## Accesibilidad y navegación

- Roles ARIA: `tablist`, `tab` y `tabpanel`. Cada tab lleva `aria-selected`, `aria-controls` (apunta
  al panel, que existe cuando la tab está activa o tiene `keepAlive`) y el panel lleva
  `aria-labelledby` apuntando a su tab.
- Un solo tab stop: sólo la tab activa tiene `tabindex="0"`; el resto, `-1` (roving tabindex). Las
  flechas mueven el foco y activan la tab a la que llegan.
- Teclado: las flechas ←/→ cambian de tab; `Home` y `End` van al primero/último.
- Las tabs deshabilitadas se saltean en la navegación, en `setActive` y al resolver el tab activo.

## Props

<!--@include: ../../partials/tabs/props-vue.md-->

### Prop `tabs`

Cada item es un objeto con:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `key` | `string` | ✓ | Identificador único (se usa para el tab activo y los slots) |
| `label` | `string` | ✓ | Texto visible del tab |
| `icon` | `string` | — | SVG/HTML del ícono (alternativa al slot `tab-icon-{key}`) |
| `disabled` | `boolean` | — | Deshabilita solo esa pestaña |
| `keepAlive` | `boolean` | — | Mantiene el panel montado al cambiar de tab |

## Emits

<!--@include: ../../partials/tabs/eventos.md-->

## Slots

<!--@include: ../../partials/tabs/slots.md-->

En HTML plano se usan con el atributo `slot="..."` sobre el elemento hijo.

## Expose

<!--@include: ../../partials/tabs/metodos-vue.md-->
