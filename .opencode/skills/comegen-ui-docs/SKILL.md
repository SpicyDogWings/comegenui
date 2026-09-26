---
name: comegen-ui-docs
description: Guía para documentar componentes de ComegenUI 2.x. Úsala cuando se pida crear, actualizar o auditar la documentación de un Custom Element de ComegenUI (los archivos en `docs/skills/use-comegen/componentes/cu-*.md`).
---

# Documentar ComegenUI

Skill de **documentación** para ComegenUI 2.x. Cubre cómo derivar la API pública de un componente desde su `.ce.vue`, cómo escribir la ficha `.md`, cómo armar su página en el sitio y cómo auditar documentación existente contra el código.

> **Premisa clave:** la API que se documenta es la del **custom element** (lo que el `.ce.vue` expone al host), porque es lo que viaja en el UMD. La ficha suma un apartado **Vista Vue** con el uso desde Vue, pero el `.vue` interno y la `interface Column` de `AdvancedTable.vue` **no son** la API pública — solo lo que el `.ce.vue` expone.

> **No hay generación automática:** la ficha y la página se escriben a mano. Si tocás un componente, actualizá las dos.

---

## Cuándo usar esta skill

Cargala cuando la tarea sea alguna de:

- **Crear** la documentación de un componente nuevo (no hay `.md` aún).
- **Actualizar** la documentación de un componente existente (cambió el `.ce.vue`).
- **Auditar** la documentación contra el código (revisar que el `.md` refleje lo que el `.ce.vue` expone).
- **Comparar** dos componentes para unificar estilo o extraer patrones.

Si la tarea es **modificar el código fuente** de un componente (`.ce.vue`, `.vue`, `.ts`), esta skill no aplica — seguí `AGENTS.md` (arquitectura y patrón de 3 archivos).

---

## Índice

1. [Arquitectura de componentes](arquitectura.md) — el patrón de 3 archivos y qué hace cada uno.
2. [Cómo extraer la API del `.ce.vue`](guia-extraccion.md) — paso a paso, qué leer y qué ignorar.
3. [Convenciones del proyecto](convenciones.md) — colores, variantes, naming, eventos.
4. [Plantilla de documentación](plantilla.md) — esqueleto del archivo `.md` por componente.
5. [Errores comunes](errores-comunes.md) — qué evitar al escribir docs.
6. [Checklist de auditoría](checklist-auditoria.md) — qué verificar cuando se compara un `.md` con su `.ce.vue`.

---

## Workflow general

### Para crear o actualizar una ficha + su página

1. Leer el `<Componente>.ce.vue` (si existe) y el `<Componente>.vue` real, y aplicar la [guía de extracción](guia-extraccion.md).
2. Anotar props, eventos, slots, métodos y variantes.
3. Consultar las [convenciones](convenciones.md) para nombres kebab-case, defaults, eventos nativos vs custom.
4. Escribir la **ficha** con la [plantilla](plantilla.md): secciones vanilla (`## Uso en HTML plano`, ejemplos `html`), el apartado `## Vista Vue` y las tablas de API (`Props`, `Eventos`, `Slots`, `Métodos expuestos`) al final. Todo a mano.
5. Crear/actualizar la **página del sitio** `docs/site/componentes/<slug>.md`: frontmatter `title`/`group`, `<!--@include: ../../skills/use-comegen/componentes/<tag>.md-->` y demos en vivo (`<ClientOnly>` + `<div class="cu-demo">`). Si el componente es interno (sin ficha), la página lleva el contenido completo.
6. Si es componente con props complejas (arrays/objetos), recordar la sección "Asignar como propiedad JS".
7. Si el componente hereda props del tema (`theme`, `color`, `variant`, `hightContrast`), documentarlas en bloque.
8. Pasar el [checklist de auditoría](checklist-auditoria.md) y correr `./scripts/preflight.sh`.

### Destinos de la documentación

| Destino | Ubicación | Audiencia |
|---|---|---|
| **Ficha del componente** | `docs/skills/use-comegen/componentes/cu-<tag>.md` (canonical; viaja en el zip) | Agentes IA + humanos |
| **Página del sitio** | `docs/site/componentes/<slug>.md` (versionada; **incluye** la ficha + demos) | Humanos |

