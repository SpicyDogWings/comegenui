# packages/

Componentes de ComegenUI administrados como paquetes independientes del workspace.
No es la app vieja (`src/`): esa sigue viva y con su gate; esto es la nueva forma.

## Paquetes

| Paquete | Rol | Depende de |
|---|---|---|
| `@comegenui/tokens` | fuente única de tokens (gandalf), CSS, `useTheme` y preset de Vite | gandalf |
| `@comegenui/button` | Button Vue con Reka UI, token-styled | `@comegenui/tokens`, reka-ui |

Dirección de dependencias: **componentes → tokens**. Nunca al revés. Los componentes
no generan tokens ni importan gandalf; consumen `--cu-*` del host.

## Contrato de estilos

Los componentes son **token-styled**, no headless ni self-contained:

- Traen estructura, comportamiento, variantes y reglas CSS (`<style scoped>`).
- Todos los valores de diseño (color, spacing, radius, tipografía) son `var(--cu-*)`.
- El host debe cargar `@comegenui/tokens/tokens.css` **una vez**. Sin ese CSS el
  componente renderiza, pero queda prácticamente unstyled (los `var()` no resuelven).
- El tema se activa por `data-theme` en `<html>` (o un contenedor); no hay prop `theme`.

## Tests

Cada paquete corre sus tests aislados:

```bash
pnpm --filter @comegenui/tokens test
pnpm --filter @comegenui/button test
```

El suite raíz (`src/**/*.test.ts`) no ve estos paquetes, y `guard.sh` no aplica acá
mientras no se toquen los componentes viejos.

## Estado (6.0.0-alpha)

- `tokens`: build completo (`dist/tokens.css`, `index.js`, `vite.js` + `.d.ts`);
  gandalf va empaquetado. Todavía `private`.
- `button`: build ESM (`dist/index.js`, `dist/style.css`, `Button.vue.d.ts`).
  Todavía `private` y sin custom element.
- Distribución: tarballs en `dist-packages/` (`pnpm pack:components`), instalables con
  `pnpm add ./dist-packages/<paquete>.tgz`.
