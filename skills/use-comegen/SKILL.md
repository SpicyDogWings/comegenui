---
name: use-comegen
description: 'Receta para usar los componentes de ComegenUI: los custom elements `<cu-*>` (UMD, HTML plano) o los `.vue` dentro de un proyecto Vue. Usar cuando haya que elegir o instalar un componente, pasar datos, escuchar eventos, llamar métodos expuestos o tematizar. Frases: "usar comejen", "agregar un cu-", "instalar la lib", "setear items/options/columns", "por qué no se actualiza el valor", "cómo escucho el evento", "cambiar el tema".'
metadata:
  repository: https://github.com/SpicyDogWings/comegenui
  path: skills/use-comegen
  version: 5.2.1
---

# Usar ComegenUI — receta

Los pasos 1→7 son el camino completo: **elegir → instalar → declarar → pasar datos →
escuchar → llamar métodos → tematizar**. Seguilos en orden la primera vez; después
andá directo al paso que te falta.

> **Dos APIs, no una.** El mismo componente se usa de dos formas y no siempre son iguales:
>
> | | Vue | Custom Element (vanilla) |
> |---|---|---|
> | Se importa de | `src/components/<cat>/X.vue` (sólo con el repo) | `CuX.umd.js` (config `umd-core`, tag `<cu-x>`) |
> | Ficha | `docs/versiones/5.1.1/componentes/vue/<kebab>.md` | `docs/versiones/5.1.1/componentes/<tag>.md` |
> | Entrada de build | — | `src/lib/<cat>/<kebab>.ts` |
> | Props | camelCase | atributos kebab-case + propiedades JS |
> | Eventos | `@evento` / `v-model` | `CustomEvent` sobre el host |
>
> El zip lleva **sólo** los bundles (custom elements); los `.vue` están en el repo. Sin el repo,
> usá el custom element también desde Vue.
>
> Si un componente **no** aparece en `src/lib/**/*.ts`, no existe como custom element:
> sólo se puede usar desde Vue.

## 1. Elegir el componente

- `references/componentes.md` es el **catálogo**: qué hace cada componente y qué **no**
  puede hacer (límites), agrupado por categoría.
- `references/api-por-componente.md` tiene los datos mecánicos del custom element: su
  `.umd.js`, las props que **sólo van por JS** y sus eventos/métodos.
- **`references/<kebab>.md` es la receta de cada custom element**: el patrón (ejemplo HTML y Vue
  con valores de relleno), los límites y las dos APIs. Es la fuente recomendada para consumir un
  componente: p. ej. `references/button.md` para `<cu-button>`.
- Detalle completo de la API:
  - custom element → `docs/versiones/5.1.1/componentes/<tag>.md`
  - Vue → `docs/versiones/5.1.1/componentes/vue/<kebab>.md`
  - índice de todo → `docs/versiones/5.1.1/componentes/README.md`

> Esos archivos viven en el repo de ComegenUI (<https://github.com/SpicyDogWings/comegenui>).
> En un proyecto que sólo consumió el zip no están: usá el índice de `references/` y la
> introspección del elemento (paso 4).

## 2. Instalar o actualizar

- Cada release publica **4 configs** (`umd-core`, `umd-shared`, `esm-core`, `esm-shared`), cada
  una en su zip. Qué trae cada una y cómo copiarla: `references/instalacion.md`.
- Los bundles no traen tokens: el tema lo aporta el CSS del host (`--cu-color-*`). Este sitio ya los
  tiene; en tu app, definilos (paso 7).
- Si el componente ya está instalado y "no cambia nada", casi siempre es un bundle viejo:
  volvé a copiar el `.umd.js` / `.js`. Para confirmarlo, leé
  `customElements.get('cu-x').comegen.version` (y `.type`) (`references/versionado.md`).

## 3. Declarar el componente

```html
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
- Para saber si una prop necesita JS, mirala en `references/api-por-componente.md`, en
  `references/componentes.md` o en la ficha del componente (columna "props por JS").

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
- Los bundles **no traen tokens**: el host define `--cu-color-*` (`:root` y `[data-theme="…"]`). Los
  15 temas están en `comegen.config.json` y los sirve el sitio de la doc.

## Errores frecuentes

1. **"Seteo `items="[...]"` y no pasa nada"** → arrays/objetos/funciones van por
   propiedad JS, no por atributo (paso 4).
2. **"El valor no se actualiza"** → `modelValue` es controlado: asigná
   `el.modelValue = nuevo` o escuchá `update:modelValue` (paso 5).
3. **"No se ve el estilo / se ve a medias"** → el bundle es viejo o cargaste la config
   equivocada (paso 2). Verificá también que el tema esté en `<html data-theme="...">`.

## Verificar antes de cerrar

- El componente aparece en el HTML con el tag exacto (`cu-*`).
- Si es una prop compleja, se asignó **después** de que el UMD esté cargado
  (sino el elemento todavía no existe).
- El evento que esperás figura en `references/api-por-componente.md`; si el componente
  tiene una limitación, está en `references/componentes.md`.

## Actualizar esta receta

- Instalada con el CLI de skills: `npx skills update use-comegen`.
- A mano: volvé a copiar `skills/use-comegen/` desde el `ref` que quieras
  (`npx skills add "https://github.com/SpicyDogWings/comegenui/tree/<ref>/skills/use-comegen"`).
- Destinos válidos (OpenCode lee los tres): `.agents/skills/`, `.opencode/skills/`, `.claude/skills/`.
- Es texto: no hay nada que compilar. **No viaja en el zip** (el zip lleva sólo la lib), y la
  versión de la lib y la de la skill pueden no coincidir (`references/versionado.md`).

## Archivos de esta skill

| Archivo | Cuándo leerlo |
|---|---|
| `references/componentes.md` | Elegir componente y saber qué puede y qué **no** puede hacer |
| `references/api-por-componente.md` | Datos del CE: `.umd.js`, props por JS, eventos y métodos |
| `references/<kebab>.md` | Receta completa de un custom element (ejemplos, límites, API) |
| `references/instalacion.md` | Instalar/actualizar la lib (las 4 configs) |
| `references/versionado.md` | Leer la versión de un UMD y hacer convivir versiones distintas |
| `references/theming.md` | Cambiar tema, colores, variantes, tokens |
| `references/gotchas.md` | Atributo vs propiedad, eventos nativos, slots, rarezas |
