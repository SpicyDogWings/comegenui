---
name: release-changelog
description: 'Genera el changelog de una release de ComegenUI a partir del diff entre refs (por defecto, último tag → HEAD): seccionado, compacto y orientado al usuario común y al de desarrollo. Usar cuando el usuario pida "generá el changelog", "notas de la release", "qué cambió desde la última release", "armá las notas de la versión", "diffs entre releases". Solo para este repo.'
metadata:
  repository: https://github.com/SpicyDogWings/comegenui
  path: docs/skills/release-changelog
  version: 5.1.0
---

# `release-changelog` — notas de release

Genera el changelog de una versión a partir del **diff entre dos refs**: seccionado,
compacto y filtrado a lo que le importa a **quien consume** la lib y a **quien la
desarrolla**.

## Cuándo se activa

- "Generá el changelog", "notas de la release", "qué cambió desde vX".
- Antes de publicar una release (compañera de `generate-release`).

## Cuándo NO

- Preparar/validar la release entera (tests, build, docs) → `generate-release`.
- Documentar un componente puntual → `comegen-ui-docs`.

## Pasos

### 1. Fijar el rango

```bash
git describe --tags --abbrev=0          # release anterior (último tag)
git log --oneline <prev>..<target>      # commits a resumir
```

- Por defecto `prev` = último tag, `target` = `HEAD`.
- Si el usuario da refs (`vX..vY`, una rama, un PR), usalos.
- Encabezado: fecha de `<prev>` (`git log -1 --format=%ci <prev>`) y cantidad de commits
  (`git rev-list --count <prev>..<target>`).

### 2. Sacar la data cruda (con cuerpos)

```bash
git log <prev>..<target> --no-merges --format='=== %h %s%n%b'
```

Los **cuerpos de commit** son la fuente: ya traen el "por qué" y los bullets. **No
inventes** cambios; si algo no está en el diff, no va.

### 3. Seccionar (este orden; omití las secciones vacías)

| Sección | Qué entra |
|---|---|
| **⚠️ Distribución** | lo que **rompe** a quien actualiza: nombres de archivo/zip, formatos (UMD/ESM, core/shared), runtimes, CSS, metadata `comegen` |
| **Componentes** → **Agregado / Cambiado / Arreglado** | props, eventos, métodos y comportamiento visible |
| **Desarrollo** | build, guard/contrato, tooling, entorno (devbox), scripts |
| **Docs** | fichas, recetas de la skill, sitio |

### 4. Filtrar

- Solo lo que le importa al usuario común y al de desarrollo.
- Colapsá lo interno (refactors, renames de tests, churn de generadores) en una línea o
  descartalo.
- Agrupá cambios repetidos: p. ej. "cursor `not-allowed` en N componentes" en vez de N
  bullets.

### 5. Redactar (compacto)

- Una línea por cambio; sin SHA en el cuerpo (el rango va en el encabezado).
- Español, tono neutro; secciones en negrita.
- Verificá fechas y conteos con git; no los estimes.

### 6. Guardar (si se pide)

`docs/changelog/v<version>.md` con este encabezado:

```md
# Changelog — v<version>

_Delta desde `<prev>` (<fecha>) hasta <target>. N commits._
```

## Formato de salida

```md
# Changelog — v<version>

_Delta desde `<prev>` (<fecha>) · N commits._

## ⚠️ Distribución (solo si rompe compatibilidad)
- …

## Componentes

**Agregado**
- `cu-x`: …

**Cambiado**
- `cu-x`: …

**Arreglado**
- `cu-x`: …

## Desarrollo
- …

## Docs
- …
```

> Ejemplo real: `docs/changelog/v5.0.3-alpha.md`.

## Reglas

- **No** incluir commits de merge ni los de release/versión (`chore(release)`).
- Una versión por archivo; no acumules en un `CHANGELOG.md` global salvo que lo pidan.
- Si hay cambios de **distribución**, van **primero** y con ⚠️.
- Citá componentes por su tag (`cu-x`), no por el nombre del `.vue`.
