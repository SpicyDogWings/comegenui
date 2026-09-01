# Arquitectura de componentes

ComegenUI sigue un patrón de **3 archivos por componente público**, con separación estricta de responsabilidades.

## Estructura

```
src/components/
├── MiComponente.ce.vue   # Thin wrapper para Custom Element (UMD)
├── MiComponente.vue      # Lógica real del componente
└── MiComponente.ts       # defineCustomElement + registro
```

Un componente puede ser **solo `.vue`** si es interno y no se expone como Custom Element. Ejemplo: `Dropdown.vue` (motor genérico usado por `DropdownMenu.vue`).

## Responsabilidades

### `MiComponente.ce.vue` — **El wrapper para Custom Element (API pública)**

- Define la interfaz pública del componente: `props`, `emits`, `exposes`.
- **Resuelve el tema activo** con `getHostTheme()` y convierte colores semánticos a hex con `getColorMap()`.
- Pasa props **explícitamente** al `.vue` interno. **Nunca uses `v-bind="{...props}"`** — siempre nombrá cada prop.
- Forwardea slots usando sintaxis HTML nativa `slot="nombre"` (no `#nombre` de Vue).
- Re-emite eventos custom del `.vue` interno con `ceEmit()` o `defineEmits()`.
- Expone métodos via `defineExpose()` delegando al ref interno.

> **Este archivo es la fuente de verdad de la API.** Lo que el usuario final consume está definido acá.

### `MiComponente.vue` — **La implementación real**

- Contiene toda la lógica de negocio, template y estilos.
- Espera `color` como **hex string** (`#1774A4`), no como nombre semántico.
- Usa sintaxis Vue `#nombre` para slots (ej: `<template #toggle>`).
- Importa y usa sub-componentes `.vue` directamente (`import Button from "./Button.vue"`).
- **No sabe nada de Custom Elements ni de temas** — recibe el color ya resuelto.

> **Este archivo es interno.** Su API puede cambiar sin avisar. La doc del usuario no se basa en él.

### `MiComponente.ts` — **Punto de entrada del build**

Siempre tiene la misma forma:

```ts
import { defineCustomElement } from "vue";
import MiComponente from "./MiComponente.ce.vue";

const comegenMiComponente = defineCustomElement(MiComponente);

customElements.define("cu-mi-componente", comegenMiComponente);

export default comegenMiComponente;
```

- Define el **tag HTML** (`cu-mi-componente`).
- Es la entrada para `build-libs.ts` (lo detecta por el `customElements.define`).
- Trivial; rara vez cambia.

## Ubicaciones

No todos los componentes viven en la raíz:

| Carpeta | Qué contiene | ¿Compila? |
|---------|--------------|-----------|
| `src/components/` (raíz) | Componentes que no son de formulario ni datos | Sí |
| `src/components/form/` | Componentes de formulario (inputs, controles) | Sí |
| `src/components/data/` | Componentes de datos (tablas) | Sí |
| `src/components/labs/` | Componentes en experimentación | **Sí** (a pesar del nombre). **Puede estar vacía** si no hay componentes experimentales activos. |
| `src/components/archived/` | Componentes retirados | **Sí** (ver [`docs/notes/01-build-glob.md`](../../notes/01-build-glob.md)) |

> **Importante:** el `build-libs.ts` usa `fast-glob("./src/components/**/*.ts")` sin filtros. **Todo** se compila. Si querés excluir algo, hay que cambiar el patrón (ver nota 01).

> **Sobre `labs/`:** la carpeta es para componentes **experimentales** (en desarrollo, validación, prueba de concepto). **Puede existir vacía** cuando no hay componentes en experimentación, e incluso **puede no existir** si nunca se usó. No es un sandbox aislado: los componentes que viven acá compilan y se distribuyen igual que los de `form/` o `data/`. Una vez que un componente se considera estable, conviene moverlo a su carpeta final (`form/`, `data/` o raíz) y borrarlo de `labs/`.

## Ejemplo: cadena de wrappers

`DropdownMenu` no es un wrapper sobre un único `.vue`. Tiene una cadena de wrappers:

```
DropdownMenu.ce.vue       (Custom Element; fuente de verdad)
  └─> DropdownMenu.vue   (wrapper con props semánticas para Dropdown.vue)
        └─> Dropdown.vue (motor genérico: toggle + panel + posicionamiento)
```

