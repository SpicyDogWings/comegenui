[← Volver](../README.md)

# `<cu-color-picker>`

Selector de color con swatch y campo de texto hex. Al hacer click en el swatch se abre el color picker nativo del navegador; el campo de texto permite escribir un `#RRGGBB` manualmente.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuColorPicker.umd.js"></script>

<cu-color-picker id="miColor" color="primary"></cu-color-picker>

<script>
  const cp = document.getElementById('miColor');
  cp.addEventListener('change', (e) => {
    console.log('Color elegido:', e.detail);
  });
</script>
```

<!-- demo:color-picker-uso -->

En Vue, importá `ColorPicker` de `@/components/form/ColorPicker.vue` (ver [ficha Vue](/componentes/vue/color-picker)).

## Colores

`color` es un nombre semántico que define el acento del borde/foco. Los 6 valores son
`primary`, `secondary`, `neutral` (**default**), `success`, `warning` y `danger`.

```html
<cu-color-picker color="primary" model-value="#3b82f6"></cu-color-picker>
<cu-color-picker color="secondary" model-value="#3b82f6"></cu-color-picker>
<cu-color-picker color="neutral" model-value="#3b82f6"></cu-color-picker>
<cu-color-picker color="success" model-value="#3b82f6"></cu-color-picker>
<cu-color-picker color="warning" model-value="#3b82f6"></cu-color-picker>
<cu-color-picker color="danger" model-value="#3b82f6"></cu-color-picker>
```

<!-- demo:color-picker-colores -->

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

<!-- demo:color-picker-valor-y-modo-controlado -->

## Deshabilitado

```html
<cu-color-picker disabled model-value="#dc3545"></cu-color-picker>
```

<!-- demo:color-picker-deshabilitado -->

## Control programático

```html
<cu-color-picker id="cp" color="primary" model-value="#3b82f6"></cu-color-picker>

<script>
  const cp = document.getElementById('cp');
  cp.get();              // "#3b82f6"
  cp.set('#ff8800');     // asigna un color
  cp.reset();            // vuelve al default "#000000"
  cp.focus();            // enfoca el campo de texto
</script>
```

<!-- demo:color-picker-control-programatico -->

## Notas

- El campo de texto solo confirma el valor cuando es un hex válido (`#RRGGBB`). Si el valor no es válido al perder el foco, se restaura el último color válido.
- El swatch muestra el color actual de `modelValue`.

## Atributos

<!--@include: ../partials/color-picker/props-vanilla.md-->

> El Custom Element **no expone** prop `theme`, `variant` ni `hightContrast`.

## Eventos

<!--@include: ../partials/color-picker/eventos.md-->

## Slots

<!--@include: ../partials/color-picker/slots.md-->

## Métodos expuestos

<!--@include: ../partials/color-picker/metodos-vanilla.md-->
