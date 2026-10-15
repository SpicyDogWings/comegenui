# Nota 11 — Migración a fichas por partials

**Fecha:** 2026-10-15
**Severidad:** Info (seguimiento)

Modelo vigente (skill `documenter`): cada componente tiene **2 fichas** (vanilla + Vue) y la **API
se comparte por partials** en `docs/partials/<kebab>/`, que las dos fichas incluyen al final.
`scripts/gen-api.mjs` pasa al **modo partials** sólo cuando existe el directorio
`docs/partials/<kebab>/`; si no, sigue con las tablas inline (**modo legacy**).

## Cómo migrar un componente

1. Crear `docs/partials/<kebab>/`.
2. `node scripts/gen-api.mjs --plan <kebab>` → lista los archivos **exactos** que va a usar:
   `<base>.md` si la sección es igual en las dos fichas, o `<base>-vanilla.md`/`<base>-vue.md` si
   difiere. Bases: `props` (atributos/props), `eventos` (eventos/emits), `slots`, `metodos`
   (métodos/expose).
3. En **las 2 fichas**, reemplazar cada tabla inline (con sus marcadores) por
   `<!--@include: <ruta>/<archivo>.md-->` debajo de su cabecera:
   - vanilla → `../partials/<kebab>/<archivo>.md`
   - Vue → `../../partials/<kebab>/<archivo>.md`
4. `node scripts/gen-api.mjs` (**corrida completa**: crea/llena los partials) y
   `node scripts/check-docs.mjs`.

> **Generá con la corrida completa, no filtrada.** `gen-api` no es determinista entre corridas (el
> orden de props depende del estado del checker), y la decisión *shared/split* puede variar. `--plan`
> ya computa todos los componentes para coincidir con la corrida completa.

## Estado

**51 / 51 migrados.** Todas las fichas de `docs/componentes/` incluyen sus partials y no queda
ningún marcador `@api:` inline.

| | Total |
|---|---|
| Con custom element | 32 |
| Sólo Vue | 19 |
| **Fichas vanilla** | 32 |
| **Fichas Vue** | 51 |
| **Dirs de partials** | 51 |

## Lectores de la API

La API ya no está en la ficha: vive en los partials. Cualquier consumidor que la lea tiene que
componer la ficha primero.

- **Contrato de runtime** (`src/contracts/ficha-api.test.ts`): `scripts/ficha-api.mjs` expande los
  `<!--@include-->` de `docs/componentes/vue/<kebab>.md` (resolución relativa, igual que VitePress)
  y recién ahí busca los marcadores. Un partial **compartido** conserva el nombre vanilla del
  marcador, así que acepta los alias: `props`≡`atributos`, `emits`≡`eventos`, `expose`≡`metodos`.
- **`gen-api --check`** valida las tablas contra el SFC; no lee las fichas.

## Descripciones vacías (deuda visible)

La columna «Descripción» sale del **JSDoc** del SFC, así que una prop/emit/slot/método sin JSDoc
deja la celda en `—`. Es deuda de documentación, no un error:

- `node scripts/gen-api.mjs --check` la reporta (`descripciones vacías: N (baseline M)`) y **avisa**
  si algún componente supera su tope, sin hacer fallar el gate.
- El tope vive en `scripts/docs-baseline.txt` (`<kebab>` + cantidad, más `total`), medido sobre la
  **API Vue** (`props`/`emits`/`slots`/`expose`) de cada ficha. Hoy: **433 en 51 componentes**.
- Cuando el número baja (se sumó JSDoc), conviene regenerarlo con `node scripts/gen-api.mjs --update`
  (o `./scripts/guard.sh --update`) para dejar el tope ajustado.

> El conteo es otro que el de la nota 10 (469 en 64 fichas): aquel medía las tablas de las **fichas**
> —que duplicaban la API entre vanilla y Vue— y su chequeo vivía en el `check-docs` grande, que esta
> migración reemplazó por el mínimo.

