# Tabs — `<cu-tabs>` / `<Tabs>`

Pestañas con variantes, iconos, tabs deshabilitadas individuales y control programático, con paneles asociados por `key`.

## Cuándo usarlo

Para alternar entre paneles alternativos en el mismo lugar. Si cada pestaña tiene que cambiar
la URL o navegar a otra ruta, no es la herramienta.

## Receta

1. Pasá `tabs` (array requerido) de `{ key, label, icon?, disabled?, keepAlive? }`; en HTML
   asignalo como propiedad JS.
2. El contenido de cada panel va en un slot con el **nombre de la key**
   (`slot="general"` en HTML, `<template #general>` en Vue).
3. El ícono de cada tab puede venir del campo `icon` (string HTML) o del slot
   `tab-icon-{key}`.
4. Controlá el activo con `v-model`/`model-value` + `update:modelValue`; escuchá `change`
   (payload = key).
5. `keepAlive: true` en un tab mantiene su panel montado (con `v-show`) y conserva el estado
   de los componentes internos.
6. Programático: `getActive()`, `setActive(key)`, `next()`, `prev()`. Teclado: ←/→, `Home` y `End`.

```html
<!-- HTML plano (UMD) -->
<script src="dist/CuTabs.core.umd.js"></script>

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

    tabs.addEventListener('change', (e) => console.log('Tab activo:', e.detail));
    tabs.setActive('advanced');
    console.log(tabs.getActive()); // "advanced"
  });
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";
import { ref } from "vue";

const active = ref("general");
const tabs = [
  { key: "general", label: "General" },
  { key: "advanced", label: "Advanced", keepAlive: true },
  { key: "locked", label: "Locked", disabled: true },
];
</script>

<template>
  <Tabs v-model="active" variant="solid" color="primary" :tabs="tabs" @change="(k) => console.log(k)">
    <template #general>Contenido General</template>
    <template #advanced>Contenido Advanced</template>
    <template #locked>Contenido Locked</template>
  </Tabs>
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores, 4 variantes (`ghost`, `solid`, `boxed`, `soft`) y 3 tamaños (`sm`, `md`,
`lg`); icono por `icon` (string HTML) o slot `tab-icon-{key}`; tabs deshabilitadas por item y
`disabled` global; `keepAlive` por tab; navegación accesible por teclado (flechas, Home, End)
con roles ARIA; y `getActive`/`setActive`/`next`/`prev`.

**No puede:**

- **Sólo hay slots por key y `tab-icon-{key}`:** no existe header, footer, badge ni slot para
  el contenido del encabezado.
- **El slot del panel depende de la `key`:** si no coincide con ninguna tab, no se renderiza.
- **`tabs` es un array:** se asigna como propiedad JS, no como atributo HTML.
- **`setActive` ignora keys inexistentes y tabs deshabilitadas:** no cambia el activo.
- **`keepAlive` usa `v-show`, no `<KeepAlive>`:** mantiene el panel montado, pero no es una
  caché semántica de componentes.
- **No expone el activo como propiedad reactiva:** se lee con `getActive()`.
- **`icon` es HTML crudo** (`v-html`), no un componente ni un nodo Vue.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"primary"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "soft" \| "ghost" \| "boxed"` | `"ghost"` | `ghost`, `solid`, `boxed`, `soft` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | `sm`, `md`, `lg` |
| `disabled` | `boolean` | `—` | Deshabilita todas las pestañas |
| `model-value` | `string` | `""` | Key del tab activo (controlado) |
| `tabs` | `{ key: string; label: string; icon?: string \| undefined; disabled?: boolean \| undefined; keepAlive?: boolean \| undefined; }[]` | `[]` | Definición de las pestañas |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `string` | — |
| `change` | — | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `getActive` | Devuelve la key del tab activo |
| `setActive` | Activa el tab con esa key |
| `next` | Activa el próximo tab habilitado |
| `prev` | Activa el tab anterior habilitado |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"primary"` | — |
| `variant` | `"solid" \| "soft" \| "ghost" \| "boxed"` | `"ghost"` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | — |
| `disabled` | `boolean` | `false` | — |
| `tabs` | `TabItem[]` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `string` | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `getActive` | Devuelve la clave del tab activo. |
| `setActive` | Activa el tab con la clave indicada. |
| `next` | Avanza al siguiente tab habilitado. |
| `prev` | Retrocede al tab habilitado anterior. |
<!-- /@api:expose -->
