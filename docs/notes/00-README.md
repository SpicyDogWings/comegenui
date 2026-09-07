# Notas internas — Auditoría de ComegenUI

Esta carpeta documenta **problemas pendientes** y decisiones técnicas que no afectan a la documentación de uso (que está en `componentes/`), pero que el equipo debe conocer para mantener la librería y su documentación alineadas con el código.

Los archivos son notas internas — **no** se exponen a usuarios finales de la librería. Son material de referencia para el próximo ciclo de auditoría o para contribuciones al código fuente.

---

## Índice de notas

| # | Tema | Severidad | Acción sugerida |
|---|------|-----------|-----------------|
| [01](./01-build-glob.md) | `build-libs.ts` no excluye `archived/` ni `data/index.ts` | Media | Editar el patrón de `fast-glob` |
| [02](./02-hightcontrast.md) | Typo `hightContrast` (debería ser `highContrast`) en 11 componentes | Baja | Evaluar migración con `deprecation warning` o corregir masivamente |
| [03](./03-table-ce-passthrough.md) | Interface `Column` del `<cu-table>` no incluye los campos extendidos que `AdvancedTable.vue` sí procesa | Info | Ya documentado en `componentes/cu-table.md` (sección "Campos extendidos") |
| [04](./04-eventos-no-reemitidos.md) | Eventos nativos del DOM burbujean por Shadow DOM pero el `.ce.vue` no los re-emite como eventos custom | Info | Ya documentado en `SKILL.md` (sección "Notas técnicas") |
| [05](./05-wrappers-ce-incompletos.md) | `cu-avatar` no forwardea `src`; `cu-command-palette` sin prop `commands` ni métodos expuestos | Media/Alta | Forwardear `src` y exponer `commands` + `defineExpose` en los wrappers |

---

## Cómo se generaron estas notas

Durante la auditoría del 2026-06-18 se revisaron los 14 `.ce.vue` públicos y se compararon con la documentación de `componentes/*.md`. Como resultado:

- 13 archivos `.md` de la skill fueron reescritos o corregidos (ver SKILL.md principal).
- 4 problemas no resueltos quedaron registrados acá porque requieren cambios en el código fuente o son decisiones de diseño.

Cualquier cambio en los archivos de código (`.ce.vue`, `.vue`, `.ts`) debe re-evaluar la nota correspondiente. Si la nota queda obsoleta, eliminarla.
