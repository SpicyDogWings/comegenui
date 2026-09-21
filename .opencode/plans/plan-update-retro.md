## Qué hacer (de más barato a más estructural)

1. **Enforzá lo que ya tenés** (~10 min): script `"test": "vitest run"` + job `test` en `.gitlab-ci.yml` antes de `build`. Hoy no corren; con esto ya no podés mergear en rojo.
2. **Smoke test de contrato por cada `cu-*`**: definir el custom element real y verificar: tag registrado, `attribute → prop`, eventos vía `ceEmit`, métodos de `defineExpose`. Es el test que tu miedo pide. Se puede generar casi automático desde las docs.
3. **Manifiesto de API versionado**: un JSON por componente (`tags`, `props`, `events`, `methods`) commiteado. Un **diff en CI = detector de breaking change**. Aditivo → minor; cambio/borrado → major. Ahí dejás de romper *sin darte cuenta*.
4. **Validá docs ↔ código**: test que falle si un prop existe en código y no en la doc (o viceversa). Mata la deriva de docs obsoletas, que a su vez desinforma a los agentes.
5. **Política de deprecación**: nunca renombrar/borrar API pública en un minor. Agregás → deprecás con `console.warn` → removés recién en major. Esto es lo que resuelve el lado *host*: los sistemas atrasados tienen ventana de compatibilidad.
6. **CLI/versión por componente** (lo de antes): lockfile para que el host fije versiones, y que `update` **avise o frene al cruzar un major** sin flag explícito. Un `comegen doctor` podrido que escanee el host por APIs removidas/deprecadas antes de actualizar.
