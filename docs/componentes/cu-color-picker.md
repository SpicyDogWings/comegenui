# `<cu-color-picker>`

Selector de color con swatch y campo de texto hex. Al hacer click en el swatch se abre el color picker nativo del navegador; el campo de texto permite escribir un `#RRGGBB` manualmente.

[← Volver](../README.md)

## Uso en HTML plano

```html
<script src="dist/CuColorPicker.umd.js"></script>

<cu-color-picker id="miColor" color="primary"></cu-color-picker>

<script>
  const cp = document.getElementById('miColor');
  cp.set('#ff5733');
  console.log(cp.get()); // "#ff5733"

  cp.addEventListener('change', (e) => {
    console.log('Color elegido:', e.detail);
  });
</script>
```

---

## Valor controlado

```html
<cu-color-picker value="#1774A4" id="colorForm"></cu-color-picker>

<script>
  const cp = document.getElementById('colorForm');
  cp.addEventListener('update:modelValue', (e) => {
    document.body.style.borderColor = e.detail;
  });
</script>
```

---

## Deshabilitado

```html
<cu-color-picker disabled value="#dc3545"></cu-color-picker>
```

---

## Notas

- El campo de texto solo confirma el valor cuando es un hex válido (`#RRGGBB`). Si el valor no es válido al perder el foco, se restaura el último color válido.
- El swatch muestra el color actual de `modelValue`.

---

## Atributos

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `modelValue` | `string` | `"#000000"` | Valor del color en formato hex (`#RRGGBB`) |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` (define el acento del borde/foco) |
| `disabled` | `boolean` | `false` | Deshabilita el control |

> El Custom Element **no expone** prop `theme`, `variant` ni `hightContrast`.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `update:modelValue` | `string` | Se emite al cambiar el color (vía swatch o texto válido) |
| `change` | `string` | Se emite en cada cambio de color confirmado (mismo payload que `update:modelValue`) |

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.get()` | Devuelve el color actual (`string` hex) |
| `.set(val: string)` | Asigna un color programáticamente |
| `.reset()` | Vuelve al valor por defecto `#000000` |
| `.focus()` | Enfoca el campo de texto |
