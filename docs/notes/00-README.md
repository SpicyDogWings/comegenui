# Notas internas — Auditoría de ComegenUI

Esta carpeta documenta **problemas pendientes** y decisiones técnicas que no afectan a la documentación de uso (que está en `docs/componentes/`), pero que el equipo debe conocer para mantener la librería y su documentación alineadas con el código.

Los archivos son notas internas — **no** se exponen a usuarios finales de la librería. Son material de referencia para el próximo ciclo de auditoría o para contribuciones al código fuente.

---

## Índice de notas

| # | Tema | Severidad | Acción sugerida |
|---|------|-----------|-----------------|
| [01](./01-build-glob.md) | `build-libs.ts` no excluye `archived/` ni `data/index.ts` | Media | Editar el patrón de `fast-glob` |
| [02](./02-hightcontrast.md) | Typo `hightContrast` (debería ser `highContrast`). Hoy **sólo** lo expone `<cu-label>` (el resto era prop muerta y se eliminó) | Baja | Evaluar migración con `deprecation warning` o corregir junto con el resto |
| [03](./03-table-ce-passthrough.md) | Interface `Column` del `<cu-table>` no incluye los campos extendidos que `AdvancedTable.vue` sí procesa | Info | Ya documentado en `docs/componentes/cu-table.md` |
| [04](./04-eventos-no-reemitidos.md) | Los eventos nativos del DOM burbujean por Shadow DOM; el `.ce.vue` no los re-emite como eventos custom | Info | Ya documentado en las fichas vanilla (`docs/componentes/<tag>.md`, sección `## Eventos`) |
| [07](./07-docs-vs-skill.md) | Docs y skill dejaron de ser lo mismo: fichas en `docs/componentes/`, receta en `.opencode/skills/use-comegen/`, y el zip pasa a llevar sólo la lib | Info | Ya aplicado (decisión registrada) |

> Las notas **05** (`cu-avatar` sin `src`, `cu-command-palette` sin `commands`) y **06**
> (`cu-markdown` sin `parsed` ni `headingIds`) quedaron **resueltas**: se arreglaron los
> wrappers y hay tests de regresión en `src/components/customElements/ce-parity.test.ts`.

---

## Cómo se generaron estas notas

Durante la auditoría del 2026-06-18 se revisaron los 14 `.ce.vue` públicos y se compararon con la documentación de `componentes/*.md`. Como resultado:

- 13 archivos `.md` de la skill fueron reescritos o corregidos.
- 4 problemas no resueltos quedaron registrados acá porque requieren cambios en el código fuente o son decisiones de diseño.

En la auditoría del 2026-09-26 (separación docs/skill + fixes de paridad CE↔Vue) se
revisaron los 32 wrappers, se corrigieron los que no forwardeaban props/eventos/slots/métodos
y se eliminaron las notas obsoletas.

Cualquier cambio en los archivos de código (`.ce.vue`, `.vue`, `.ts`) debe re-evaluar la nota correspondiente. Si la nota queda obsoleta, eliminarla.
