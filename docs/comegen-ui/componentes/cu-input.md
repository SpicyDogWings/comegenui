# `<cu-input>`

Campo de texto con soporte de color y variantes.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"ghost"` | `outlined`, `soft`, `ghost`, `subtle`, `none` |
| `type` | `string` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `placeholder` | `string` | — | Placeholder |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `readOnly` | `boolean` | `false` | Solo lectura |
| `modelValue` | `string` | `""` | Valor controlado |
| `startValue` | `string` | — | Valor inicial |
| `hightContrast` | `boolean` | `false` | Alto contraste |

## Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `change` | `Event` | Cambio nativo |
| `input` | `Event` | Input nativo |

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.get()` | Devuelve el valor actual (`string`) |
| `.set(value)` | Asigna un valor |
| `.reset()` | Limpia el valor |
| `.focus()` | Enfoca el input |

## Uso en HTML plano

```html
<script src="dist/CuInput.umd.js"></script>

<cu-input placeholder="Nombre" color="primary" variant="outlined"></cu-input>
<cu-input type="email" placeholder="correo@ejemplo.com" variant="soft" id="email"></cu-input>
<cu-input disabled value="No editable"></cu-input>

<script>
  const input = document.getElementById('email');
  input.set('usuario@dominio.com');
  console.log(input.get());
  input.focus();
</script>
```
