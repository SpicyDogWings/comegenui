# Nota 11 — Dos capas: `.vue` (Vue) y `.ce.vue` (vanilla)

**Estado:** decisión de arquitectura vigente.

## La decisión

ComegenUI es una **librería de Vue**. Todo componente **nace** como un SFC
`.vue` (`src/components/{categoria}/X.vue`) y esa es la única fuente de verdad.

La capa de **custom elements** (`.ce.vue` + `defineCustomElement`) es una capa
**encima**: un adaptador que se agregó para poder consumir la lib en **vanilla**
(HTML plano, sin build, sin Vue). **No** es un componente aparte ni una segunda
implementación.

> **Regla dura:** el paquete de Vue **solo lleva `.vue`**. Los `.ce.vue` se quedan
> afuera, son exclusivos de la capa vanilla.

## Qué viaja en cada superficie

| Superficie | Fuente | Salida | Consumidor | Vue |
|---|---|---|---|---|
| **Vue** (paquete npm) | `src/components/**/X.vue` **y nada más** | `dist-vue/` (ESM + `.d.ts` + `style.css`) | apps Vue con bundler | peer (lo pone el host) |
| **CE** (zip) | `X.vue` **+** `customElements/**/X.ce.vue` | `dist-libs/` (UMD/ESM) | HTML plano (`<cu-x>`) | incluido (`*-core`) o global (`*-shared`) |

La dependencia **siempre** va en un solo sentido:

```
X.ce.vue  ──importa──▶  X.vue        ✅
X.vue     ──importa──▶  X.ce.vue     ❌  (nunca)
```

## Por qué

El `.ce.vue` es **thin** y hace tres cosas que solo tienen sentido en vanilla:

1. declara las props con nombres semánticos y las **pasa explícitamente** al `.vue`;
2. llama `initTokens()` (inyecta `--cu-*` en el documento);
3. **puentea eventos** Vue → `CustomEvent` nativo con `ceEmit()`, que lee
   `getCurrentInstance()?.vnode.el` y hace `dispatchEvent` en el host del shadow DOM.

Nada de eso hace falta —ni conviene— en un proyecto Vue: el consumidor usa props,
`emits`, slots y `defineExpose` **directamente**, sin interop ni shadow DOM.

## Por qué NO mezclarlas

- **`ceEmit()` es VDOM**: `getCurrentInstance()?.vnode.el` no existe en Vapor ni
  tiene sentido fuera de `defineCustomElement`. Ver la nota 10 de Vapor
  (rama `feat/vapor-mode`).
- Exportar los `.ce.vue` arrastraría `defineCustomElement` y el puente de eventos
  al paquete Vue, y obligaría a mantener **dos APIs públicas** en el mismo paquete.
- El consumidor Vue perdería tipado y eventos nativos (recibiría `CustomEvent` en
  vez de `@close`, `v-model`, etc.).

## Consecuencias (reglas de trabajo)

1. **Un cambio de API se hace en el `.vue`.** El `.ce.vue` solo lo refleja; hay
   tests de paridad CE↔Vue (`src/components/customElements/ce-parity.test.ts`) que
   lo verifican.
2. El `.vue` **nunca** importa de un `.ce.vue`.
3. El entry del paquete Vue (`src/index.ts`) exporta **solo** `.vue`.
4. Los `.ce.vue` pueden tener su propia experiencia (atributos, `el.set()/get()`,
   eventos) sin contaminar la API Vue.
5. Vapor (Vue 3.6) es evaluable **en la capa `.vue`**; en los `.ce.vue` está
   bloqueado (nota 10).

## Relación con el paquete npm

`src/index.ts` es el entry de la capa Vue:

```ts
import Button from '@/components/buttons/Button.vue'   // ← el .vue, no el .ce.vue
import Alert from '@/components/information/Alert.vue'

export const CuButton = Button
export const CuAlert = Alert
```

El build (`build-vue.ts`) empaqueta eso en `dist-vue/` (ESM, `vue` como peer,
estilos extraídos, `.d.ts`). **Ningún `.ce.vue` entra al tarball.**

## Estado

PoC con `CuButton` + `CuAlert`. La meta es exportar los **32 componentes** de la
capa `.vue` (los que hoy tienen entry en `src/lib/`, sin contar `colors.ts` ni
`tokens.ts`, que no son componentes).
