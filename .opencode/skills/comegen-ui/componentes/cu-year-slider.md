# `<cu-year-slider>`

Selector de año con navegación por botones y arrastre. Muestra el año actual y permite moverse de 1 en 1 con `<` / `>` (no usa `<<` / `>>` porque los años van de uno en uno). El label también responde al **arrastre**: deslizá hacia la izquierda para pasar al año siguiente y hacia la derecha para volver al anterior (un gesto = un año). Soporta límites mínimos/máximos y las mismas variantes de color que el resto de la librería.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `model-value` | `number` \| `string` | año actual | Año seleccionado (soporta `v-model`). Acepta número o string numérico (`"2025"`) |
| `variant` | `string` | `"soft"` | Variante del label: `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `min` | `number` | — | Año mínimo navegable (el botón `<` se deshabilita al llegar al borde) |
| `max` | `number` | — | Año máximo navegable (el botón `>` se deshabilita al llegar al borde) |
| `color` | `string` | `"primary"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `disabled` | `boolean` | `false` | Deshabilita la navegación |

> No expone prop `theme`. El color se controla con `color` y el estilo del label con `variant`.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|--------|----------------------|-------------|
| `change` | `number` | Se emite al cambiar el año (botones o programático) |
| `update:modelValue` | `number` | Se emite con el nuevo año (para `v-model` en Vue) |

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.nextYear()` | Avanza un año |
| `.prevYear()` | Retrocede un año |
| `.goToYear(value)` | Va a un año puntual (`number`), recortado por `min`/`max` |
| `.getValue()` | Devuelve el año actual como `number` |
| `.setValue(value)` | Setea el año actual (`number`) |

---

## Uso en HTML plano

```html
<script src="dist/CuYearSlider.umd.js"></script>

<cu-year-slider></cu-year-slider>
```

### Con año inicial y límites

```html
<cu-year-slider model-value="2025" min="2020" max="2030"></cu-year-slider>
```

### Variante y color

```html
<cu-year-slider variant="outlined" color="success"></cu-year-slider>
```

### Control programático y eventos

```html
<cu-year-slider id="anio"></cu-year-slider>

<script>
  const anio = document.getElementById('anio');
  anio.addEventListener('change', (e) => console.log('nuevo año:', e.detail));
  anio.nextYear();
  anio.goToYear(2030);
  console.log(anio.getValue());
</script>
```

## Drag del label

El label responde a Pointer Events (mouse y touch): arrastrá hacia la **izquierda** para pasar al año siguiente y hacia la **derecha** para volver al anterior. Hay que arrastrar **bastante** (umbral fijo, ~96 px, igual que el month-slider) para que cambie, y **un gesto = un año**. También se puede navegar con las flechas `←` / `→` cuando el label tiene foco.
