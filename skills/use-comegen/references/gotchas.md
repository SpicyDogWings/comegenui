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

Qué props son "sólo por JS" en cada componente: `references/api-por-componente.md`; los
límites de cada uno (qué no puede hacer), en `references/componentes.md`.

## 2. `modelValue`: el componente mantiene su estado

El custom element **sincroniza su estado solo**: al clickear/tipear/seleccionar, actualiza
la UI y su valor interno, y además emite `update:modelValue` para avisarte. **No hace falta
reasignar `modelValue`** para que el control se mueva.

```js
const input = document.querySelector('cu-input');
// Escuchás el cambio para reaccionar; el campo ya refleja lo que el usuario escribió.
input.addEventListener('update:modelValue', (e) => console.log(e.detail));
```

Reasignar `modelValue` es **opcional** y sólo sirve para el modo controlado: cuando vos
decidís el valor (por ejemplo, para descartar entradas inválidas o reponer un valor tras
un reset). Ahí sí, cerrá el ciclo:

```js
const input = document.querySelector('cu-input');
// Modo controlado: forzás el valor que querés conservar.
input.addEventListener('update:modelValue', (e) => {
  input.modelValue = sanitizar(e.detail);
});
```

En Vue es `v-model` y maneja los dos modos solo: sin `v-model` (o con `:model-value` y un
`@update:model-value`) el componente es dueño de su estado y refleja los cambios igual.

> Los CE que **siguen** actualizando su valor interno aunque el host no lo reasigne son los
> de campo: `cu-input`, `cu-textarea`, `cu-select`, `cu-autocomplete`, `cu-switch`,
> `cu-checkbox`, `cu-color-picker`, `cu-file-input` y `cu-file-input-zone`. Los
> seleccionadores con estado propio (calendario, dropdown, tabs) también.

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

## 8. Varios componentes se componen entre sí

`<cu-date-picker>` compone el dropdown + calendario; `<cu-table>` es el `AdvancedTable`;
`<cu-cells-importer>` envuelve `cu-input`/`cu-file-input`. Si un evento no aparece, puede
estar saliendo del hijo: mirá la sección "Nota de implementación" de la ficha.

## 9. El estilo no aparece

- Falta `css/themes.css` (o el tema) → cargalo **antes** de los UMD.
- Estás en un `data-theme` distinto del que creés (revisá `<html>`).
- El UMD quedó viejo después de actualizar la lib.
