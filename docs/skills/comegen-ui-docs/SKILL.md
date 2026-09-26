---
name: comegen-ui-docs
description: 'Receta para documentar o revisar la documentación de un componente de ComegenUI: escribe/actualiza la ficha del custom element, la ficha Vue y la página del sitio. Usar cuando se pida "documentá el componente", "actualizá la doc de cu-x", "revisá que la doc coincida con el código", "agregar un componente nuevo a la doc", "por qué falla check-docs".'
---

# Documentar un componente

Cada componente tiene **hasta tres archivos**, y no dicen lo mismo:

| Archivo | Qué documenta | Fuente |
|---|---|---|
| `docs/componentes/<tag>.md` | el **custom element** (vanilla): atributos, `CustomEvent`s, slots, métodos del host | `src/components/customElements/.../X.ce.vue` (o el `.vue` directo si no hay wrapper) |
| `docs/componentes/vue/<kebab>.md` | el componente **Vue**: props, emits, slots, `expose` | `src/components/<cat>/X.vue` |
| `docs/site/componentes/<slug>.md` | la **página del sitio**: frontmatter + `@include` de una ficha | — |
| `skills/use-comegen/references/<kebab>.md` | la **receta del componente** para quien consume la lib: cuándo usarlo, qué puede y qué no, ejemplos y las dos APIs | las dos fichas + el SFC |

`<kebab>` es el kebab del **nombre del componente Vue** (`AdvancedTable` → `advanced-table`),
no del tag. Por eso `cu-table` (vanilla) ↔ `vue/advanced-table` (Vue) y el interno
`Table` ↔ `vue/table` conviven sin pisarse. Las dos páginas de un componente llevan el
**mismo `title`**: así el switch Vue/Vanilla las encuentra como contraparte.

## Pasos

1. **Identificar el componente y si tiene custom element.**
   - ¿Hay `customElements.define('cu-x', …)` en `src/lib/**/*.ts`? → tiene vanilla.
   - ¿Existe `src/components/customElements/.../X.ce.vue`? → la API pública del CE es **ese**
     wrapper. Si no existe, el CE es el `.vue` directo (casos: `cu-button`,
     `cu-floating-button`, `cu-badge`).
   - Si no hay entrada en `src/lib`, el componente es **sólo Vue** (interno).

2. **Leer el código** (en este orden):
   - `src/components/<cat>/X.vue` → props, `defineEmits`, slots, `defineExpose`.
   - `src/components/customElements/.../X.ce.vue` → qué declara, qué forwardea de verdad,
     qué bridgea con `ceEmit()`, qué expone.
   - `src/lib/<cat>/<kebab>.ts` → el tag real.
   - Ver `references/guia-extraccion.md` para el detalle de qué leer y qué ignorar.

3. **Decidir qué fichas corresponden.**
   - CE + Vue → las dos fichas.
   - Sólo Vue → sólo `docs/componentes/vue/<kebab>.md`.

4. **Escribir la ficha vanilla** con esta plantilla (secciones obligatorias en negrita):

```md
# `<cu-x>`

<una línea: qué hace>

[← Volver](../README.md)

---

## Uso en HTML plano
```html
<script src="dist/CuX.umd.js"></script>
<cu-x …>…</cu-x>
```
<secciones curadas: variantes, tamaños, casos de uso…>

---

**## Atributos**
| Atributo | Tipo | Default | Descripción |
|---|---|---|---|

**## Propiedades JS**        ← sólo si tiene arrays/objetos/funciones
| Propiedad | Tipo | Descripción |
|---|---|---|
```js
el.items = [{ … }];
```

**## Eventos**
| Evento | Payload (`e.detail`) | Descripción |
|---|---|---|
<+ qué eventos nativos burbujean>

**## Slots**
| Slot | Descripción |
|---|---|

**## Métodos expuestos**
| Método | Descripción |
|---|---|
<o "No expone métodos.">
```

5. **Escribir la ficha Vue**:

```md
# `X`

<la misma descripción, con el nombre Vue>

[← Volver](../README.md)

---

## Uso en Vue
```vue
<script setup lang="ts">
import X from "@/components/<cat>/X.vue";
</script>
<template>…</template>
```
<las mismas secciones curadas, en clave Vue>

---

## Props
| Prop | Tipo | Default | Descripción |
|---|---|---|---|

## Emits
| Evento | Payload | Descripción |
|---|---|---|

## Slots
| Slot | Descripción |
|---|---|

## Expose
| Método | Descripción |
|---|---|
```

6. **Crear/actualizar la página**:

```md
---
title: X
group: <Buttons | Formularios | Controles | Información | Markdown | Overlay | Navegación | Datos | Theme | Otros>
---

<!--@include: ../../componentes/<tag>.md-->
```

