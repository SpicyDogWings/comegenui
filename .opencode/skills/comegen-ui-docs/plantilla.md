# Plantilla de documentación por componente

Copiá esta plantilla y llená cada sección con los datos extraídos del `.ce.vue`. Las secciones entre `[corchetes]` son optativas según el componente.

> **El `.md` se edita a mano** (no hay generación). Ver
> [convenciones.md](convenciones.md#secciones-curadas-vanilla--vista-vue) para el modelo
> vanilla + `## Vista Vue`.

```markdown
# `<cu-NOMBRE>`

Descripción corta (1 línea, funcional, no técnica).

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"soft"` | `solid`, `outlined`, `soft`, `subtle` |
| `hightContrast` | `boolean` | `false` | Modo de alto contraste para el texto |
| `[prop1]` | `[tipo]` | `[default]` | [Descripción] |
| `[prop2]` | `[array` | `[]` | [Descripción. **Se asigna como propiedad JS.**] |

> **Atributos en HTML:** [si hay props camelCase que se transforman a kebab-case, listarlas acá].
>
> **Atributos booleanos:** se usan sin valor: `<cu-NOMBRE prop-bool>`

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|--------|----------------------|-------------|
| `update:modelValue` | `[tipo]` | [Descripción] |
| `[evento1]` | `[tipo]` | [Descripción] |

> Los eventos nativos del DOM (`click`, `input`, `change`, `focus`, `blur`) **burbujean automáticamente** al host desde el Shadow DOM. [Si el `.ce.vue` re-emite alguno como custom, aclaralo acá.]

## Slots

| Slot | Bindings | Descripción |
|------|----------|-------------|
| `default` | — | [Descripción] |
| `[slot1]` | `[bindings si tiene]` | [Descripción. **Slot HTML nativo, usar `slot="..."`.**] |

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.open()` | [Descripción] |
| `.close()` | [Descripción] |
| `.isOpen` (getter) | [Descripción] |

---

## Uso en HTML plano

```html
<script src="dist/CuNOMBRE.umd.js"></script>

<cu-NOMBRE color="primary" variant="soft" id="miComponente">
  Contenido
</cu-NOMBRE>

<script>
  const c = document.getElementById('miComponente');
  // asignar props complejas
  c.items = [...];
  // escuchar eventos
  c.addEventListener('update:modelValue', (e) => console.log(e.detail));
</script>
```

## [Sección específica del componente]

[Aclaraciones sobre posicionamiento, búsqueda, edición, etc. Una sección por feature importante.]
```

---

## Vanilla + Vista Vue

Cada feature se escribe dos veces en la ficha: la parte **vanilla** (arriba, tag HTML +
`<script src="dist/...">` + JS plano) y su equivalente en el apartado **`## Vista Vue`**
(mismas secciones, en el mismo orden, con `<script setup>` + `<template>` y props en vez de
atributos).

- La ficha de un custom element es vanilla + `## Vista Vue`.
- Un componente **sin** custom element no tiene forma vanilla: sólo el uso en Vue.
- Ver [convenciones.md](convenciones.md#secciones-curadas-vanilla--vista-vue).

---

## Variantes por categoría de componente

Algunos `.md` se diferencian por tener secciones adicionales. Esta es una guía rápida:

### Componentes de formulario (`Input`, `Textarea`, `Checkbox`, `Switch`, `Select`, `Autocomplete`)

- Sección "Tipos soportados" (para `Input` y `Autocomplete`).
- Sección "Reset" (para los que tienen `.reset()` y `startValue`).
- Sección "Control programático" (ejemplos de `get`/`set`/`focus`).
- Sección "Posicionamiento" (para `Select` y `Autocomplete` con `position`/`align`/`placement`).

### Componentes de layout / overlay (`Modal`, `DropdownMenu`)

- Sección "Sizes" (Modal).
- Sección "Posicionamiento" (DropdownMenu, Select, Autocomplete).
- Sección "Control programático" (open/close/toggle).
- Sección "Contenido libre" (DropdownMenu, si aplica).

### Componentes de datos (`Table`)

- Sección "Interfaz de columna" (con `interface Column` en TS).
- Sección "Campos extendidos (forwarded)" si la interface del `.ce.vue` no cubre todo.
- Sección "Búsqueda" / "Filtros" / "Ordenamiento" / "Edición" / "Acciones de fila".
- Sección "Sticky header" (con `max-height`).
- Sección "Patrón: ..." (ejemplos avanzados).

### Componentes de presentación (`Badge`, `Button`)

- Sección "Variantes" (ejemplo de cada variant con el color default).
- Sección "Con ícono" (ejemplo de SVG inline).
- Sección "Escuchar clicks" (solo `Button`).

---

## Ejemplo completo: `cu-input.md`

```markdown
# `<cu-input>`

Input de texto con color, variante, tipos de input HTML5 y métodos `get`/`set`/`reset`.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `modelValue` | `string` | `""` | Valor controlado |
| `startValue` | `string` | — | Valor inicial usado por `.reset()` |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"none"` | `outlined`, `soft`, `ghost`, `subtle`, `none` |
| `type` | `string` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `placeholder` | `string` | — | Placeholder del input |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `readOnly` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |
| `hightContrast` | `boolean` | `false` | Modo de alto contraste para el texto |

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|--------|----------------------|-------------|
| `update:modelValue` | `string` | Se emite en cada cambio de valor |

> Los eventos nativos del DOM (`input`, `change`, `focus`, `blur`) **burbujean automáticamente** al host desde el Shadow DOM. No se re-emiten como eventos custom.

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.get()` | Devuelve el valor actual (`string`) |
| `.set(value)` | Asigna un valor |
| `.reset()` | Vuelve al `startValue` (o `""` si no se definió) |
| `.focus()` | Enfoca el input |

---

## Uso en HTML plano

```html
<script src="dist/CuInput.umd.js"></script>

<cu-input placeholder="Nombre" color="primary" variant="outlined"></cu-input>
<cu-input type="email" placeholder="correo@ejemplo.com" variant="soft" id="email"></cu-input>

<script>
  const input = document.getElementById('email');
  input.set('usuario@dominio.com');
  console.log(input.get());
  input.focus();
</script>
```

## Tipos soportados

```html
<cu-input type="text" placeholder="Texto"></cu-input>
<cu-input type="email" placeholder="correo@ejemplo.com"></cu-input>
<cu-input type="number" placeholder="0"></cu-input>
```
```
