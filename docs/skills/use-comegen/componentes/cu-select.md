# `<cu-select>`

Selector de opciones con color, variante, ícono chevron, opciones deshabilitadas y posicionamiento configurable. Controlable via `modelValue` o métodos `get`/`set`.

[← Volver](../SKILL.md)

---

---

## Uso en HTML plano

```html
<script src="dist/CuSelect.umd.js"></script>

<cu-select id="miSelect" placeholder="Seleccione una opción" color="primary" variant="outlined"></cu-select>

<script>
  const select = document.getElementById('miSelect');
  select.options = [
    { value: 'doc', label: 'Documento' },
    { value: 'pdf', label: 'PDF' },
    { value: 'csv', label: 'CSV' },
  ];
  select.set('pdf');
  console.log(select.get()); // "pdf"
</script>
```

---

## Opciones deshabilitadas

```html
<cu-select id="miSelect" placeholder="Elige un formato"></cu-select>

<script>
  const s = document.getElementById('miSelect');
  s.options = [
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'Documento', disabled: true },
    { value: 'csv', label: 'CSV', disabled: true },
    { value: 'xlsx', label: 'Excel' },
  ];
</script>
```

Las opciones con `disabled: true` se ven atenuadas y no responden al click.

---

## Opciones con color y variante individual

```html
<cu-select id="miSelect"></cu-select>

<script>
  const s = document.getElementById('miSelect');
  s.options = [
    { value: 'ok',   label: 'Aprobado',  color: 'success' },
    { value: 'warn', label: 'Pendiente', color: 'warning' },
    { value: 'err',  label: 'Rechazado', color: 'danger' },
  ];
</script>
```

Si una opción no especifica `color` ni `variant`, hereda los valores del `<cu-select>`.

---

## Escuchar cambios

```html
<cu-select id="selector"></cu-select>

<script>
  const sel = document.getElementById('selector');
  sel.options = [
    { value: 'op1', label: 'Opción 1' },
    { value: 'op2', label: 'Opción 2' },
  ];

  sel.addEventListener('select', (e) => {
    console.log('Seleccionado:', e.detail); // { value, label }
  });

  sel.addEventListener('update:modelValue', (e) => {
    console.log('Valor:', e.detail); // string
  });
</script>
```

---

## Búsqueda por teclado (searchEnabled)

Cuando `searchEnabled` es `true`, el select acepta entrada por teclado (como un `<select>` nativo): el usuario escribe y la lista hace scroll a la primera opción que coincide.

```html
<cu-select id="paises" search-enabled></cu-select>

<script>
  const select = document.getElementById('paises');
  select.options = [
    { value: 'ar', label: 'Argentina' },
    { value: 'br', label: 'Brasil' },
    { value: 'cl', label: 'Chile' },
    { value: 'co', label: 'Colombia' },
    { value: 'mx', label: 'México' },
    { value: 'pe', label: 'Perú' },
  ];
</script>
```

**Comportamiento:**
- Al abrir el dropdown, el input oculto recibe foco
- Al escribir, la lista scrollea a la primera opción que coincide (según `searchMode`: `startsWith` por defecto)
- El texto acumulado se resetea después de 1s sin teclear (configurable con `searchResetDelay`)
- Backspace borra el último carácter
- Escape y Tab no afectan la búsqueda

---

## Estado de carga (loading)

Cuando `loading` es `true`, se muestra una barra animada en el tope del dropdown y el panel se atenúa (sin interacción):

```html
<cu-select id="miSelect" loading></cu-select>
```

```js
const select = document.getElementById('miSelect');
select.loading = true;   // mostrar
// ...carga...
select.loading = false;  // ocultar
```

**Nota:** Si `loading` está activo, la barra de cooldown (del `searchEnabled`) **no se muestra**.

---

## Barra de cooldown

Mientras el usuario escribe (con `searchEnabled`), aparece una barra de cooldown que se vacía en `searchResetDelay` ms. Al presionar otra tecla, la barra se reinicia.

```html
<!-- Cooldown con color suave (ghost, default) -->
<cu-select search-enabled></cu-select>

<!-- Cooldown con color lleno (solid) -->
<cu-select search-enabled cooldown-variant="solid"></cu-select>

<!-- Cooldown personalizado: 3s -->
<cu-select search-enabled search-reset-delay="3000"></cu-select>
```

