# Nota 14 — Consola limpia en el sitio de docs: qué ruido es nuestro y qué no

**Fecha:** 2026-10-21
**Severidad:** Info (diagnóstico + un fix chico de perf en `Popover`)

Reporte: al abrir `http://localhost:5173/componentes/cu-label` con **Firefox** (sitio servido con
`pnpm dev`) la consola muestra:

```
[vite] connecting...
[vite] connected.
This site appears to use a scroll-linked positioning effect. This may not work well with
asynchronous panning; see https://firefox-source-docs.mozilla.org/performance/scroll-linked_effects.html …
cu-label
Security Error: Content at http://localhost:5173/componentes/cu-label may not load or link to file:///
```

Conclusiones, una por mensaje.

## 1. `scroll-linked positioning effect` — es de VitePress, no nuestro

Firefox lo emite cuando **un handler de `scroll` en JS cambia estilos de forma sincrónica** (la
detección es del cambio de CSS dentro del handler, no del `position: sticky` en sí: ver
[bug 1300215](https://bugzilla.mozilla.org/show_bug.cgi?id=1300215)). Nuestro CSS no tiene nada que
ver: el repo **no tiene un solo `url()`** ni `background-attachment`/`scroll-behavior`.

Evidencia (Firefox 156 vía `playwright-cli`, sobre `/componentes/cu-label`):

| Experimento (init script que descarta listeners) | ¿Aparece el warning al scrollear? |
|---|---|
| sin tocar nada | **sí** |
| descartando los `scroll` de `document` | **sí** (⇒ no es nuestro `Popover`) |
| descartando los `scroll` de `window` | **no** (⇒ viene de un listener de `window`) |

Con el page instrumentado (`EventTarget.prototype.addEventListener`) quedan dos `scroll` no pasivos
en `window`, ambos de librerías:

- `@vueuse/core` — `useEventListener` (chunk `.vitepress/cache/deps/@vueuse_core.js`),
- **VitePress** — `useActiveAnchor` (`vitepress/dist/client/theme-default/composables/outline.js:65`),
  el scroll-spy del outline lateral: en el handler recalcula el link activo y cambia clases.

Es el comportamiento normal del tema (resaltar la sección activa mientras scrolleás). No se toca:
desactivarlo sería apagar el outline (`outline: false`) o parchear una dependencia, y no rompe nada
—es un aviso de performance del navegador, no un error.

**Lo nuestro que sí había:** `src/components/overlay/Popover.vue` registraba
`document.addEventListener("scroll", onViewportChange, true)`, o sea **no pasivo**, en todas las
páginas (el topbar monta popovers). El handler sólo lee geometría (`onViewportChange` →
`positionPanel`, y sólo con el panel abierto y `fixed`), nunca llama a `preventDefault`, así que
ahora va **pasivo** (`SCROLL_OPTS = { capture: true, passive: true }`). Es un listener de scroll no
pasivo menos en `document`: no bloquea el scrolling asíncrono. Cubierto por
`src/components/overlay/Popover.test.ts` («escucha el scroll del documento en captura y en modo
pasivo») y por la mutación `popover-scroll-listener-no-pasivo`.

## 2. `Security Error: … may not load or link to file:///` — no es del repo

Firefox bloquea cualquier intento de una página `http:` de **cargar o enlazar** un `file:`. Lo que
se verificó, sobre el sitio servido:

- `tgrep` de `file:` en `src/`, `docs/`, `docs/site/`, `comegen.config.json` y `.vitepress/`: **sin
  coincidencias** de un `file:` construido por nosotros (`import.meta.url`, `pathToFileURL`,
  `baseURI`, `new URL(...)`: tampoco aparecen).
- **No hay `url(` en ningún CSS del repo** (los temas son sólo custom properties), así que no puede
  salir de un `@font-face` / `background-image` / `cursor`.
- Barrido del DOM (incluyendo shadow roots de los `<cu-*>`): ningún atributo con `file:` ni con una
  ruta absoluta tipo `/home/…`. El único match son los `<style data-vite-dev-id="/home/…">` que
  inyecta el dev server (atributo de datos, no un `src`).
- `performance.getEntriesByType("resource")`: ninguna entrada `file:` (lo bloqueado no llega a red).
- **No se reproduce**: Firefox 156 con perfil limpio (playwright) sobre `5173` y sobre un dev server
  propio (`5273`), a 1280×720 y a 420×800, con y sin scroll. El canal de captura **sí** funciona: una
  página de control con `<img src="file:///etc/hostname">` reporta el mismo texto de error.
- La línea `cu-label` suelta tampoco la emite el repo: no existe ningún `console.log`/`info` de tags.

Único `file://` literal del repo: dentro del bundle de **`xlsx`** que viaja en `CuCellsImporter`
(`"file:///C:/SheetJS/"` como `Content-Location` del MHT y limpieza de `href` de SheetJS). Es
metadata que se escribe en la exportación, no una URL que el navegador cargue, y ni siquiera está en
la página de `cu-label`.

**Conclusión:** el intento de `file:` sale del navegador/perfil (extensión o panel de devtools), no
del contenido que sirve ComegenUI. Firefox lo bloquea y no afecta la página. Si vuelve a aparecer,
abrir la consola con el perfil limpio (`firefox --new-instance --profile $(mktemp -d)`) para
confirmarlo.

## Cómo se reproduce el diagnóstico

```bash
pnpm dev --port 5273 &                    # el 5173 suele estar ocupado por el repo principal
playwright-cli --browser=firefox open http://localhost:5273/componentes/cu-label
playwright-cli -s=ff --raw eval 'async()=>{window.scrollTo(0,800);await new Promise(r=>setTimeout(r,600));return "ok"}'
playwright-cli -s=ff console              # el warning aparece recién después de scrollear
```

Para ver **quién** registra cada listener, un `run-code` con `addInitScript` que envuelva
`EventTarget.prototype.addEventListener` y guarde `{ target, type, passive, capture, stack }` en
`window.__ls`.
