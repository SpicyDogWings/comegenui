---
name: comegen-preflight
description: 'Corre el preflight local de comegen-ui antes de un merge request (type-check contra baseline + tests + gate de docs). Usar cuando el usuario pida "prepará el merge request", "preparar MR", "correr tests antes del MR", "preflight", "chequear que no rompí nada", "validar antes de commitear".'
---

# `comegen-preflight`

Chequeo local previo al merge request. **No usa GitLab CI**: corre en la máquina del que desarrolla.

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

Flags: `--no-typecheck` y `--no-tests` saltean los dos primeros pasos.

## Cómo reportar

- Si termina con `✅ Preflight OK`: informar que está en verde y continuar (commit / MR).
- Si falla: mostrar el step que falló y el error. **No** commitear ni preparar el MR hasta resolverlo.

## Notas

- El repo tiene tests que **ya** fallan por deuda vieja. Antes de atribuirte un fallo, compará con el
  estado previo (`git stash` + `pnpm test` + `git stash pop`).
- El gate de docs **no valida contenido**, sólo existencia y frontmatter. Si cambiaste un componente,
  actualizá a mano su ficha y su página (ver el agente `.opencode/agent/comegen-docs.md`).
