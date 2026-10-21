<!--
  Título: Conventional Commits en español (minúsculas). Ej:
    fix(switch): hover sólido cuando está encendido
    feat(select): permitir búsqueda remota
    docs(button): aclarar la variante ghost

  Issue: Closes #N. El autocierre sólo funciona si el PR va a `main`.
-->

## Qué

<!--
  Contá el problema y la causa, no sólo el diff:
  - qué se veía mal / qué faltaba,
  - por qué pasaba (la causa concreta),
  - qué se cambió (en bullets),
  - si toca la API: props/slots/eventos/métodos; si no toca nada, decilo ("No toca la API").
-->

## Issue

Closes #

## Verificación

<!--
  Evidencia, no afirmaciones. Lo que no probaste, no lo marques.
  Si el cambio es visual: tabla de valores medidos antes/después + capturas.
-->

- [ ] `./scripts/guard.sh --full` en verde — pegá el veredicto y el resumen
      (tipos · build · contrato · tests · mutación · docs)
- [ ] Probado en el sitio (indicá las páginas) o con el custom element
- [ ] Si es visual: tabla **antes/después** con valores medidos (color, ancho, opacidad,
      `scrollWidth`…) y capturas
- [ ] Si cambió la API: fichas y páginas al día (`docs/versiones/<id>/…`)
- [ ] Si el contrato cambió a propósito: baseline actualizado
- [ ] Si agregué un test de comportamiento: mutación en `scripts/mutation-check.mjs`
- [ ] Si es sólo CSS y no hay test: explicá por qué y dejá la evidencia (medición/captura)

<!--
  Release: si este PR corta una versión, agregá acá el resumen del changelog, la guía de breaking
  changes (si existe) y que incluye los zips `dist-libs/comegenui-*-v<version>.zip`.
-->
