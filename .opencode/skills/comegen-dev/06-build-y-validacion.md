# 06 — Build y validación

## Gate local: preflight

```bash
./scripts/preflight.sh        # o: pnpm run preflight
```

Corre en orden y corta al primer fallo:

1. **type-check** (`vue-tsc --build`) contra `scripts/typecheck-baseline` — hay deuda preexistente; **falla solo si aparecen errores nuevos** (si agregás errores, el mensaje te muestra cuáles).
2. **tests L1** (`.vue`) — `vitest run --project l1`.

> La skill `comegen-preflight` dispara esto cuando pedís "prepará el merge request". **No** se usa GitLab CI para esto.

## Tests

```bash
pnpm run test                    # todos los projects
pnpm run test:l1                 # solo capa L1
pnpm run test:watch              # watch
pnpm exec vitest run --project l1 src/components/buttons/Button.l1.test.ts
```

- Los tests de componente salen de la story: [`04-stories-y-tests.md`](04-stories-y-tests.md).
- El reporter escribe `public/test-results.json` (ignorado por git) para los badges del playground.
- Con **fake timers** usar `vi.advanceTimersByTimeAsync(ms)`; `runAllTimersAsync` ejecuta los timeouts internos del componente.

## Builds

```bash
pnpm run build-only     # compila la app Vue (validación de que el playground no rompe)
pnpm run build:lib      # UMD + css/themes.css + zip versionado en dist-lib/
pnpm run build          # type-check + build-only en paralelo
```

- `build:lib` toma cada `src/lib/**/*.ts` por glob (excluye `index.ts`, `tokens.ts`) → no hay que registrar nada a mano.
- El zip incluye los UMD, `css/`, `README-BUILD.md`, la skill de uso `use-comegen/` y los actualizadores (`update.sh`/`.ps1`/`.bat`).
- Al tocar la **lib** (contrato, shadow DOM, tokens), correr `build:lib` antes de cerrar la tarea.

## Probar el CE buildeado (fuera de Vue)

```bash
cd dist && python3 -m http.server 3000
```

```html
<!DOCTYPE html>
<html data-theme="dark">
<head><link rel="stylesheet" href="dist/css/themes.css"></head>
<body>
  <cu-button color="primary" variant="soft">Click me</cu-button>
  <script src="dist/CuButton.umd.js"></script>
  <script>
    document.querySelector('cu-button').addEventListener('click', () => console.log('clicked'))
  </script>
</body>
</html>
```

- `<script>` del componente siempre en `<body>` (o `defer`).
- Props como atributos kebab-case; arrays/objetos por JS (`el.options = [...]` tras `customElements.whenDefined('cu-…')`).
- Los eventos `ceEmit` llegan con `e.detail`.

## Qué correr según el cambio

| Cambio | Validación mínima |
|---|---|
| Componente `.vue` / story / test | `preflight` + L1 del componente |
| Playground | `pnpm dev` (visual) + `pnpm run build-only` |
| `.ce.vue` / `lib/` / tokens | `preflight` + `build:lib` + probar UMD en HTML plano |
| Docs | `comegen-ui-docs` (checklist de auditoría) |
