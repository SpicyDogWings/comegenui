# Personalización

Personalizar ComegenUI es elegir **tema**, **color** y **variante** — y, si te quedan cortos, armar
tus propios temas. Todo entra por CSS custom properties: no hay hoja de estilos que cargar.

## El tema lo define el host

```html
<html data-theme="dark">
```

- Prioridad: **`data-theme`** (en `<html>` o en cualquier contenedor) → **`prefers-color-scheme`**
  del sistema si no hay `data-theme`.
- No hay prop `theme` por componente: el tema entra por custom properties, así que **cualquier
  contenedor con `data-theme`** cambia a los componentes de adentro.

### Varios temas en la misma página

```html
<html data-theme="dark">
  <section data-theme="catppuccin-latte">
    <cu-button color="primary">Acá manda catppuccin-latte</cu-button>
  </section>

  <cu-button color="primary">Y acá vuelve dark</cu-button>
</html>
```

El contenedor más cercano gana. Es la forma de mostrar, por ejemplo, una vitrina de temas o un
panel lateral de otro color sin tocar los componentes.

## Theme Builder

El [Theme Builder](/theme-builder) es un laboratorio en vivo sobre los componentes reales:

- elegís un tema y ves cómo queda todo de una;
- **editás los colores** (primary, neutral —la tinta—, surface, tipografía…) y el resultado se
  actualiza al instante, sin tocar código;
- guardás el tema en el gestor de temas y lo seguís usando ahí mismo.

Para probar un tema en **toda esta documentación**, usá el selector de tema del topbar: lo aplica
en `<html>` igual que lo haría tu app.

## Colores semánticos

Se piden por nombre, no por hex: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`
y `surface` (el fondo).

```html
<cu-button color="primary">Primary</cu-button>
<cu-badge color="danger">12</cu-badge>
<cu-alert color="success" variant="soft">Listo</cu-alert>
```

En Vue es el mismo valor: `<Button color="primary">`.

## Variantes

Según el componente: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none`. Cuál es el
default cambia por componente — está en la ficha de cada uno.

## Temas

Los colores de los temas viven en `comegen.config.json`, la **fuente de verdad** del repo:

`light` (default), `dark`, `nord-frost`, `nord-aurora`, `nord-snow-storm`, `nord-polar-night`,
`gruvbox-dark`, `gruvbox-light`, `rose-pine`, `rose-pine-moon`, `rose-pine-dawn`,
`catppuccin-latte`, `catppuccin-frappe`, `catppuccin-macchiato`, `catppuccin-mocha`.

Un tema puede definir **sólo** los colores que cambia: el resto sale del tema `light` (el default).

::: tip
Los bundles **no traen tokens**: definí `[data-theme="…"] { --cu-color-*: … }` con los hex de
`comegen.config.json`. Este sitio ya los tiene; en tu app, ver [Configuración](/configuracion).
:::

## Agregar un tema nuevo

1. Agregá la entrada en `comegen.config.json` con los colores que cambian:

```json
{
  "themes": {
    "mi-marca": {
      "primary": "#0f62fe",
      "neutral": "#161616",
      "surface": "#f4f4f4"
    }
  }
}
```

2. Regenerá los tokens del sitio con `pnpm site:sync`; en tu app, copiá los hex que uses a tu CSS
   (los bundles no incluyen tokens).
3. Usalo: `<html data-theme="mi-marca">`.

El mismo `data-theme` sirve para pisar un tema existente en un rincón de la página: definí el
bloque de tokens que quieras.

## Ver también

- [Configuración](/configuracion) — tokens, `comegen.config.json` y clases CSS.
- [Instalación](/instalacion) — qué configuración bajar y cómo actualizarla.
