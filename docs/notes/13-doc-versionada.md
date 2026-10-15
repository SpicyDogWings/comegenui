# 13 — Doc versionada: la doc es la fuente, el sitio la compone

**Fecha:** 2026-10-15
**Severidad:** Info (decisión de arquitectura; migración pendiente)

Hoy ([nota 12](./12-versionado-docs.md)) cada versión publicada se **reconstruye desde su tag**:
`git worktree` + `pnpm install` + `site:sync` + `vitepress build` (y el build del alias vacía el
`outDir`, por eso latest va primero). Eso mezcla dos cosas distintas —**buildear el sitio** y
**generar documentación**— y hace caro/frágil publicar: cada build necesita los tags y el toolchain
de esa versión.

## Decisión

La **documentación es la fuente y está almacenada**; el sitio la **consume** para armar páginas.

- Los `.md` (fichas + partials + páginas) viven **fuera de `docs/site/`**, en `docs/versiones/<id>/`.
- Una versión nueva guarda **sólo lo que cambió** (la ficha/partial tocado, aunque el resto se
  parezca). Lo no afectado **se resuelve desde la versión anterior**.
- El build del sitio **no genera doc**: compone páginas (`@include`) a partir de la doc resuelta.
- La dirección es **la doc genera la page**, no la page genera la doc.

### Estructura

```
docs/
├── site/                 ← VitePress: theme + páginas finas (@include) + demos
└── versiones/
    ├── 5.1.1/            ← snapshot completo de esa versión
    └── 5.2.0/            ← overlay: sólo los archivos que cambiaron vs la anterior
```

Ejemplo real: se agrega una prop a `<cu-date-picker>` → en `versiones/<nueva>/` va
`partials/date-picker/props.md` (con la prop) y la ficha tocada; el resto de date-picker se resuelve
desde la versión anterior.

### Resolución (versión → árbol de doc)

Para la versión `V` se camina **de la más vieja a `V`** y **gana el último archivo del mismo path**:
`V` pisa a la anterior, que pisa a la suya. El resultado es el árbol de doc completo de `V`.

### Corte de una versión

1. **Materializar las tablas de API**: `gen-api --freeze` (a implementar) escribe las tablas en
   texto plano, sin marcadores `@api:*`, para que la versión sea autosuficiente: no necesita el SFC
   viejo ni su toolchain.
2. Guardar en `versiones/<id>/` **sólo lo que difiere** de la versión anterior.
3. Anotar la versión en `docs/versions.json` (id, label, `ref` del tag, `latest`).

### Composición y publicación

`pnpm docs:versions` resuelve el árbol de cada versión del manifiesto y **buildea sólo las que
cambiaron** (hash del árbol resuelto): sin `worktree`, sin `pnpm install`, sin rebuild de la lib.

## Migración (una vez)

1. Mover la doc actual (`docs/componentes/**`, `docs/partials/**`, `docs/site/componentes/**`) a
   `docs/versiones/<versión actual>/`.
2. Apuntar `gen-api` / `check-docs` a la raíz nueva y a la resolución por overlays.
3. Si se quiere historia: materializar las versiones viejas desde sus tags **una sola vez**.
4. Los demos de cada versión necesitan **su** bundle de la lib: se arma una vez por versión, no en
   cada build.

## Límites conocidos

- Una versión congelada **no se actualiza**: un error en su doc se corrige en la versión siguiente
  (o se reescribe ese archivo en su carpeta, a mano).
- El overlay **no hace merge fino**: si cambia una sección, se reescribe **el archivo entero** de esa
  versión (son partials chicos, así que es barato).
- Mientras dure la migración conviven las dos cosas: `docs/componentes|partials` (hoy) y
  `docs/versiones/` (nuevo). El resto de las notas y las skills siguen apuntando a la ubicación
  vieja hasta que se mueva el tooling.
