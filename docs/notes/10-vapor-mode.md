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
(los tres son incompatibles con Vapor). El único choque real es
`getCurrentInstance`.

## Camino recomendado

- **CE (esta lib): seguir en VDOM.** El modo CE se define por
  `defineCustomElement`; no hay soporte de Vapor para eso.
- **Lib Vue nativa (futuro paquete npm): ahí sí Vapor es candidato**, porque no
  necesita `defineCustomElement` ni `ceEmit` (el consumidor usa props/eventos
  Vue normales). Sería un build/entry aparte, no un flag sobre el de CE.
- Si algún día se quiere Vapor *también* en los CE, hay que reemplazar `ceEmit`
  por una referencia al elemento raíz (template ref) en vez de `instance.vnode`,
  y verificar `defineCustomElement` contra el runtime Vapor.

## Cómo probarlo

```bash
# build en Vapor (hoy compila, pero rompe en runtime por ceEmit)
COMEGEN_VAPOR=1 COMEGEN_CONFIGS=esm-shared COMEGEN_NO_ZIP=1 pnpm build:lib

# tests en Vapor (hoy fallan: falta la entry de vue con runtime-vapor)
COMEGEN_VAPOR=1 pnpm test
```
