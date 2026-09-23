# `<cu-textarea>`

Área de texto multilínea con color, variante, control de filas y opción de deshabilitar el redimensionado.

[← Volver](../SKILL.md)

---

---

## Uso en HTML plano

```html
<script src="dist/CuTextarea.umd.js"></script>

<cu-textarea placeholder="Escribe aquí..." rows="5" color="primary" variant="outlined"></cu-textarea>
<cu-textarea no-resize variant="soft" id="comentarios"></cu-textarea>

<script>
  const ta = document.getElementById('comentarios');
  ta.set('Texto predefinido');
  console.log(ta.get());
</script>
```

---

## Escuchar cambios

```html
<cu-textarea id="bio" placeholder="Biografía"></cu-textarea>

<script>
  document.getElementById('bio').addEventListener('update:modelValue', (e) => {
    console.log('Bio:', e.detail);
  });
</script>
```

---

## Reset

```html
<cu-textarea id="notas" start-value="Plantilla inicial">Plantilla inicial</cu-textarea>

<button onclick="document.getElementById('notas').reset()">Restaurar plantilla</button>
```

---

## Deshabilitar redimensionado

```html
<cu-textarea no-resize placeholder="Tamaño fijo" rows="4"></cu-textarea>
```

Útil cuando querés controlar el alto de forma externa (con CSS o de manera responsiva).

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `startValue` | `string` | — | Valor inicial usado por `.reset()` |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `placeholder` | `string` | — | Placeholder del textarea |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `readOnly` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |
| `rows` | `number` | `3` | Cantidad de filas visibles |
| `noResize` | `boolean` | `false` | Desactiva el redimensionado manual (atributo HTML: `no-resize`) |
| `modelValue` | `string` | `""` | Valor actual del textarea (v-model). |

> **Atributos en HTML:** `readOnly` → `readonly`, `noResize` → `no-resize`.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `update:modelValue` | `string` | Se emite en cada cambio de valor |

> Los eventos nativos del DOM (`input`, `change`, `focus`, `blur`) **burbujean automáticamente** al host desde el Shadow DOM. No se re-emiten como eventos custom.

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.get()` | Devuelve el valor actual del textarea. |
| `.set(newValue: string \| number)` | Setea el valor del textarea. |
| `.reset()` | Limpia el textarea. |
| `.focus()` | Enfoca el textarea. |
