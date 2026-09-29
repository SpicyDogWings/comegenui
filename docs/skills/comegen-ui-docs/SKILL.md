---
name: comegen-ui-docs
description: 'Receta para documentar o revisar la documentación de un componente de ComegenUI de punta a punta: auditar el SFC contra lo que se va a escribir, escribir/actualizar la ficha del custom element, la ficha Vue, la receta que viaja con `skills add` (`skills/use-comegen/references/<kebab>.md`), las demos reales como archivos `.vue` (`docs/site/examples/<componente>/*.vue`) y la página del sitio, generar las tablas de API entre marcadores y validar con check-docs, gen-api, preflight y el build del sitio. Usar cuando se pida "documentá el componente", "actualizá la doc de cu-x", "revisá que la doc coincida con el código", "agregar un componente nuevo a la doc", "por qué falla check-docs".'
---

# Documentar un componente

Cada componente deja **hasta cinco artefactos**, y no dicen lo mismo:

| Artefacto | Qué documenta | Fuente |
|---|---|---|
| `docs/componentes/<tag>.md` | la **ficha vanilla** del **custom element**: atributos, `CustomEvent`s, slots, métodos del host | `src/components/customElements/.../X.ce.vue` (o el `.vue` directo si no hay wrapper) |
| `docs/componentes/vue/<kebab>.md` | la **ficha Vue** del componente: props, emits, slots, `expose` | `src/components/<cat>/X.vue` |
| `skills/use-comegen/references/<kebab>.md` | la **receta** para quien consume la lib: cuándo usarlo, qué puede y qué no (lista completa), ejemplos y las dos APIs | las dos fichas + el SFC |
| `docs/site/examples/<componente>/*.vue` | las **demos reales**: un SFC completo y compilable por feature | el SFC + la API Vue |
| `docs/site/componentes/<slug>.md` | la **página del sitio**: frontmatter + `@include` de una ficha + las demos | — |

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
   - Si no hay entrada en `src/lib`, el componente es **sólo Vue** (interno): la vista vanilla
     **sólo existe si hay entry en `src/lib`**, así que **no hay ficha vanilla ni receta con API de
     custom element** — sólo ficha Vue, demos y página.

2. **Leer el código** (en este orden):
   - `src/components/<cat>/X.vue` → props, `defineEmits`, slots, `defineExpose`.
   - `src/components/customElements/.../X.ce.vue` → qué declara, qué forwardea de verdad,
     qué bridgea con `ceEmit()`, qué expone.
   - `src/lib/<cat>/<kebab>.ts` → el tag real.
   - Ver `references/guia-extraccion.md` para el detalle de qué leer y qué ignorar.

3. **Auditar el componente.** De acá sale el "qué puede y qué no puede" de las fichas y de la
   receta. Anotá **por escrito**, antes de redactar:
   - **Qué puede y qué no:** props que no existen, cosas que no se re-emiten, métodos que no se
     exponen, defaults engañosos, casos donde una prop no aplica (p. ej. `target` sin `to`).
   - **Qué tiene de más o muerto:** variantes idénticas a otra, CSS que nada aplica, props
     declaradas que nadie usa, eventos declarados que nadie emite.
   - **Bug vs. límite:** si es un **bug** del componente, se arregla el componente (no se documenta
     el bug); si es una **decisión de diseño**, se documenta como límite.
   - La tabla de API se genera desde el **JSDoc** del SFC: un JSDoc que miente es doc rota. Si el
     comportamiento no coincide con el comentario, se corrige **el comentario**.
   - Checklist: `references/checklist-auditoria.md`.

4. **Escribir la ficha vanilla** (sólo si hay entry en `src/lib`) con esta plantilla:

````md
# `<cu-x>`

<una línea: qué hace>

[← Volver](../README.md)

## Uso en HTML plano

```html
<script src="dist/CuX.umd.js"></script>
<cu-x …>…</cu-x>
```

<secciones curadas: variantes, tamaños, casos de uso…>

