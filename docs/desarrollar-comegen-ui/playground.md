# Playground

El playground tiene dos versiones:

1. **Playground Vue** (`src/pages/playground/`) — aplicación Vue para desarrollar y demostrar componentes. Es la herramienta principal para iterar.
2. **Playground HTML estático** (`playground/`) — carga bundles UMD para experimentar como usuario final.

## Playground Vue (`src/pages/playground/`)

### Regla: usá los propios componentes

> **Siempre que sea posible, usá los componentes de ComegenUI dentro del playground.** No uses HTML vanilla (`<button>`, `<input>`, `<select>`) si existe un componente equivalente (`Button`, `Input`, `Select`, etc.).

```vue
<!-- ❌ Mal: HTML vanilla -->
<button class="cu-button cu-button--ghost" @click="selected = 'opt1'">Set Option 1</button>

<!-- ✅ Bien: componente del proyecto -->
<Button color="neutral" variant="ghost" @click="selected = 'opt1'">Set Option 1</Button>
```

**Importá siempre el componente correspondiente:**

```ts
import Button from "@/components/buttons/Button.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
```

Esto asegura que el playground refleje el comportamiento real de los componentes y sirva como documentación viva.

### Estructura

```
src/pages/playground/
├── components/          ← un .vue por componente
│   ├── Select.vue
│   ├── Button.vue
│   └── ...
├── useLibStatus.ts      ← composable para badge "En lib"
└── (router en src/router/index.ts)
```

### Agregar un ejemplo de componente

Crear `src/pages/playground/components/<Nombre>.vue`:

```vue
<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import MiComponente from "@/components/<carpeta>/MiComponente.vue";
import Button from "@/components/buttons/Button.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
];
</script>

<template>
  <PlaygroundLayout title="MiComponente" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <div class="playground-row">
          <MiComponente variant="soft" />
          <MiComponente variant="outlined" />
        </div>
      </section>
    </div>
  </PlaygroundLayout>
</template>
```

---

## Playground HTML estático (`playground/`)

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

## Cuándo usar cada playground

| Necesitás... | Usá... |
|--------------|--------|
| Iterar rápido sobre el código Vue del componente | Playground Vue |
| Probar todas las variantes de un componente | Playground Vue |
| Testear un preset completo con datos reales | Playground HTML |
| Ver cómo se ve el bundle UMD en producción | Playground HTML |
| Experimentar como usuario final (HTML plano + UMD) | Playground HTML |

## Convenciones dentro de los presets

- **No usar `document.querySelector` con selectores ambiguos.** Siempre dar un `id` y usar `getElementById`.
- **Usar la función `logEvent(msg)`** para debug, no `console.log`.
- **No** acumular ejemplos en `example.js`. Cada experimento reemplaza al anterior (como dice el comentario en `index.html`).
- Si un preset usa `id="tabla"`, no chocar con otros presets que también usen ese id.

## Resumen de los IDs actualmente en uso

- `playground.js`: `btnTheme`, `log`.
- `examples/table.js`: `tabla`.
- `examples/table-inline-editing.js`: `tabla-estados`.

Si agregás un preset nuevo, usá un `id` distinto a esos.