Hmm, la ruta es `../../componentes/...` para la página vanilla (dos niveles) y
`../../../componentes/vue/<kebab>.md` para la página Vue, que vive un nivel más adentro
(`docs/site/componentes/vue/`). Las dos llevan el mismo `title` y su `group`. Si la
página tiene demos en vivo, van **en la página Vue** (usan la API de Vue):

```md
<script setup lang="ts">
import X from "@/components/<cat>/X.vue";
</script>

<!--@include: ../../componentes/vue/<kebab>.md-->

## Demos en vivo

<ClientOnly>
  <div class="cu-demo">
    <X … />
  </div>
</ClientOnly>
```

7. **Escribí la receta del componente en la skill** (`skills/use-comegen/references/<kebab>.md`).
   Es el archivo que se lleva quien consume la lib (viaja con `skills add`), así que tiene
   que ser autosuficiente y **no puede ser un symlink**:

   ```md
   # <Componente> — `<cu-x>` / `<X>`

   <qué es, en una línea>

   ## Cuándo usarlo
   ## Receta                    ← pasos + ejemplo HTML plano + ejemplo Vue
   ## Qué puede y qué no puede
   ## API del custom element    → Atributos / Eventos / Slots / Métodos expuestos
   ## API del componente Vue    → Props / Emits / Slots / Expose
   ```

   Las cuatro secciones de API son **las mismas** que las de las fichas, con los mismos
   datos: si una dice algo distinto, gana el código y se corrigen las tres. Las
   **limitaciones** van también acá: es lo que evita que el consumidor codee a ciegas.
   Modelo a copiar: `skills/use-comegen/references/button.md`.

8. **Validar**:

```bash
node scripts/check-docs.mjs   # tag↔ficha, @include sano, secciones obligatorias
./scripts/preflight.sh        # type-check + tests + gate
pnpm dev                      # mirar el sitio (sidebar sale del frontmatter)
```

Si agregás un componente nuevo, sumalo también al índice `docs/componentes/README.md`.

## Reglas

- **Gana el código.** Si la ficha y el `.ce.vue`/`.vue` no coinciden, la ficha está mal.
  No la defiendas: corregila.
- **Si el bug es del wrapper, se arregla el wrapper** (no se documenta el bug). Después
  actualizá la ficha. Los bugs de paridad CE↔Vue se testean en
  `src/components/customElements/ce-parity.test.ts`.
- **No inventes APIs.** Todo sale del SFC: si una prop no está en `defineProps`, no existe.
- **No digas lo mismo en dos lados**: el cuerpo vive en la ficha, la página sólo incluye.
- Los callouts de divergencia (`> El Custom Element …`) van **sólo en la ficha vanilla**.
- `check-docs.mjs` valida existencia, `@include` y secciones obligatorias; **no** compara
  el contenido con el código. Eso es tuyo.

## Archivos de esta skill

| Archivo | Cuándo leerlo |
|---|---|
| `references/arquitectura.md` | Recordar el patrón de 3 archivos (`.vue` + `.ce.vue` + `lib/*.ts`) |
| `references/guia-extraccion.md` | Cómo derivar la API del `.ce.vue` paso a paso |
| `references/convenciones.md` | Colores, variantes, naming, eventos |
| `references/errores-comunes.md` | Qué evitar al escribir docs |
| `references/checklist-auditoria.md` | Revisar una ficha existente contra el código |

## Mantenimiento de las tablas de API (son generadas)

Las cuatro secciones de API **no se escriben a mano**: se generan desde los SFC y se
inyectan entre marcadores. La prosa (cuándo usarlo, qué puede y qué no, ejemplos) sí va a
mano, y **fuera** de los marcadores.

```md
## Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
<!-- /@api:atributos -->

<la prosa, si hace falta, va acá afuera>
```

Marcadores: `atributos` / `eventos` / `slots` / `metodos` (ficha vanilla), `props` / `emits`
/ `slots` / `expose` (ficha Vue). En la receta de la skill van con `###`.

```bash
node scripts/gen-api.mjs                  # escribe las tablas
node scripts/gen-api.mjs --check          # no escribe: falla si el código cambió y la doc no
node scripts/gen-api.mjs --print button   # ver la salida de un componente sin escribir
```

Reglas:

- **No edites dentro de los marcadores**: se sobreescribe en la próxima corrida.
- Si un dato está mal, se corrige en el SFC. La descripción sale del `/** … */` de la prop,
  así que un JSDoc pobre da una tabla pobre (y un JSDoc bueno documenta solo).
- El extractor lee el `.ce.vue` para la ficha vanilla (o el `.vue` cuando el CE es directo)
  y el `.vue` para la ficha Vue.
- `cu-date-picker-range` se saltea: su `.vue` no entra en el tsconfig del checker.

Pendiente conocido: `docs/componentes/vue/navbar-list.md` no converge en `--check`.
