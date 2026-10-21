# `docs/versiones/` — la documentación, versionada

Acá vive la **documentación en sí** (fichas, partials y páginas), fuera del sitio. El sitio
(`docs/site/`) la **consume** para armar sus páginas: la doc es la fuente, la page es el resultado.

## Reglas

- **Una carpeta por versión**: `docs/versiones/<id>/`, con el mismo `<id>` que `docs/versions.json`.
- Una versión nueva guarda **sólo lo que cambió** respecto de la anterior (overlay), no una copia
  completa.
- Para leer una versión se camina **de la más vieja a la suya** y **gana el último archivo del mismo
  path**.
- Una versión congelada **no se regenera**: sus tablas de API van materializadas (texto plano, sin
  marcadores `@api:*`).
- El build del sitio **no genera doc**.

## Estado

✅ **Hecho**: la doc vive en `docs/versiones/5.2.0/` (`componentes/`, `partials/`; las páginas se heredan
de `5.1.1/`) y `docs/{componentes,partials,site/componentes}` son **compuestos** (gitignoreados) por
`pnpm docs:compose`, que corren `dev` y `build`. `gen-api` y `check-docs` ya leen/escriben la fuente
versionada.

⏳ **Falta**: reescribir las rutas `docs/componentes/…` que citan recetas/skills/notas, materializar las tablas
al cortar una versión (`gen-api --freeze`) y el deploy de versiones con el modelo nuevo. Detalle:
[nota 13](../notes/13-doc-versionada.md).
