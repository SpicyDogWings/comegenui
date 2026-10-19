---
name: documenter
description: 'Receta para documentar un componente de ComegenUI: deja claro dónde y qué se documenta (las dos páginas del sitio —vanilla y Vue—, sus fichas compuestas por partials y la receta que viaja en la skill), cómo validar la API antes de escribir, cómo demostrar visualmente todo lo que el componente puede hacer y cómo mostrar su uso en código (fiel en las fichas, patrón + referencia en la receta). Usar cuando se pida "documentá el componente", "actualizá la doc de cu-x", "dónde va esta sección", "validar la API del componente", "demostrar el componente", "cómo se usa el componente" o "revisá que la doc coincida con el código".'
metadata:
  repository: https://github.com/SpicyDogWings/comegenui
  path: docs/skills/documenter
  version: 5.1.2
---

# Documentar un componente

## Dónde se documenta

Siempre hay **2 fichas** (vanilla y Vue) y **1 receta**:

| Página (lado) | Scope | Archivo | Documenta |
|---|---|---|---|
| **vanilla** | ficha vanilla | `docs/versiones/<id>/componentes/<tag>.md` | la API del **custom element**: atributos, eventos, slots, métodos |
| **Vue** | ficha Vue | `docs/versiones/<id>/componentes/vue/<kebab>.md` | la API del **componente Vue**: props, emits, slots, expose |
| — (no está en el sitio) | receta de la skill | `skills/use-comegen/references/<kebab>.md` | **las dos APIs** juntas + receta de uso |

- `<tag>` = tag del custom element (`cu-button`); `<kebab>` = nombre del componente Vue en kebab
  (`Button` → `button`).
- Cada **página** del sitio sólo **incluye** su ficha (`<!--@include-->`): la ficha es la fuente,
  la página no agrega API.
- La **receta** no vive en el sitio: viaja con la lib (`skills add`) y es **autosuficiente**.
- La **receta es del agente**: no lleva nada pensado para una persona (prosa, "por qué", pasos de
  instalación de la skill). Eso vive en el README y en el sitio.
- **Siempre 2 fichas**, nunca una unificada (esto revierte el piloto de `cu-button`,
  `docs/notes/10-ficha-unificada.md`).

### Las fichas se componen de partials

Las 2 fichas **no repiten** lo que comparten: cada sección vive en un **partial** y las fichas lo
**incluyen** (VitePress `<!--@include-->`, nativo; se expande antes de parsear, sin runtime).

```
docs/versiones/<id>/partials/<kebab>/     ← <id> = la `latest` del manifiesto (docs/versions.json)
  props.md          ← igual en vanilla y Vue → la incluyen las 2 fichas
  props-vue.md      ← divergió → sólo la ficha Vue
  props-vanilla.md  ← divergió → sólo la ficha vanilla
  slots.md  eventos.md  metodos.md  …
```

- Sección **igual** en las 2 fichas → **un** partial (`props.md`); si **difiere** → **dos**
  (`props-vue.md` + `props-vanilla.md`). Nunca se resuelve duplicando la ficha entera.
- La **cabecera** (`## Props`, `## Atributos`, …) la escribe la **ficha**; el partial lleva **el
  cuerpo** (la tabla). Así una sección compartida sirve a las dos aunque el título cambie.
- Los partials **no** van dentro de `docs/versiones/<id>/componentes/` ni `docs/versiones/<id>/componentes/vue/` (el gate los
  tomaría por fichas).
- El `@include` es **relativo al archivo que incluye**: la ruta cambia entre la ficha vanilla
  (`../../partials/…`) y la ficha Vue (`../../../partials/…`).

### Migrar un componente a partials

1. `mkdir -p docs/versiones/<id>/partials/<kebab>`.
2. `node scripts/gen-api.mjs --plan <kebab>` → lista los archivos **exactos** que va a usar:
   `<base>.md` si la sección es igual en las dos fichas, o `<base>-vanilla.md`/`<base>-vue.md` si
   difiere.
