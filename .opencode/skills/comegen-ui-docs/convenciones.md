# Convenciones del proyecto

Reglas que aplican a **todos** los `.md` de la skill `comegen-ui`. Cuando documentes un componente nuevo, respetalas.

## Tag y nombre del archivo

- El archivo `.md` se nombra igual que el tag pero con guiones: `<cu-button>` → `cu-button.md`.
- Va en la carpeta `.opencode/skills/comegen-ui/componentes/`.

## Encabezado

```markdown
# `<cu-button>`

Descripción corta (1 línea) de qué hace el componente.

[← Volver](../SKILL.md)

---
```

- El título usa el tag con backticks.
- La descripción es funcional, no técnica ("Botón con soporte de color, variante y link", no "Componente Vue que renderiza un button con props...").
- El link "← Volver" es relativo y va en la línea siguiente a la descripción.
- El `---` separa el encabezado del cuerpo.

## Secciones del cuerpo

Orden recomendado (omití las que no apliquen):

1. **Props** — siempre primero si hay props.
2. **Eventos** — solo si hay eventos custom.
3. **Slots** — solo si hay slots.
4. **Métodos expuestos** — solo si `defineExpose` está en el `.ce.vue`.
5. **Uso en HTML plano** — al menos un ejemplo mínimo.
6. Secciones adicionales específicas del componente (ej: "Posicionamiento" en Select, "Búsqueda" en Table).

## Tabla de Props

