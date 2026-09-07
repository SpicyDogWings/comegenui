---
name: documentar-comegen-ui
description: Guía para documentar componentes de ComegenUI 2.x. Úsala cuando se pida crear, actualizar o auditar la documentación de un Custom Element de ComegenUI (los archivos en `docs/comegen-ui/componentes/cu-*.md`).
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

### Índices a actualizar al crear un componente nuevo

Un componente nuevo **no está documentado solo con su `.md`**. Cuando se crea uno (ej. `<cu-card>`), hay que actualizar **todos** los índices que listan componentes. Verificarlos con `grep` por el tag del componente:

1. **`docs/comegen-ui/SKILL.md`** (usuario final) — 3 lugares:
   - Tabla "Archivos disponibles" (agregar `Cu<Nombre>.umd.js` / `<cu-xxx>` / descripción).
   - Tabla "Default de `variant` por componente" (si tiene variant).
   - Índice "Componentes" (link a `componentes/cu-xxx.md`).
   - Si corresponde, la tabla de "Variantes disponibles" y la de "Tamaño de los bundles" (los tamaños salen del `pnpm run build:lib`).
2. **`docs/DOCS.md`** — tabla "Componentes disponibles" (agregar fila con link al `.md`).
3. **`COMPONENTS-GUIDE.md`** (raíz del repo) — índice, listado de `<script>` de instalación, tabla "Archivos disponibles", y una sección `### <cu-xxx>` completa con props/slots/uso.
4. **Skill local `~/.agents/skills/use-comegen/`** — instalada por `update.sh`/`update.ps1` desde el zip (`use-comegen/`). Es una copia del canonical `docs/skills/use-comegen/`.
5. **`docs/desarrollar-comegen-ui/convenciones-desarrollo.md`** — solo si el componente introduce una convención nueva (ej. reglas CSS, especificidad de títulos `solid`, patrones de slots).

> Regla de oro: **el tag `<cu-xxx>` debe aparecer en todos los índices o en ninguno.** Si solo lo agregás al `.md` y al SKILL.md, el componente queda "documentado pero invisible" en `DOCS.md` y `COMPONENTS-GUIDE.md`.

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

- `src/components/**/<Nombre>.ce.vue` — fuente de verdad de la API.
- `src/components/**/<Nombre>.vue` — implementación interna (referencia, no para docs).
- `src/components/**/<Nombre>.ts` — punto de entrada del build (no suele afectar docs).
- `docs/comegen-ui/SKILL.md` — la skill que consume el usuario final.
- `docs/comegen-ui/componentes/<nombre>.md` — el archivo a crear/actualizar/auditar.
- `docs/notes/` — notas internas sobre problemas pendientes.
