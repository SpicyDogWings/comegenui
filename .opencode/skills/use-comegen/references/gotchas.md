# Rarezas y errores frecuentes

## 1. Atributo vs propiedad (el error Nº1)

Un custom element recibe **strings** por atributo. Todo lo que no sea string/number/boolean
va por **propiedad JS**, después de que el UMD esté cargado:

```html
<cu-table id="t"></cu-table>
<script src="CuTable.umd.js"></script>
<script>
  const t = document.getElementById('t');
  t.columns = [{ key: 'name', label: 'Nombre' }];  // ✅
  t.data = [{ name: 'Ana' }];
</script>
```

```html
<cu-select options="[{'value':'a'}]"></cu-select>  <!-- ❌ no parsea: llega el string -->
```

Qué props son "sólo por JS" en cada componente: `references/api-por-componente.md`.

## 2. `modelValue` es controlado

El componente **no** cambia su valor solo: emite el cambio y vos lo asignás (o lo escuchás).

```js
const input = document.querySelector('cu-input');
input.addEventListener('update:modelValue', (e) => {
  input.modelValue = e.detail;   // cerrar el ciclo
});
```

Si ves que "se escribe y vuelve atrás", es esto: falta reasignar el valor.

En Vue es `v-model` y no hay que hacer nada.

## 3. Booleanos por presencia

`disabled` (presente) = `true`; ausente = `false`. No existe `disabled="false"` como
"apagado" desde HTML —para apagarlo, sacá el atributo (por propiedad, `el.disabled = false` sí funciona).

## 4. Eventos: nativos vs propios

- **Nativos** (`click`, `input`, `change`, `focus`, `blur`, `keydown`): burbujean solos desde
  el shadow DOM. `el.addEventListener('click', …)` funciona sin configurar nada.
- **Propios** (los de la tabla `Eventos` de la ficha): son `CustomEvent` en el host y el dato
  viene en `e.detail`.

```js
picker.addEventListener('change', (e) => console.log(e.detail));
```

⚠️ Cuidado con los nombres con `:`: `update:modelValue` se escucha tal cual (con dos puntos).

## 5. Slots (light DOM)

Los slots del custom element se llenan con **hijos que declaren `slot="nombre"`**:

```html
<cu-modal>
  <span slot="icon">🔔</span>
  Contenido por defecto
  <div slot="footer"><cu-button>Listo</cu-button></div>
</cu-modal>
```

Los nombres válidos están en la tabla `Slots` de la ficha. Si un slot no se rellena, el
componente usa su contenido por defecto (por eso a veces "no se ve" lo que pusiste: lo
pisaste con un `slot` mal nombrado).

## 6. `hightContrast` está mal escrito

El prop existe con ese typo histórico (`hight`, no `high`) y hoy **sólo** lo expone
`<cu-label>`. No inventes `hightContrast` en otros componentes.

## 7. `<cu-date-picker-range>` está deprecado

Es un shim viejo. Usá `<cu-date-picker mode="range">` (o `dual-calendar` para dos meses).

## 8. Varios componentes se componen entre sí

`<cu-date-picker>` compone el dropdown + calendario; `<cu-table>` es el `AdvancedTable`;
`<cu-cells-importer>` envuelve `cu-input`/`cu-file-input`. Si un evento no aparece, puede
estar saliendo del hijo: mirá la sección "Nota de implementación" de la ficha.

## 9. El estilo no aparece

- Falta `css/themes.css` (o el tema) → cargalo **antes** de los UMD.
- Estás en un `data-theme` distinto del que creés (revisá `<html>`).
- El UMD quedó viejo después de actualizar la lib.
