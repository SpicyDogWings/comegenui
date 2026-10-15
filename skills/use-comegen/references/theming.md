# Temas y color

## Cómo se elige el tema

```html
<html data-theme="dark">
```

- Prioridad: `data-theme` (en `<html>` **o en cualquier contenedor**) → `prefers-color-scheme`.
- No hay prop `theme` por componente: el tema entra por custom properties, así que un contenedor
  con `data-theme` cambia a los componentes de adentro (varios temas en la misma página).
- Los colores se piden por nombre semántico; ver «Colores semánticos» abajo.

### Varios temas en la misma página

```html
<html data-theme="dark">
  <section data-theme="catppuccin-latte">
    <cu-button color="primary">Acá manda catppuccin-latte</cu-button>
  </section>
  <cu-button color="primary">Y acá vuelve dark</cu-button>
</html>
```

## Qué temas trae la lib (leer antes de prometer temas)

Al cargar el primer componente, `initTokens()` inyecta **un solo** juego de tokens: el **default**
(`:root`, más `[data-theme="light"]`). Los bundles **no** traen los otros temas.

Los 15 temas existen en el repo (`comegen.config.json`: `light`, `dark`, `nord-*`, `gruvbox-*`,
`rose-pine-*`, `catppuccin-*`) y **el sitio de la doc** los sirve: ahí `data-theme` cambia todo sin
CSS extra.

En el proyecto del usuario, para usar un tema distinto del default hay que **aportar los tokens**:

```css
/* los hex de cada tema están en comegen.config.json (repo) o en el sitio de la doc */
[data-theme="dark"] {
  --cu-color-neutral: #e5e5e5;
  --cu-color-surface: #1c1c1c;
}
```

- Alcanza con los colores que **cambian**: el resto sigue saliendo de `:root` (los defaults).
- Si el CSS del host define `--cu-color-primary` en `:root`, la lib **no** inyecta nada (manda el
  CSS del host).
- No inventes un `data-theme` nuevo sin declarar sus tokens: el componente se ve como el default.

## Colores semánticos

`primary`, `secondary`, `neutral`, `success`, `warning`, `danger` — y `surface` (el fondo).

```html
<cu-button color="primary">Primary</cu-button>
<cu-badge color="danger">12</cu-badge>
```

En Vue es el mismo valor: `<Button color="primary">`.

## Variantes

Según el componente: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none`. El default
varía por componente: está en la tabla `variant` de su ficha (`docs/componentes/…`) o en
`references/<kebab>.md`.

## Tokens (para el CSS del host)

Familias por color: `--cu-color-{color}`, `-text`, `-hover`, `-active`,
`-soft`/`-soft-hover`/`-soft-active`, `-subtle`/`-subtle-hover`/`-subtle-active`/`-subtle-border`,
`-ghost-hover`/`-ghost-active`, `-code`.

Compartidos: tipografía (`--cu-font-*`), espaciado (`--cu-space-*`), radios (`--cu-radius*`),
bordes (`--cu-border-*`), sombras (`--cu-shadow-*`).

```css
.mi-banner {
  color: var(--cu-color-primary);
  background: var(--cu-color-primary-soft);
  border: 1px solid var(--cu-color-primary-subtle-border);
}
```

- Los inyecta la lib en `:root` (el primer componente que cargue) y existen dentro del shadow DOM
  de cada componente: sirven globalmente y también para el CSS del host.
- Los componentes viven en un **shadow root**: sus clases internas no se pueden estilar desde
  afuera. Para cambiar un color desde el CSS del host, **pisá tokens** en un contenedor:

```css
.mi-seccion { --cu-color-primary: #16a34a; }
```
