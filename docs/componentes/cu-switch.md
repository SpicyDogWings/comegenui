# `<cu-switch>`

Toggle switch con color semántico y dos tamaños. Mantiene su estado y también se controla via `modelValue` o métodos `get`/`set`.

[← Volver](../README.md)

## Uso en HTML plano

```html
<script src="dist/CuSwitch.core.umd.js"></script>

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

Hay dos formas equivalentes (el switch se mueve solo; estos listeners son para reaccionar):

```html
<cu-switch id="toggle"></cu-switch>

<script>
  const sw = document.getElementById('toggle');

  // update:modelValue (convención Vue). El switch ya cambió su estado solo;
  // este listener es para reaccionar, no para moverlo.
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

## Estado y modo controlado

El switch **mantiene su propio estado**: al clickearlo (o llamar `set()`/`reset()`) se mueve
la UI y `get()` devuelve el valor nuevo, sin que tengas que reasignar `modelValue`.

Si necesitás que **vos** decidas el valor, reasignalo en el evento (modo controlado):

```html
<cu-switch id="guardado"></cu-switch>

<script>
  const sw = document.getElementById('guardado');
  // Ejemplo: sólo permite activarlo una vez; si el usuario lo apaga, lo volvemos a encender.
  sw.addEventListener('update:modelValue', (e) => {
    if (!e.detail) sw.modelValue = true;
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

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `size` | `"sm" \| "md"` | `"md"` | Tamaño del switch: `sm`, `md` |
| `disabled` | `boolean` | `—` | Estado deshabilitado |
| `model-value` | `boolean` | `false` | Estado del toggle. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo |
| `label` | `string` | `""` | — |
<!-- /@api:atributos -->

> El Custom Element **no expone** una prop `checked` separada. El control se hace únicamente con `modelValue`. Tampoco tiene props `variant`, `theme` ni `hightContrast`; el tamaño se controla con `size`.

## Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `boolean` | — |
| `change` | — | — |
<!-- /@api:eventos -->

## Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

Ninguno.

## Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el estado actual (`boolean`) |
| `set` | Asigna el estado |
| `reset` | Pone el estado en `false` |
| `focus` | Enfoca el switch |
<!-- /@api:metodos -->