## Cuándo usarlo

<una línea>

| Querés… | Usá |
|---|---|
| … | … |

<los límites, como callouts inline donde importan:>

> …

## Atributos

<!-- @api:atributos -->
<!-- /@api:atributos -->

## Eventos

<!-- @api:eventos -->
<!-- /@api:eventos -->

## Slots

<!-- @api:slots -->
<!-- /@api:slots -->

## Métodos expuestos

<!-- @api:metodos -->
<!-- /@api:metodos -->
````

   A mano va: la descripción de una línea, `[← Volver](../README.md)`, `## Uso en HTML plano` con un
   ejemplo, las secciones curadas, `## Cuándo usarlo` (con la tabla "querés… → usá") y los límites
   **como callouts inline donde importan** — la lista completa de límites va en la receta de la
   skill (paso 6), no hace falta repetirla acá en una sección aparte. Las tablas de API al final van
   **entre marcadores y no se escriben a mano**: detalle en «Mantenimiento de las tablas de API (son
   generadas)».

5. **Escribir la ficha Vue** — igual que el paso 4 pero en clave Vue:

````md
# `X`

<la misma descripción, con el nombre Vue>

[← Volver](../README.md)

## Uso en Vue

```vue
<script setup lang="ts">
import X from "@/components/<cat>/X.vue";
</script>

<template>…</template>
```

<las mismas secciones curadas que la vanilla, en clave Vue>

## Cuándo usarlo

<la misma tabla "querés… → usá">

<los mismos límites, como callouts inline>

## Props

<!-- @api:props -->
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
<!-- /@api:expose -->
````

   **Mismas secciones curadas que la vanilla, con los mismos nombres de props** en cada idioma (si
   la vanilla habla de `loading`, la Vue también). Las tablas de API van entre marcadores, igual que
   en el paso 4.

6. **Escribir la receta en la skill** (`skills/use-comegen/references/<kebab>.md`). Es el archivo
   que se lleva quien consume la lib (viaja con `skills add`), así que tiene que ser
   **autosuficiente** y **no puede ser un symlink**. Estructura y marcadores exactos:

   ````md
   # <Componente> — `<cu-x>` / `<X>`

   <qué es, en una línea>

   ## Cuándo usarlo

   <una línea>

   ## Receta                    ← pasos + ejemplo HTML plano + ejemplo Vue

   ## Qué puede y qué no puede  ← la lista COMPLETA de límites: es el lugar canónico

   ## API del custom element

   ### Atributos
   <!-- @api:atributos -->
   <!-- /@api:atributos -->

   ### Eventos
   <!-- @api:eventos -->
   <!-- /@api:eventos -->

   ### Slots
   <!-- @api:slots -->
   <!-- /@api:slots -->

   ### Métodos expuestos
   <!-- @api:metodos -->
   <!-- /@api:metodos -->

   ## API del componente Vue

   ### Props
   <!-- @api:props -->
   <!-- /@api:props -->

   ### Emits
   <!-- @api:emits -->
   <!-- /@api:emits -->

   ### Slots
   <!-- @api:slots-vue -->
   <!-- /@api:slots-vue -->

   ### Expose
   <!-- @api:expose -->
   <!-- /@api:expose -->
   ````

   Importante: como la receta junta las dos APIs en un archivo, los slots del CE usan
   `@api:slots` y los de Vue `@api:slots-vue` (no repetir `@api:slots`). Son **las mismas**
   secciones de las fichas, con los mismos datos: si una dice algo distinto, gana el código y se
   corrigen las tres. Modelo a copiar: `skills/use-comegen/references/button.md`.