3. En **las 2 fichas**, reemplazar cada tabla inline (con sus marcadores) por un `<!--@include-->`
   debajo de su cabecera:
   - vanilla → `<!--@include: ../partials/<kebab>/<archivo>.md-->`
   - Vue → `<!--@include: ../../partials/<kebab>/<archivo>.md-->`
4. `node scripts/gen-api.mjs` (**corrida completa**: crea/llena los partials) y
   `node scripts/check-docs.mjs`.

> **Generá con la corrida completa, no filtrada.** `gen-api` no es determinista entre corridas
> (el orden de las props depende del estado del checker), así que `--check` es la única referencia.
> No corras `gen-api` sin `--plan` para *ver*: usá `--plan`, que es de sólo lectura.

### Un componente está completo cuando…

1. **API (Paso 1):** las 2 fichas terminan con las secciones de API, generadas del SFC y compartidas
   por partials.
2. **Demostración (Paso 2):** el cuerpo de **cada** ficha tiene una sección por **capacidad** (una
   prop, o un grupo que comparte función) que muestra **todas** sus variantes —no la más usada—, con
   su demo real: marcador `<!-- demo:<comp>-<slug> -->` en la ficha vanilla y el `.vue` en
   `docs/versiones/<id>/paginas/examples/<comp>/<slug>.vue` (se compone a `docs/site/examples/`, que
   está gitignoreado: la fuente versionada es la de `versiones/<id>/`). `check-docs` verifica que el
   id del marcador tenga su archivo.
3. **Uso (Paso 3):** cada sección muestra el **código fiel** de esa demostración, en el lenguaje de
   su ficha (vanilla → HTML; Vue → `.vue`). No pseudocódigo: espeja lo que se ve.
4. **Receta:** `skills/use-comegen/references/<kebab>.md` autosuficiente, con las dos APIs (patrón
   con valor de relleno + referencia) y la lista completa de límites.
5. `node scripts/check-docs.mjs`, `node scripts/gen-api.mjs --check` y `pnpm build` en verde.

Modelo completo: `docs/versiones/<id>/componentes/cu-button.md` + `docs/versiones/<id>/componentes/vue/button.md` +
`skills/use-comegen/references/button.md`.

## Regla dura: la API siempre está, y va al final

Toda ficha lleva **API** —como mínimo `props`/`atributos`— y va **al final de cada ficha, sin
excepción**.

- La API se **comparte** entre las 2 fichas vía partials; no se duplica la tabla en las dos fichas.
- Las tablas se **generan** del SFC (`scripts/gen-api.mjs`) **sólo donde hay marcadores `@api:*`**:
  hoy, las recetas de la skill. Las fichas y los partials **no llevan marcadores** y se mantienen a
  mano; ahí lo que valida el gate es `ficha-api.test.ts` (nombre de cada prop + default documentado,
  emits, slots y expose) — **no** los tipos ni las descripciones.
- La **prosa** no se comparte: cada scope la escribe para sí, **fuera** de la API.
- La **receta** no incluye partials (viaja sola) y lleva **su propia copia** de las dos APIs, generada
  del SFC: se regenera con `node scripts/gen-api.mjs` y `--check` falla si driftó (también si un
  marcador `@api:*` de la receta quedó mal escrito, que antes se salteaba en silencio).
- Si una tabla dice algo distinto según el scope, **gana el código**: se corrige el SFC o el partial.

### Pero no todos los scopes dicen lo mismo (y está bien)

Comparten las **secciones**; los **datos** se validan **contra la fuente de cada scope**:

| Scope | Se valida contra | Por qué |
|---|---|---|
| ficha vanilla | el `.ce.vue` (o el `.vue` si el CE es directo) | la API pública del CE es **el wrapper**: lo que el `.vue` interno no forwardea, no existe para el usuario |
| ficha Vue | el `.vue` | la API pública de Vue es el componente, con sus props/emits/expose reales |
| receta de la skill | las dos fuentes | junta las dos APIs |

Ejemplo: un `.vue` puede declarar una prop que el `.ce.vue` **no** expone. Un `props.md` compartido
ahí **mentiría**; por eso una sección así se parte en `props-vue.md` + `props-vanilla.md`. Las
**secciones** son las mismas; los **valores** dependen de quién es cada scope.

