# @comegenui/button

Button de ComegenUI: componente Vue construido sobre `Primitive` de
[Reka UI](https://reka-ui.com/), con variantes, tamaños y estados. Es la versión
nueva; el Button de la app vieja (`src/components/buttons/Button.vue`) sigue intacto.

## Estado

- Versión `6.0.0-alpha`, `private: true`, distribuido como tarball.
- Build ESM + `style.css` + declaraciones reales (`dist/`).
- **No es custom element todavía**: no hay `defineCustomElement` ni tag `cu-button`.
- Se consume como componente Vue (workspace o tarball):
  `import { Button } from "@comegenui/button"`.

## Instalación (tarball 6.0.0-alpha)

```bash
# 1. en el repo: generar los tarballs
pnpm pack:components

# 2. en el proyecto consumidor (Vue + Vite)
pnpm add ./dist-packages/comegenui-tokens-6.0.0-alpha.tgz
pnpm add ./dist-packages/comegenui-button-6.0.0-alpha.tgz
```

`reka-ui` se instala como dependencia del botón; `vue` es peer (ya lo tenés).

```ts
// main.ts
import "@comegenui/tokens/tokens.css";
import "@comegenui/button/style.css";
import { Button } from "@comegenui/button";
```

```vue
<Button variant="solid" color="primary">Guardar</Button>
```

Ruta C: el CSS de tokens es un paquete aparte; `@comegenui/button/style.css` **no** lo
incluye. El tema se activa con `data-theme` (o con `useTheme` de `@comegenui/tokens`).

## Contrato de estilos (importante)

Es **token-styled**: trae estructura, comportamiento y CSS scoped, pero los valores
de diseño salen de tokens del host. **El host debe cargar una vez:**

```ts
import "@comegenui/tokens/tokens.css";
```

Sin ese CSS el botón renderiza, pero queda prácticamente unstyled:

- sobreviven `display`, `cursor`, `box-sizing`, `transition`, `border: none`,
  `text-decoration`, el spinner y el fallback `opacity: var(--cu-opacity-disabled, 0.7)`;
- no resuelven colores, padding, gap, tipografía, radius ni ancho de borde.

El tema se activa con `data-theme` en `<html>` (o un contenedor), no con una prop.
Ver `@comegenui/tokens` para `useTheme`.

## API

### Props

| Prop | Valores | Default | Notas |
|---|---|---|---|
| `color` | `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` | `neutral` | valor inválido → `neutral` |
| `variant` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link` | `ghost` | valor inválido → `ghost`; `none` fue eliminada |
| `size` | `sm`, `md`, `lg` | `md` | |
| `to` | string | — | si existe, renderiza `<a>` en vez de `<button>` |
| `target` | `_self`, `_blank`, `_parent`, `_top` | `_self` | `_blank` agrega `rel="noopener noreferrer"` |
| `type` | `button`, `submit`, `reset` | `button` | inválido → `button` |
| `disabled` | boolean | `false` | |
| `loading` | boolean | `false` | deshabilita y antepone spinner |
| `iconOnly` | boolean | `false` | padding cuadrado; requiere nombre accesible |

### Emits

| Evento | Payload | Cuándo |
|---|---|---|
| `loading-change` | `boolean` | cambia `loading` |

### Slots

| Slot | Contenido |
|---|---|
| default | label y/o íconos SVG inline |

## Comportamiento

- **Modo link**: un único `<a>` (sin `<button>` anidado), conserva clases y estilos.
  `javascript:`, `vbscript:` y `data:` se rechazan → se renderiza como `<button>`.
- **Link deshabilitado** (o `loading`): sin `href`, `aria-disabled="true"`,
  `tabindex="-1"` y el click se previene y no burbujea.
- **Loading**: spinner `aria-hidden="true"` y `aria-busy="true"` en el nodo raíz.
- **Formularios en shadow DOM**: como `<button>` dentro de un CE no es
  form-associated, se replica `submit`/`reset` del `<form>` del host
  (incluye `form` apuntando a otro form y `formnovalidate`).
- **Clases**: `cu-button`, `cu-button--{variant}`, `cu-button--{size}`,
  `cu-button--disabled`, `cu-button--icon-only`, `cu-button-link`.

## Tokens que consume

Variables locales inline (`--btn-*`) que apuntan a tokens de gandalf:

| Variable | Token |
|---|---|
| `--btn-solid`, `-hover`, `-active`, `-text` | `--cu-color-{color}-solid[-hover\|-active\|-text]` |
| `--btn-soft`, `-soft-hover`, `-soft-active` | `--cu-color-{color}-soft[-hover\|-active]` |
| `--btn-subtle`, `-subtle-hover`, `-subtle-active`, `-subtle-border` | `--cu-color-{color}-subtle[-hover\|-active\|-border]` |
| `--btn-ghost-hover`, `-ghost-active` | `--cu-color-{color}-ghost-hover\|-ghost-active` |
| `--btn-text` | `--cu-color-{color}-ghost-text` |
| `--btn-text-ghost` | `--cu-color-{color}-ghost-active-text` |
| `--btn-text-soft` | `--cu-color-{color}-soft-active-text` |
| `--btn-text-subtle` | `--cu-color-{color}-subtle-active-text` |
| `--btn-border` | `--cu-color-{color}-ghost-border` |

Compartidos: `--cu-font-family-sans`, `--cu-font-size-{xs,sm,lg}`,
`--cu-font-weight-medium`, `--cu-space-{0-5,1,2,3,4,6}`, `--cu-radius-default`,
`--cu-border-width`, `--cu-opacity-disabled`.

## Desarrollo

```bash
pnpm --filter @comegenui/button dev     # playground (Vite + tokens en memoria)
pnpm --filter @comegenui/button test    # tests aislados
```

El playground usa `comogenTokens({ output: "tokens.css" })` y `useTheme` de
`@comegenui/tokens`; no importa CSS estático.