7. **NUEVO — Demos reales** (van en la **página Vue**: usan la API de Vue). **Un archivo `.vue` por
   feature** en `docs/site/examples/<componente>/`, con nombre `Componente<Feature>Example.vue`
   (p. ej. `ButtonVariantsExample.vue`), y la página los importa **seccionados con un `###` por
   feature** — no un bloque único al final.

   Cada ejemplo es un **SFC completo y copy-pasteable**:

   ```vue
   <script setup lang="ts">
   import Button from "@/components/buttons/Button.vue";
   </script>

   <template>
     <Button color="primary" variant="solid">solid</Button>
   </template>
   ```

   y en la página cada feature va con su propio `###`:

   ```md
   ## Demos en vivo

   ### Variantes

   <ClientOnly>
     <div class="cu-demo">
       <ButtonVariantsExample />
     </div>
   </ClientOnly>
   ```

   Ojo con los imports: el alias `@` apunta a `src`, así que **el ejemplo** importa el componente
   como `@/components/…`, pero **la página** importa el ejemplo con ruta **relativa**
   (`../../examples/<componente>/X.vue`). Regla: **los ejemplos tienen que compilar** — un bloque de
   código en el `.md` puede mentir para siempre, un ejemplo real no.

8. **Crear/actualizar la página** con el **mismo `title`** que su contraparte y su `group`, y el
   `@include` correcto: `../../componentes/<tag>.md` para la página vanilla (dos niveles) y
   `../../../componentes/vue/<kebab>.md` para la Vue, que vive un nivel más adentro
   (`docs/site/componentes/vue/`):

   ```md
   ---
   title: X
   group: <Buttons | Formularios | Controles | Información | Markdown | Overlay | Navegación | Datos | Theme | Otros>
   ---

   <!--@include: ../../componentes/<tag>.md-->
   ```

9. **Índice**: si el componente es nuevo, sumalo a `docs/componentes/README.md`.

10. **Validar**:

```bash
node scripts/check-docs.mjs     # tag↔ficha, @include sano, secciones obligatorias
node scripts/gen-api.mjs --check # las tablas de API generadas están al día
./scripts/preflight.sh          # type-check + tests + gate
pnpm build                      # el sitio: caza dead links y que los ejemplos compilen
pnpm dev                        # mirar el sitio (sidebar sale del frontmatter)
```

## Reglas

- **Gana el código.** Si la ficha y el `.ce.vue`/`.vue` no coinciden, la ficha está mal.
  No la defiendas: corregila.
- **Si el bug es del wrapper, se arregla el wrapper** (no se documenta el bug). Después
  actualizá la ficha. Los bugs de paridad CE↔Vue se testean en
  `src/components/customElements/ce-parity.test.ts`.
- **No inventes APIs.** Todo sale del SFC: si una prop no está en `defineProps`, no existe.
- **No digas lo mismo en dos lados**: el cuerpo vive en la ficha, la página sólo incluye.
- Los callouts de divergencia (`> El Custom Element …`) van **sólo en la ficha vanilla**.
- **El JSDoc es la fuente de la tabla generada.** La descripción de cada prop sale del `/** … */`
  del SFC: un JSDoc pobre da una tabla pobre, y un JSDoc bueno documenta solo.
- **Los ejemplos tienen que compilar.** Un bloque de código en el `.md` puede quedar mintiendo para
  siempre sin que nadie lo note; un `.vue` real lo caza el build.
- **La prosa no se duplica tres veces.** Los límites van como callout en las fichas (donde importan)
  y la lista completa en la receta; las tablas de API sí se repiten en los tres artefactos, pero
  porque se generan, no porque se escriban.
- `check-docs.mjs` valida **estructura** (existencia, `@include`, secciones obligatorias) pero **no**
  el contenido ni los links. Para eso están la auditoría del paso 3 y `pnpm build`.

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
inyectan entre marcadores (pasos 4, 5 y 6). La prosa (cuándo usarlo, qué puede y qué no, ejemplos)
sí va a mano, y **fuera** de los marcadores.

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
  y el `.vue` para la ficha Vue. Los eventos del CE salen de los `ceEmit('evento', …)` del
  wrapper (no de `defineEmits`), y los métodos expuestos del `defineExpose` del SFC.
- El extractor es determinista: `--check` da estable y está en el preflight.