### Secciones y marcadores (nombres exactos)

| Scope | Cabecera (en la ficha) | Marcador (en el partial) |
|---|---|---|
| vanilla | `## Atributos` · `## Eventos` · `## Slots` · `## Métodos expuestos` | `@api:atributos` · `@api:eventos` · `@api:slots` · `@api:metodos` |
| Vue | `## Props` · `## Emits` · `## Slots` · `## Expose` | `@api:props` · `@api:emits` · `@api:slots-vue` · `@api:expose` |
| receta | `## API del custom element` / `## API del componente Vue` (con `###`) | los mismos, con `###` |

> La **cabecera** vive en la ficha; el **partial** lleva el cuerpo (la tabla; si el archivo tiene
> marcadores `@api:*`, los llena `gen-api`). En la
> receta los slots del CE usan `@api:slots` y los de Vue `@api:slots-vue` (no repetir el mismo marcador
> en un archivo). Modelo a copiar: `skills/use-comegen/references/button.md`.

## Paso 1 — Validar la API (antes de escribir una sola línea)

Antes de redactar nada, se resuelve **qué scopes existen y qué API lleva cada uno**.

1. **Inventariar los scopes.**
   - ¿Hay `defineComegenElement('cu-x', …)` en `src/lib/**/*.ts`? → existe la ficha **vanilla**.
   - ¿Existe `src/components/customElements/.../X.ce.vue`? → la fuente de la vanilla es **ese
     wrapper**. Si no existe, el CE es el `.vue` directo (`cu-button`, `cu-floating-button`,
     `cu-badge`).
   - Sin entry en `src/lib` → el componente es **sólo Vue**: no hay ficha vanilla ni receta con API
     de custom element; sólo ficha Vue y su página.
   - **Siempre 2 fichas**: la vanilla y la Vue. La API se comparte por partials; si una sección
     difiere, se parte en `<sección>-vue.md` / `<sección>-vanilla.md`.

2. **Leer la fuente de cada scope** y anotar la API, sección por sección:
   - **Props/atributos:** nombre, tipo, default, valores válidos (`validator`) y descripción (sale del
     JSDoc del SFC).
   - **Eventos/emits:** en Vue, `defineEmits`; en el CE, los `ceEmit('evento', …)` del wrapper (no
     `defineEmits`). Lo que el wrapper no reenvía, no se documenta.
   - **Slots:** los que el wrapper **forwardea** de verdad.
   - **Expose/métodos:** el `defineExpose` del SFC que corresponde a cada scope.

3. **Pintar la API al final de cada ficha**, en su **partial** (compartido si es igual, partido si
   difiere). No se escribe a mano: se genera.

4. **Comparar scope por scope** contra su fuente. Si algo no coincide, se corrige la ficha — o el
   componente si es un **bug del wrapper** (no se documenta el bug).

```bash
node scripts/gen-api.mjs --check     # las tablas coinciden con el SFC (drift)
node scripts/check-docs.mjs          # cada componente tiene sus 2 fichas, el @include existe, 1 ficha = 1 página
```

## Paso 2 — Demostrar lo que puede hacer el componente

La API del paso 1 dice **qué existe**; el cuerpo **demuestra qué hace**. Fase 2 = **mostrar, no
explicar**: que el usuario vea, de forma **visual**, todo lo que el componente es capaz de hacer.

Esto vive en las **dos fichas** (ficha vanilla y ficha Vue) y sus páginas. **No** en la receta de la
skill.

Qué se demuestra:

- **Todas las variantes posibles de cada prop**, no la que más se usa: los 6 `color`, las 7
  `variant`, los 3 `size`… se muestran **todas**, juntas y a la vista.
- Igual con los **emits/eventos** y los **estados**.
- El **código** que produce cada demostración no va acá: es el **paso 3** (Cómo usarlos). En el paso
  2 sólo se muestra **el resultado a la vista**.

Cómo se agrupa:

- Se pueden **mezclar** capacidades en una misma sección cuando comparten una función: ahorra
  secciones.