| `cooldownVariant` | Apariencia |
|-------------------|------------|
| `ghost` (default) | Color suave (`--cu-color-{color}-ghost-hover`) |
| `solid` | Color lleno (`--cu-color-{color}`) |

---

## Control programático

```html
<cu-select id="auto"></cu-select>

<script>
  const s = document.getElementById('auto');
  s.options = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
  ];

  s.set('a');             // seleccionar 'a'
  s.get();                // 'a'
  s.selectedItem();       // { value: 'a', label: 'A' }
  s.reset();              // limpiar
  s.isOpen();             // false
  s.focus();              // foco
</script>
```

---

## Posicionamiento

```html
<!-- Con position + align separados -->
<cu-select position="bottom" align="end"></cu-select>
<cu-select position="top" align="center"></cu-select>

<cu-select position="bottom" align="end"></cu-select>
<cu-select position="top" align="start"></cu-select>
```

---

## Vista Vue

### Uso en Vue

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("pdf");
const opciones = [
  { value: "doc", label: "Documento" },
  { value: "pdf", label: "PDF" },
  { value: "csv", label: "CSV" },
];
</script>

<template>
  <Select
    v-model="value"
    :options="opciones"
    placeholder="Seleccione una opción"
    color="primary"
    variant="outlined"
  />
</template>
```

### Opciones deshabilitadas

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("");
const opciones = [
  { value: "pdf", label: "PDF" },
  { value: "doc", label: "Documento", disabled: true },
  { value: "csv", label: "CSV", disabled: true },
  { value: "xlsx", label: "Excel" },
];
</script>

<template>
  <Select v-model="value" :options="opciones" placeholder="Elige un formato" />
</template>
```

Las opciones con `disabled: true` se ven atenuadas y no responden al click.

### Opciones con color y variante individual

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("");
const opciones = [
  { value: "ok", label: "Aprobado", color: "success" },
  { value: "warn", label: "Pendiente", color: "warning" },
  { value: "err", label: "Rechazado", color: "danger" },
];
</script>

<template>
  <Select v-model="value" :options="opciones" />
</template>
```

Si una opción no especifica `color` ni `variant`, hereda los valores del `<cu-select>`.

### Escuchar cambios

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("");
const opciones = [
  { value: "op1", label: "Opción 1" },
  { value: "op2", label: "Opción 2" },
];

function onSelect(option: { value: string; label: string }) {
  console.log("Seleccionado:", option); // { value, label }
}

function onUpdate(valor: string) {
  console.log("Valor:", valor); // string
}
</script>

<template>
  <Select
    v-model="value"
    :options="opciones"
    @select="onSelect"
    @update:model-value="onUpdate"
  />
</template>
```

### Búsqueda por teclado (searchEnabled)

Cuando `searchEnabled` es `true`, el select acepta entrada por teclado (como un `<select>` nativo): el usuario escribe y la lista hace scroll a la primera opción que coincide.

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("");
const paises = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
  { value: "co", label: "Colombia" },
  { value: "mx", label: "México" },
  { value: "pe", label: "Perú" },
];
</script>

<template>
  <Select v-model="value" :options="paises" search-enabled />
</template>
```

**Comportamiento:**
- Al abrir el dropdown, el input oculto recibe foco
- Al escribir, la lista scrollea a la primera opción que coincide (según `searchMode`: `startsWith` por defecto)
- El texto acumulado se resetea después de 1s sin teclear (configurable con `searchResetDelay`)
- Backspace borra el último carácter
- Escape y Tab no afectan la búsqueda

### Estado de carga (loading)

Cuando `loading` es `true`, se muestra una barra animada en el tope del dropdown y el panel se atenúa (sin interacción):

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("");
const opciones = [/* ... */];
const loading = ref(false);

async function cargar() {
  loading.value = true;   // mostrar
  // ...carga...
  loading.value = false;  // ocultar
}
</script>

<template>
  <Select v-model="value" :options="opciones" :loading="loading" />
</template>
```

**Nota:** Si `loading` está activo, la barra de cooldown (del `searchEnabled`) **no se muestra**.

### Barra de cooldown

Mientras el usuario escribe (con `searchEnabled`), aparece una barra de cooldown que se vacía en `searchResetDelay` ms. Al presionar otra tecla, la barra se reinicia.

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("");
const opciones = [/* ... */];
</script>

