# TODO — release 5.2.0

**Estado:** cerrada y lista para publicar (PR de release abierto, pendiente de merge y tag).
**Rama:** `release/5.2.0` (cortada desde `main`).
**Última verificación:** `./scripts/guard.sh --full` verde (1884 tests, 115/115 mutaciones).

Objetivo de la release: **reemplazar la release `v5.1.1`** con estos fixes. Sin cambios de
compatibilidad para quien ya consume la lib, salvo el método `open()` de `cu-side-over`, que nunca
funcionó y pasa a `show()`.

## Ya incluido

- [x] `cu-switch`: el atributo/prop `label` renderiza aunque el host no tenga hijos; el slot sigue
      teniendo prioridad cuando hay contenido.
- [x] Test de regresión del CE (sin hijos, sólo espacios, slot con contenido, contenido tardío).
- [x] Verificación del build real con Lightpanda (`umd-core`).
- [x] `package.json` en `5.2.0` y `metadata.version` de las 8 skills.
- [x] `docs/versions.json`: `5.2.0` = `latest`, `5.1.1` con `ref: v5.1.1`.
- [x] Changelog inicial en `docs/changelog/v5.2.0.md`.
- [x] Doc de `5.2.0`: `componentes/` + `partials/` (las páginas se heredan de `5.1.1`).
- [x] Baseline de contrato de `cu-switch` regenerado.
- [x] `cu-side-over`: `show()` reemplaza al método `open()` (la prop booleana `open` lo tapaba en
      el CE); el CE no teleporta el panel para conservar el slot; ficha vanilla, partial, skill y
      demos de 5.2.0 actualizados. Baseline regenerado.
- [x] `cu-select`: prop `readOnly` (atributo `read-only`) que bloquea apertura y selección sin
      atenuar ni quitar foco; ficha, skill, demo, tests y baseline actualizados.

## Pendiente (post 5.2.0)

- [ ] `cu-alert`: la prop `close` (muestra la X) tapa al método `close()` en el custom element;
      misma colisión que tenía `cu-side-over`. Decidir rename (prop `closable` o método `dismiss`)
      antes de documentar el método como funcional.

## Cierre de la release

- [x] `pnpm test` (dentro del gate)
- [x] `./scripts/guard.sh --full`
- [x] `pnpm build` (sitio)
- [x] `pnpm build:lib` (bundles + zips)
- [x] Verificar los 4 zips: `dist-libs/comegenui-{umd-core,umd-shared,esm-core,esm-shared}-v5.2.0.zip`
- [ ] Commit final y PR de release (resumen del changelog + gate + zips)
- [ ] Merge a `main`
- [ ] Tag `v5.2.0` sobre el commit mergeado y push del tag
- [ ] `pnpm docs:freeze 5.2.0` y `pnpm docs:freeze 5.2.0 --with-lib`
- [ ] Confirmar que `docs/versions.json` tiene una sola `latest`
- [ ] `pnpm docs:versions` y `pnpm deploy:docs:versions`
- [ ] Generar `.release/v5.2.0.md` y `gh release create v5.2.0 dist-libs/*.zip --notes-file .release/v5.2.0.md`

## Notas

- El gate completo puede fallar esporádicamente en `Alert.test.ts` / `AuthorCard.test.ts` cuando
  corre toda la suite en paralelo; esos tests pasan aislados. Reintentar antes de investigar.
- No publicar ni taggear hasta que la release esté cerrada: por ahora `5.2.0` sólo es la `latest`
  del manifiesto.
