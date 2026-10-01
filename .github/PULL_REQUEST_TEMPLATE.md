<!--
  Título del PR: Conventional Commits en español (minúsculas). Ej:
    feat(select): permitir búsqueda remota
    fix(date-picker): no cerrar al cambiar de mes
    docs(button): aclarar la variante ghost

  Referenciá la issue con un closing keyword para que se cierre al mergear:
    Closes #N   (también sirven Fixes / Resolves)
  Ojo: el autocierre solo funciona si la rama base es `main` (la por defecto).
  Si el PR va a una rama de integración (ej. v5.0.0-alpha.3), la issue queda
  abierta y hay que cerrarla a mano.
-->

## Qué

<!-- Resumen del cambio y por qué. Si toca la API, decí qué props/slots/eventos/métodos cambian. -->

## Issue relacionada

Closes #

## Verificación

<!-- Cómo lo probaste: tests, preflight, pasos manuales, capturas. -->

- [ ] `pnpm preflight` pasa (type-check + tests + docs + build del sitio)
- [ ] Probado en el sitio / con el custom element según corresponda

## Checklist

- [ ] Hay una issue abierta y este PR la referencia (`Closes #N`)
- [ ] Los commits siguen Conventional Commits
- [ ] Si cambió la API, actualicé fichas (`docs/componentes/…`) y páginas del sitio
- [ ] No se colaron secretos, tokens ni credenciales