<template>
  <!-- Cooldown con color suave (ghost, default) -->
  <Select v-model="value" :options="opciones" search-enabled />

  <!-- Cooldown con color lleno (solid) -->
  <Select v-model="value" :options="opciones" search-enabled cooldown-variant="solid" />

  <!-- Cooldown personalizado: 3s -->
  <Select v-model="value" :options="opciones" search-enabled :search-reset-delay="3000" />
</template>
```

| `cooldownVariant` | Apariencia |
|-------------------|------------|
| `ghost` (default) | Color suave (`--cu-color-{color}-ghost-hover`) |
| `solid` | Color lleno (`--cu-color-{color}`) |

### Control programático

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { onMounted, ref, useTemplateRef } from "vue";

const value = ref("");
const auto = useTemplateRef("auto");
const opciones = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
];

onMounted(() => {
  auto.value?.set("a");             // seleccionar 'a'
  auto.value?.get();                // 'a'
  auto.value?.selectedItem();       // { value: 'a', label: 'A' }
  auto.value?.reset();              // limpiar
  auto.value?.isOpen();             // false
  auto.value?.focus();              // foco
});
</script>

<template>
  <Select ref="auto" v-model="value" :options="opciones" />
</template>
```

### Posicionamiento

```vue
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("");
const opciones = [/* ... */];
</script>

<template>
  <!-- Con position + align separados -->
  <Select v-model="value" :options="opciones" position="bottom" align="end" />
  <Select v-model="value" :options="opciones" position="top" align="center" />

  <Select v-model="value" :options="opciones" position="bottom" align="end" />
  <Select v-model="value" :options="opciones" position="top" align="start" />
</template>
```

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `modelValue` | `string` | `""` | Valor seleccionado |
| `options` | `SelectOption[]` | `[]` | Opciones del select (ver abajo). Se asigna como propiedad JS |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `placeholder` | `string` | — | Texto mostrado cuando no hay selección |
| `placeholderWrap` | `boolean` | `false` | Si `true`, el texto wrappea; si `false`, se trunca con `...` (atributo HTML: `placeholder-wrap`) |
| `position` | `string` | `"bottom"` | Posición del dropdown: `bottom`, `top` |
| `align` | `string` | `"start"` | Alineación: `start`, `center`, `end` |
| `textAlign` | `"left" \| "center" \| "right"` | `"left"` | Alineación del texto seleccionado: `left`, `center`, `right` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `fixed` | `boolean` | `false` | Si es `true`, el dropdown usa `position: fixed` en vez de absoluto |
| `hightContrast` | `boolean` | `false` | Modo de alto contraste para el texto |
| `searchEnabled` | `boolean` | `false` | Activa búsqueda por teclado (estilo select nativo: escribir hace scroll al match) |
| `searchMode` | `string` | `"startsWith"` | Modo de coincidencia: `startsWith` (solo al inicio del label) o `includes` (en cualquier parte) |
| `searchResetDelay` | `number` | `1000` | Tiempo (ms) antes de resetear el texto de búsqueda. Se reinicia con cada tecla |
| `loading` | `boolean` | `false` | Muestra una barra de progreso animada en el dropdown |
| `cooldownVariant` | `string` | `"ghost-hover"` | Estilo de la barra de cooldown: `ghost` (suave) o `solid` (color lleno). No se muestra si `loading` está activo |

### Opciones (`options`)

Cada opción del array `options` puede tener:

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `value` | `string` | — | Valor de la opción (lo que se asigna al `modelValue`) |
| `label` | `string` | — | Texto visible |
| `disabled` | `boolean` | `false` | Opción deshabilitada (no clickeable, atenuada) |
| `color` | `string` | hereda del padre | Color semántico individual |
| `variant` | `string` | hereda del padre | Variante individual |

> **Importante:** `options` se asigna como propiedad JS (`select.options = [...]`), no como atributo HTML.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `update:modelValue` | `string` | Se emite cuando cambia el valor seleccionado |
| `select` | `{ value, label }` | Se emite al elegir una opción |
| `close` | — | Se emite cuando se cierra el dropdown |
| `blur` | `FocusEvent` | Pérdida de foco |

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.get()` | Devuelve el valor seleccionado |
| `.set(val: string)` | Asigna un valor (debe existir en `options`) |
| `.reset()` | Limpia la selección |
| `.focus()` | Enfoca el select |
| `.isOpen()` | Estado del dropdown (`boolean`) |
| `.selectedItem()` | Objeto `{ value, label }` de la opción seleccionada o `null` |

## Interfaces

### `SelectOption`

```ts
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string;
  variant?: string;
}
```
