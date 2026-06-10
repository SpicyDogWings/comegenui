# `<cu-textarea>`

Área de texto multilínea.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"none"` | `outlined`, `soft`, `ghost`, `subtle`, `none` |
| `placeholder` | `string` | — | Placeholder |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `readOnly` | `boolean` | `false` | Solo lectura |
| `rows` | `number` | `3` | Número de filas |
| `noResize` | `boolean` | `false` | Deshabilita redimensionar |
| `modelValue` | `string` | `""` | Valor controlado |
| `startValue` | `string` | — | Valor inicial |

## Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `change` | `Event` | Cambio nativo |
| `input` | `Event` | Input nativo |

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.get()` | Devuelve el valor actual |
| `.set(value)` | Asigna un valor |
| `.reset()` | Limpia el valor |
| `.focus()` | Enfoca el textarea |

## Uso en HTML plano

```html
<script src="dist/CuTextarea.umd.js"></script>

<cu-textarea placeholder="Escribe aquí..." rows="5" color="primary" variant="outlined"></cu-textarea>
<cu-textarea no-resize variant="soft" id="comentarios"></cu-textarea>

<script>
  const ta = document.getElementById('comentarios');
  ta.set('Texto predefinido');
  console.log(ta.get());
</script>
```
