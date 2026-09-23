# `<cu-input>`

Input de texto con color, variante, tipos de input HTML5 y métodos `get`/`set`/`reset`.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `modelValue` | `string` | `""` | Valor controlado |
| `startValue` | `string` | — | Valor inicial usado por `.reset()` |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `type` | `string` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `placeholder` | `string` | — | Placeholder del input |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `readOnly` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |

> **Atributos en HTML:** `readOnly` se escribe como `readonly` (convención HTML). Ej.: `<cu-input readonly>`

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `update:modelValue` | `string` | Se emite en cada cambio de valor (mientras el usuario escribe) |

> Los eventos nativos del DOM (`input`, `change`, `focus`, `blur`) **burbujean automáticamente** al host desde el Shadow DOM. Podés escucharlos con `addEventListener`, pero no se re-emiten como eventos custom (no hay `input`/`change` propios en el Custom Element).

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.get()` | Devuelve el valor actual (`string`) |
| `.set(value)` | Asigna un valor |
| `.reset()` | Vuelve al `startValue` (o `""` si no se definió) |
| `.focus()` | Enfoca el input |

---

## Uso en HTML plano

```html
<script src="dist/CuInput.umd.js"></script>

<cu-input placeholder="Nombre" color="primary" variant="outlined"></cu-input>
<cu-input type="email" placeholder="correo@ejemplo.com" variant="soft" id="email"></cu-input>
<cu-input type="number" disabled value="42"></cu-input>

<script>
  const input = document.getElementById('email');
  input.set('usuario@dominio.com');
  console.log(input.get());
  input.focus();
</script>
```

---

## Escuchar cambios

```html
<cu-input id="nombre" placeholder="Tu nombre"></cu-input>

<script>
  document.getElementById('nombre').addEventListener('update:modelValue', (e) => {
    console.log('Valor actual:', e.detail);
  });
</script>
```

---

## Reset

```html
<cu-input id="campo" start-value="Texto inicial" value="Texto inicial"></cu-input>

<button onclick="document.getElementById('campo').reset()">Resetear</button>
```

---

## Tipos soportados

```html
<cu-input type="text" placeholder="Texto"></cu-input>
<cu-input type="password" placeholder="Contraseña"></cu-input>
<cu-input type="email" placeholder="correo@ejemplo.com"></cu-input>
<cu-input type="number" placeholder="0"></cu-input>
<cu-input type="tel" placeholder="+54 11 1234-5678"></cu-input>
<cu-input type="url" placeholder="https://..."></cu-input>
<cu-input type="search" placeholder="Buscar..."></cu-input>
```