```markdown
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"soft"` | `solid`, `outlined`, `soft`, `subtle` |
```

- Los nombres de props en backticks.
- Los tipos en backticks con tipos JS/TS legibles (`string`, `number`, `boolean`, `array`, `object`).
- Los valores válidos en línea con backticks: `` `solid`, `outlined`, `soft`, `subtle` ``.
- Si una prop es específica del componente (no estándar), explicá brevemente en la columna "Descripción".
- Si una prop tiene `validator` en el `.ce.vue`, **mostrá los valores aceptados** (no los inventes).

## Tabla de Eventos

```markdown
| Evento | Payload (`e.detail`) | Descripción |
|--------|----------------------|-------------|
| `update:modelValue` | `string` | Cambio de valor |
| `select` | `{ value, label }` | Opción seleccionada |
```

- **Solo se listan eventos custom** re-emitidos por el `.ce.vue`.
- Los eventos nativos (`click`, `input`, `change`, etc.) **no se listan** salvo que se aclaren abajo en una nota.
- La columna "Payload" debe indicar el tipo del `e.detail` cuando lo emite el `.ce.vue`. Si es `—`, significa que no hay payload.

## Tabla de Slots

```markdown
| Slot | Descripción |
|------|-------------|
| `default` | Contenido del botón |
| `toggle` | Botón disparador (slot HTML nativo) |
```

- El nombre del slot entre backticks.
- Si el slot tiene bindings (caso de `<cu-table>` con `header-{key}`), agregar columna "Bindings".

## Tabla de Métodos

```markdown
| Método | Descripción |
|--------|-------------|
| `.open()` | Abre el modal |
| `.isOpen` (getter) | Estado actual (`boolean`) |
```

- Solo si el `.ce.vue` llama a `defineExpose`.
- Distinguir métodos `()` de getters (sin paréntesis, indicar `(getter)`).
- Incluir args en la descripción si los tiene: `updateRow(index, newData)`.

## Props de tema: convenciones especiales

Los componentes que tienen color semántico (`Alert`, `Badge`, `Button`, `Checkbox`, `Input`, `Switch`, `Textarea`, `Select`, `Autocomplete`, `DropdownMenu`, `Pagination`, `Table`) suelen tener este bloque de props:

| Prop | Comportamiento |
|------|----------------|
| `theme` | Hereda de `<html data-theme>`. Valores: `light`, `dark`, `sigacadv2` |
| `color` | Semántico: `primary`, `neutral`, `success`, `warning`, `danger`. Se traduce a hex según el tema |
| `variant` | Estilo visual (varía por componente, ver [tabla en SKILL.md](../../SKILL.md#sistema-de-color-y-variantes)) |
| `hightContrast` | Modo de alto contraste (typo intencional, ver `doc/notes/02-hightcontrast.md`) |

Usá este bloque cuando aplique, no copies de otros archivos sin verificar el default real.

## Arrays y objetos como propiedades JS

Para props que son `array` u `object`, agregá una nota explícita:

```markdown
> **`items` se asigna como propiedad JS**, no como atributo HTML:
>
> ```js
> const ac = document.getElementById('ac');
> ac.items = [{ label: 'Admin' }];
> ```
```

Aplicá a: `items`, `options`, `columns`, `data`, `filters`, `pageSizeOptions`, `actions`, etc.

**Excepción:** `<cu-table>` acepta `search-fields` como atributo HTML en formato JSON. Documentá esto como caso especial.

## camelCase → kebab-case en HTML

Las props de Vue se declaran en `camelCase` y se exponen en HTML como `kebab-case`. Documentá la forma HTML cuando difiera de la JS:

| camelCase (JS) | kebab-case (HTML) |
|----------------|-------------------|
| `hightContrast` | `hight-contrast` |
| `readOnly` | `readonly` |
| `noResize` | `no-resize` |
| `itemsPerPage` | `items-per-page` |
| `currentPage` | `current-page` |
| `totalPages` | `total-pages` |
| `totalItems` | `total-items` |
| `showPageSize` | `show-page-size` |
| `pageSizeOptions` | `page-size-options` |
| `showFirstAndLast` | `show-first-and-last` |
| `searchEnabled` | `search-enabled` |
| `searchPlaceholder` | `search-placeholder` |
| `searchFields` | `search-fields` |
| `searchValue` | `search-value` |
| `placeholderWrap` | `placeholder-wrap` |
| `modelValue` | `model-value` (en select, input, etc. no se suele usar como atributo) |

> **Convención:** en las tablas del `.md` mostrá la prop en `camelCase` (como está en el `.ce.vue`) y, si difiere, agregá una nota sobre la forma HTML.

## Booleanos en HTML

Los booleanos se usan sin valor o con el nombre del atributo:

```html
<cu-button disabled>...</cu-button>
<cu-alert close>...</cu-alert>
<cu-table pagination search-enabled>...</cu-table>
```

En JS se asignan como boolean:

```js
boton.disabled = true;
tabla.searchEnabled = true;
```

## Atributos booleanos por componente

Lista de props booleanas que existen en los `.ce.vue`:

- `Alert`: `close`, `show`, `hightContrast`
- `Badge`: `hightContrast`
- `Button`: `disabled`, `hightContrast`
- `Checkbox`: `disabled`, `hightContrast`
- `DropdownMenu`: `disabled`, `hightContrast`
- `Input`: `disabled`, `readOnly`, `hightContrast`
- `Label`: `hightContrast`
- `Pagination`: `showPageSize`, `showFirstAndLast`
- `Select`: `placeholderWrap`, `disabled`, `hightContrast`
- `Switch`: `disabled`, `hightContrast`
- `Table`: `pagination`, `showPageSize`, `searchEnabled`, `loading`
- `Textarea`: `disabled`, `readOnly`, `noResize`, `hightContrast`
- `Autocomplete`: `disabled`, `readOnly`, `hightContrast`

## Eventos: nativos vs custom

- **Eventos nativos** del DOM (`click`, `input`, `change`, `focus`, `blur`, `mouseenter`, `keydown`) **burbujean automáticamente** desde el Shadow DOM al host. Se pueden escuchar con `addEventListener` sobre el host sin configuración.
- **Eventos custom** (`update:modelValue`, `select`, `open`, `close`, `edit-save`, etc.) deben ser re-emitidos explícitamente por el `.ce.vue` con `composed: true` para cruzar el Shadow DOM.

> Si documentás que un componente emite `input` o `change`, asegurate de que el `.ce.vue` lo re-emite. Si no, aclará que el evento nativo burbujea pero no hay un evento custom con ese nombre.

## Atribución de `e.detail`

Los eventos custom exponen su payload en `e.detail`:

```js
element.addEventListener('edit-save', (e) => {
  console.log(e.detail); // { row, column, value, index }
});
```

En la tabla de eventos, indicá la forma de `e.detail` en la columna "Payload" o "Payload (`e.detail`)".

## Métodos: `get`/`set`/`reset`/`focus` para forms

Los componentes de formulario (`Input`, `Checkbox`, `Switch`, `Textarea`, `Select`, `Autocomplete`) suelen exponer:

- `.get()` — devuelve el valor actual.
- `.set(value)` — asigna valor.
- `.reset()` — vuelve al `startValue` (o `""`/valor inicial).
- `.focus()` — pone el foco.

`Autocomplete` no expone `.reset()` (es un caso particular). Verificá en el `.ce.vue`.

## Métodos: `open`/`close`/`toggle` para overlays

Los componentes con overlay (`Modal`, `DropdownMenu`) exponen:

- `.open()` — abre.
- `.close()` — cierra.
- `.toggle()` — alterna.
- `.isOpen` (getter) — estado.

Documentá los cuatro si existen.

## Lenguaje y estilo

- **Español** en todas las descripciones y prosa.
- **Tono:** directo, conciso, sin marketing.
- **Cero emojis** salvo que el usuario lo pida.
- **No uses "Vue" en ejemplos de uso**: la doc es para HTML plano + UMD. No importa Vue, no se hace `new Vue({...})`, no se hace `import CuButton from ...`. Solo `<script src="dist/CuButton.umd.js"></script>` y uso directo del tag.
- **No muestres código Vue** (template, ref, reactive, etc.) en los ejemplos. Si necesitás mostrar cómo setear un valor, hacelo con `addEventListener` o asignación a propiedad del DOM.
- Los ejemplos de iconos SVG son OK (los `<cu-button>` aceptan SVG inline), pero no abuses.

## Links relativos

Desde `.opencode/skills/comegen-ui/componentes/cu-xxx.md`:

- Volver a la skill principal: `[← Volver](../SKILL.md)`
- Link a otro componente: `[`<cu-alert>`](cu-alert.md)`

Desde `.opencode/skills/comegen-ui/SKILL.md`:

- Link a un componente: `[`<cu-alert>`](componentes/cu-alert.md)`
- Link a una sección interna: `[Sistema de Temas](#sistema-de-temas)`

## Evitar

- ❌ Explicar cómo se compila (eso es de desarrollo, no de la doc de uso).
- ❌ Mencionar que está hecho con Vue 3 (irrelevante para el consumidor).
- ❌ Tablas de tamaños de bundle en cada `.md` (está en `SKILL.md`).
- ❌ Links a archivos del código fuente.
- ❌ Información sobre el motor de temas interno (`getColorMap`, `getHostTheme`).
