# Sistema de temas

ComegenUI tiene 3 temas integrados (`light`, `dark`, `sigacadv2`) y un mecanismo para detectarlos automáticamente desde el documento. Todos los componentes con color usan este sistema.

## Arquitectura del tema

```
<cu-button color="primary">
       ↓
┌──────────────────────────────────────────┐
│ MiComponente.ce.vue                      │
│  1. Lee props.color (semántico)          │
│  2. Lee props.theme O getHostTheme()     │
│  3. Resuelve color → hex con             │
│     getColorMap(theme)[color]            │
│  4. Pasa hex al MiComponente.vue         │
└──────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│ MiComponente.vue                        │
│  Recibe color en hex, aplica estilos    │
└──────────────────────────────────────────┘
```

## Resolución de tema: prioridad

1. `theme` prop en el componente (`<cu-button theme="dark">`).
2. `data-theme` en cualquier ancestro del DOM (típicamente `<html data-theme="dark">`).
3. `prefers-color-scheme` del sistema operativo.
4. Default: `light`.

## Estructura de un tema

`src/config/theme.ts`:

```ts
export const themes = {
  light: {
    primary: '#1774A4',
    neutral: '#2c2c2c',
    success: '#22c55e',
    warning: '#f59e0b',
    danger:  '#ef4444',
    surface: '#ffffff',
  },
  dark: {
    primary: '#38bdf8',
    neutral: '#e5e5e5',
    success: '#4ade80',
    warning: '#fbbf24',
    danger:  '#f87171',
    surface: '#1a1a1a',
  },
  sigacadv2: { /* ... */ },
};

export type ThemeName = keyof typeof themes;
export const isValidTheme = (value: string) =>
  Object.keys(themes).includes(value) || value === "";
```

Cada tema tiene **6 colores**: `primary`, `neutral`, `success`, `warning`, `danger`, `surface`. Todos son strings hex.

> **`surface`** es el color de fondo de paneles emergentes (dropdowns, popups de autocomplete, etc.). Se accede via `getColorMap(theme).surface`.

## Cómo fluye el color en un componente

### 1. El usuario pone un color semántico

```html
<cu-button color="primary">Click</cu-button>
```

### 2. El `.ce.vue` resuelve

```ts
import { getColorMap } from "../utils/palette";
import { getHostTheme } from "../utils/getHostTheme";

const effectiveTheme = computed(() => props.theme || getHostTheme());

const hexColor = computed(() => {
  const map = getColorMap(effectiveTheme.value as "light" | "dark");
  return map[props.color as keyof typeof map] || props.color;
  //                                                ^^^^^^^^^^^^^^^^^
  //                                                Si props.color es un hex (no semántico),
  //                                                se respeta tal cual
});
```

### 3. El `.ce.vue` pasa el hex al `.vue` interno

```html
<MiComponente :color="hexColor" />
```

### 4. El `.vue` interno aplica estilos con el hex

```ts
import { getBgClasses, getFgClasses } from "../utils/palette";

const bgClass = computed(() =>
  getBgClasses(props.color, props.variant, props.hightContrast),
);
```

## Agregar un tema nuevo

1. Editar `src/config/theme.ts` y agregar la entrada en `themes`:

   ```ts
   export const themes = {
     // ... existentes
     miTema: {
       primary: '#ff6600',
       neutral: '#333333',
       success: '#00cc66',
       warning: '#ffcc00',
       danger:  '#ff3333',
       surface: '#fafafa',
     },
   };
   ```

2. El type `ThemeName` se actualiza solo (es `keyof typeof themes`).

3. `isValidTheme` acepta el nuevo nombre automáticamente.

4. **No hace falta tocar nada más.** Los componentes lo detectan vía `getHostTheme()`.

5. Rebuild: `pnpm build:lib`. El nuevo tema se distribuye en los UMD.

## Modificar un color de un tema existente

1. Editar el hex en `src/config/theme.ts`.
2. Rebuild.

> **Cuidado:** cambiar un color es **breaking** si alguien lo está usando como referencia. Considerar versionar.

## Pasarle un hex literal a un componente

Si querés ignorar el sistema de temas en un componente puntual, pasá un hex en `color`:

```html
<cu-button color="#ff0000">Rojo literal</cu-button>
```

El `.ce.vue` lo detecta (no es un nombre semántico) y lo pasa tal cual al `.vue` interno. Útil para casos puntuales donde necesitás un color ad-hoc.

## Detección automática del tema del host

`src/utils/getHostTheme.ts`:

```ts
const currentTheme = ref("light");

function getSystemTheme(): string {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function findThemeInDocument(): string {
  const themed = document.querySelector("[data-theme]");
  if (themed) return themed.getAttribute("data-theme") || "light";
  return getSystemTheme();
}

if (typeof document !== "undefined") {
  currentTheme.value = findThemeInDocument();
  const observer = new MutationObserver(() => {
    currentTheme.value = findThemeInDocument();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    subtree: true,
    attributeFilter: ["data-theme"],
  });
}

export function getHostTheme(fallback = "light"): string {
  return currentTheme.value || fallback;
}
```

- Usa un `MutationObserver` para detectar cambios en `data-theme` en cualquier ancestro.
- Si no hay `data-theme` en el documento, usa `prefers-color-scheme`.
- El `matchMedia` también escucha cambios del sistema.

## `palette.ts` (resumen)

Funciones principales:

- `getColorMap(theme)` — devuelve un objeto `{ primary, neutral, success, warning, danger, surface }` para el tema dado.
- `getBgClasses(color, variant, hightContrast)` — devuelve `{ main, hover, active }` para los fondos de un variant.
- `getFgClasses(color, variant, hightContrast)` — devuelve colores de foreground/texto/bordes.

Usá estas funciones en el `.vue` interno para mantener consistencia visual entre componentes.

## Color hex con `color2k`

El proyecto usa [`color2k`](https://github.com/ricokahler/color2k) para manipulación de color:

```ts
import { lighten, darken, transparentize, toHex, getContrast } from "color2k";
```

- `lighten(color, amount)` y `darken(color, amount)` para oscurecer/aclarar.
- `transparentize(color, amount)` para opacidad.
- `getContrast(a, b)` para verificar contraste (usado en palette.ts para accesibilidad).

## Temas y testing

En los tests, no testees contra colores específicos (pueden cambiar). Testeá que el componente **recibe** el color correcto dado un `theme` y `color` conocidos.

## Resumen

| Necesitás... | Tocá... |
|--------------|---------|
| Agregar un tema | `src/config/theme.ts` |
| Cambiar un color de un tema | `src/config/theme.ts` |
| Cambiar la prioridad de detección | `src/utils/getHostTheme.ts` |
| Cambiar cómo se calcula un variant | `src/utils/palette.ts` |
| Usar un tema en un componente nuevo | Nada: ya viene integrado en `.ce.vue` |
