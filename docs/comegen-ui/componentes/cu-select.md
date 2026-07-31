# `<cu-select>`

Selector de opciones con color, variante, ícono chevron, opciones deshabilitadas y posicionamiento configurable. Controlable via `modelValue` o métodos `get`/`set`.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `modelValue` | `string` | `""` | Valor seleccionado |
| `options` | `array` | `[]` | Opciones del select (ver abajo). Se asigna como propiedad JS |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `placeholder` | `string` | — | Texto mostrado cuando no hay selección |
| `placeholderWrap` | `boolean` | `false` | Si `true`, el texto wrappea; si `false`, se trunca con `...` (atributo HTML: `placeholder-wrap`) |
| `position` | `string` | `"bottom"` | Posición del dropdown: `bottom`, `top` |
| `align` | `string` | `"start"` | Alineación: `start`, `center`, `end` |
| `placement` | `string` | `""` | Shorthand (`bottom-start`, etc.). Si se define, sobrescribe `position` y `align` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `hightContrast` | `boolean` | `false` | Modo de alto contraste para el texto |

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
|--------|----------------------|-------------|
| `update:modelValue` | `string` | Se emite cuando cambia el valor seleccionado |
| `select` | `{ value, label }` | Se emite al elegir una opción |
| `close` | — | Se emite cuando se cierra el dropdown |
| `blur` | `FocusEvent` | Pérdida de foco |

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.get()` | Devuelve el valor seleccionado |
| `.set(value)` | Asigna un valor (debe existir en `options`) |
| `.reset()` | Limpia la selección |
| `.focus()` | Enfoca el select |
| `.isOpen()` | Estado del dropdown (`boolean`) |
| `.selectedItem()` | Objeto `{ value, label }` de la opción seleccionada o `null` |

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

## Posicionamiento

```html
<!-- Con position + align separados -->
<cu-select position="bottom" align="end"></cu-select>
<cu-select position="top" align="center"></cu-select>

<!-- O con placement shorthand -->
<cu-select placement="bottom-end"></cu-select>
<cu-select placement="top-start"></cu-select>
```
