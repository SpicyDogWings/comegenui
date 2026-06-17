# `<cu-select>`

Selector de opciones con soporte de color, variante e ícono chevron.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"none"` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `placeholder` | `string` | — | Placeholder |
| `placeholder-wrap` | `boolean` | `false` | Si `true`, el texto del label wrappea; si `false`, se trunca con `...` |
| `placement` | `string` | `"bottom-start"` | `bottom-start`, `bottom-end`, `top-start`, `top-end` |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `options` | `array` | `[]` | Opciones `[{ value, label, disabled?, color?, variant? }]` |
| `modelValue` | `string` | `""` | Valor seleccionado |
| `hightContrast` | `boolean` | `false` | Alto contraste |

### Propiedades de cada opción (`options`)

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `value` | `string` | — | Valor de la opción |
| `label` | `string` | — | Texto visible |
| `disabled` | `boolean` | `false` | Opción deshabilitada (no clickeable, atenuada visualmente) |
| `color` | `string` | hereda del padre | Color semántico individual |
| `variant` | `string` | hereda del padre | Variante individual |

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.get()` | Devuelve el valor seleccionado |
| `.set(value)` | Asigna un valor |
| `.reset()` | Limpia la selección |
| `.focus()` | Enfoca el select |
| `.selectedItem` | Objeto `{ value, label }` de la opción seleccionada o `null` |

## Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `select` | `{ value, label }` | Opción seleccionada |
| `close` | — | Menú cerrado |
| `blur` | `FocusEvent` | Pérdida de foco |

## Uso en HTML plano

```html
<script src="dist/CuSelect.umd.js"></script>

<cu-select id="miSelect" placeholder="Seleccione una opción" color="primary" variant="outlined"></cu-select>

<script>
  const select = document.getElementById('miSelect');
  select.options = [
    { value: 'doc', label: 'Documento' },
    { value: 'pdf', label: 'PDF' },
  ];
  select.set('pdf');
  console.log(select.get()); // "pdf"
</script>
```

> **Nota:** `options` se pasa como propiedad DOM (no atributo) porque es un array.

## Opciones deshabilitadas

```html
<cu-select id="miSelect" placeholder="Elige un formato"></cu-select>

<script>
  const select = document.getElementById('miSelect');
  select.options = [
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'Documento', disabled: true },
    { value: 'csv', label: 'CSV', disabled: true },
    { value: 'xlsx', label: 'Excel' },
  ];
</script>
```

Las opciones con `disabled: true` se ven atenuadas (`opacity-50`) y no responden al click.

## Opciones con color y variante individual

```html
<cu-select id="miSelect"></cu-select>

<script>
  const select = document.getElementById('miSelect');
  select.options = [
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
    console.log('Seleccionado:', e.detail);
  });
</script>
```
