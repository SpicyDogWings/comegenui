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
