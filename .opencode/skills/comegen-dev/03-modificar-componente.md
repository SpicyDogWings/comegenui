# 03 — Modificar un componente existente

> Toda modificación se considera terminada cuando `./scripts/preflight.sh` da verde y la DoD sigue cumpliéndose. Si cambiás la API pública, es un cambio de contrato: tratalo con cuidado.

## Flujo

1. **Identificar los 3 archivos** (si es público):
   - `src/components/{category}/X.vue`
   - `src/components/customElements/{category}/X.ce.vue`
   - `src/lib/{category}/x.ts`
2. **¿Cambia la interfaz?** (props/emits/slots/expose)
   - Actualizá también `.ce.vue` y la **story** (los `variants` y `checks`).
   - Actualizá la **doc** (`docs/skills/use-comegen/componentes/cu-x.md`) e índices con `comegen-ui-docs`.
   - Si renombrás/borrás algo público, **no lo hagas en un minor**: deprecá (logueá un warning) y remové en el major. El sistema huésped puede estar atrasado.
3. **Actualizá la story**: si el cambio introduce un estado/variante nuevo, agregá la sección/variante y su `check`. Si cambia un default, el `Badge` del playground suele quedar desactualizado: revisalo.
4. **Tests**: corré el L1 del componente. Si el comportamiento cambió a propósito, ajustá el check; si no querés tocar el check, probablemente rompiste algo.
5. **Validar**:

```bash
pnpm exec vitest run src/components/{category}/X.l1.test.ts
./scripts/preflight.sh
pnpm run build:lib        # si es público y tocaste contrato/estilos de shadow DOM
```

6. **Commit atómico**:

```bash
git status --short
git add <archivos de la tarea>
git commit -m "fix(cu-x): descripción del cambio"
```

## Reglas

- **No toques el build system** (`build-lib.ts`, `vite.config.ts`, `vitest.config.ts`) en una tarea de componente.
- **No corrijas el typo `hightContrast`** sin un plan de deprecación.
- Si un test viejo (`.test.ts` sin runner de stories) cubre el componente y lo estás migrando, seguí la receta [`08-migrar-al-sistema-de-stories.md`](08-migrar-al-sistema-de-stories.md): `X.l1.test.ts` con las secciones de la story (no dejes los dos).
- Si encontrás un problema no relacionado, registralo en `docs/notes/` en vez de arreglarlo de prepo.
