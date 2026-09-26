# `<cu-textarea>`

Área de texto multilínea con color, variante, control de filas y opción de deshabilitar el redimensionado.

[← Volver](../README.md)

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

---

## Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `read-only` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |
| `model-value` | `string` | `""` | Valor controlado |
| `rows` | `number` | `3` | Cantidad de filas visibles |
| `no-resize` | `boolean` | `false` | Desactiva el redimensionado manual (atributo HTML: `no-resize`) |
| `placeholder` | `string` | `—` | Placeholder del textarea |
| `start-value` | `string` | `—` | Valor inicial usado por `.reset()` |
<!-- /@api:atributos -->

> **Atributos en HTML:** `readOnly` → `readonly`, `noResize` → `no-resize`.

## Eventos

<!-- @api:eventos -->
Ninguno.
<!-- /@api:eventos -->

> Los eventos nativos del DOM (`input`, `change`, `focus`, `blur`) **burbujean automáticamente** al host desde el Shadow DOM. No se re-emiten como eventos custom.

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
