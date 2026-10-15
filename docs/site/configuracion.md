# Configuración

Se configuran dos cosas: **los temas** (qué colores hay) y **los tokens** (cómo los consumís desde
tu CSS). Los componentes no exponen clases para estilar desde afuera: el contrato son los tokens.

## `comegen.config.json`

Es la **fuente de verdad** de los temas: ahí vive cada tema con sus colores, más lo compartido
(tipografía, espaciados, radios, bordes, sombras y opacidades). Los tokens se generan desde este
archivo; no se editan a mano en ningún otro lado.

```json
{
  "themes": {
    "light": { "primary": "#E73F1E", "neutral": "#1a1a1a", "surface": "#eeeeee" },
    "dark": { "neutral": "#e5e5e5", "surface": "#1c1c1c" }
  },
  "typography": { "fontFamily": { "sans": "…", "mono": "…" } },
  "spacing": { "sm": "0.5rem" }
}
```

Un tema puede listar **sólo** los colores que cambia: el resto se hereda del default de la lib.

## Tokens CSS

Cada color del tema se expone como custom properties y los componentes se estilan con ellas; podés
usar las mismas en tu propio CSS:

```css
.mi-banner {
  color: var(--cu-color-primary);
  background: var(--cu-color-primary-soft);
  border: 1px solid var(--cu-color-primary-subtle-border);
}
```

Por cada color (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`):

- `--cu-color-{nombre}` — color base
- `--cu-color-{nombre}-text` — texto sobre ese color
- `--cu-color-{nombre}-hover` / `-active` — estados interactivos
- `--cu-color-{nombre}-soft` / `-soft-hover` / `-soft-active`
- `--cu-color-{nombre}-subtle` / `-subtle-hover` / `-subtle-active` / `-subtle-border`
- `--cu-color-{nombre}-ghost-hover` / `-ghost-active`
- `--cu-color-{nombre}-code` — acento para bloques de código (con contraste ≥ 4.5:1 ya garantizado)

Compartidos: tipografía (`--cu-font-*`, `--cu-line-height-*`), espaciado (`--cu-space-*`), radios
(`--cu-radius*`), bordes (`--cu-border-*`) y sombras (`--cu-shadow-*`). El esquema de código usa
`--cu-code-bg`, `--cu-code-text` y `--cu-code-faded`.

Los inyecta la lib al cargar el primer componente: el tema default en `:root` y cada tema de
`comegen.config.json` bajo su `[data-theme="…"]`. **Si tu CSS ya define `--cu-color-primary` en
`:root`, la lib no inyecta nada** y manda tu CSS: ese es el gancho para traer tus propios temas.

```css
:root { --cu-color-primary: #0f62fe; }

[data-theme="mi-marca"] {
  --cu-color-primary: #0f62fe;
  --cu-color-surface: #f4f4f4;
  --cu-color-neutral: #161616;
}
```

## Clases CSS y shadow DOM

Cada componente vive en su **shadow root**, así que sus clases internas (`cu-button--solid`, los
wrappers de cada parte) **no se pueden estilar desde afuera** — ni con un selector global ni con
`!important`. La personalización se hace por dos vías:

1. **Pisar tokens** en un contenedor. Las custom properties sí cruzan el shadow boundary, así que
   todo lo que esté adentro usa tus valores:

   ```css
   .mi-seccion {
     --cu-color-primary: #16a34a;
     --cu-color-primary-soft: #dcfce7;
   }
   ```

2. **Elegir por props** lo que el componente expone: `color`, `variant`, `size`, `hightContrast`, …
   Están en la ficha de cada componente.

Dos selectores que convienen tener a mano: `[data-theme="…"]` es el que usan los temas para definir
sus tokens, y el sitio de esta documentación además traduce el modo oscuro de VitePress (la clase
`dark` en `<html>`) al tema `dark` de ComegenUI.

## Ver también

- [Personalización](/personalizacion) — elegir y combinar temas, Theme Builder.
- [Versionado](/versionado) — versión y tipo de build de cada bundle.
