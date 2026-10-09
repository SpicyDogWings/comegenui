# Label — `<cu-label>` / `<Label>`

Label con color semántico que enfoca el control hijo (o el elemento de `for`) al hacer clic, para
ganar área clickeable.

## Cuándo usarlo

Para etiquetar un control de formulario (`Input`, `Checkbox`, `Switch`) y que todo el texto sea
clickeable. No es para texto decorativo suelto.

## Receta

1. Poné el texto con `label` (modo declarativo) o pasalo por el slot default.
2. Envolvé el control como hijo: al hacer clic en el label, el control se enfoca.
3. Si el control está fuera del label, apuntá con `for="id"` al elemento a enfocar.
4. Coloreá con `color` (default `neutral`).
5. En Vue, `@click` escucha el click; en vanilla, el click nativo burbujea desde el shadow DOM.

```html
<!-- HTML plano (UMD) -->
<cu-label label="Correo electrónico" color="primary">
  <cu-input type="email" placeholder="correo@ejemplo.com"></cu-input>
</cu-label>

<cu-label for="nombre" label="Nombre"></cu-label>
<input id="nombre" type="text" />

<script src="dist/CuLabel.core.umd.js"></script>
<script src="dist/CuInput.core.umd.js"></script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Label from "@/components/form/Label.vue";
import Input from "@/components/form/Input.vue";
</script>

<template>
  <Label label="Correo electrónico" color="primary">
    <Input type="email" placeholder="correo@ejemplo.com" />
  </Label>

  <Label for="nombre" label="Nombre" />
  <input id="nombre" type="text" />
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`), el texto
por `label` o por slot, y `for` para apuntar a un elemento externo. El clic enfoca el hijo o el
elemento apuntado.

**No puede:**

- **No tiene `variant` ni `size`.** Sólo se controla el color.
- **`hight-contrast` no hace nada.** Está declarado y reenviado, pero el `.vue` no lo usa: no cambia
  el contraste.
- **No expone métodos.**
- **No emite eventos custom en el CE.** El `click` que escuchás es el nativo; el `defineEmits('click')`
  del `.vue` interno no se bridgea a un `CustomEvent`.
- **No acepta `theme`.** El tema se define en `<html data-theme="...">`.
- **El foco depende de que el hijo sea focusable.** Con contenido no focusable el clic no enfoca
  nada.
- **Con `for`, el foco es global al documento:** el id tiene que existir y ser único.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del texto; se resuelve vía el token `--cu-color-{color}` |
| `label` | `string` | `""` | Texto del label (modo declarativo) |
| `for` | `string` | `""` | ID del elemento a enfocar al hacer clic (atributo HTML `for`) |
| `hight-contrast` | `boolean` | `false` | Modo de alto contraste para el texto |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
Ninguno.
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
No expone métodos.
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `label` | `string` | `""` | — |
| `for` | `string` | `""` | — |
| `hightContrast` | `boolean` | `false` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `click` | — | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