> La **ficha** es la única fuente del cuerpo: la página no la duplica, la incluye con
> `<!--@include: ../../skills/use-comegen/componentes/<tag>.md-->` y le agrega demos. Así la
> misma prosa sirve al zip y al sitio.

> `slug` = el tag (`cu-button`) para los custom elements, y el kebab del nombre (`dropdown`,
> `loader`) para el resto. Los componentes internos (sin ficha) llevan el contenido completo en
> la página.

### Índices a actualizar — Skill (agentes)

1. **`docs/skills/use-comegen/SKILL.md`** (canonical) — 3 lugares:
    - Tabla "Archivos disponibles" (agregar `Cu<Nombre>.umd.js` / `<cu-xxx>` / descripción).
    - Tabla "Default de `variant` por componente" (si tiene variant).
    - Índice "Componentes" (link a `componentes/cu-xxx.md`).
    - Si corresponde, la tabla de "Variantes disponibles" y la de "Tamaño de los bundles" (los tamaños salen del `pnpm build:lib`).
2. **`docs/skills/use-comegen/componentes/cu-<tag>.md`** (canonical) — la ficha del componente.

> El nav/sidebar del sitio se arma solo: `docs/site/.vitepress/sidebar.ts` lee `title`/`group` del
> frontmatter de cada página.

### Validación post-documentación

Después de documentar, verificá:
- `./scripts/preflight.sh` (el gate `check-docs` valida que cada tag tenga ficha y página, y que la página tenga `title`/`group`).
- Que la ficha y la página digan lo mismo que el SFC — el gate **no** compara contenido.
- Que el tag aparezca en los índices de `docs/skills/use-comegen/SKILL.md`.

### Para auditar un `.md` existente

1. Leer el `.md` y el `.ce.vue` correspondiente.
2. Aplicar la [guía de extracción](guia-extraccion.md) al `.ce.vue`.
3. Comparar tabla por tabla con el [checklist de auditoría](checklist-auditoria.md).
4. Si hay diferencias, corregir el `.md` para reflejar el `.ce.vue` (no al revés).
5. Si encontrás algo que parece un bug en el `.ce.vue`, **no lo corrijas desde la doc** — registralo en `docs/notes/` (ver `00-README.md` de esa carpeta).

---

## Regla de oro

> **El `.ce.vue` siempre gana.** Si la documentación dice algo distinto a lo que el `.ce.vue` expone, la documentación está mal. No la "defiendas" diciendo "pero la versión anterior..." — corregila.

Esto es importante porque:

- El `.ce.vue` es lo que se compila a UMD y distribuyen los usuarios.
- Los `.vue` internos pueden cambiar sin que la API pública lo haga.
- Los tipos de TypeScript del `.vue` interno describen el comportamiento de Vue, no del Web Component.

---

## Archivos de referencia en el proyecto

**Fuente de verdad:**
- `src/components/**/<Nombre>.ce.vue` — API pública (la fuente de verdad).
- `src/components/**/<Nombre>.vue` — implementación interna (referencia, no para docs).
- `src/lib/**/<kebab>.ts` — punto de entrada del build (define el tag del custom element).

**Destino — Ficha (canonical):**
- `docs/skills/use-comegen/SKILL.md` (canonical) — skill de uso.
- `docs/skills/use-comegen/componentes/<tag>.md` — ficha del componente (viaja en el zip).
- `.opencode/skills/comegen-ui/` → symlink al canonical (lo lee opencode).
- `.agents/skills/use-comegen/` → symlink al canonical (lo lee el agente del huésped).

**Destino — Sitio:**
- `docs/site/componentes/<slug>.md` — página (frontmatter + include de la ficha + demos).
- `docs/site/.vitepress/sidebar.ts` — arma el sidebar desde `title`/`group`.

**Destino — Índices:**
- `docs/skills/use-comegen/SKILL.md` — índice de la skill de uso.
- `docs/notes/` — notas internas sobre problemas pendientes.
