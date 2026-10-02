---
name: comegen-preflight
description: 'Corre el gate local de comegen-ui (guard.sh) antes de un merge request — impacto, tipos sin regresión, contrato de cada custom element, build de la lib, tests y docs — y arma el título y la descripción del PR desde la plantilla. Usar cuando el usuario pida "prepará el merge request", "preparar MR", "correr tests antes del MR", "preflight", "chequear que no rompí nada", "¿dañé un componente?", "validar antes de commitear", "armá el PR", "generá el título/descripción del PR".'
metadata:
  repository: https://github.com/SpicyDogWings/comegenui
  path: docs/skills/comegen-preflight
  version: 5.0.1-alpha
---

# `comegen-preflight`

Chequeo local previo al merge request. **No usa CI**: corre en la máquina del que desarrolla.

## Cuándo se activa

- "Prepará el merge request" / "preparar MR" / "voy a abrir un MR".
- "Preflight" / "chequeá que no rompí nada" / "validá antes de commitear".

## Qué correr

```bash
./scripts/guard.sh --full
```

El gate corre, en orden, y por cada paso imprime un veredicto en criollo:

1. **impacto** (`scripts/impact.mjs`): qué componentes dependen de los archivos que cambiaste.
2. **tipos** (`vue-tsc --build` + `scripts/typecheck-diff.mjs`): errores de TypeScript **nuevos por
   identidad** contra `scripts/typecheck-baseline.txt` (no por conteo: el baseline viejo sólo contaba).
3. **contrato** (`scripts/contract.mjs`): carga cada `dist-lib/Cu*.umd.js` en jsdom y compara props
   declaradas, métodos expuestos, metadata `comegen` y estructura del shadow DOM contra
   `scripts/contract-baseline/<tag>.json`. Reporta `❌ <tag> ROTO: ...`.
4. **build de la lib** (`build:lib`): compila los UMD reales — lo que antes ningún gate miraba.
5. **tests unitarios** (`vitest run`).
6. **docs**: `check-docs.mjs` + `gen-api.mjs --check`; con `--full` además el build del sitio
   (dead links + que los ejemplos `.vue` compilen).

Flags: `--solo <tag>` (loop rápido), `--explicar` (qué hace y por qué cada paso), `--update`
(regenera el baseline de contratos), `--no-typecheck`, `--no-build`, `--no-tests`.

Termina con `✅ RESULTADO: nada roto` o `❌ RESULTADO: hay componentes rotos o fallos. NO mergear.`

## Cómo reportar

- Si termina en `✅`: informar que está en verde y continuar (commit / MR).
- Si falla: mostrar el paso y el componente/error concreto. **No** commitear ni preparar el MR.
- Si un **contrato** cambió a propósito (nueva prop/método/clase): regenerá el baseline con
  `./scripts/guard.sh --update` y commitealo en el mismo PR.

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

- El repo arrastra deuda de tipos vieja: el gate **sólo** te atribuye errores *nuevos* (por identidad).
  Si aparece uno, es tuyo.
- El gate de docs **no valida contenido**, sólo existencia y frontmatter. Si cambiaste un componente,
  actualizá a mano su ficha y su página (ver el agente `.opencode/agent/comegen-docs.md`).
- `scripts/preflight.sh` sigue existiendo pero es un alias de `scripts/guard.sh`.
