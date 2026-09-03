---
name: comegen-ui-docs
description: Guía para documentar componentes de ComegenUI 2.x. Úsala cuando se pida crear, actualizar o auditar la documentación de un Custom Element de ComegenUI (los archivos en `.opencode/skills/comegen-ui/componentes/cu-*.md`).
---

# Documentar ComegenUI

Skill de **documentación** para ComegenUI 2.x. Cubre cómo extraer la API pública de un componente desde su `.ce.vue`, cómo escribir el archivo `.md` correspondiente, y cómo auditar documentación existente contra el código.

> **Premisa clave:** la documentación es para **consumo en HTML plano con UMD**, no para entornos Vue. El archivo fuente de verdad siempre es el `.ce.vue` (el wrapper de Custom Element). El `.vue` interno y la `interface Column` de `AdvancedTable.vue` **no son** la API pública — solo lo que el `.ce.vue` expone al host.

---

## Cuándo usar esta skill

Cargala cuando la tarea sea alguna de:

- **Crear** la documentación de un componente nuevo (no hay `.md` aún).
- **Actualizar** la documentación de un componente existente (cambió el `.ce.vue`).
- **Auditar** la documentación contra el código (revisar que el `.md` refleje lo que el `.ce.vue` expone).
- **Comparar** dos componentes para unificar estilo o extraer patrones.

Si la tarea es **modificar el código fuente** de un componente (`.ce.vue`, `.vue`, `.ts`), esta skill no aplica — usá la skill de desarrollo del proyecto.

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

### Para crear o actualizar un `.md`

1. Leer el archivo `<Componente>.ce.vue` y aplicar la [guía de extracción](guia-extraccion.md).
2. Anotar props, eventos, slots, métodos y variantes.
3. Consultar las [convenciones](convenciones.md) para nombres kebab-case, defaults, eventos nativos vs custom.
4. Llenar la [plantilla](plantilla.md) con los datos extraídos.
5. Escribir ejemplos de uso en HTML plano (no Vue).
6. Si es componente con props complejas (arrays/objetos), recordar la sección "Asignar como propiedad JS".
7. Si el componente hereda props del tema (`theme`, `color`, `variant`, `hightContrast`), documentarlas en bloque.
8. Pasar el [checklist de auditoría](checklist-auditoria.md) sobre el `.md` resultante.

### Destinos de la documentación

Documentar un componente significa actualizar **2 destinos distintos**:

| Destino | Ubicación | Tipo | Audiencia |
|---|---|---|---|
| **Skill** | `.opencode/skills/comegen-ui/` | Skill (receta) | Agentes IA (viaja con el zip) |
| **Docs** | `docs/comegen-ui/`, `docs/DOCS.md`, `COMPONENTS-GUIDE.md` | Documentación | Humanos |

> La skill de uso (`comegen-ui`) es una **receta para el agente**, no documentación. La documentación real vive en `docs/`.

### Índices a actualizar — Skill (agentes)

1. **`.opencode/skills/comegen-ui/SKILL.md`** — 3 lugares:
    - Tabla "Archivos disponibles" (agregar `Cu<Nombre>.umd.js` / `<cu-xxx>` / descripción).
    - Tabla "Default de `variant` por componente" (si tiene variant).
    - Índice "Componentes" (link a `componentes/cu-xxx.md`).
    - Si corresponde, la tabla de "Variantes disponibles" y la de "Tamaño de los bundles" (los tamaños salen del `pnpm build:lib`).
2. **`.opencode/skills/comegen-ui/componentes/<nombre>.md`** — el archivo de API del componente.

### Índices a actualizar — Docs (humanos)

1. **`docs/comegen-ui/componentes/<nombre>.md`** — copia del `.md` de la skill (verificar con `diff`).
2. **`docs/DOCS.md`** — tabla "Componentes disponibles" (agregar fila con link al `.md`).
3. **`COMPONENTS-GUIDE.md`** (raíz del repo) — índice, listado de `<script>` de instalación, tabla "Archivos disponibles", y una sección `### <cu-xxx>` completa con props/slots/uso.
4. **`docs/desarrollar-comegen-ui/convenciones-desarrollo.md`** — solo si el componente introduce una convención nueva.

> Regla de oro: **el tag `<cu-xxx>` debe aparecer en TODOS los índices o en ninguno.** Si solo lo agregás al `.md` y al skill, el componente queda "documentado pero invisible" para humanos.

### Validación post-documentación

Después de documentar, auditar con **skill-auditor** para verificar:
- Los `.md` en skill y docs son idénticos (`diff`).
- El tag aparece en todos los índices.
- No hay ruido documental (la skill sigue siendo receta, no doc).

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
- `src/components/**/<Nombre>.ts` — punto de entrada del build.

**Destino — Skill (agentes):**
- `.opencode/skills/comegen-ui/SKILL.md` — skill de uso.
- `.opencode/skills/comegen-ui/componentes/<nombre>.md` — API del componente.

**Destino — Docs (humanos):**
- `docs/comegen-ui/` — documentación para humanos.
- `docs/DOCS.md` — índice principal.
- `COMPONENTS-GUIDE.md` — guía de componentes (raíz del repo).
- `docs/notes/` — notas internas sobre problemas pendientes.
