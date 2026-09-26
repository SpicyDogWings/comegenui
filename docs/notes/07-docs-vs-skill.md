# Nota 07 — Docs y skill dejaron de ser lo mismo

**Fecha:** 2026-09-26
**Severidad:** Info (decisión de arquitectura ya aplicada)

## Decisión

Hasta ahora la **skill de uso** (`docs/skills/use-comegen/`) *era* la documentación: sus
`componentes/cu-*.md` eran la fuente de verdad de la API, y la página del sitio sólo las
incluía. Eso mezclaba dos cosas con ciclos de vida distintos:

- **Docs** (referencia de API): las consume quien lee el sitio o trabaja en el repo. Es
  exhaustiva y cambia con cada componente.
- **Skill** (receta de uso): la consume un agente que quiere *hacer algo* con la lib
  (instalar, pasar datos, escuchar eventos). Es un procedimiento, no un catálogo.

Ahora son cosas separadas:

| | Docs | Skill |
|---|---|---|
| Qué es | referencia de API por componente | receta de pasos para usar la lib |
| Dónde vive | `docs/componentes/<tag>.md` (CE) + `docs/componentes/vue/<kebab>.md` (Vue) | `.opencode/skills/use-comegen/` (`SKILL.md` + `references/`) |
| ¿Viaja en el zip? | **No** | **No** (el zip lleva sólo la lib) |
| Estructura | ficha: atributos/eventos/slots/métodos · ficha Vue: props/emits/slots/expose | pasos numerados + `references/` que se cargan on demand |

## Consecuencias

- El zip `comegenui-v{version}.zip` pasó a llevar **sólo la lib** (UMDs + `css/` +
  `README-BUILD.md`). Los updaters (`update.sh`/`.ps1`/`.bat`) se eliminaron: la instalación
  es manual (descomprimir y copiar).
- Cada componente tiene **dos fichas** (vanilla y Vue) y **dos páginas**: la API del custom
  element y la del componente `.vue` no son la misma y ya no se mezclan en una tabla.
- Las páginas Vue se nombran por el **nombre del componente** (`vue/advanced-table`), no por
  el tag: evita el choque `cu-table` (AdvancedTable) vs `table` (Table interno).
- El sitio tiene un **select de modo** (`Vue` / `Vanilla`) en el topbar, antes del de temas
  (`docs/site/.vitepress/theme/DocsModeSelect.vue`). El modo se deriva de la URL (las páginas
  Vue viven bajo `/componentes/vue/`), así que el **sidebar queda filtrado a una sola familia
  en build, sin JS**: `buildSidebars()` devuelve un sidebar por prefijo de ruta y VitePress
  elige el más específico. Ambos lados de un componente comparten el `title` para poder mapear
  la contraparte. El select se oculta cuando el componente no tiene las dos familias (internos).
- **La única cosa en runtime es un redirect**: `transformPageData`/`transformHead` en
  `config.ts` inyecta un script inline en el `<head>` que, si `localStorage['cu-docs-mode']` no
  coincide con el modo de la página, hace `location.replace(<contraparte>)`. Corre **antes del
  primer paint**, así que no se ve la página equivocada (era el parpadeo de la implementación
  anterior, que redirigía desde Vue después de montar). No decide qué se renderiza: sólo navega.
- `scripts/check-docs.mjs` ahora valida además que cada `@include` apunte a una ficha
  existente, que cada ficha esté incluida una sola vez y que las secciones obligatorias
  estén presentes (antes sólo miraba existencia y frontmatter).

## Si algo de esto se revierte

Volver a empaquetar las fichas en el zip es *una línea* en `build-lib.ts` (`createZip`) y
copiar de nuevo los updaters desde el historial (`git show <commit>:update.sh`). No hay
ninguna otra dependencia de que las docs viajen.
