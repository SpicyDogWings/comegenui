---
name: comegen-preflight
description: 'Corre el preflight local de comegen-ui antes de un merge request (type-check + tests por capa). Usar cuando el usuario pida "prepará el merge request", "preparar MR", "correr tests antes del MR", "preflight", "chequear que no rompí nada", "validar antes de commitear".'
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

1. `type-check` (`vue-tsc --build`)
2. tests **L1** (`.vue`) — `vitest run --project l1`

Las fases 2 y 3 agregan tests **L2** (`.ce`, browser) y **L3** (`.umd`, browser) al mismo script.

## Cómo reportar

- Si termina con `✅ Preflight OK`: informar que está en verde y continuar (commit / MR).
- Si falla: mostrar el step que falló y el error. **No** commitear ni preparar el MR hasta resolverlo.
- Los resultados de los tests de stories se escriben en `public/test-results.json`; el playground los muestra como badges ✅/❌ por sección.

## Notas

- Los tests de stories viven junto al componente (`X.stories.ts`) y se generan por capa desde el contrato (`src/plugins/khadgar/contract.ts`).
- El naming de los tests es `[cu-button] colors › primary › nombre del check`; el reporter (`src/plugins/khadgar/vitest/reporter.ts`) lo mapea a sección/variante.
