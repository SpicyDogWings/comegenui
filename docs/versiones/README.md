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

Esqueleto: la doc actual todavía está en `docs/componentes/` + `docs/partials/` + `docs/site/`
(migración pendiente). Modelo completo y pasos: [nota 13](../notes/13-doc-versionada.md).
