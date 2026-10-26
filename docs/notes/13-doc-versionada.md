# 13 — Doc versionada: la doc es la fuente, el sitio la compone

**Fecha:** 2026-10-15
**Estado:** implementado (la doc es la fuente versionada; el sitio la compone y publica por versión)

Antes ([nota 12](./12-versionado-docs.md)) cada versión publicada se **reconstruía desde su tag**:
`git worktree` + `pnpm install` + `site:sync` + `vitepress build`. Eso mezclaba dos cosas distintas
—**buildear el sitio** y **generar documentación**— y hacía caro/frágil publicar: cada build
necesitaba los tags y el toolchain de esa versión.

## Decisión

La **documentación es la fuente y está almacenada**; el sitio la **consume** para armar páginas.

- Los `.md` (fichas + partials + páginas) viven **fuera de `docs/site/`**, en `docs/versiones/<id>/`.
- Una versión nueva guarda **sólo lo que cambió** (la ficha/partial tocado, aunque el resto se
  parezca). Lo no afectado **se resuelve desde la versión anterior**.
- El build del sitio **no genera doc**: compone páginas (`@include`) a partir de la doc resuelta.
- La dirección es **la doc genera la page**, no la page genera la doc.
- Cada versión **congela su lib** (`esm-shared`) para que los demos corran la lib de esa versión.

### Estructura

```
docs/
├── site/                 ← VitePress: theme + páginas finas (@include) + demos
└── versiones/
    ├── 5.1.1/            ← snapshot completo de esa versión
    │   └── lib/          ← build esm-shared congelado (versionado en git)
    └── 5.2.1/            ← versión en curso (la `latest` del manifiesto)
```

Cuando una release reemplaza a otra (5.2.1 sobre 5.2.0), la versión vieja **sale del manifiesto y de
`versiones/`**: no se publica más y el selector no la muestra. Su doc y su lib quedan en el tag
(`v5.2.0`), que es la trazabilidad. `docs-versions` borra del destino las carpetas de versión que
salieron del manifiesto, para que tampoco queden accesibles por URL.

Ejemplo real: se agrega una prop a `<cu-date-picker>` → en `versiones/<nueva>/` va
`partials/date-picker/props.md` (con la prop) y la ficha tocada; el resto de date-picker se resuelve
desde la versión anterior.

### Resolución (versión → árbol de doc)

Para la versión `V` se camina **de la más vieja a `V`** y **gana el último archivo del mismo path**:
`V` pisa a la anterior, que pisa a la suya. El resultado es el árbol de doc completo de `V`.
El resolutor vive en `scripts/doc-tree.mjs` y lo usan `docs-compose`, `docs-freeze` y `gen-api`.

### Corte de una versión

1. **Materializar las tablas de API**: `pnpm docs:freeze <id>` escribe las tablas en texto plano,
   sin marcadores `@api:*`, para que la versión sea autosuficiente: no necesita el SFC viejo ni su
   toolchain.
2. Guardar en `versiones/<id>/` **sólo lo que difiere** de la versión anterior.
3. **Congelar la lib**: `pnpm docs:freeze <id> --with-lib` copia el build `esm-shared` a
   `versiones/<id>/lib/` (~2-3 MB, versionado en git). Los demos de esa doc corren esa lib.
4. Anotar la versión en `docs/versions.json` (id, label, `ref` del tag, `latest`).

### Composición y publicación

`pnpm docs:versions` resuelve el árbol de cada versión del manifiesto, lo compone
(`scripts/docs-compose.mjs`) y buildea **cada una** desde su doc y **su lib**: sin `worktree`, sin
`pnpm install`. Una versión cuyo `<out>/<id>/index.html` ya existe se saltea (salvo `--force`).
Cada build apunta el alias `@comegen-shared` a `docs/versiones/<id>/lib` (vía `COMEGEN_SHARED_DIR`);
si una versión no congeló su lib, cae al build actual (`dist-libs/esm-shared`).

## Migración (una vez)

1. ✅ **Mover** la doc a `docs/versiones/<id>/{componentes,partials,paginas}` (hecho con `5.1.1`;
   las profundidades se preservaron, así que los `@include` no cambiaron).
2. ✅ **Tooling**: `gen-api` y `check-docs` leen/escriben la fuente versionada; `pnpm docs:compose`
   materializa el árbol resuelto para el sitio (lo corren `dev` y `build`; los destinos están
   gitignoreados). El resolutor del overlay está en `scripts/doc-tree.mjs`.
3. ✅ **Rutas**: las recetas y skills ya apuntan a `docs/versiones/…` (no quedan referencias a
   `docs/componentes/` en `skills/`).
4. ✅ **Overlays + `--freeze`**: el resolutor (“gana el último archivo del mismo path”) está en
   `doc-tree.mjs`; `docs-freeze` materializa las tablas al cortar una versión y congela su lib.
5. ✅ **Deploy de versiones**: `docs-versions.mjs` compone por versión (sin worktree ni install),
   agrega la salida y arma el catálogo.

## Límites conocidos

- Una versión congelada **no se actualiza**: un error en su doc se corrige en la versión siguiente
  (o se reescribe ese archivo en su carpeta, a mano).
- El overlay **no hace merge fino**: si cambia una sección, se reescribe **el archivo entero** de esa
  versión (son partials chicos, así que es barato).
- La **lib versionada pesa** (~2-3 MB por versión) y se versiona en git: es el precio de que una doc
  congelada corra, de verdad, su propia lib.
