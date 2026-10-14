# Arquitectura — recorte para documentar

> La arquitectura del repo se explica **una sola vez**, en [`AGENTS.md`](../../../../AGENTS.md).
> Acá va solo el recorte que necesitás para escribir o revisar fichas, así no hay dos
> explicaciones que se desincronicen.

## Las dos capas

ComegenUI es una librería de **Vue**: el componente nace como `.vue`. Los `.ce.vue` son un
adaptador **encima**, que existe solo para consumir la lib en vanilla (HTML plano).
Decisión completa: [`docs/notes/11-dos-capas.md`](../../../notes/11-dos-capas.md).

| Capa | Archivos | Ficha | Consumidor |
|---|---|---|---|
| Vue | `X.vue` | `docs/componentes/vue/<kebab>.md` | apps Vue |
| Vanilla (CE) | `customElements/…/X.ce.vue` + `src/lib/…/x.ts` | `docs/componentes/<tag>.md` | HTML plano |

## Qué leer para documentar

| Archivo | Qué aporta | ¿Leerlo? |
|---|---|---|
| `X.vue` | Implementación (lógica, template, estilos) | **Sí** — de acá sale la API Vue |
| `X.ce.vue` | API **pública** del custom element (atributos, eventos, métodos) | **Sí** — es lo que consume el usuario vanilla |
| `src/lib/…/x.ts` | Solo registra el tag | No — alcanza con confirmar el `<cu-x>` |

- **No documentes** el motor interno de temas (`getColorMap`, `getHostTheme`): es interno
  y ya no se usa (ver `convenciones.md`).
- Los colores son **nombres semánticos** (`primary`, `neutral`, …) resueltos por CSS custom
  properties (`--cu-color-*`). El `.vue` **no** espera un hex.

## Si el `.vue` y el `.ce.vue` no coinciden

El `.ce.vue` es un adaptador **thin**: puede no reenviar todo lo que el `.vue` emite. Eso es
justo lo que define qué existe para el usuario vanilla.

- Evento reenviado con `ceEmit()` en el `.ce.vue` → **sí** está disponible en el CE.
- Evento del `.vue` que no aparece en el `.ce.vue` → **no** está disponible en el CE.
- Para la ficha **Vue** vale, en cambio, lo que expone el `.vue` directamente.

> Ejemplo: `AdvancedTable.vue` (interno) emite `row-click`, pero `<cu-table>` no lo re-emite.

## Ubicaciones

| Carpeta | Qué contiene |
|---|---|
| `src/components/` | Componentes que no son de formulario ni datos |
| `src/components/form/` | Inputs y controles de formulario |
| `src/components/data/` | Tablas y listas |
| `src/components/lab/` | Experimentales |
| `src/components/archived/` | Retirados; se siguen distribuyendo (ver `docs/notes/01-build-glob.md`) |

## Cadenas de wrappers

Algunos componentes no envuelven un único `.vue`:

```
DropdownMenu.ce.vue   (custom element)
  └─ DropdownMenu.vue (wrapper con props semánticas)
       └─ Dropdown.vue (motor genérico: toggle + panel + posicionamiento)
```

En esos casos, la ficha vanilla documenta el `.ce.vue` y la ficha Vue el `.vue` de arriba.
