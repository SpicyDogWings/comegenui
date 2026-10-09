# `<cu-color-picker>`

Selector de color con swatch y campo de texto hex. Al hacer click en el swatch se abre el color picker nativo del navegador; el campo de texto permite escribir un `#RRGGBB` manualmente.

[← Volver](../README.md)

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuColorPicker.umd.js"></script>

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

## Valor y modo controlado

Por defecto el control mantiene su color al elegir. Si querés decidir el valor vos, reasigná
`modelValue` en el evento:

```html
<cu-color-picker id="colorForm"></cu-color-picker>

<script>
  const cp = document.getElementById('colorForm');
  // Modo controlado: escuchás el cambio y decidís qué color queda.
  cp.addEventListener('update:modelValue', (e) => {
    document.body.style.borderColor = e.detail;
  });
</script>
```

---

## Deshabilitado

```html
<cu-color-picker disabled model-value="#dc3545"></cu-color-picker>
```

---

## Notas

- El campo de texto solo confirma el valor cuando es un hex válido (`#RRGGBB`). Si el valor no es válido al perder el foco, se restaura el último color válido.
- El swatch muestra el color actual de `modelValue`.

---

## Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` (define el acento del borde/foco) |
| `disabled` | `boolean` | `false` | Deshabilita el control |
| `model-value` | `string` | `"#000000"` | Valor del color en formato hex (`#RRGGBB`) |
<!-- /@api:atributos -->

> El Custom Element **no expone** prop `theme`, `variant` ni `hightContrast`.

## Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `string` | — |
| `change` | — | — |
<!-- /@api:eventos -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el color actual (`string` hex) |
| `set` | Asigna un color programáticamente |
| `reset` | Vuelve al valor por defecto `#000000` |
| `focus` | Enfoca el campo de texto |
<!-- /@api:metodos -->
