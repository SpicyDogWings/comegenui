# `<cu-checkbox>`

Checkbox personalizado con label.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"ghost"` | `outlined`, `soft`, `ghost`, `subtle`, `none` |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `modelValue` | `boolean` | `false` | Valor controlado |
| `checked` | `boolean` | `false` | Checkeado |
| `label` | `string` | — | Texto junto al checkbox |
| `hightContrast` | `boolean` | `false` | Alto contraste |

## Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `change` | `Event` | Evento nativo de cambio |
| `update:modelValue` | `boolean` | Cambio de valor |

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.get()` | Devuelve el estado (`boolean`) |
| `.set(value)` | Asigna estado |
| `.reset()` | Pone en `false` |
| `.focus()` | Enfoca el checkbox |

## Uso en HTML plano

```html
<script src="dist/CuCheckbox.umd.js"></script>

<cu-checkbox label="Acepto los términos" color="primary" variant="soft"></cu-checkbox>
<cu-checkbox label="Opción deshabilitada" disabled></cu-checkbox>

<script>
  const chk = document.querySelector('cu-checkbox');
  chk.set(true);
  console.log(chk.get()); // true
</script>
```

## Escuchar cambios

```html
<cu-checkbox label="Notificaciones" id="notif"></cu-checkbox>

<script>
  document.getElementById('notif').addEventListener('change', (e) => {
    console.log('Cambió:', e.target.checked);
  });
</script>
```
