# @comegenui/tokens

Fuente única de tokens de ComegenUI. El generador es
[gandalf](https://gitlab.com/SpicyDogWings/gandalf-tokens) (`@spicydogwings/gandalf-tokens`),
un paquete externo: **no se modifica ni se parchea su output**. Si algo falta, se
configura gandalf o se adapta el consumidor.

## Qué exporta

| Entry | Contenido |
|---|---|
| `@comegenui/tokens` | `useTheme` (re-export de gandalf), tipos, `gandalfConfig` |
| `@comegenui/tokens/tokens.css` | CSS generado (`:root` + `[data-theme]` + `@supports`) |
| `@comegenui/tokens/vite` | `comegenTokens()`: preset de Vite sobre el plugin de gandalf |
| `@comegenui/tokens/config` | `gandalfConfig` compilado |

## Instalación y entrega del CSS (ruta C)

El CSS viaja **dentro del paquete** (`files: ["dist"]`, `sideEffects: ["**/*.css"]`
para que ningún bundler elimine el import). El consumidor instala el paquete y carga
`tokens.css`; no necesita saber que existe gandalf.

**Tarball (sin registry):**

```bash
# en el repo
pnpm pack:components
# → dist-packages/comegenui-tokens-6.0.0-alpha.tgz

# en el proyecto consumidor
pnpm add ./dist-packages/comegenui-tokens-6.0.0-alpha.tgz
```

**Registry (como gandalf):** `.npmrc` con el scope y publicar:

```ini
@comegenui:registry=https://gitlab.com/api/v4/projects/<id>/packages/npm/
```

```bash
pnpm --filter @comegenui/tokens publish
```

Requiere `private: false` y `publishConfig`. Hoy `private: true`, así que solo está
disponible la vía tarball. gandalf va **empaquetado** en `dist/` (devDependency): el
consumidor no necesita el registry de `@spicydogwings`.

**Consumidor:**

```ts
// Vue / Vite: main.ts
import "@comegenui/tokens/tokens.css";
```

```ts
// Nuxt: nuxt.config.ts
css: ["@comegenui/tokens/tokens.css"]
```

```html
<!-- vanilla: copiar dist/tokens.css a public/ o servirlo desde el host -->
<link rel="stylesheet" href="/tokens.css">
```

En ruta C el CSS del componente **no incluye** tokens: se importan ambos
(`tokens.css` + el CSS del componente) y el tema se activa con `data-theme`.

## Uso en el host

Cargar los tokens una vez (bundler o `<link>`):

```ts
import "@comegenui/tokens/tokens.css";
```

Activar tema:

```ts
import { useTheme } from "@comegenui/tokens";

const { theme, setTheme, toggleTheme } = useTheme({
  themes: ["light", "dark"],
  defaultTheme: "light",
});
```

`useTheme` (el de gandalf) resuelve el tema inicial en este orden: elección guardada →
`data-theme` ya aplicado → `prefers-color-scheme` → `defaultTheme`; escribe el atributo
en `<html>` y persiste en `localStorage` (`gandalf-theme` por defecto).

**Sin `tokens.css` no hay diseño**: los componentes referencian `--cu-*` y no inyectan
tokens por sí mismos (no existe `initTokens()`).

## Dev y build

Preset de Vite (genera al arrancar; sirve `/tokens.css` en memoria e inyecta `<link>`):

```ts
import { comegenTokens } from "@comegenui/tokens/vite";

plugins: [comogenTokens({ output: "tokens.css" }), vue()]
```

Distribución:

```bash
pnpm --filter @comegenui/tokens build   # vite build && tsc -p tsconfig.build.json
```

Emite en `dist/`: `tokens.css`, `index.js`, `vite.js`, `gandalf.config.js` y sus `.d.ts`.
`prepare`/`prepack` corren el build. `dist/` no se versiona.

## Configuración (`src/gandalf.config.ts`)

- Paleta base: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`,
  `surface`, `focus`, `shadow`, `strong`, `default`.
- Temas: `light` en `:root` y `dark` en `[data-theme="dark"]` (por ahora solo esos dos).
- `naming`: prefix `cu` y orden plano de variantes
  (`--cu-color-{color}-{variante}-{estado}-{text|border}`), compatible con la
  convención de la lib vieja.
- `opacities`: `shadows: 10`, `disabled: 70` → `--cu-opacity-disabled: 0.7`.
- `sizes`: pasos numéricos (`--cu-space-1`, `--cu-space-0-5`, …), radius y border.
- `font`: familias sans/mono; tamaños/pesos/line-height por default de gandalf.
- `code`: esquema de código de gandalf (`--cu-code-bg/-text/-faded`).
- `variants`: `solid`, `soft`, `subtle`, `ghost` con las fórmulas de cu-tokens
  (alfas 15/25/35 %, 10/20/30 %, texto medido contra el peor tinte).

## Límites actuales

- `private: true`: no publicado.
- Solo `light`/`dark`; los 15 temas de la app vieja no se migraron.
- gandalf no modela tiers de texto (`-text-muted`, `-text-subtle`) ni alfas de estado
  más allá de `disabled`.
