---
name: generate-release
description: 'Receta para preparar la próxima release de ComegenUI (este repo): generar las stories faltantes, refrescar la metadata y las fichas de la skill de uso, correr TODOS los tests, validar con preflight y buildear la lib + zip versionado. Usá esta skill cuando el usuario pida "preparar la release", "generar release", "dejar todo listo para la release", "generar las stories que faltan", "regenerar la skill / las fichas", "correr todos los tests antes de releasear" o "buildear la lib para publicar". Es solo para este proyecto (no es la skill de uso `use-comegen` que viaja en el zip, ni `comegen-dev` para desarrollar un componente puntual).'
---

# `generate-release` — preparar la próxima release

Deja el repo listo para publicar: stories completas, fichas de la skill sincronizadas con el código, tests verdes, y el zip de la lib generado.

> **Regla:** la release está lista solo si el [checklist final](#checklist-final) está completo y `./scripts/preflight.sh` da verde. No declares "listo" sin eso.

## Cuándo se activa

- "Preparar / generar la release", "dejar todo listo para la próxima release".
- "Generar las stories que faltan".
- "Regenerar la skill" / "las fichas de los componentes".
- "Correr todos los tests antes de releasear".
- "Buildear la lib / el zip para publicar".

## Cuándo NO

- Consumir la lib en otro proyecto → skill de uso `comegen-ui` (`use-comegen`).
- Desarrollar/modificar un componente puntual → `comegen-dev`.
- Documentar un componente → `comegen-ui-docs`.

## Precondiciones

- Estar en la rama de release (no commitear directo a `main`; `main` solo recibe merges).
- `pnpm install` al día.
- El flujo **modifica** stories y fichas: si tenés cambios sin commitear, commitealos o stashealos antes.

## Flujo

Seguí los pasos **en orden**; cortá al primer fallo.

### 0. Estado y versión

```bash
git status --short
node -e "console.log(require('./package.json').version)"
```

Anotá la versión: el zip se llama `comegenui-v<version>.zip`. Si hay que bumpear, editá `version` en `package.json` **antes** del paso 7.

### 1. Generar stories faltantes

```bash
pnpm stories:status        # inventario: qué tiene story/test/badges
pnpm khadgar:generate --all
```

`--all` **crea solo las stories que faltan**; a las existentes las saltea con "ya existe" (es esperado, no es error).

### 2. Refrescar metadata de las stories

```bash
pnpm khadgar:generate --all --meta-only
```

Actualiza `tokens`/`classes`/`api` de cada story sin tocar secciones/checks/extras curados.

### 3. Regenerar las fichas de la skill (docs)

```bash
pnpm khadgar:generate --all --docs
```

Regenera `docs/skills/use-comegen/componentes/cu-*.md` desde el **SFC que distribuye la lib** (`.ce.vue` si existe, si no el `.vue`). La prosa curada vive en los sidecars `*.doc.json` (nunca se pisan).

### 4. Tests

```bash
pnpm test          # todos los projects (hoy: capa L1)
pnpm test:l1       # explícito: capa L1 (.vue, jsdom)
```

### 5. Gate (type-check + tests + drift de docs)

```bash
./scripts/preflight.sh
```

Falla si hay **errores de type-check nuevos** (respecto de `scripts/typecheck-baseline`), tests rojos, o fichas desactualizadas. No bajes el baseline sin arreglar la causa.

### 6. Build de la app (que el playground no rompa)

```bash
pnpm build-only
```

### 7. Build de la lib + zip versionado

```bash
pnpm build:lib
```

Genera `dist-lib/` con los UMD, `css/themes.css` y el zip `dist-lib/comegenui-v<version>.zip`. El zip incluye los UMD, `css/`, `README-BUILD.md`, la skill `use-comegen/` (sin sidecars) y `update.sh`/`.ps1`/`.bat`.

### 8. Verificar el zip

```bash
unzip -l dist-lib/comegenui-v<version>.zip
```

Debe contener: los `Cu*.umd.js`, `css/themes.css`, `use-comegen/SKILL.md` + `use-comegen/componentes/cu-*.md`, y `update.sh`/`update.ps1`/`update.bat`. **No** debe contener `*.doc.json`.

### 9. Commit de lo generado

```bash
git status --short
```

Staggeá solo lo generado (stories, fichas, sidecars) y commiteá, p. ej.:

```bash
git add src/stories docs/skills/use-comegen/componentes
git commit -m "chore(release): preparar v<version>"
```

Revisá el diff antes. **Nunca** `git add -A` a ciegas.

## Checklist final

- [ ] `pnpm stories:status` → **0 sin story**.
- [ ] `pnpm khadgar:generate --all --docs --check` → **33/33 ok** (fichas sincronizadas).
- [ ] `pnpm test` verde.
- [ ] `./scripts/preflight.sh` verde (sin errores nuevos de type-check).
- [ ] `pnpm build-only` OK.
- [ ] `pnpm build:lib` OK.
- [ ] `dist-lib/comegenui-v<version>.zip` con UMDs, css, skill y update scripts; sin sidecars.
- [ ] Cambios generados commiteados.

Si algo falta, decilo explícitamente en el reporte; no lo tapes con "quedó funcionando".

## Troubleshooting

| Síntoma | Causa / qué hacer |
|---|---|
| `ficha desactualizada` en preflight | Corré `pnpm khadgar:generate --all --docs` y volvé a chequear. |
| `Ya existe .../X.stories.ts` | Esperado en `--all`: solo genera las faltantes. Usá `--force` solo si querés reconstruir una story (pierde secciones custom). |
| Errores de type-check "nuevos" | Compará con `scripts/typecheck-baseline`; arreglá los nuevos, no bajes el baseline. |
| Una ficha no cambia tras tocar la API | Verificá que estés tocando el SFC que importa el entry de `src/lib/**/<kebab>.ts`. |
| El zip no incluye un componente | Debe existir su entry en `src/lib/**/*.ts` (los internos no van a la lib ni a la skill). |
| La versión del zip no es la esperada | Sale de `version` en `package.json`; bumpéala y re-corré `pnpm build:lib`. |

## Archivos que toca

| Artefacto | Ruta |
|---|---|
| Stories | `src/stories/**/X.stories.ts` (+ `.stories.config.json` / `.extras.ts` curados) |
| Tests L1 | `src/stories/**/X.l1.test.ts` |
| Fichas de la skill | `docs/skills/use-comegen/componentes/cu-*.md` |
| Sidecars de prosa | `docs/skills/use-comegen/componentes/cu-*.doc.json` |
| Build de la lib | `dist-lib/` (gitignored) + `dist-lib/comegenui-v<version>.zip` |
| Reporte de tests | `public/test-results.json` (gitignored) |
