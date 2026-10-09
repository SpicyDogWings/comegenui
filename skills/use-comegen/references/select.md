# Select — `<cu-select>` / `<Select>`

Selector de opciones de lista cerrada con color, variante, color/variante por opción, búsqueda por teclado, estado de carga y control programático.

## Cuándo usarlo

Para elegir una opción de un conjunto fijo. Si el usuario tiene que filtrar resultados por
escritura sobre un input visible, usá `cu-autocomplete`.

## Receta

1. Definí `options` como array de `{ value, label, disabled?, color?, variant? }` y asignalo
   como propiedad JS.
2. El valor lo maneja el propio select: al elegir una opción se refleja solo. Enlazá
   `modelValue` sólo si querés controlarlo (`v-model` en Vue). Escuchá
   `select` para recibir la opción completa (`{ value, label, ... }`), o `change`
   para el valor nuevo (string, como un `<select>` nativo).
3. `placeholder` se muestra cuando no hay selección; `placeholder-wrap` decide si el texto
   wrappea o se trunca con `...`.
4. Para la búsqueda estilo `<select>` nativo activá `search-enabled`; `search-mode` elige
   `startsWith` (default) o `includes`, y `search-reset-delay` define el reset (1000 ms).
5. Mientras cargás datos, `loading` muestra una barra animada y atenúa el panel; anula la
   barra de cooldown del search.
6. Programático: `get()`, `set(v)`, `reset()`, `focus()`, `isOpen()`, `selectedItem()`.
7. Posicioná el dropdown con `position`, `align` y `fixed`.

```html
<!-- HTML plano (UMD) -->
<script src="dist/CuSelect.core.umd.js"></script>

<cu-select id="miSelect" placeholder="Seleccione una opción" color="primary" variant="outlined"></cu-select>

<script>
  const select = document.getElementById('miSelect');
  select.options = [
    { value: 'doc', label: 'Documento' },
    { value: 'pdf', label: 'PDF', disabled: true },
    { value: 'csv', label: 'CSV' },
  ];

  select.addEventListener('select', (e) => console.log('Opción:', e.detail));
  select.addEventListener('update:modelValue', (e) => console.log('Valor:', e.detail));

  select.set('csv');
  console.log(select.get()); // "csv"
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Select from "@/components/form/Select.vue";
import { ref } from "vue";

const value = ref("doc");
const opciones = [
  { value: "doc", label: "Documento" },
  { value: "pdf", label: "PDF", disabled: true },
  { value: "csv", label: "CSV" },
];

function onSelect(option: { value: string; label: string }) {
  console.log("Seleccionado:", option);
}
</script>

<template>
  <Select
    v-model="value"
    :options="opciones"
    placeholder="Seleccione una opción"
    color="primary"
    variant="outlined"
    @select="onSelect"
  />
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores y 4 variantes (`outlined`, `soft`, `ghost`, `subtle`), color y variante
por opción (si no, hereda del select), `disabled` global y por opción, `placeholder` con
truncado o wrap, posicionamiento (`position`, `align`, `fixed`), búsqueda por teclado
(`searchEnabled` + `searchMode` + `searchResetDelay`) con barra de cooldown, `loading` con
barra animada, y los métodos `get`/`set`/`reset`/`focus`/`isOpen`/`selectedItem`.

**No puede:**

- **No tiene slots:** las opciones son datos, no markup (el `label` se renderiza como texto).
- **No hay una caja de búsqueda visible:** `searchEnabled` es type-ahead sobre un input oculto,
  no un filtro escrito en el trigger; sólo hace scroll al primer match.
- **`options` es un array:** se asigna como propiedad JS, no como atributo HTML.
- **`variant` es de formulario:** no admite `solid`, `link` ni `none`.
- **No expone `open()`/`close()`:** sólo `isOpen()` para consultar.
- **`reset()` limpia a `""`**, no vuelve a un valor inicial.
- **No es un `<select>`/`<input>` nativo con `name`:** no participa del submit de un `<form>`.
- `cooldownVariant` acepta `ghost-hover` (default, barra suave) o `solid` (color lleno); no
  tiene validador, así que un valor raro simplemente no cambia la barra.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `search-enabled` | `boolean` | `false` | Activa búsqueda por teclado (estilo select nativo: escribir hace scroll al match) |
| `loading` | `boolean` | `false` | Muestra una barra de progreso animada en el dropdown |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `position` | `string` | `"bottom"` | Posición del dropdown: `bottom`, `top` |
| `align` | `string` | `"start"` | Alineación: `start`, `center`, `end` |
| `fixed` | `boolean` | `false` | Si es `true`, el dropdown usa `position: fixed` en vez de absoluto |
| `model-value` | `string` | `""` | Valor seleccionado. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `text-align` | `"center" \| "left" \| "right"` | `"left"` | Alineación del texto seleccionado: `left`, `center`, `right` |
| `search-mode` | `"includes" \| "startsWith"` | `"startsWith"` | Modo de coincidencia: `startsWith` (solo al inicio del label) o `includes` (en cualquier parte) |
| `options` | `SelectOption[]` | `[]` | Opciones del select (ver abajo). Se asigna como propiedad JS |
| `placeholder-wrap` | `boolean` | `false` | Si `true`, el texto wrappea; si `false`, se trunca con `...` (atributo HTML: `placeholder-wrap`) |
| `search-reset-delay` | `number` | `1000` | Tiempo (ms) antes de resetear el texto de búsqueda. Se reinicia con cada tecla |
| `cooldown-variant` | `string` | `"ghost-hover"` | Estilo de la barra de cooldown: `ghost` (suave) o `solid` (color lleno). No se muestra si `loading` está activo |
| `placeholder` | `string` | `—` | Texto mostrado cuando no hay selección |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | — | — |
| `select` | — | — |
| `change` | — | — |
| `close` | — | — |
| `blur` | — | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | — |
| `set` | — |
| `reset` | — |
| `focus` | — |
| `isOpen` | Indica si el panel está abierto. |
| `selectedItem` | Devuelve la opción seleccionada o null. |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `searchEnabled` | `boolean` | `false` | — |
| `loading` | `boolean` | `false` | — |
| `disabled` | `boolean` | `false` | — |
| `placeholder` | `string` | `""` | — |
| `position` | `string` | `"bottom"` | — |
| `align` | `string` | `"start"` | — |
| `fixed` | `boolean` | `false` | — |
| `modelValue` | `string` | `""` | — |
| `textAlign` | `"center" \| "left" \| "right"` | `"left"` | — |
| `searchMode` | `"includes" \| "startsWith"` | `"startsWith"` | — |
| `options` | `SelectOption[]` | `[]` | — |
| `placeholderWrap` | `boolean` | `false` | — |
| `searchResetDelay` | `number` | `1000` | — |
| `cooldownVariant` | `string` | `"ghost-hover"` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `select` | — | — |
| `close` | — | — |
| `update:modelValue` | — | — |
| `change` | — | — |
| `blur` | — | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el valor seleccionado. |
| `set` | Setea el valor seleccionado y emite `change`. |
| `reset` | Limpia la selección y emite `change`. |
| `focus` | Enfoca el trigger del select. |
| `isOpen` | Indica si el panel está abierto. |
| `selectedItem` | Devuelve la opción seleccionada o null. |
<!-- /@api:expose -->