- Pero si una función es **importante o compleja de usar/entender**, merece **su propia sección**.

### Modelo: `<Button>` (8 props → 7 secciones)

| Prop | Qué demuestra | Sección |
|---|---|---|
| `color` | los **6** colores | **Colores** |
| `variant` | las **7** variantes | **Variantes** |
| `size` | los **3** tamaños | **Tamaños** |
| `disabled` | estado atenuado | **Estados** |
| `loading` | spinner + `loading-change` | **Estados** |
| `to` | navega (renderiza `<a>`) | **Navegación** |
| `target` | `_blank`, etc. (**sólo** con `to`) | **Navegación** |
| `type` | `submit`/`reset` dentro de un `<form>` | **Formulario** |

Y el slot `default` (contenido e íconos SVG inline) → **Contenido e iconos**. O sea: 8 props + 1
slot → **7 secciones**, porque `disabled`+`loading` comparten **Estados** y `to`+`target` comparten
**Navegación**. Cada sección muestra **todas** sus variantes, no una.

**Una prop sin demostración no se inventa:** si algo no se puede mostrar solo (p. ej. `target` sin
`to`), se documenta como **límite** (callout `>`), no como sección. La lista completa de límites vive
en la receta (`## Qué puede y qué no puede`).

Modelo real: `docs/versiones/<id>/componentes/cu-button.md` (Colores, Variantes, Tamaños, Estados, Navegación,
Formulario, Contenido e iconos, Eventos).

## Paso 3 — Cómo usarlos

Acá está la **segunda bifurcación** (la primera fue el idioma del scope, en el paso 2): se muestra
**cómo se usan los componentes en código**, y el código **difiere entre Vue y vanilla**. Es el puente
entre la demostración visual (paso 2) y la API (paso 1).

### En las fichas: el ejemplo real y fidedigno

El código tiene que ser **el mismo ejemplo** que se demostró visualmente, sin resumir ni idealizar:
el desarrollador tiene que ver **exactamente** cómo llegar a ese resultado. Si el demo mostró los 6
colores, la ficha muestra el código de los 6 colores.

| Ficha | Bloque |
|---|---|
| vanilla | HTML plano: `<cu-button color="primary" variant="solid">…</cu-button>` |
| Vue | Vue: `<Button color="primary" variant="solid">…</Button>` |

### En la skill: el patrón, no las combinaciones

A una **IA** no le interesa cada combinación: reconoce **patrones** y ya tiene **todos los valores
posibles abajo**, en la API. Así que la receta **no repite** los 3 botones: muestra **un ejemplo con
un valor de relleno** (placeholder) que, 1) deja claro que ahí va un valor, y 2) **referencia** la
sección donde están los valores posibles.

```html
<!-- `<color>` / `<variant>`: relleno; los valores están en «Atributos» / «Props», abajo -->
<cu-button color="<color>" variant="<variant>"><label></cu-button>
```

```vue
<Button color="<color>" variant="<variant>"><label></Button>
```

Esto hace la **receta más compacta** y ahorra código. La regla:

- **Ficha = para el humano:** completa y fiel (todos los valores, el código tal cual).
- **Receta = para el agente:** el patrón + la referencia (los valores viven en `@api:atributos` /
  `@api:props`), sin texto que sólo le sirve al humano.

## Reglas

- **La receta es del agente.** `skills/use-comegen/**` es lo único que se le sirve al agente: sin
  prosa para humanos (el "por qué", el catálogo de combinaciones, cómo instalar la skill). Eso vive
  en el README y en el sitio. La receta lleva: procedimiento + patrón + referencia a la API.
- **Gana el código.** Si la ficha y el `.vue`/`.ce.vue` no coinciden, la ficha está mal: corregila.
- **No inventes APIs.** Todo sale del SFC: si no está en `defineProps` / `ceEmit` / `defineExpose`, no
  existe.
- **No digas lo mismo en la página:** la página sólo incluye la ficha.
- **La prosa no se duplica.** Los límites van donde importan; la API se comparte por partials entre
  las fichas y se genera en la receta.
