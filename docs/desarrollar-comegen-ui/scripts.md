# Scripts

Hay scripts bash que automatizan tareas del proyecto. Todos usan la CLI [`pan`](https://github.com/anomalyco/hefesto) para UI/UX (confirmaciones, spinners, inputs, file pickers, menús).

## Dependencia: `pan` (Hefesto)

Todos los scripts requieren `pan` >= 0.4.5:

```bash
cargo install pandora-kit
```

## Menú principal

`menu.sh` en la raíz es la entrada interactiva principal:

```bash
./menu.sh
```

Estructura del menú:

```
󱉟 Library
  ├── 󰣪 Build              → build_library.sh
  └── 󰆾 Move and Unzip     → move_unzip.sh
󰒓 Configuración
  ├── 󰞷 Administrador       → seleccionar PM (npm/pnpm/bun/deno)
  ├── 󱁉 Source Zip Path     → file picker para SOURCE_ZIP
  └── 󰉋 Destination Path    → dir picker para DESTINATION_PATH
 Salir
```

Los items de Configuración editan `scripts/env.sh` directamente desde `menu.sh` (sin llamar a `scripts/config.sh`). El menú se genera dinámicamente con iconos Nerd Font definidos como variables al inicio de `menu.sh`.

## `scripts/env.sh` (variables de entorno)

Sourceado por los scripts. No se ejecuta directamente.

```bash
PM="pnpm"
SOURCE_ZIP="dist/comegenui.zip"
DESTINATION_PATH="/var/www/html/comegenui"
```

- `PM` — Package manager a usar: `npm`, `pnpm`, `bun` o `deno`.
- `SOURCE_ZIP` — Ruta al zip generado por `$PM run build:lib`.
- `DESTINATION_PATH` — Directorio destino donde se descomprime el zip.

> Los scripts de build usan `$PM` en vez de `pnpm` hardcodeado. Si cambiás el PM desde el menú, los scripts lo usan automáticamente.

## `scripts/build_library.sh`

Compila la librería con confirmación previa:

```bash
pan confirm -t "Build Library" -m "¿Compilar la librería ComegenUI?" -y "Compilar" || exit 0
pan spin -l -t "Compilando librería..." -a dots -- $PM run build:lib
```

## `scripts/move_unzip.sh`

Toma el zip de `SOURCE_ZIP`, lo mueve y descomprime en `DESTINATION_PATH`:

```bash
if [ ! -f "$SOURCE_ZIP" ]; then
  pan log error "El archivo ZIP '$SOURCE_ZIP' no existe. Compilá la librería primero."
  exit 1
fi
pan confirm -t "Move and Unzip" -m "..." -v danger -y "Ejecutar" || exit 0
pan spin -l -t "Limpiando..." -- rm -rf "$DESTINATION_PATH"
pan spin -l -t "Creando..." -- mkdir -p "$DESTINATION_PATH"
pan spin -l -t "Moviendo..." -- mv "$SOURCE_ZIP" "$DESTINATION_PATH"
pan spin -l -t "Descomprimiendo..." -- unzip "$DESTINATION_PATH/$(basename "$SOURCE_ZIP")" -d "$DESTINATION_PATH"
pan spin -l -t "Limpiando zip..." -- rm "$DESTINATION_PATH/$(basename "$SOURCE_ZIP")"
```

> **Cuidado:** borra `DESTINATION_PATH` antes de descomprimir.

## `scripts/storybook_dev.sh`

Inicia Storybook:

```bash
pan log info "Iniciando Storybook en http://localhost:6006"
pan spin -t "Storybook Dev" -- $PM run storybook
```

## Patrones aplicados

### Expandir tilde y validar directorios

Al pasar paths a `pan file` desde variables de entorno, la tilde (`~`) no se expande dentro de comillas y el directorio puede no existir. `menu.sh` usa dos guards:

```bash
expand_path() {
  local path="$1"
  case "$path" in
    \~/*) echo "$HOME/${path#\~/}" ;;
    \~)   echo "$HOME" ;;
    *)    echo "$path" ;;
  esac
}

# Para archivo: extraer dirname primero
local dir
dir=$(expand_path "$(dirname "${SOURCE_ZIP:-.}")")
[ -d "$dir" ] || dir="."
NEW_VAL=$(pan file "$dir") || continue

# Para directorio: expandir directo
local dir
dir=$(expand_path "${DESTINATION_PATH:-.}")
[ -d "$dir" ] || dir="."
NEW_VAL=$(pan file -d "$dir") || continue
```

### Iconos Nerd Font en menús jerárquicos

formato `<icon>parent/<icon>child` por segmento:

```bash
I_LIBRARY="󱉟"
I_BUILD="󰣪"
I_MOVE="󰆾"

cat > "$menu_file" <<EOF
${I_LIBRARY} Library/${I_BUILD} Build
${I_LIBRARY} Library/${I_MOVE} Move and Unzip
EOF
```

## Workflows típicos

### Compilar y desplegar

```bash
./menu.sh
# → Library/󰣪 Build
# → Library/󰆾 Move and Unzip
```

### Cambiar el destino de deploy

```bash
./menu.sh
# → Configuración/󰉋 Destination Path
# → [elegir carpeta con el file picker]
```

### Cambiar package manager

```bash
./menu.sh
# → Configuración/󰞷 Administrador
# → [seleccionar npm/pnpm/bun/deno]
```

### Sobreescribir variables desde CLI

```bash
SOURCE_ZIP=/tmp/otro.zip DESTINATION_PATH=/tmp/destino bash scripts/move_unzip.sh
```
