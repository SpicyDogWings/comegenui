[← Volver](../README.md)

# `Checkbox`

Checkbox con label. Mantiene su estado y también se controla via `modelValue` o métodos `get`/`set`.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuCheckbox.umd.js"></script>

<cu-checkbox label="Acepto los términos" color="primary"></cu-checkbox>
<cu-checkbox label="Opción deshabilitada" disabled></cu-checkbox>

<script>
  const chk = document.querySelector('cu-checkbox');
  chk.set(true);
  console.log(chk.get()); // true
</script>
```

<!-- demo:checkbox-uso -->

En Vue, importá `Checkbox` de `@/components/form/Checkbox.vue` (ver [ficha Vue](/componentes/vue/checkbox)).

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`). Los 6 valores son `primary`, `secondary`, `neutral` (**default**),
`success`, `warning` y `danger`.

```html
<cu-checkbox label="primary" color="primary" model-value></cu-checkbox>
<cu-checkbox label="secondary" color="secondary" model-value></cu-checkbox>
<cu-checkbox label="neutral" color="neutral" model-value></cu-checkbox>
<cu-checkbox label="success" color="success" model-value></cu-checkbox>
<cu-checkbox label="warning" color="warning" model-value></cu-checkbox>
<cu-checkbox label="danger" color="danger" model-value></cu-checkbox>
```

<!-- demo:checkbox-colores -->

## Tamaños

`size` acepta `sm` y `md` (**default**), y cambia el tamaño de la caja y de la etiqueta.

```html
<cu-checkbox label="sm" size="sm" model-value></cu-checkbox>
<cu-checkbox label="md (default)" size="md" model-value></cu-checkbox>
```

<!-- demo:checkbox-tamanos -->

## Estado deshabilitado

`disabled` atenúa el checkbox, bloquea el click y muestra cursor `not-allowed`, marcado o
no. `label` es el texto de al lado y es opcional: sin él, el checkbox queda solo.

```html
<cu-checkbox label="Deshabilitado (marcado)" model-value disabled></cu-checkbox>
<cu-checkbox label="Deshabilitado (sin marcar)" disabled></cu-checkbox>
```

<!-- demo:checkbox-deshabilitado -->

## Escuchar cambios

Hay dos formas equivalentes de escuchar cambios (el checkbox ya se mueve solo; estos
listeners son para reaccionar):

```html
<cu-checkbox label="Notificaciones" id="notif"></cu-checkbox>

<script>
  const cb = document.getElementById('notif');

  // Vía update:modelValue (convención Vue)
  cb.addEventListener('update:modelValue', (e) => {
    console.log('Valor:', e.detail);
  });

  // Vía change (payload = boolean)
  cb.addEventListener('change', (e) => {
    console.log('Cambió a:', e.detail);
  });
</script>
```

<!-- demo:checkbox-cambios -->

## Control programático

```html
<cu-checkbox id="auto" label="Acepto"></cu-checkbox>

<script>
  const cb = document.getElementById('auto');
  cb.set(true);     // marcar
  cb.set(false);    // desmarcar
  cb.reset();       // equivale a cb.set(false)
  cb.focus();       // foco
  console.log(cb.get()); // estado actual
</script>
```

<!-- demo:checkbox-control-programatico -->

## Atributos

<!--@include: ../partials/checkbox/props-vanilla.md-->

> El Custom Element **no expone** una prop `checked` separada (el control se hace únicamente con `modelValue`), ni una prop `variant` (el estilo se fija con `size` y `color`).

## Eventos

<!--@include: ../partials/checkbox/eventos.md-->

## Slots

<!--@include: ../partials/checkbox/slots.md-->

## Métodos expuestos

<!--@include: ../partials/checkbox/metodos-vanilla.md-->
