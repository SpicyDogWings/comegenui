# Versiones anteriores

Este sitio publica **sólo la última versión** de la documentación (la que sale de `main`). No hay
selector de versiones ni copias viejas publicadas: mantener cada versión como un sitio completo
duplicaba el peso del deploy sin aportar nada que el tag no resuelva.

Cada release queda **etiquetada** en git (`v5.2.2`, `v5.2.1`, …). La doc de una versión anterior vive
en su tag, y se lee o se buildea localmente en tres comandos.

## Leer la doc de una versión anterior

```bash
git clone https://github.com/SpicyDogWings/comegenui.git
cd comegenui
git checkout v5.1.1      # el tag de la versión que querés ver
pnpm install
pnpm dev                 # levanta el sitio de esa versión en http://localhost:5173
```

`pnpm dev` compone la doc de ese tag, buildea la lib `esm-shared` de esa versión y levanta VitePress.
Lo que ves —fichas, páginas y demos— es de **esa** versión, no de `main`.

Para el build estático: `pnpm build` deja el sitio en `docs/site/.vitepress/dist/`.

## Instalar esa versión

Los zips no se publican en el sitio: se generan desde el tag.

```bash
git checkout v5.1.1
pnpm install
pnpm build:lib           # deja dist-libs/comegenui-<config>-v5.1.1.zip
```

Después seguí [Instalación](/instalacion) igual que siempre. La API de esa versión está en las fichas
del mismo tag (`docs/versiones/<id>/componentes/`), que son las que renderiza `pnpm dev`.

## Qué versiones hay

| Versión | Tag | Dónde está su doc |
|---|---|---|
| 5.2.2 | `v5.2.2` | publicada en este sitio |
| 5.2.1 | `v5.2.1` | reemplazada por 5.2.2; sólo en el tag |
| 5.2.0 | `v5.2.0` | reemplazada por 5.2.1; sólo en el tag |
| 5.1.1 | `v5.1.1` | sólo en el tag |

Listá los tags disponibles con `git tag -l 'v*'`. Las versiones cortadas antes de 5.1.1
(`v5.0.*-alpha`) también se leen desde su tag, pero no tienen el sitio versionado.
