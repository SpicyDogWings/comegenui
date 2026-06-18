# Playground

El playground es un HTML estático en `playground/` que carga los bundles UMD ya construidos y permite experimentar con los componentes en vivo.

## Estructura

```
playground/
├── index.html          ← estructura base (carga UMD, define la zona editable)
├── playground.js       ← base: theme toggle, log, init (NO modificar)
├── style.css           ← estilos del playground (NO modificar)
├── example.js          ← archivo editable principal
└── examples/           ← presets editables
    └── table.js
```

## Archivos base (NO modificar)

- **`index.html`** — Carga los scripts UMD desde `../dist/`, define la carta (`.card`) que es la zona editable, e incluye los scripts de playground y examples.
- **`playground.js`** — Lógica del playground: toggle de tema claro/oscuro, función `logEvent(msg)` para imprimir eventos en la consola visual (`#log`), e init.
- **`style.css`** — Estilos del playground: topbar, carta, log-box, dark mode, etc.

## Archivos editables (SÍ modificar)

- **`example.js`** — Acá va la lógica JS de cada experimento. Se carga **después** de `playground.js` y de los examples.
- **`examples/*.js`** — Presets de ejemplos (componentes específicos ya configurados). Se cargan en orden desde `index.html`.

## La zona editable

En `index.html` hay un `<div class="card">` que es la **única zona** que podés modificar libremente:

```html
<div class="main">
  <div class="card" style="max-width: 800px">
    <h2>Tabla con Select + Autocomplete editable</h2>
    <cu-table id="tabla" ... ></cu-table>
    <div class="log-box" id="log">// Eventos</div>
  </div>
</div>
```

- Cambiá el contenido de la carta según el componente que quieras probar.
- Mantené el `<div class="log-box" id="log">` para ver los eventos que emitan los componentes.
- **No** modifiques la topbar ni la estructura de `<main>`.

## Cómo funciona

1. El usuario abre `playground/index.html` en el navegador (asumiendo que está sirviendo la raíz del proyecto).
2. `index.html` carga `../dist/CuTable.umd.js` y otros bundles.
3. `playground.js` se ejecuta: configura el toggle de tema y la función `logEvent()`.
4. Los `examples/*.js` se ejecutan: inicializan los componentes con datos.
5. El `example.js` se ejecuta: tu código de experimentación.

## Función `logEvent(msg)` (global)

Está definida en `playground.js` y es accesible desde cualquier `examples/*.js` o `example.js`:

```js
logEvent('Hola mundo');
// → agrega línea con timestamp al #log
```

Sirve para debuggear eventos:

```js
const tabla = document.getElementById('tabla');
tabla.addEventListener('edit-save', (e) => {
  logEvent(`Editado: ${e.detail.column.key} = "${e.detail.value}"`);
});
```

## Toggle de tema

El botón 🌙/☀️ en la topbar alterna entre `light` y `dark`:

- Setea `data-theme` en `<html>`.
- Agrega/remueve la clase `body.dark`.
- Persiste en `localStorage` con la key `theme`.
- Si no hay `localStorage`, usa `prefers-color-scheme` del OS.

**Importante:** los componentes reaccionan automáticamente al cambio de `data-theme` porque el `.ce.vue` usa `getHostTheme()` con un `MutationObserver` que escucha cambios en ese atributo.

## Agregar un nuevo preset

1. Crear `playground/examples/<nombre>.js`.
2. Agregar el `<script>` en `index.html` después de `playground.js`:

   ```html
   <script src="playground.js"></script>
   <script src="examples/<nombre>.js"></script>
   ```

3. Si necesitás un tag específico en la carta, agregalo al `<div class="card">` con un `id` único.

## Agregar un bundle UMD

Si creaste un componente nuevo, agregá su script en `index.html`:

```html
<script src="../dist/CuMiComponente.umd.js"></script>
```

> **Tip:** agregá `?t=<número>` al final del src para forzar reload y evitar caché del navegador:
> ```html
> <script src="../dist/CuTable.umd.js?t=2"></script>
> ```

## Limitaciones del playground

- No hay hot-reload. Para ver cambios en el código, refresh (F5).
- No tiene devtools de Vue (porque los UMD están compilados en modo producción).
- No podés usar `<template>` de Vue ni directivas Vue (`v-if`, `v-for`, etc.). Es HTML plano + JS vanilla.
- El playground lee de `../dist/`, así que necesitás haber corrido `pnpm build:lib` al menos una vez para que los UMD existan.

## Cuándo usar playground vs Storybook

| Necesitás... | Usá... |
|--------------|--------|
| Experimentar con HTML plano + UMD (como el usuario final) | Playground |
| Probar todas las variantes/variants de un componente con controles | Storybook |
| Iterar rápido sobre el código Vue del componente | Storybook |
| Testear un preset completo con datos reales | Playground |
| Ver cómo se ve el bundle UMD en producción | Playground |

## Convenciones dentro de los presets

- **No usar `document.querySelector` con selectores ambiguos.** Siempre dar un `id` y usar `getElementById`.
- **Usar la función `logEvent(msg)`** para debug, no `console.log`.
- **No** acumular ejemplos en `example.js`. Cada experimento reemplaza al anterior (como dice el comentario en `index.html`).
- Si un preset usa `id="tabla"`, no chocar con otros presets que también usen ese id.

## Resumen de los IDs actualmente en uso

- `playground.js`: `btnTheme`, `log`.
- `examples/table.js`: `tabla`.

Si agregás un preset nuevo, usá un `id` distinto a esos.
