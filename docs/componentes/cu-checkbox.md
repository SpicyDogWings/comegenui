# `<cu-checkbox>`

Checkbox con label. Mantiene su estado y también se controla via `modelValue` o métodos `get`/`set`.

[← Volver](../README.md)

## Uso en HTML plano

```html
<script src="dist/CuCheckbox.core.umd.js"></script>

<cu-checkbox label="Acepto los términos" color="primary"></cu-checkbox>
<cu-checkbox label="Opción deshabilitada" disabled></cu-checkbox>

<script>
  const chk = document.querySelector('cu-checkbox');
  chk.set(true);
  console.log(chk.get()); // true
</script>
```

---

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

---

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

---

## Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `size` | `"sm" \| "md"` | `"md"` | Tamaño del checkbox: `sm`, `md` |
| `disabled` | `boolean` | `—` | Estado deshabilitado |
| `model-value` | `boolean` | `false` | Estado del checkbox. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `label` | `string` | `—` | Texto visible junto al checkbox |
<!-- /@api:atributos -->

> El Custom Element **no expone** una prop `checked` separada (el control se hace únicamente con `modelValue`), ni una prop `variant` (el estilo se fija con `size` y `color`).

## Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `boolean` | — |
| `change` | — | — |
<!-- /@api:eventos -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el estado actual (`boolean`) |
| `set` | Asigna el estado (programáticamente) |
| `reset` | Pone el estado en `false` |
| `focus` | Enfoca el checkbox |
<!-- /@api:metodos -->