El `.ce.vue` es lo que documentás. Pero cuando hay un slot como `toggle`, la doc debe mostrar la sintaxis HTML `slot="toggle"`, no la sintaxis Vue `#toggle` (porque el `.ce.vue` reenvía con HTML nativo).

## Patrón de eventos (re-emisión a través del Shadow DOM)

El `.ce.vue` suele tener un helper para re-emitir eventos custom:

```ts
const instance = getCurrentInstance();

function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = el?.getRootNode()?.host || el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,    // ← clave para cruzar el Shadow DOM
    }));
  }
}
```

- `composed: true` es lo que permite que el evento cruce el Shadow DOM.
- Si el `.ce.vue` no llama a `ceEmit` para un evento, ese evento **no** está disponible para el usuario final, aunque el `.vue` interno lo emita.

## Patrón de exposición de métodos

```ts
const innerRef = ref<InstanceType<typeof Inner> | null>(null);

defineExpose({
  open: () => innerRef.value?.open(),
  close: () => innerRef.value?.close(),
  get isOpen() { return innerRef.value?.isOpen || false },
});
```

- Solo los métodos listados en `defineExpose` son accesibles por el usuario.
- `get`/`set` definen getters/setters.
- Si el `.ce.vue` no llama a `defineExpose`, el componente no expone nada.

## Patrón: búsqueda en dropdown (Input con filtrado)

Algunos componentes con lista desplegable (como `Select`) pueden ofrecer búsqueda mediante un `Input` visible dentro del dropdown que filtra las opciones en tiempo real.

**Implementación en `Select.vue`:**

```vue
<template>
  <div v-if="searchEnabled" class="cu-select-search">
    <Input
      :placeholder="searchPlaceholder"
      :model-value="searchQuery"
      :color="color"
      variant="ghost"
      @update:model-value="searchQuery = $event"
    />
  </div>
  <div v-if="filteredOptions.length > 0" class="cu-select-options">
    <!-- opciones filtradas -->
  </div>
  <div v-else-if="searchEnabled && searchQuery" class="cu-select-empty">
    Sin resultados
  </div>
</template>
```

```ts
import Input from "./Input.vue";

const searchQuery = ref("");

const filteredOptions = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return props.options;
  return props.options.filter(o => o.label.toLowerCase().includes(q));
});
```

**Reglas del patrón:**

1. **Usa el componente `Input` del proyecto** — no un `<input>` nativo. Mantiene consistencia visual y funcional.
2. **Filtrado en tiempo real** mediante `computed` — la lista se reduce a medida que se escribe.
3. **Case-insensitive** — usar `toLowerCase()` tanto en el query como en el label.
4. **Coincidencia por `includes`** (no `startsWith`) — busca en cualquier parte del label.
5. **Estado vacío diferenciado** — cuando hay búsqueda sin resultados, mostrar "Sin resultados" (no "Sin opciones").
6. **Separador visual** — el input va en un contenedor con `border-bottom` para separarlo de la lista.

**CSS del contenedor de búsqueda:**

```css
.cu-select-search {
  padding: var(--cu-space-sm);
  border-bottom: 1px solid var(--cu-color-neutral-subtle-border, rgba(0, 0, 0, 0.1));
}

.cu-select-search :deep(.cu-input) {
  width: 100%;
}
```

**Props expuestas:**

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `searchEnabled` | Boolean | `false` | Muestra el input de búsqueda dentro del dropdown |
| `searchPlaceholder` | String | `"Buscar..."` | Placeholder del input de búsqueda |

## Resumen: qué leer cuando estás desarrollando

| Necesitás... | Leé... |
|--------------|--------|
| Saber qué API pública tiene un componente | `X.ce.vue` |
| Entender la lógica interna de un componente | `X.vue` |
| Ver el tag HTML de un componente | `X.ts` |
| Cambiar el sistema de temas | `src/config/theme.ts` |
| Ver cómo se calcula el color de un variant | `src/utils/palette.ts` |
| Ver cómo se detecta el tema activo | `src/utils/getHostTheme.ts` |
| Entender el build | `build-libs.ts` |
| Ver qué componentes hay | `src/components/**/*.ts` |
