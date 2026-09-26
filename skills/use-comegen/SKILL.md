---
name: use-comegen
description: 'Receta para usar los componentes de ComegenUI: los custom elements `<cu-*>` (UMD, HTML plano) o los `.vue` dentro de un proyecto Vue. Usar cuando haya que elegir o instalar un componente, pasar datos, escuchar eventos, llamar métodos expuestos o tematizar. Frases: "usar comejen", "agregar un cu-", "instalar la lib", "setear items/options/columns", "por qué no se actualiza el valor", "cómo escucho el evento", "cambiar el tema".'
---

# Usar ComegenUI — receta

Los pasos 1→7 son el camino completo: **elegir → instalar → declarar → pasar datos →
escuchar → llamar métodos → tematizar**. Seguilos en orden la primera vez; después
andá directo al paso que te falta.

> **Dos APIs, no una.** El mismo componente se usa de dos formas y no siempre son iguales:
>
> | | Vue | Custom Element (vanilla) |
> |---|---|---|
> | Se importa de | `src/components/<cat>/X.vue` | `CuX.umd.js` (tag `<cu-x>`) |
> | Ficha | `docs/componentes/vue/<kebab>.md` | `docs/componentes/<tag>.md` |
> | Entrada de build | — | `src/lib/<cat>/<kebab>.ts` |
> | Props | camelCase | atributos kebab-case + propiedades JS |
> | Eventos | `@evento` / `v-model` | `CustomEvent` sobre el host |
>
> Si un componente **no** aparece en `src/lib/**/*.ts`, no existe como custom element:
> sólo se puede usar desde Vue.

## 1. Elegir el componente

- `references/api-por-componente.md` lista cada tag, su `.umd.js`, su categoría, las
  props que **sólo se pueden setear por JS** y sus eventos custom.
- Detalle completo de la API:
  - custom element → `docs/componentes/<tag>.md`
  - Vue → `docs/componentes/vue/<kebab>.md`
  - índice de todo → `docs/componentes/README.md`

> Esos archivos viven en el repo de ComegenUI. En un proyecto que sólo consumió el zip
> no están: usá el índice de `references/` y la introspección del elemento (paso 4).

## 2. Instalar o actualizar

- Qué trae el zip y cómo copiarlo: `references/instalacion.md`.
- Regla: el CSS del tema se carga **antes** que los UMD.
- Si el componente ya está instalado y "no cambia nada", casi siempre es un UMD viejo:
  volvé a copiar el `.umd.js` y el `css/themes.css`.

## 3. Declarar el componente

```html
<link rel="stylesheet" href="css/themes.css">
<script src="CuButton.umd.js"></script>

<cu-button color="primary" variant="solid">Guardar</cu-button>
```

En Vue:

```vue
<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <Button color="primary" variant="solid">Guardar</Button>
</template>
```

## 4. Pasar datos: atributo o propiedad (el paso que más se falla)

| Tipo de dato | Cómo se pasa |
|---|---|
| string, number, boolean | **atributo** kebab-case: `color="primary"`, `items-per-page="20"` |
| array, objeto, función | **propiedad JS**: `el.items = [...]` (nunca por atributo) |

```js
const tabla = document.querySelector('cu-table');
tabla.columns = [{ key: 'name', label: 'Nombre' }];   // array → propiedad
tabla.data = [{ name: 'Ana' }];
tabla.compact = true;                                  // boolean también por propiedad
```

- Los booleanos funcionan por presencia: `disabled` = `true`, ausente = `false`.
- Vue no tiene esta distinción: pasás todo por `:prop` (camelCase en JS, kebab en el template).
- Para saber si una prop necesita JS, mirala en `references/api-por-componente.md`
  (columna "props por JS") o en la ficha del componente.

## 5. Escuchar eventos

- Los eventos propios son `CustomEvent` **en el host**; el payload va en `e.detail`:

```js
picker.addEventListener('change', (e) => {
  console.log(e.detail);       // la fecha, el rango, la opción, …
});
```

- Los eventos **nativos del DOM** (`click`, `input`, `change`, `focus`, `blur`, `keydown`)
  burbujean solos desde el shadow DOM: se escuchan igual, sin hacer nada extra.
- En Vue: `@change="..."`, `v-model`, `v-model:startDate`.

## 6. Llamar métodos expuestos

Los que estén en `## Métodos expuestos` de la ficha (custom element) o `## Expose`
(la de Vue). Típicos: `.open()`, `.close()`, `.toggle()`, `.get()`, `.set(v)`, `.reset()`, `.focus()`.

```js
const picker = document.querySelector('cu-date-picker');
picker.setRange('2026-09-01', '2026-09-30');
picker.open();
```

## 7. Tematizar

- `references/theming.md`: temas, `data-theme`, colores, variantes y tokens.

## Errores frecuentes

1. **"Seteo `items="[...]"` y no pasa nada"** → arrays/objetos/funciones van por
   propiedad JS, no por atributo (paso 4).
2. **"El valor no se actualiza"** → `modelValue` es controlado: asigná
   `el.modelValue = nuevo` o escuchá `update:modelValue` (paso 5).
3. **"No se ve el estilo / se ve a medias"** → falta el `css/themes.css` o el UMD es
   viejo (paso 2). Verificá también que el tema esté en `<html data-theme="...">`.

## Verificar antes de cerrar

- El componente aparece en el HTML con el tag exacto (`cu-*`).
- Si es una prop compleja, se asignó **después** de que el UMD esté cargado
  (sino el elemento todavía no existe).
- El evento que esperás figura en `references/api-por-componente.md`.

## Archivos de esta skill

| Archivo | Cuándo leerlo |
|---|---|
| `references/api-por-componente.md` | Elegir componente, saber qué va por JS y qué eventos emite |
| `references/instalacion.md` | Instalar/actualizar la lib y el CSS |
| `references/theming.md` | Cambiar tema, colores, variantes, tokens |
| `references/gotchas.md` | Atributo vs propiedad, eventos nativos, slots, rarezas |
