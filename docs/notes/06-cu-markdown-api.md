# Nota 06 — `cu-markdown`: `parsed` y `headingIds()` documentados pero no expuestos

**Fecha:** 2026-09-23
**Severidad:** Media
**Estado:** Documentado (ficha corregida); requiere decisión de código

## Problema

La ficha `componentes/cu-markdown.md` documentaba históricamente:

- el evento `parsed` (payload `string[]` con los IDs de headings),
- el método `headingIds()`.

Pero el wrapper `src/components/customElements/markdown/Markdown.ce.vue` **no los re-emite ni los expone**:

- el template es `<Markdown ref="markdownRef"><slot /></Markdown>` (sin `@parsed="ceEmit(...)"`),
- no hay `defineExpose`.

Es decir: en el UMD, `md.addEventListener('parsed', ...)` y `md.headingIds()` **no funcionan**. El `.vue` interno sí los provee, pero no atraviesan el wrapper CE.

Detectado por el generador de fichas (`pnpm cu-playground:generate --all --docs`), que resuelve la API desde el SFC que distribuye la lib (el `.ce.vue`).

## Impacto

- La ficha se corrigió para reflejar el `.ce.vue` (se quitaron `parsed` y `headingIds()`).
- Los usuarios que dependan de `headingIds()` para generar una tabla de contenidos no pueden hacerlo desde el UMD.

## Acción sugerida

Si se quiere mantener la funcionalidad, agregar en `Markdown.ce.vue`:

```ts
defineExpose({ headingIds: () => markdownRef.value?.headingIds() });
```

y reenviar el evento con `@parsed="ceEmit('parsed', $event)"`. Después, regenerar la ficha (`--all --docs`).

Si no, dejar la ficha como está (sin `parsed`/`headingIds()`).
