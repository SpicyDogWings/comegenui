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

Un tema puede listar **sólo** los colores que cambia: el resto se hereda del tema `light` (el default).

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
- `--cu-color-{nombre}-text-muted` / `-text-subtle` — texto atenuado con contraste real
  (≥ 4.5:1 y hasta 6:1 cuando el texto base lo permite, sobre la superficie y los tintes
  `ghost-hover`/`soft`); son colores opacos, no `opacity`
- `--cu-color-{nombre}-hover` / `-active` — estados interactivos
- `--cu-color-{nombre}-soft` / `-soft-hover` / `-soft-active`
- `--cu-color-{nombre}-subtle` / `-subtle-hover` / `-subtle-active` / `-subtle-border`
- `--cu-color-{nombre}-ghost-hover` / `-ghost-active`
- `--cu-color-{nombre}-code` — acento para bloques de código (con contraste ≥ 4.5:1 ya garantizado)

Compartidos: tipografía (`--cu-font-*`, `--cu-line-height-*`), espaciado (`--cu-space-*`), radios
(`--cu-radius*`), bordes (`--cu-border-*`), sombras (`--cu-shadow-*`) y alpha de estado
(`--cu-alpha-*`). El esquema de código usa `--cu-code-bg`, `--cu-code-text` y `--cu-code-faded`.

### Alpha de estado

El tono de los estados atenuados es un token, no un valor de cada componente: así un campo
deshabilitado y un botón deshabilitado se ven igual. Los declara el grupo `alpha` del config:

| Token | Default | Para qué |
|---|---|---|
| `--cu-alpha-disabled` | `0.7` | controles interactivos deshabilitados (button, checkbox, switch, campos, sliders) |
| `--cu-alpha-muted` | `0.5` | items, opciones, filas y pestañas deshabilitadas — y placeholders |
| `--cu-alpha-subtle` | `0.6` | iconos y textos secundarios atenuados |
| `--cu-alpha-faded` | `0.4` | contenido bloqueado/atenuado (loading, overlay, vista no editable) |

```json
{ "alpha": { "disabled": 0.7, "muted": 0.5, "subtle": 0.6, "faded": 0.4 } }
```

Los componentes las consumen con fallback (`var(--cu-alpha-disabled, 0.7)`), así que un CSS de
host viejo —sin estos tokens— sigue funcionando con los defaults.

`--cu-alpha-*` se usa para **atenuar controles completos** (un botón deshabilitado, un overlay).
Para **texto** atenuado el token es `--cu-color-{nombre}-text-muted` / `-text-subtle`: `opacity`
diluye el texto contra el fondo y baja el contraste real por debajo de WCAG (2.2–4.3:1 en varios
temas), mientras que estos tokens son colores ya medidos (≥ 4.5:1) en los 15 temas. Los
consumen CommandPalette, Table, Pagination, Input/Textarea (placeholder), Tabs, FileInput,
FileInputZone, Select, Autocomplete, Dropdown/DropdownMenu, Navbar, Calendar, CellsImporter y
la descripción del Modal.

Los tokens los aporta el CSS del host: este sitio los genera de `comegen.config.json` (`:root` con
el tema default y cada tema bajo su `[data-theme="…"]`). En tu app definí `:root` / `[data-theme="…"]`
con los colores que uses; los bundles no traen tokens.

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
