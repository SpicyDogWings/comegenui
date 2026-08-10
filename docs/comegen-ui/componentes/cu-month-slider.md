# `<cu-month-slider>`

Selector de mes con navegación por botones y arrastre. Muestra el mes actual (con el año al lado si no es el año en curso) y permite moverse mes a mes (`<` / `>`) o año a año (`<<` / `>>`, activable por prop). También se puede cambiar de mes arrastrando el label hacia la izquierda (mes siguiente) o derecha (mes anterior).

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `model-value` | `string \| number \| Date` | mes actual | Mes seleccionado (soporta `v-model`). Acepta `Date`, timestamp numérico o string ISO (`"2026-03-01"`) |
| `month-format` | `string` | `"MMMM"` | Formato del label del mes (ver tokens abajo) |
| `year-format` | `string` | `"yyyy"` | Formato del año que se muestra al lado cuando no es el año actual |
| `locale` | `string` | `"es"` | Locale usado por `Intl` para los nombres de mes |
| `year-navigation` | `boolean` | `true` | Muestra/oculta los botones `<<` / `>>` de navegación anual |
| `color` | `string` | `"primary"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `disabled` | `boolean` | `false` | Deshabilita la navegación y el arrastre |

> No expone prop `variant` ni `theme`. El color se controla con `color`.

### Tokens de formato

| Token | Ejemplo (`es`) | Descripción |
|-------|----------------|-------------|
| `MMMM` | `"agosto"` | Nombre completo del mes (locale) |
| `MMM` | `"ago"` | Nombre corto del mes |
| `MM` | `"08"` | Número de mes con cero inicial |
| `M` | `"8"` | Número de mes |
| `yyyy` | `"2026"` | Año con 4 dígitos |
| `yy` | `"26"` | Año con 2 dígitos |

Cualquier otro texto del formato se mantiene literal (`"MM/yyyy"` → `"08/2026"`).

**Año automático:** si `month-format` **no** incluye un token de año (`y`) y el mes seleccionado no pertenece al año en curso, se agrega el año al lado usando `year-format`. Ejemplo: con el default, en 2026 se ve `"agosto"`, pero si navegás a 2025 se ve `"agosto 2025"`.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|--------|----------------------|-------------|
| `change` | `Date` | Se emite al cambiar el mes (botones, teclado o arrastre) |
| `update:modelValue` | `Date` | Se emite con el nuevo mes (para `v-model` en Vue) |

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.nextMonth()` | Avanza un mes |
| `.prevMonth()` | Retrocede un mes |
| `.nextYear()` | Avanza un año |
| `.prevYear()` | Retrocede un año |
| `.goToMonth(value)` | Va a un mes puntual (`string \| number \| Date`) |
| `.getValue()` | Devuelve el mes actual como `Date` (primer día del mes, hora local) |
| `.setValue(value)` | Setea el mes actual (`string \| number \| Date`) |

---

## Uso en HTML plano

```html
<script src="dist/CuMonthSlider.umd.js"></script>

<cu-month-slider></cu-month-slider>
```

### Con mes inicial y año visible

```html
<cu-month-slider model-value="2025-03-01"></cu-month-slider>
```

### Sin navegación de año y con otro formato

```html
<cu-month-slider month-format="MMM yyyy" year-navigation="false" color="success"></cu-month-slider>
```

### Control programático y eventos

```html
<cu-month-slider id="mes"></cu-month-slider>

<script>
  const mes = document.getElementById('mes');
  mes.addEventListener('change', (e) => console.log('nuevo mes:', e.detail));
  mes.nextMonth();
  mes.prevYear();
  mes.goToMonth('2030-06-01');
  console.log(mes.getValue());
</script>
```

### Drag del label

El label responde a Pointer Events (mouse y touch): arrastrá hacia la **izquierda** para pasar al mes siguiente y hacia la **derecha** para volver al anterior. También se puede navegar con las flechas `←` / `→` cuando el label tiene foco.
