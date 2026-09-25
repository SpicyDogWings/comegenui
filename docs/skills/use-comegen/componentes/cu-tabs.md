# `<cu-tabs>`

Pestañas con variantes, iconos, tabs deshabilitadas individuales y control programático. Acepta `tabs` como array de objetos y `v-model`/`modelValue` para el tab activo.

[← Volver](../SKILL.md)

---

---

## Uso en HTML plano

```html
<script src="dist/CuTabs.umd.js"></script>

<cu-tabs id="misTabs" variant="solid" color="primary">
  <div slot="general">Contenido General</div>
  <div slot="advanced">Contenido Advanced</div>
  <div slot="locked">Contenido Locked</div>
</cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    const tabs = document.getElementById('misTabs');
    tabs.tabs = [
      { key: 'general', label: 'General' },
      { key: 'advanced', label: 'Advanced' },
      { key: 'locked', label: 'Locked', disabled: true },
    ];
  });
</script>
```

> Las `tabs` se asignan después de `customElements.whenDefined('cu-tabs')` porque es una prop compleja.

---

## Variantes

```html
<cu-tabs variant="ghost"><!-- underline --></cu-tabs>
<cu-tabs variant="solid"><!-- pills redondeadas --></cu-tabs>
<cu-tabs variant="boxed"><!-- contenedor con borde --></cu-tabs>
<cu-tabs variant="soft"><!-- contenedor soft + activo solid --></cu-tabs>
```

> El array `tabs` se asigna vía JavaScript (ver [Uso en HTML plano](#uso-en-html-plano)).

---

## Iconos

Cada tab puede llevar un icono con el slot `tab-icon-{key}`. El SVG debe usar `currentColor` para heredar el color del tab:

```html
<cu-tabs id="iconos" variant="solid" color="primary">
  <svg slot="tab-icon-home" width="14" height="14" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  </svg>
  <div slot="home">Contenido Home</div>
</cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    document.getElementById('iconos').tabs = [
      { key: 'home', label: 'Home' },
    ];
  });
</script>
```

---

## Escuchar cambios y control programático

```html
<cu-tabs id="ctrl" variant="ghost" color="neutral">
  <div slot="first">Contenido First</div>
  <div slot="second">Contenido Second</div>
  <div slot="third">Contenido Third</div>
</cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    const tabs = document.getElementById('ctrl');
    tabs.tabs = [
      { key: 'first', label: 'First' },
      { key: 'second', label: 'Second' },
      { key: 'third', label: 'Third' },
    ];

    // change (payload = key activa)
    tabs.addEventListener('change', (e) => {
      console.log('Tab activo:', e.detail);
    });

    tabs.setActive('second');       // activa Second
    console.log(tabs.getActive());  // 'second'
  });
</script>
```

---

## Accesibilidad y navegación

- Roles ARIA: `tablist`, `tab`, `tabpanel`, con `aria-selected`, `aria-controls` y `aria-labelledby`.
- Navegación con teclado: flechas ←/→ para cambiar de tab, `Home` y `End` para ir al primero/último.
- Las tabs deshabilitadas se saltean en la navegación y en `setActive`.

---

## Ejemplo completo (playground vanilla)

El repositorio incluye una demo en HTML plano: [`playground/pages/tabs/tabs.html`](../../playground/pages/tabs/tabs.html) — abrí el archivo directamente en el navegador (sin server).

---

## Vista Vue

### Uso en Vue

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

### Variantes

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

### Iconos

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

### Escuchar cambios y control programático

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

### Accesibilidad y navegación

- Roles ARIA: `tablist`, `tab`, `tabpanel`, con `aria-selected`, `aria-controls` y `aria-labelledby`.
- Navegación con teclado: flechas ←/→ para cambiar de tab, `Home` y `End` para ir al primero/último.
- Las tabs deshabilitadas se saltean en la navegación y en `setActive`.

### Ejemplo completo (playground vanilla)

El repositorio incluye una demo en HTML plano: [`playground/pages/tabs/tabs.html`](../../playground/pages/tabs/tabs.html) — abrí el archivo directamente en el navegador (sin server).

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `tabs` | `TabItem[]` | — | Definición de las pestañas |
| `color` | `"neutral" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"primary"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"soft" \| "solid" \| "ghost" \| "boxed"` | `"ghost"` | `ghost`, `solid`, `boxed`, `soft` |
| `size` | `"md" \| "sm" \| "lg"` | `"md"` | `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Deshabilita todas las pestañas |
| `modelValue` | `string` | `""` | Clave del tab activo (v-model). |

### Prop `tabs`

Cada item es un objeto con:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `key` | `string` | ✓ | Identificador único (se usa para el tab activo y los slots) |
| `label` | `string` | ✓ | Texto visible del tab |
| `disabled` | `boolean` | — | Deshabilita solo esa pestaña |

> Los arrays/objetos se asignan **via JavaScript como propiedad DOM**, no como atributo HTML. Ver [Arrays y objetos](../SKILL.md#arrays-y-objetos-props-complejas).

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `update:modelValue` | `string` | Key del tab activo al cambiar |
| `change` | `string` | Se emite en cada cambio de tab (payload = key) |

## Slots

Los paneles y los iconos usan **slots nombrados** con el key de cada tab.

En HTML plano se usan con el atributo `slot="..."` sobre el elemento hijo.

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.getActive()` | Devuelve la clave del tab activo. |
| `.setActive(key: string)` | Activa el tab con la clave indicada. |
| `.next()` | Avanza al siguiente tab habilitado. |
| `.prev()` | Retrocede al tab habilitado anterior. |

## Interfaces

### `TabItem`

```ts
interface TabItem {
  key: string;
  label: string;
  // Icono del tab como HTML/SVG string (render con v-html), consistente con
  // label. Si la tab no trae icon, se usa el slot dinámico tab-icon-{key}.
  icon?: string;
  disabled?: boolean;
  // Mantiene el panel montado aunque no esté activo (v-show, no v-if):
  // el estado de los componentes internos sobrevive al cambio de tab.
  keepAlive?: boolean;
}
```
