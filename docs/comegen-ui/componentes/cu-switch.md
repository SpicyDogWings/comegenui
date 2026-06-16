# `<cu-switch>`

Toggle switch con soporte de color, tamaños y animación.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `size` | `string` | `"md"` | `sm`, `md` |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `modelValue` | `boolean` | `false` | Estado del toggle |
| `checked` | `boolean` | `false` | Estado alternativo |
| `hightContrast` | `boolean` | `false` | Alto contraste |

## Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `update:modelValue` | `boolean` | Cambio de valor |
| `change` | `boolean` | Cuando cambia el estado |

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.get()` | Devuelve el estado actual |
| `.set(value)` | Asigna un estado |
| `.reset()` | Pone en `false` |
| `.focus()` | Enfoca el switch |

## Uso en HTML plano

```html
<script src="dist/CuSwitch.umd.js"></script>

<cu-switch id="miSwitch" color="primary" size="md"></cu-switch>

<script>
  const sw = document.getElementById('miSwitch');
  sw.set(true);
  console.log(sw.get()); // true
  sw.reset();
</script>
```

## Tamaños

```html
<cu-switch size="sm" color="primary"></cu-switch>
<cu-switch size="md" color="primary"></cu-switch>
```

- `sm`: 32×20px
- `md`: 48×32px

## Escuchar cambios

```html
<cu-switch id="toggle"></cu-switch>

<script>
  document.getElementById('toggle').addEventListener('change', (e) => {
    console.log('Toggle:', e.detail);
  });
</script>
```
