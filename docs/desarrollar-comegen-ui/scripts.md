# Scripts

Hay 7 scripts bash en `scripts/` que automatizan tareas del proyecto. Todos usan la CLI [`pan`](https://github.com/anomalyco/hefesto) para UI/UX (confirmaciones, spinners, inputs, file pickers, menús).

## Dependencia: `pan` (Hefesto)

Todos los scripts requieren `pan` >= 0.4.5. Si no lo tenés instalado, los scripts no funcionan.

```bash
# Instalar hefesto (https://github.com/anomalyco/hefesto)
```

## Listado

| Script | Qué hace | Comando directo |
|--------|----------|-----------------|
| `build_library.sh` | Compila la librería (`pnpm build:lib`) | `bash scripts/build_library.sh` |
| `move_unzip.sh` | Mueve el zip a un destino y lo descomprime | `bash scripts/move_unzip.sh` |
| `storybook_dev.sh` | Inicia Storybook en `localhost:6006` | `bash scripts/storybook_dev.sh` |
| `config.sh` | Edita las variables de `env.sh` (paths) | `bash scripts/config.sh` |
| `env.sh` | Variables de entorno compartidas (source, no ejecutar) | N/A |
| `config.txt` | Lista de variables editables para `config.sh` | N/A |
| `menu.txt` | Opciones del menú principal | N/A |

## Menú principal

Hay un script de menú en la raíz: `menu.sh`. Lanza el menú interactivo:

```bash
./menu.sh
```

Opciones (definidas en `scripts/menu.txt`):

- **Library/Build** — Compilar la librería.
- **Library/Move and Unzip** — Mover el zip generado y descomprimirlo en destino.
- **Storybook Dev** — Iniciar Storybook.
- **Configuración** — Editar las variables de entorno.
- **Salir**

## `env.sh` (variables de entorno)

Este archivo es **sourceado** por los otros scripts. No se ejecuta directamente.

```bash
#!/bin/bash
# scripts/env.sh

SCRIPT_DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

SOURCE_ZIP="/home/unancode/Documentos/canary/comegenUI/dist/comegenui.zip"
DESTINATION_PATH="/home/unancode/Documentos/releases/finanzas/views/libs/comegenuiv2"
```

Variables:

- `SOURCE_ZIP` — ruta absoluta al zip generado por `pnpm build:lib`.
- `DESTINATION_PATH` — directorio destino donde se descomprime el zip.

> **Importante:** estos paths son **específicos del entorno de desarrollo del equipo** (rutas absolutas a `Documentos/canary/comegenUI/...`). Si clonas el repo en otro lado, tenés que editar `env.sh` o usar `scripts/config.sh` para cambiarlos.

## Editar las variables (`config.sh` + `config.txt`)

Para no editar `env.sh` a mano (riesgo de sintaxis bash), usá `config.sh`:

```bash
bash scripts/config.sh
```

Abre un menú (definido en `config.txt`) con las variables editables:

```
Archivos/SOURCE_ZIP
Archivos/DESTINATION_PATH
```

Y para cada variable:

- `SOURCE_ZIP` — file picker (`pan file`).
- `DESTINATION_PATH` — directory picker (`pan file -d`).
- Otras (string) — input text (`pan input`).

El script modifica `env.sh` con `sed` automáticamente.

## `build_library.sh`

Compila la librería con confirmación previa:

```bash
#!/bin/bash
source "$SCRIPT_DIR/env.sh"

pan confirm -t "Build Library" -m "¿Compilar la librería ComegenUI?" -y "Compilar" || {
  pan log info "Compilación cancelada"
  exit 0
}

pan spin -l -t "Compilando librería..." -a dots -- pnpm build:lib

if [ $? -eq 0 ]; then
  pan log info "Librería compilada correctamente"
else
  pan log error "Error al compilar la librería"
  exit 1
fi
```

Equivalente directo a:

```bash
pnpm build:lib
```

## `move_unzip.sh`

Toma el zip de `SOURCE_ZIP` y lo mueve + descomprime en `DESTINATION_PATH`:

```bash
#!/bin/bash
source "$ROOT/scripts/env.sh"

if [ ! -f "$SOURCE_ZIP" ]; then
  pan log error "El archivo ZIP '$SOURCE_ZIP' no existe. Compilá la librería primero."
  exit 1
fi

pan confirm -t "Move and Unzip" \
  -m "Se eliminará $DESTINATION_PATH y se descomprimirá $(basename "$SOURCE_ZIP")" \
  -v danger -y "Ejecutar" || exit 0

# ... limpia destino, copia zip, descomprime ...
```

> **Cuidado:** este script **borra** `DESTINATION_PATH` antes de descomprimir. Confirmá antes de ejecutar.

Workflow típico:

```bash
# 1. Compilar
pnpm build:lib
# 2. Desplegar
bash scripts/move_unzip.sh
```

O en una sola sesión con el menú:

```bash
./menu.sh
# → Library/Build
# → Library/Move and Unzip
```

## `storybook_dev.sh`

Inicia Storybook:

```bash
#!/bin/bash
source "$SCRIPT_DIR/env.sh"

pan log info "Iniciando Storybook en http://localhost:6006"
pan spin -t "Storybook Dev" -- pnpm run storybook
```

Equivalente directo a:

```bash
pnpm storybook
```

## Workflows típicos

### Compilar y desplegar (producción)

```bash
./menu.sh
# → Library/Build
# → Library/Move and Unzip
```

### Iterar visualmente sobre un componente

```bash
./menu.sh
# → Storybook Dev
# → [editar código, Vite HMR recarga]
# → Ctrl+C para salir
```

### Cambiar el destino de deploy

```bash
./menu.sh
# → Configuración
# → Archivos/DESTINATION_PATH
# → [elegir nueva carpeta con el file picker]
```

## Variables de entorno alternativas

Si querés sobreescribir las variables de `env.sh` sin editar el archivo (CI, deploy temporal, etc.):

```bash
SOURCE_ZIP=/tmp/otro.zip DESTINATION_PATH=/tmp/destino bash scripts/move_unzip.sh
```

Los scripts usan `source env.sh` que solo setea las variables si no están definidas previamente (técnicamente, las sobreescribe con su valor hardcoded, así que esto **no funciona** directamente — habría que editar `env.sh` o `config.sh`).

## Resumen

| Para... | Usá... |
|---------|--------|
| Compilar los UMD | `pnpm build:lib` o `bash scripts/build_library.sh` |
| Desplegar a un destino | `bash scripts/move_unzip.sh` (con `pnpm build:lib` previo) |
| Iterar visualmente | `pnpm storybook` o `bash scripts/storybook_dev.sh` |
| Cambiar paths de deploy | `bash scripts/config.sh` |
| Workflow completo con menú | `./menu.sh` |
