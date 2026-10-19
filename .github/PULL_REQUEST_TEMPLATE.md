<!--
  Título: Conventional Commits en español (minúsculas). Ej:
    fix(date-picker): no cerrar al cambiar de mes
    feat(select): permitir búsqueda remota

  Issue: Closes #N. El autocierre sólo funciona si el PR va a `main`.
-->

## Qué

<!-- Qué cambia y por qué. Si toca la API: props/slots/eventos/métodos. -->

## Issue

Closes #

## Verificación

<!-- Cómo lo probaste y veredicto de ./scripts/guard.sh --full. -->

- [ ] `./scripts/guard.sh --full` en verde
- [ ] Probado en el sitio o con el custom element (si aplica)
- [ ] Si cambió la API: fichas y páginas al día (`docs/versiones/<id>/…`)
- [ ] Si el contrato cambió a propósito: baseline actualizado
- [ ] Si agregué un test de comportamiento: mutación en `scripts/mutation-check.mjs`

<!--
  Release: si este PR corta una versión, agregá acá el resumen del changelog, la guía de breaking
  changes (si existe) y que incluye los zips `dist-libs/comegenui-*-v<version>.zip`.
-->
