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

7. **Validar**:

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
