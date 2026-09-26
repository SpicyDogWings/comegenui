# `<cu-input>`

Input de texto con color, variante, tipos de input HTML5 y métodos `get`/`set`/`reset`.

[← Volver](../README.md)

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

---

## Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `"number" \| "text" \| "password" \| "email" \| "tel" \| "url" \| "search"` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño: `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `read-only` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |
| `model-value` | `string` | `""` | Valor controlado |
| `placeholder` | `string` | `—` | Placeholder del input |
| `start-value` | `string` | `—` | Valor inicial usado por `.reset()` |
<!-- /@api:atributos -->

> **Atributos en HTML:** `readOnly` se escribe como `readonly` (convención HTML). Ej.: `<cu-input readonly>`

## Eventos

<!-- @api:eventos -->
Ninguno.
<!-- /@api:eventos -->

> Los eventos nativos del DOM (`input`, `change`, `focus`, `blur`) **burbujean automáticamente** al host desde el Shadow DOM. Podés escucharlos con `addEventListener`, pero no se re-emiten como eventos custom (no hay `input`/`change` propios en el Custom Element).

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | — |
| `set` | — |
| `reset` | — |
| `focus` | — |
<!-- /@api:metodos -->
