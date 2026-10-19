# TODO — release 5.1.2

**Estado:** en preparación. `5.1.2` es la `latest` del sitio, pero **todavía no es la final**.
**Rama:** `fix/switch-label`.
**Última verificación:** `./scripts/guard.sh --full` verde (1710 tests, 57/57 mutaciones).

Objetivo de la release: **reemplazar la release `v5.1.1`** con estos fixes, sin cambios de
compatibilidad para quien ya consume la lib.

## Ya incluido

- [x] `cu-switch`: el atributo/prop `label` renderiza aunque el host no tenga hijos; el slot sigue
      teniendo prioridad cuando hay contenido.
- [x] Test de regresión del CE (sin hijos, sólo espacios, slot con contenido, contenido tardío).
- [x] Verificación del build real con Lightpanda (`umd-core`).
- [x] `package.json` en `5.1.2` y `metadata.version` de las 7 skills.
- [x] `docs/versions.json`: `5.1.2` = `latest`, `5.1.1` con `ref: v5.1.1`.
- [x] Changelog inicial en `docs/changelog/v5.1.2.md`.
- [x] Doc de `5.1.2`: `componentes/` + `partials/` (las páginas se heredan de `5.1.1`).
- [x] Baseline de contrato de `cu-switch` regenerado.

## Pendiente — ir sumando a la release

- [ ] Anotar en `docs/changelog/v5.1.2.md` cada fix nuevo que entre.
- [ ] Actualizar la doc de cada componente tocado: ficha vanilla, ficha Vue, partials y página.
- [ ] Si cambia una página del sitio, agregarla como overlay en `docs/versiones/5.1.2/paginas/`.
- [ ] Revisar si algún cambio rompe compatibilidad. Si rompe: `docs/site/breaking/5.1.2.md` + su
      fila en `docs/site/breaking/index.md`.
- [ ] Si cambia una API a propósito: `./scripts/guard.sh --update` y commitear el baseline.

## Cierre de la release

- [ ] `pnpm test`
- [ ] `./scripts/guard.sh --full`
- [ ] `pnpm docs:freeze 5.1.2` (materializar tablas de API)
- [ ] `pnpm docs:freeze 5.1.2 --with-lib` (congelar la lib `esm-shared` de la versión)
- [ ] `pnpm build` (sitio)
- [ ] `pnpm build:lib` (bundles + zips)
- [ ] Verificar los 4 zips: `dist-libs/comegenui-{umd-core,umd-shared,esm-core,esm-shared}-v5.1.2.zip`
- [ ] Commit final y PR de release (resumen del changelog + gate + zips)
- [ ] Merge a `main`
- [ ] Tag `v5.1.2` sobre el commit mergeado y push del tag
- [ ] Confirmar que `docs/versions.json` tiene una sola `latest`
- [ ] `pnpm docs:versions` y `pnpm deploy:docs:versions`
- [ ] Generar `.release/v5.1.2.md` y `gh release create v5.1.2 dist-libs/*.zip --notes-file .release/v5.1.2.md`

## Notas

- El gate completo puede fallar esporádicamente en `Alert.test.ts` / `AuthorCard.test.ts` cuando
  corre toda la suite en paralelo; esos tests pasan aislados. Reintentar antes de investigar.
- No publicar ni taggear hasta que la release esté cerrada: por ahora `5.1.2` sólo es la `latest`
  del manifiesto.
