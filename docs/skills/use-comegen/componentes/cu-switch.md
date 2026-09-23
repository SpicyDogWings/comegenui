# `<cu-switch>`

Toggle switch con color semántico y dos tamaños. Controlable via `modelValue` o métodos `get`/`set`.

[← Volver](../SKILL.md)

---

---

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

---

## Tamaños

```html
<cu-switch size="sm" color="primary"></cu-switch>
<cu-switch size="md" color="primary"></cu-switch>
```

- `sm`: 32×20px
- `md`: 48×32px

---

## Escuchar cambios

Hay dos formas equivalentes:

```html
<cu-switch id="toggle"></cu-switch>

<script>
  const sw = document.getElementById('toggle');

  // update:modelValue (convención Vue)
  sw.addEventListener('update:modelValue', (e) => {
    console.log('Estado:', e.detail);
  });

  // change (payload = boolean)
  sw.addEventListener('change', (e) => {
    console.log('Toggle a:', e.detail);
  });
</script>
```

---

## Uso con label

El switch no incluye label propio. Combinalo con `<cu-label>` para tener un área clickeable extendida:

```html
<cu-label label="Notificaciones activas">
  <cu-switch id="notif" color="primary"></cu-switch>
</cu-label>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"neutral" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `size` | `"sm" \| "md"` | `"md"` | Tamaño del switch: `sm`, `md` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `label` | `string` | `""` |  |
| `modelValue` | `boolean` | `false` | Estado del toggle (controlado) |

> El Custom Element **no expone** una prop `checked` separada. El control se hace únicamente con `modelValue`. Tampoco tiene props `variant`, `theme` ni `hightContrast`; el tamaño se controla con `size`.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `update:modelValue` | `boolean` | Se emite cuando cambia el estado |
| `change` | `boolean` | Se emite en cada cambio (payload directo = boolean) |

## Slots

| Slot | Descripción |
|------|------|
| `default` |  |

Ninguno.

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.get()` | Devuelve el estado actual del switch. |
| `.set(value: boolean)` | Setea el estado del switch y emite change. |
| `.reset()` | Apaga el switch y emite change. |
| `.focus()` | Enfoca el input nativo. |
