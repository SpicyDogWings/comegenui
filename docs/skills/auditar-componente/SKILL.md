---
name: auditar-componente
description: 'Receta para auditar un componente ComegenUI como dev, usuario y atacante antes de que un bug llegue a la lib: montar un banco de pruebas real, atacar props/atributos/eventos/teclado/links/formularios/CSS, clasificar lo encontrado en bug del componente vs sistémico, y cerrar cada bug con test de comportamiento + mutación + guard. Usar cuando se pida "auditá cu-x", "buscale bugs", "probalo como usuario/atacante", "hacé una prueba adversarial" o "revisá que no se rompa".'
metadata:
  repository: https://github.com/SpicyDogWings/comegenui
  path: docs/skills/auditar-componente
  version: 5.2.3
---

# Auditar un componente

Objetivo: encontrar bugs **antes** de publicarlos, con evidencia observable, no con inspección de
código. Un hallazgo sin reproducción no cuenta.

## Cuándo NO

- Documentar el componente → `documenter`. · Implementar una tarea pedida → `task-proccess`.
- Preparar release/MR → `generate-release` / `crear-pr`.

## 1. Mapa previo (5 minutos)

Leé, sin editar:

- componente real `src/components/<cat>/<X>.vue` y su entry `src/lib/<cat>/<kebab>.ts` (¿hay `.ce.vue`?).
- **ficha vanilla** (`docs/versiones/<id>/componentes/<tag>.md`) y **ficha Vue**: son el contrato
  escrito. Cada claim raro ("submit dispara el form", "e.target es el interno") es un candidato a bug.
- tests existentes: si el componente **no tiene** `<X>.test.ts`, eso ya es un hallazgo.
- baseline de contrato y mutaciones del componente (`scripts/contract-baseline/<tag>.json`).

## 2. Banco de pruebas real

No alcanza con tests unitarios: usá Chromium real para lo que jsdom no simula (foco, teclado,
navegación, `getComputedStyle`, shadow DOM, submit).

```bash
# bundles + tokens actuales
COMEGEN_CONFIGS=umd-core COMEGEN_NO_ZIP=1 pnpm build:lib
mkdir -p /tmp/<comp>-qa
cp dist-libs/umd-core/Cu<X>.umd.js /tmp/<comp>-qa/
cp docs/site/.vitepress/theme/themes.gen.css /tmp/<comp>-qa/tokens.css
python3 -m http.server 8765 --directory /tmp/<comp>-qa
```

`index.html`: `tokens.css` + `Cu<X>.umd.js`, `data-theme="light"`, un `<form>` con input y
listeners que cuenten `submit`/`reset`/`click`. Después, desde eval:
`browser.open({url})` → `tab.evaluate(fn)` para montar fixtures y leer resultados.

## 3. Cuatro lentes (checklist)

**Dev**
- props inválidas: `color`, `variant`, `size`, `type`, `target` (¿validator? ¿qué renderiza?).
- atributos del host: `aria-*` con guion, `data-*`, `id`, `name`, `value`, `form`, `tabindex`,
  `class`, `style`. Verificá el **nombre exacto** que llega al árbol interno.
- cambios dinámicos: props, slots, `to` ↔ botón, montar/desmontar.
- API de la ficha vs comportamiento (defaults, clases, expose, emits).

**Usuario**
- Tab order: cuántas paradas por control; foco visible; Enter/Espacio.
- disabled/loading: ¿bloquea mouse **y** teclado? ¿links con `href`?
- link: click, teclado, botón, target; formularios: submit/reset/validación.
- layout: tamaños, texto largo, ancho del host; `prefers-reduced-motion`.

**Atacante**
- `javascript:` / `data:` / `vbscript:` (mayúsculas y espacios) en `to`; `target=_blank` + `rel`.
- inyección por slot (¿se interpreta HTML?), atributos que se reflejan, ids duplicados.
- clicks en disabled que burbujean o navegan.

**Accesibilidad**
- `tab.ariaSnapshot()`: rol, nombre accesible, estado disabled; un solo nodo interactivo.
- contraste WCAG real por variante×color y **todos los temas** (componer fondos con alpha):
  normal ≥ 4.5:1; bordes ≥ 3:1.
- `aria-busy`, spinner `aria-hidden`, `aria-disabled`; `aria-labelledby/describedby` resueltos
  contra el elemento que enfoca el usuario.

## 4. Clasificar

- **Bug del componente**: se arregla en el `.vue` (link que navega, color inválido invisible,
  `type` inválido que hace submit, form del CE que no envía).
- **Sistémico**: se repite en otros componentes (tokens de contraste, forwarding de atributos en
  `defineComegenElement`, `<a><button>` anidado, doble tab stop). No lo tapes con un parche local:
  reportalo aparte con reproducción y alcance.
- **Decisión de producto** (cambiar el DOM del link, paleta): elegí la opción conservadora,
  documentá el tradeoff y actualizá el baseline de contrato en el mismo cambio.

## 5. Cerrar

Por cada bug del componente:

1. fix mínimo en el `.vue`;
2. test de comportamiento en `<X>.test.ts` escrito desde la prosa de la ficha (nunca pinneando el
   comportamiento actual);
3. mutación en `scripts/mutation-check.mjs` que lo detecte;
4. docs (fichas vanilla + Vue, partials si aplica) corregidas;
5. `./scripts/guard.sh --full` en verde (`✅ RESULTADO: nada roto`).

Para lo sistémico, agregá el test que falle con el comportamiento viejo **solo** si el fix entra en
el mismo cambio; si no, entregá repro + evidencia + propuesta.

## 6. Entregar

Tabla: `bug | evidencia (antes/después) | severidad | archivos | test/mutación`. Sumá la sección
"sistémico no arreglado" con números concretos (ratios, atributos mangled, nodos duplicados) y el
comando exacto para reproducirlo. El gate literal, no un resumen.
