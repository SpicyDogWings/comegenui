# Nota 10 — Vapor Mode (Vue 3.6) en ComegenUI

**Estado:** exploración (rama `feat/vapor-mode`). Hoy **no** es viable en la lib
como está; el switch existe para experimentar.

Vapor Mode es el modo de compilación opt-in de **Vue 3.6** (RC al día de hoy:
`3.6.0-rc.11`; `latest` sigue en `3.5.x`). Compila los SFC a operaciones de DOM
directas, sin VDOM. Es **100% opt-in** y soporta un **subset** de la API.

## Lo que quedó en esta rama

1. **RC al día:** `vue` `3.6.0-rc.9 → 3.6.0-rc.11` en `package.json` **y** en el
   `overrides` de `pnpm-workspace.yaml` (ojo: el override existe porque
   VitePress 1.6.4 no acepta un prerelease de Vue y sin él se instalan dos
   runtimes). `@vitejs/plugin-vue` subido a `^6.0.8` (es la versión que agregó
   `features.vapor`).
2. **Switch experimental** `COMEGEN_VAPOR=1` en `build-lib.ts` y
   `vitest.config.ts`. Apagado por defecto: sin la variable, todo queda VDOM.

## Evidencia medida (rc.11)

| Prueba | Resultado |
|---|---|
| `pnpm test` (sin Vapor) | ✅ **1662/1662** pasan → el bump de RC es limpio |
| `COMEGEN_VAPOR=1 … pnpm build:lib` | ✅ **compila** (33 bundles + runtime) |
| `COMEGEN_VAPOR=1 pnpm test` | ❌ falla: `TypeError: defineVaporComponent is not a function` |

El bundle Vapor real (`dist-libs/esm-shared/CuAlert.js`) importa de `vue`:
`defineVaporComponent` **y** `defineCustomElement` **y** `getCurrentInstance`.
O sea: el build compila, pero mezcla los dos runtimes.

## El experimento decisivo: ¿se puede migrar TODO a Vapor?

Probado, no supuesto. Pasos y resultado:

1. **La entry por defecto de `vue` no trae Vapor.** `node_modules/vue/dist/`
   no expone `defineVaporComponent`; el runtime de Vapor vive aparte, en
   `vue/dist/vue.runtime-with-vapor.esm-browser.js`. Por eso el primer intento
   fallaba con `defineVaporComponent is not a function`. Con `resolve.alias` de
   `vue` a esa build, el import ya no falla (ver `vitest.config.ts`).
2. **Aun así, `defineCustomElement` NO monta componentes Vapor.** Con el runtime
   correcto el error pasa a:

   ```
   processComponent → getVaporInterface(parentComponent, n2).mount(...)
   TypeError: Cannot read properties of undefined (reading 'mount')
     ❯ VueCustomElement._mountComponent
   ```

   `getVaporInterface()` devuelve `undefined`: el patcher VDOM no sabe delegar el
   montaje de un componente Vapor cuando lo dispara el custom element.
3. **Instalar el interop no alcanza.** `defineCustomElement` acepta
   `configureApp`, así que se probó `configureApp: app => app.use(vaporInteropPlugin)`.
   Resultado: sigue roto y Vue avisa
   `Vapor component found in vdom tree but vapor-in-vdom interop was not installed`.
   Además, con Vapor **`defineExpose` no se mapea al elemento**: `el.get` /
   `el.set` **no son funciones** (cae toda la API pública de los CE).

**Marcador:** `COMEGEN_VAPOR=1 pnpm vitest run src/components/customElements` →
**54 fallan | 4 pasan (58)**.

## Conclusión

**Vapor y custom elements no son combinables hoy** (Vue 3.6 rc.11). Migrar *toda*
la lib a Vapor implica **renunciar a `defineCustomElement`**, y por lo tanto al
modo `<cu-*>`: props, métodos (`el.set`/`el.get`), eventos y el zip/UMD/ESM.
Vapor sí es viable para un **entry Vue-native** (componentes consumidos dentro de
una app Vue, sin custom elements) — otro build, no un flag sobre el de CE.

## Por qué no funciona el modo CE con Vapor

1. **`ceEmit()` es VDOM.** Los 23 wrappers `.ce.vue` emiten sus CustomEvents con:

   ```ts
   const instance = getCurrentInstance()
   const el = instance?.vnode.el as HTMLElement | null
   ```

   En Vapor **`getCurrentInstance()` devuelve `null`** y **no hay `vnode`** → el
   `ceEmit` no hace nada y **todos los eventos custom de los CE desaparecen**.

2. **`defineCustomElement` es del runtime VDOM.** No existe un
   `defineVaporCustomElement`; el soporte de Vapor para custom elements **no está
   documentado** en las notas de la RC.

3. **Delegación de eventos.** Vapor delega eventos elegibles a `document`: si un
   ancestro hace `stopPropagation()`, el handler delegado no corre. En una lib con
   overlays (Modal, SideOver, DropdownMenu) y consumidores externos esto es un
   riesgo real.

4. **Entorno de test.** Vitest resuelve un `vue` que no expone el runtime de
   Vapor, de ahí el `defineVaporComponent is not a function`. Habilitar Vapor en
   tests requiere apuntar a la entry con vapor (y `vaporInteropPlugin`).

## Restricciones de Vapor que **no** nos afectan

Medido en el repo: **no** usamos Options API, ni `v-memo`, ni directivas custom
(los tres son incompatibles con Vapor). Los choques reales son otros:
`getCurrentInstance` (eventos CE), el mapeo de `defineExpose` al elemento, y el
montaje del custom element.

## Camino recomendado

- **CE (esta lib): seguir en VDOM.** El modo CE se define por
  `defineCustomElement` y **no** hay soporte de Vapor para custom elements.
- **Lib Vue nativa (futuro paquete npm): ahí sí Vapor es candidato**, porque no
  necesita `defineCustomElement` ni `ceEmit` (el consumidor usa props/eventos
  Vue normales). Sería un build/entry aparte, no un flag sobre el de CE.
- Si algún día se quiere Vapor *también* en los CE, hay que esperar soporte de
  Vue (hoy no existe) o cambiar el modelo de distribución.

## Cómo probarlo

```bash
# build en Vapor (hoy compila, pero rompe en runtime: montaje + eventos)
COMEGEN_VAPOR=1 COMEGEN_CONFIGS=esm-shared COMEGEN_NO_ZIP=1 pnpm build:lib

# tests en Vapor (hoy: 54 fallan | 4 pasan). El alias de `vue` al runtime
# with-vapor en `vitest.config.ts` es necesario para que al menos cargue.
COMEGEN_VAPOR=1 pnpm test
```
