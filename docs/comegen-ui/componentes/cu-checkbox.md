# `<cu-checkbox>`

Checkbox con label, controlable via `modelValue` o métodos `get`/`set`.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `modelValue` | `boolean` | `false` | Estado del checkbox (controlado) |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"none"` | `outlined`, `soft`, `ghost`, `subtle`, `none` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `label` | `string` | — | Texto visible junto al checkbox |
| `hightContrast` | `boolean` | `false` | Modo de alto contraste para el texto |

> El Custom Element **no expone** una prop `checked` separada; el control se hace únicamente con `modelValue`.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|--------|----------------------|-------------|
| `update:modelValue` | `boolean` | Se emite cuando cambia el estado |
| `change` | `boolean` | Se emite en cada cambio, útil para listeners simples |

## Slots

Ninguno (el texto se pasa via `label`).

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.get()` | Devuelve el estado actual (`boolean`) |
| `.set(value)` | Asigna el estado (programáticamente) |
| `.reset()` | Pone el estado en `false` |
| `.focus()` | Enfoca el checkbox |

---

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

Hay dos formas equivalentes de escuchar cambios:

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
