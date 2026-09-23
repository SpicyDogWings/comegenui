# ⚠️ Deprecado — migrando a Khadgar

Este directorio (`src/stories/`) está **deprecado**. Es el sistema viejo: cada
componente se describe con una story (secciones + variantes + checks) que alimenta
el preview del playground, los snippets y los tests L1/L2/L3.

**El reemplazo es Khadgar:** un extractor que deriva la API de cada `.vue`
directo del SFC (`vue-component-meta` + complementos) y la publica como
`khadgar.json`. Los consumidores (playground, docs) leen ese JSON.

- No agregar stories nuevas.
- Los archivos actuales **siguen funcionando** (no se borran todavía) hasta que el
  reemplazo esté completo.
- Respaldo congelado: `backups/stories-legacy/`.
- Plan completo: `PLAN-KHADGAR.md` (raíz).

Preguntas/decisiones: ver `.opencode/skills/comegen-dev/`.
