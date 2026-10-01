---
name: comegen-preflight
description: 'Corre el preflight local de comegen-ui antes de un merge request (type-check contra baseline + tests + gate de docs) y arma el título y la descripción del PR desde la plantilla. Usar cuando el usuario pida "prepará el merge request", "preparar MR", "correr tests antes del MR", "preflight", "chequear que no rompí nada", "validar antes de commitear", "armá el PR", "generá el título/descripción del PR".'
metadata:
  repository: https://github.com/SpicyDogWings/comegenui
  path: docs/skills/comegen-preflight
  version: 5.0.0-alpha.3
---

# `comegen-preflight`

Chequeo local previo al merge request. **No usa CI**: corre en la máquina del que desarrolla.

## Cuándo se activa

- "Prepará el merge request" / "preparar MR" / "voy a abrir un MR".
- "Preflight" / "chequeá que no rompí nada" / "validá antes de commitear".

## Qué correr

```bash
bash scripts/preflight.sh
```

El script corre, en orden y cortando al primer fallo:

1. **type-check** (`vue-tsc --build`) contra `scripts/typecheck-baseline`: falla sólo si hay errores
   *nuevos* respecto de esa cifra (el repo arrastra deuda vieja).
2. **tests unitarios** (`vitest run`).
3. **gate de docs** (`node scripts/check-docs.mjs`): cada tag definido en `src/lib/**/*.ts` tiene
   ficha en `docs/componentes/` y página en `docs/site/componentes/` con `title`/`group`; cada
   `@include` apunta a una ficha existente, cada ficha se incluye una sola vez y tiene sus
   secciones obligatorias.
4. **API generada** (`node scripts/gen-api.mjs --check`): las tablas de API entre marcadores están
   al día respecto de los SFC.
5. **build del sitio** (`pnpm build`): caza dead links y verifica que los ejemplos `.vue` compilen.

Flags: `--no-typecheck` y `--no-tests` saltean los dos primeros pasos.

## Cómo reportar

- Si termina con `✅ Preflight OK`: informar que está en verde y continuar (commit / MR).
- Si falla: mostrar el step que falló y el error. **No** commitear ni preparar el MR hasta resolverlo.

## Armar el MR

Con el preflight en verde, generá el PR a partir de las plantillas del repo:

1. **Título:** Conventional Commits en español, mismo criterio que los commits
   (`fix(tokens): emitir font-size 3xl/4xl`).
2. **Descripción:** partí de [.github/PULL_REQUEST_TEMPLATE.md](../../../.github/PULL_REQUEST_TEMPLATE.md)
   (GitHub la precarga) y completá `Qué`, `Issue relacionada` y `Verificación`.
3. **Issue:** tiene que existir y estar referenciada con un closing keyword (`Closes #N`, o
   `Fixes`/`Resolves`). La issue se pide con
   [.github/ISSUE_TEMPLATE/issue.md](../../../.github/ISSUE_TEMPLATE/issue.md).
   **El autocierre solo ocurre si el PR va a `main`** (rama por defecto); si el PR apunta a una
   rama de integración (ej. `v5.0.0-alpha.3`), la issue queda abierta y hay que cerrarla a mano.
   Avisá de esto al reportar el PR.
4. Devolvé título y cuerpo listos para pegar, o creá el PR:

   ```bash
   gh pr create --title "<título>" --body-file <archivo>
   ```

## Notas

- El repo tiene tests que **ya** fallan por deuda vieja. Antes de atribuirte un fallo, compará con el
  estado previo (`git stash` + `pnpm test` + `git stash pop`).
- El gate de docs **no valida contenido**, sólo existencia y frontmatter. Si cambiaste un componente,
  actualizá a mano su ficha y su página (ver el agente `.opencode/agent/comegen-docs.md`).
