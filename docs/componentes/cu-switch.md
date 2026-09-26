# `<cu-switch>`

Toggle switch con color semántico y dos tamaños. Controlable via `modelValue` o métodos `get`/`set`.

[← Volver](../README.md)

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

---

## Atributos

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `modelValue` | `boolean` | `false` | Estado del toggle (controlado) |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `size` | `"sm" \| "md"` | `"md"` | Tamaño del switch: `sm`, `md` |
| `disabled` | `boolean` | — | Estado deshabilitado |
| `label` | `string` | `""` |  |

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
| `.get()` | Devuelve el estado actual (`boolean`) |
| `.set(val: boolean)` | Asigna el estado |
| `.reset()` | Pone el estado en `false` |
| `.focus()` | Enfoca el switch |
