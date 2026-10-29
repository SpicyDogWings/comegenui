---
name: deploy-docs
description: 'Receta para publicar el sitio de la documentación de ComegenUI en Vercel (CLI, subida estática): construir la salida agregada de versiones, chequearla y publicarla a producción, con el rollback si sale mal, y la release de GitHub con los zips. Usar cuando el usuario pida "deployá la doc", "publicá el sitio", "subilo a Vercel", "deploy:docs", "publicar las versiones", "salir a producción con la doc", "cómo hago el deploy" o "rollback del sitio". Solo para este proyecto.'
metadata:
  repository: https://github.com/SpicyDogWings/comegenui
  path: docs/skills/deploy-docs
  version: 5.2.3
---

# `deploy-docs` — publicar el sitio de la doc

El sitio se publica **estático, por CLI**: no hay build en Vercel ni Git integration (Vercel clonaría
sin el `dist`, que está gitignored). Se sube la carpeta ya construida al proyecto `comegenui-docs`.

> **Primero, `generate-release`.** Deployar asume que la release ya está preparada y cortada: versión
> y tag, manifiesto con su `latest`, doc congelada (con su lib), changelog + breaking, gate verde y
> PR mergeado. Si falta algo de eso, empezá por `generate-release`; acá sólo se construye la salida
> agregada y se publica.

## Cuándo NO

- Preparar/cortar una release (tag, manifiesto, zips, changelog) → `generate-release`.
- Documentar un componente → `documenter`. · Consumir la lib → `use-comegen`.

## Precondiciones

- **La release está preparada** (skill `generate-release`): versión cortada, tag pusheado, manifiesto
  con una sola `latest`, doc de esa versión congelada **con su lib** (`docs/versiones/<id>/lib/`),
  changelog + página de breaking, y el gate verde.
- `vercel whoami` responde (si no: `pnpm dlx vercel login`).
- Saber **qué** publicás: la doc versionada se construye **antes** de subir (el deploy no buildea).

## Dos salidas, dos comandos

| Comando | Salida | Cuándo |
|---|---|---|
| `pnpm deploy:docs` | `docs/site/.vitepress/dist` — sitio de **una** versión, base `/` | sólo si no querés versiones |
| `pnpm deploy:docs:versions` | `docs/site/.vitepress/dist-versions` — cada versión en `/<id>/` + alias raíz + `versions.json` | lo normal |

Los dos hacen: **construir → `vercel link --cwd <salida> --project comegenui-docs --yes` →
`vercel --cwd <salida> --prod --yes`**. O sea: la carpeta tal cual queda **en producción**.

## Flujo (versionado)

### 1. Construir y mirar antes de subir

```bash
pnpm docs:versions
```

Deja `docs/site/.vitepress/dist-versions/`. Verificá que esté completo **antes** de publicar:

```bash
ls docs/site/.vitepress/dist-versions/          # <id>/ por versión + index.html + assets/ + versions.json
node -e "console.log(require('./docs/site/.vitepress/dist-versions/versions.json'))"
```

Tiene que haber: una carpeta por versión del manifiesto, el **alias raíz** (`/` = latest) y
`versions.json` con **una sola** entrada `latest: true` y las `routes` de cada versión. Si falta algo,
no publiques: el select del topbar y las URLs de versión salen de ahí.

### 2. Publicar

```bash
pnpm deploy:docs:versions        # = docs:versions + link + vercel --prod
```

`--prod` publica al dominio live **de inmediato**. Qué cambia: `/` sigue sirviendo latest (alias) y se
**suman** `/<id>/` (con la lib de esa versión), `/versions.json` y las páginas del sitio
(`/breaking/<version>`, guías).

### 3. Verificar lo publicado

```bash
curl -sI https://comegenui-docs.vercel.app/versions.json | head -1     # 200
curl -s  https://comegenui-docs.vercel.app/versions.json | head -20
```

Y abrí una página de una versión congelada (`/<id>/componentes/cu-button`) y el select del topbar.

### 4. Release de GitHub (opcional, pero es lo que se anuncia)

```bash
gh release create v<version> dist-libs/*.zip --title "v<version>" --notes-file .release/v<version>.md
```

Requiere los 4 zips (`pnpm build:lib`) y el mensaje de `.release/` (ver `generate-release`).

## Rollback

Vercel guarda todos los deploys: desde el dashboard del proyecto `comegenui-docs` →
*Deployments* → el anterior → **Promote to Production**. Por CLI, la vía rápida es re-publicar una
salida buena anterior (dejá el `dist-versions/` de la última publicación sana si vas a experimentar).

## Troubleshooting

| Síntoma | Causa / qué hacer |
|---|---|
| `vercel` pide login | `pnpm dlx vercel login` (y `vercel whoami` para confirmar el usuario). |
| El sitio queda sin versiones | Publicaste `dist` (una versión) en vez de `dist-versions`. |
| El select no aparece | `versions.json` ausente o con menos de 2 versiones (el select se oculta con una sola). |
| Chunks viejos tras republicar | El alias raíz se copia sin podar: cambiá/rehacé la carpeta de salida si cambian los hashes de chunk. |
| 404 en `/componentes/cu-x` | `docs/site/public/vercel.json` (`cleanUrls`) no viajó al `dist`. |
| La lib de una versión no es la suya | Falta `docs/versiones/<id>/lib/`: congelá con `pnpm docs:freeze <id> --with-lib`. |

## Límites

- **No** conectes el repo por Git integration: clonaría sin el `dist` (gitignored) y/o intentaría
  buildear; el deploy es por CLI con la carpeta construida.
- Vercel persiste **lo publicado**, no tu disco: la carpeta `dist-versions/` es local.
- Nada de esto toca la librería ni la skill que viaja en el zip.
