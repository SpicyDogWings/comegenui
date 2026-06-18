# Nota 02 — Typo `hightContrast` en 11 componentes

**Fecha:** 2026-06-18
**Severidad:** Baja (cambio breaking si se corrige sin cuidado)
**Estado:** Pendiente de decisión

## Problema

La prop de "alto contraste" está mal escrita como `hightContrast` (sin la segunda "h") en **todos** los archivos `.ce.vue` y `.vue` que la exponen. El término correcto en inglés es `highContrast`.

## Componentes afectados

| Componente | Archivo `.ce.vue` | Línea aprox. |
|---|---|---|
| `<cu-alert>` | `src/components/Alert.ce.vue` | 13 (prop), 78 (binding) |
| `<cu-badge>` | `src/components/Badge.ce.vue` | — |
| `<cu-button>` | `src/components/Button.ce.vue` | — |
| `<cu-dropdown-menu>` | `src/components/DropdownMenu.ce.vue` | 13 (prop), 55 (binding) |
| `<cu-table>` | `src/components/data/Table.ce.vue` | — (no expone) |
| `<cu-autocomplete>` | `src/components/form/Autocomplete.ce.vue` | 27 |
| `<cu-checkbox>` | `src/components/form/Checkbox.ce.vue` | 43 |
| `<cu-input>` | `src/components/form/Input.ce.vue` | — |
| `<cu-label>` | `src/components/form/Label.ce.vue` | — |
| `<cu-select>` | `src/components/labs/Select.ce.vue` | 34 |
| `<cu-switch>` | `src/components/form/Switch.ce.vue` | — |
| `<cu-textarea>` | `src/components/form/Textarea.ce.vue` | — |

(Verificar las líneas exactas con `grep "hightContrast" src/components/**/*.vue`.)

## Razón para no corregirlo automáticamente

La prop está expuesta en HTML como `hight-contrast` (kebab-case) y en JS como `hightContrast`. Cambiar a `highContrast` / `high-contrast` es un **breaking change** para todos los usuarios que la estén usando.

## Opciones

### Opción A — No tocar (recomendado a corto plazo)

Dejarlo como está. La documentación actual usa `hightContrast` consistentemente y refleja lo que el código expone. El costo es cosmético (search engines, autocompletado, linters).

### Opción B — Deprecar y migrar

1. Agregar `highContrast` como nueva prop.
2. Marcar `hightContrast` como deprecated en cada `.ce.vue` con un `console.warn` en `watch`.
3. Si ambas están definidas, `highContrast` tiene prioridad.
4. Después de un ciclo de releases, eliminar `hightContrast`.
5. Actualizar la documentación para reflejar la nueva prop, manteniendo una nota de migración.

### Opción C — Corrección silenciosa (breaking)

Renombrar a `highContrast` y bumpear versión major (3.0.0). Útil si el proyecto aún no tiene usuarios productivos o si se decide romper compatibilidad en este punto del ciclo.

## Recomendación

**Opción A ahora, Opción B en una versión futura.** La librería está en `2.3.0`; un cambio así no debería ir en una minor. Planificar para `3.0.0`.

## Impacto en la documentación

- **Actual:** todos los `.md` reflejan correctamente la prop `hightContrast`. Sin cambios pendientes.
- **Si se aplica Opción B:** los `.md` deben actualizarse para mostrar `highContrast` como recomendada y `hightContrast` como deprecated.
- **Si se aplica Opción C:** los `.md` deben renombrar todas las menciones.

Buscar la cadena `hightContrast` en `componentes/*.md` y `SKILL.md` para listar las menciones exactas antes de cualquier cambio.
