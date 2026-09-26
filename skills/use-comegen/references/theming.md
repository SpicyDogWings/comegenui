# Temas y color

## Cómo se elige el tema

```html
<html data-theme="dark">
```

Prioridad: **`data-theme` en `<html>` → `prefers-color-scheme`** (si no hay `data-theme`).

No hay prop `theme` por componente: el tema lo define el host. Para tener varios temas en
la misma página, envolvé la parte que quieras en un contenedor con `data-theme`.

## Temas disponibles (16)

`light` (default), `dark`, `nord-frost`, `nord-aurora`, `nord-snow-storm`,
`nord-polar-night`, `gruvbox-dark`, `gruvbox-light`, `rose-pine`, `rose-pine-moon`,
`rose-pine-dawn`, `catppuccin-latte`, `catppuccin-frappe`, `catppuccin-macchiato`,
`catppuccin-mocha`.

- `css/themes.css` trae todos (cada uno bajo su `[data-theme]`).
- `css/{tema}.css` trae uno solo.

La fuente de verdad de los temas es `comegen.config.json` (en el repo); el CSS se genera
desde ahí (`pnpm build:lib`).

## Colores semánticos

`primary`, `secondary`, `neutral`, `success`, `warning`, `danger` — y `surface` (fondo).

```html
<cu-button color="primary">Primary</cu-button>
<cu-badge color="danger">12</cu-badge>
```

En Vue es el mismo valor: `<Button color="primary">`.

## Variantes

Según el componente: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none`.
El default varía por componente (ver la ficha de cada uno o la tabla de `variant` en la doc).

## Tokens (para tu propio CSS)

Los componentes se estilan con custom properties `--cu-color-*`, así que podés reusar los
mismos colores fuera de ellos:

```css
.mi-banner {
  color: var(--cu-color-primary);
  background: var(--cu-color-primary-soft);
  border: 1px solid var(--cu-color-primary-subtle-border);
}
```

Familias de tokens por color: `--cu-color-{color}`, `-text`, `-hover`, `-active`,
`-soft`/`-soft-hover`/`-soft-active`, `-subtle`/`-subtle-hover`/`-subtle-active`/`-subtle-border`,
`-ghost-hover`/`-ghost-active`, `-code`.

Compartidos: tipografía (`--cu-font-*`), espaciado (`--cu-space-*`), radios (`--cu-radius*`),
bordes (`--cu-border-*`), sombras (`--cu-shadow-*`).

> Los tokens se inyectan por componente (`initTokens()`), así que las custom properties
> existen dentro del shadow DOM de cada uno. Si querés usarlas globalmente, cargá el
> `css/themes.css` (define las mismas variables en `:root`).
