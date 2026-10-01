# Contribuir a ComegenUI

¡Gracias por querer aportar! ComegenUI es una librería de componentes UI como Web Components
(Custom Elements) construidos con Vue 3.

## Regla de oro: todo es una issue

**Todo pedido, bug, mejora, cambio de API o de documentación empieza como una issue.**
No se aceptan pull requests sin una issue asociada.

El flujo es siempre el mismo:

1. **Buscá** si ya existe una issue abierta para tu caso.
2. Si no existe, **creá una issue** usando la [template](https://github.com/SpicyDogWings/comegenui/issues/new?template=issue.md).
3. **Discutí el enfoque en la issue** antes de escribir código. Así evitamos trabajo que después
   no se puede mergear.
4. Recién entonces creá una rama, hacé el cambio y abrí el pull request **referenciando la issue**
   (`Closes #N`).

> Las peticiones y solicitudes de cambios se canalizan **únicamente por issues**. Los PRs sin issue
> asociada se cierran o se dejan en espera.

## Setup local

Requisitos:

- Node `^20.19.0 || >=22.12.0`
- pnpm `12`

```sh
git clone git@github.com:SpicyDogWings/comegenui.git
cd comegenui
pnpm install
pnpm dev
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Dev server del sitio de docs (VitePress) con hot-reload |
| `pnpm build` | Build del sitio de docs |
| `pnpm preview` | Preview del sitio buildeado |
| `pnpm site:sync` | Regenera el tema de VitePress (tokens CU → `*.gen.*`) |
| `pnpm build:lib` | Build de la librería UMD (Web Components) + zip |
| `pnpm type-check` | Type-check con `vue-tsc` |
| `pnpm test` | Tests unitarios (Vitest) |
| `pnpm preflight` | Gate local antes de un PR (type-check + tests + docs + build del sitio) |

## Flujo de ramas y commits

- Partí **siempre de `main`** y creá una rama con prefijo según el tipo de cambio:
  `feat/…`, `fix/…`, `docs/…`, `chore/…`, `refactor/…`.
- Si ya estás trabajando en una rama (base ≠ `main`), **no crees otra**: seguí sobre la actual.
  `main` solo recibe merges.
- Usá **Conventional Commits** en español y en minúsculas, por ejemplo:

  ```
  feat(select): permitir búsqueda remota
  fix(date-picker): no cerrar al cambiar de mes
  docs(button): aclarar la variante ghost
  ```

## Pull requests

Todo PR nace de una issue y la **referencia con un closing keyword** (`Closes #N`, o `Fixes`/`Resolves`):
GitHub la cierra sola al mergear. Escribí:

- **Título:** Conventional Commits en español, igual que los commits
  (`fix(tokens): emitir font-size 3xl/4xl`).
- **Descripción:** usá la [plantilla de PR](./.github/PULL_REQUEST_TEMPLATE.md) (GitHub la precarga):
  qué cambia y por qué, la issue (`Closes #N`) y cómo lo verificaste.

Los agentes generan el título y la descripción a partir de esa plantilla: la skill
`comegen-preflight` corre el gate local y arma el cuerpo del PR.

## Componentes

Antes de tocar un componente, leé la arquitectura y las reglas del repo en
[`AGENTS.md`](./AGENTS.md). El patrón público es de **3 archivos**:

```
src/components/{category}/MiComponente.vue                    → componente real
src/components/customElements/{category}/MiComponente.ce.vue  → wrapper CE
src/lib/{category}/mi-componente.ts                           → entry point
```

Si el cambio altera la API, actualizá también las fichas de documentación
(`docs/componentes/…`) y las páginas del sitio. La receta completa está en la skill
`comegen-ui-docs`.

## Checklist antes del PR

- [ ] Hay una issue abierta y el PR la referencia (`Closes #N`).
- [ ] `pnpm preflight` pasa (type-check, tests, docs y build del sitio).
- [ ] Las fichas y páginas de docs reflejan el cambio si tocaste la API.
- [ ] Los commits siguen Conventional Commits.
- [ ] No se colaron secretos, tokens ni credenciales.

## Trato

Se espera un trato respetuoso en issues, PRs y comentarios. Critique el cambio, no a la persona.
