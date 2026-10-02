---
name: use-comegen
description: 'Receta para usar los componentes de ComegenUI: los custom elements `<cu-*>` (UMD, HTML plano) o los `.vue` dentro de un proyecto Vue. Usar cuando haya que elegir o instalar un componente, pasar datos, escuchar eventos, llamar métodos expuestos o tematizar. Frases: "usar comejen", "agregar un cu-", "instalar la lib", "setear items/options/columns", "por qué no se actualiza el valor", "cómo escucho el evento", "cambiar el tema".'
metadata:
  repository: https://github.com/SpicyDogWings/comegenui
  path: skills/use-comegen
  version: 5.0.1-alpha
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

- `references/componentes.md` es el **catálogo**: qué hace cada componente y qué **no**
  puede hacer (límites), agrupado por categoría.
- `references/api-por-componente.md` tiene los datos mecánicos del custom element: su
  `.umd.js`, las props que **sólo van por JS** y sus eventos/métodos.
- **`references/<kebab>.md` es la receta completa de cada custom element** (cuándo usarlo,
  receta con ejemplos HTML y Vue, límites y las dos APIs). Es la fuente recomendada para
  consumir un componente: p. ej. `references/button.md` para `<cu-button>`.
- Detalle completo de la API:
  - custom element → `docs/componentes/<tag>.md`
  - Vue → `docs/componentes/vue/<kebab>.md`
  - índice de todo → `docs/componentes/README.md`

> Esos archivos viven en el repo de ComegenUI (<https://github.com/SpicyDogWings/comegenui>).
> En un proyecto que sólo consumió el zip no están: usá el índice de `references/` y la
> introspección del elemento (paso 4).

## 2. Instalar o actualizar

- Qué trae el zip y cómo copiarlo: `references/instalacion.md`.
- Regla: el CSS del tema se carga **antes** que los UMD.
- Si el componente ya está instalado y "no cambia nada", casi siempre es un UMD viejo:
  volvé a copiar el `.umd.js` y el `css/themes.css`. Para confirmarlo, leé
  `customElements.get('cu-x').comegen.version` (`references/versionado.md`).

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
- El evento que esperás figura en `references/api-por-componente.md`; si el componente
  tiene una limitación, está en `references/componentes.md`.

## Origen

- **Repositorio:** <https://github.com/SpicyDogWings/comegenui>
- **Ruta en el repo:** `skills/use-comegen/`
- **Versión de esta copia:** `5.0.1-alpha` (el `metadata.version` del frontmatter).

La skill es texto: no hay nada que compilar. **No viaja en el zip** (el zip lleva sólo
la lib). Se instala desde el repo oficial, y la versión de la lib y la de la skill pueden
no coincidir (`references/versionado.md`).

## Instalar o actualizar esta receta en otro proyecto

El CLI [`skills`](https://github.com/vercel-labs/skills) (Vercel) la instala en el
directorio de tu agente y deja el origen registrado en `skills-lock.json` (Node 24+):

```sh
# último `main` (autodetecta el agente; forzá con -a opencode, -a claude-code, …)
npx skills add SpicyDogWings/comegenui --skill use-comegen

# fijar una rama/tag concreto
npx skills add "https://github.com/SpicyDogWings/comegenui/tree/v5.0.0-alpha.3/skills/use-comegen"

# actualizar
npx skills update use-comegen
```

Si no podés usar el CLI, bajá la carpeta a mano eligiendo el `ref` (`main` o una
rama/tag concreto, ej. `v5.0.0-alpha.3`):

**Con git (sparse-checkout: no baja el resto del repo):**

```sh
git clone --filter=blob:none --sparse --branch main \
  https://github.com/SpicyDogWings/comegenui.git /tmp/comegenui
cd /tmp/comegenui
git sparse-checkout set skills/use-comegen
mkdir -p <proyecto>/.opencode/skills
cp -r skills/use-comegen <proyecto>/.opencode/skills/
```

Cambiá `--branch main` por la rama o tag que quieras (`--branch v5.0.0-alpha.3`).

**Sin git (tarball del ref):**

```sh
mkdir -p <proyecto>/.opencode/skills
curl -L https://github.com/SpicyDogWings/comegenui/archive/refs/heads/main.tar.gz \
  | tar -xz --strip-components=2 -C <proyecto>/.opencode/skills \
    'comegenui-main/skills/use-comegen'
```

Para un tag, usá `archive/refs/tags/v5.0.0-alpha.3.tar.gz` y el prefijo
`comegenui-5.0.0-alpha.3/` (GitHub quita la `v` inicial del ref al nombrar la carpeta).
Para actualizar a mano, repetí el paso con el mismo `ref` (o `git pull` en el clone y
volvé a copiar). Destinos válidos para el agente: `.agents/skills/`, `.opencode/skills/`
o `.claude/skills/` (OpenCode lee los tres; ver `references/instalacion.md` para la lib).

## Archivos de esta skill

| Archivo | Cuándo leerlo |
|---|---|
| `references/componentes.md` | Elegir componente y saber qué puede y qué **no** puede hacer |
| `references/api-por-componente.md` | Datos del CE: `.umd.js`, props por JS, eventos y métodos |
| `references/<kebab>.md` | Receta completa de un custom element (ejemplos, límites, API) |
| `references/instalacion.md` | Instalar/actualizar la lib y el CSS |
| `references/versionado.md` | Leer la versión de un UMD y hacer convivir versiones distintas |
| `references/theming.md` | Cambiar tema, colores, variantes, tokens |
| `references/gotchas.md` | Atributo vs propiedad, eventos nativos, slots, rarezas |
