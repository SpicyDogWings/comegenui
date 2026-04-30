#!/bin/bash

# BTK - Bash ToolKit
# Version: 2.1 (Con soporte printf)
# Description: Advanced color and logging system for bash scripts

# Verificaciones
if ! command -v tput &> /dev/null; then
    echo "Error: 'tput' no está instalado. Este script requiere 'tput' para funcionar correctamente."
    exit 1
fi

# Configuración
# Usar MODE existente si está definido, sino usar "light" como valor por defecto
MODE="${MODE:-light}"

# ============================================
# CONFIGURACIÓN DE COLORES (Arrays Asociativos)
# ============================================

# Colores de texto (foreground)
declare -A FG_COLORS=(
    [BLACK]=$(tput setaf 0)
    [RED]=$(tput setaf 1)
    [GREEN]=$(tput setaf 2)
    [YELLOW]=$(tput setaf 3)
    [BLUE]=$(tput setaf 4)
    [MAGENTA]=$(tput setaf 5)
    [CYAN]=$(tput setaf 6)
    [WHITE]=$(tput setaf 7)
    [LIGHT_BLACK]=$(tput setaf 8)
    [LIGHT_RED]=$(tput setaf 9)
    [LIGHT_GREEN]=$(tput setaf 10)
    [LIGHT_YELLOW]=$(tput setaf 11)
    [LIGHT_BLUE]=$(tput setaf 12)
    [LIGHT_MAGENTA]=$(tput setaf 13)
    [LIGHT_CYAN]=$(tput setaf 14)
    [LIGHT_WHITE]=$(tput setaf 15)
)

# Colores de fondo (background)
declare -A BG_COLORS=(
    [BLACK]=$(tput setab 0)
    [RED]=$(tput setab 1)
    [GREEN]=$(tput setab 2)
    [YELLOW]=$(tput setab 3)
    [BLUE]=$(tput setab 4)
    [MAGENTA]=$(tput setab 5)
    [CYAN]=$(tput setab 6)
    [WHITE]=$(tput setab 7)
    [LIGHT_BLACK]=$(tput setab 8)
    [LIGHT_RED]=$(tput setab 9)
    [LIGHT_GREEN]=$(tput setab 10)
    [LIGHT_YELLOW]=$(tput setab 11)
    [LIGHT_BLUE]=$(tput setab 12)
    [LIGHT_MAGENTA]=$(tput setab 13)
    [LIGHT_CYAN]=$(tput setab 14)
    [LIGHT_WHITE]=$(tput setab 15)
)

# Estilos y controles
declare -A STYLES=(
    [NONE]=$(tput sgr0)
    [BOLD]=$(tput bold)
    [UNDERLINE]=$(tput smul)
    [BLINK]=$(tput blink)
)

# ============================================
# CONFIGURACIÓN DE TEMA
# ============================================

# Configuración por defecto
declare -A THEME=(
    [TEXT_COLOR]="${FG_COLORS[WHITE]}"
    [INFO_COLOR]="${BG_COLORS[BLUE]}"
    [WARN_COLOR]="${BG_COLORS[YELLOW]}"
    [ERROR_COLOR]="${BG_COLORS[RED]}"
    [SUCCESS_COLOR]="${BG_COLORS[GREEN]}"
    [DEBUG_COLOR]="${BG_COLORS[LIGHT_BLACK]}"
)

# Aplicar modo claro/oscuro
if [ "$MODE" = "light" ]; then
    THEME[TEXT_COLOR]="${FG_COLORS[BLACK]}"
else
    THEME[TEXT_COLOR]="${FG_COLORS[WHITE]}"
fi



# ============================================
# FUNCIONES AUXILIARES
# ============================================

# Función auxiliar para formatear texto con múltiples parámetros
# Uso: _format_text "formato" "arg1" "arg2" ...
# Ejemplo: _format_text "Hola %s, tienes %d mensajes" "Juan" 5
function _format_text() {
    local format="$1"
    shift
    
    # Si no hay más argumentos, devolver el formato tal cual
    if [ $# -eq 0 ]; then
        printf "%s" "$format"
        return
    fi
    
    # Usar printf para formatear el texto
    printf "$format" "$@"
}

# ============================================
# FUNCIONES DE LOGGING
# ============================================

# Función principal de logging
# Uso: log <tipo> <formato> [arg1] [arg2] ...
# Tipos: info, warn, error, success, debug
function log() {
    local type="${1:-info}"  # Tipo de log (por defecto: info)
    local message="${2:-}"    # Mensaje a mostrar
    local bg_color="${STYLES[NONE]}"
    local text_color="${THEME[TEXT_COLOR]}"
    local log_type="INFO"

    # Validar que se proporcione un mensaje
    if [ -z "$message" ]; then
        echo "Error: log() requiere un mensaje como segundo parámetro" >&2
        return 1
    fi

    case "$type" in
        "info")
            bg_color="${THEME[INFO_COLOR]}"
            log_type="INFO"
            ;;
        "warn")
            bg_color="${THEME[WARN_COLOR]}"
            log_type="WARNING"
            ;;
        "error")
            bg_color="${THEME[ERROR_COLOR]}"
            log_type="ERROR"
            ;;
        "success")
            bg_color="${THEME[SUCCESS_COLOR]}"
            log_type="SUCCESS"
            ;;
        "debug")
            bg_color="${THEME[DEBUG_COLOR]}"
            text_color="${FG_COLORS[BLACK]}"
            log_type="DEBUG"
            ;;
        *)
            bg_color="${STYLES[NONE]}"
            log_type="${type^^}"  # Convertir a mayúsculas
            ;;
    esac

    # Formatear el mensaje con los argumentos adicionales
    shift 2
    local formatted_message=$(_format_text "$message" "$@")

    # Formato: [FECHA] [TIPO] mensaje
    printf "%s %s%s%s %s %s\n" "$(date '+%Y-%m-%d %H:%M:%S')" "$bg_color$text_color" "[$log_type]" "${STYLES[NONE]}" "$formatted_message"
}

# Funciones de logging rápidas
function log_info() { log "info" "$@"; }
function log_warn() { log "warn" "$@"; }
function log_error() { log "error" "$@"; }
function log_success() { log "success" "$@"; }
function log_debug() { log "debug" "$@"; }


# ============================================
# FUNCIONES DE COLOR
# ============================================

# Funciones de color de texto
# Uso: <color> "formato" [arg1] [arg2] ...
# Ejemplo: red "Este texto será rojo"
# Ejemplo con formato: red "Hola %s, tienes %d mensajes" "Juan" 5
function black() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[BLACK]}%s${STYLES[NONE]}" "$formatted_text"
}
function red() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[RED]}%s${STYLES[NONE]}" "$formatted_text"
}
function green() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[GREEN]}%s${STYLES[NONE]}" "$formatted_text"
}
function yellow() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[YELLOW]}%s${STYLES[NONE]}" "$formatted_text"
}
function blue() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[BLUE]}%s${STYLES[NONE]}" "$formatted_text"
}
function magenta() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[MAGENTA]}%s${STYLES[NONE]}" "$formatted_text"
}
function cyan() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[CYAN]}%s${STYLES[NONE]}" "$formatted_text"
}
function white() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[WHITE]}%s${STYLES[NONE]}" "$formatted_text"
}
function lightBlack() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[LIGHT_BLACK]}%s${STYLES[NONE]}" "$formatted_text"
}
function lightRed() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[LIGHT_RED]}%s${STYLES[NONE]}" "$formatted_text"
}
function lightGreen() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[LIGHT_GREEN]}%s${STYLES[NONE]}" "$formatted_text"
}
function lightYellow() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[LIGHT_YELLOW]}%s${STYLES[NONE]}" "$formatted_text"
}
function lightBlue() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[LIGHT_BLUE]}%s${STYLES[NONE]}" "$formatted_text"
}
function lightMagenta() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[LIGHT_MAGENTA]}%s${STYLES[NONE]}" "$formatted_text"
}
function lightCyan() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[LIGHT_CYAN]}%s${STYLES[NONE]}" "$formatted_text"
}
function lightWhite() { 
    local formatted_text=$(_format_text "$@")
    printf "${FG_COLORS[LIGHT_WHITE]}%s${STYLES[NONE]}" "$formatted_text"
}

# Funciones de color de fondo
# Uso: bg<color> "formato" [arg1] [arg2] ...
# Ejemplo: bgBlue "Este texto tendrá fondo azul"
# Ejemplo con formato: bgBlue "Pod de %s tiene %d réplicas" "nginx" 3
function bgBlack() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[BLACK]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}
function bgRed() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[RED]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}
function bgGreen() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[GREEN]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}
function bgYellow() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[YELLOW]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}
function bgBlue() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[BLUE]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}
function bgMagenta() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[MAGENTA]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}
function bgCyan() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[CYAN]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}
function bgWhite() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[WHITE]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}
function bgLightBlack() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[LIGHT_BLACK]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}
function bgLightRed() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[LIGHT_RED]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}
function bgLightGreen() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[LIGHT_GREEN]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}
function bgLightYellow() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[LIGHT_YELLOW]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}
function bgLightBlue() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[LIGHT_BLUE]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}
function bgLightMagenta() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[LIGHT_MAGENTA]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}
function bgLightCyan() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[LIGHT_CYAN]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}
function bgLightWhite() { 
    local formatted_text=$(_format_text "$@")
    printf "${BG_COLORS[LIGHT_WHITE]}${THEME[TEXT_COLOR]}%s${STYLES[NONE]}" "$formatted_text"
}

# ============================================
# FUNCIONES DE ESTILO
# ============================================

# Funciones de estilo de texto
# Uso: <estilo> "formato" [arg1] [arg2] ...
# Ejemplo: bold "Este texto será negrita"
# Ejemplo con formato: bold "Hola %s, bienvenido" "Juan"
function bold() { 
    local formatted_text=$(_format_text "$@")
    printf "${STYLES[BOLD]}%s${STYLES[NONE]}" "$formatted_text"
}
function underline() { 
    local formatted_text=$(_format_text "$@")
    printf "${STYLES[UNDERLINE]}%s${STYLES[NONE]}" "$formatted_text"
}
function blink() { 
    local formatted_text=$(_format_text "$@")
    printf "${STYLES[BLINK]}%s${STYLES[NONE]}" "$formatted_text"
}

# ============================================
# FUNCIONES AVANZADAS
# ============================================

# Función para crear combinaciones personalizadas
# Uso: custom_color <fg_color> <bg_color> "formato" [arg1] [arg2] ...
# Ejemplo: custom_color "WHITE" "BLUE" "Texto personalizado"
# Ejemplo con formato: custom_color "WHITE" "BLUE" "Hola %s, %d" "Juan" 25
function custom_color() {
    local fg="${FG_COLORS[$1]:-${THEME[TEXT_COLOR]}}"
    local bg="${BG_COLORS[$2]:-${STYLES[NONE]}}"
    shift 2
    local formatted_text=$(_format_text "$@")
    printf "%s%s%s%s" "$bg" "$fg" "$formatted_text" "${STYLES[NONE]}"
}

# Función para cambiar el tema dinámicamente
# Uso: set_theme <text_color> <info_color> <warn_color> <error_color> <success_color> <debug_color>
function set_theme() {
    THEME[TEXT_COLOR]="$1"
    THEME[INFO_COLOR]="$2"
    THEME[WARN_COLOR]="$3"
    THEME[ERROR_COLOR]="$4"
    THEME[SUCCESS_COLOR]="$5"
    THEME[DEBUG_COLOR]="$6"
}

# ============================================
# DOCUMENTACIÓN Y EJEMPLOS
# ============================================

# Ejemplos de uso:
# log_info "Este es un mensaje informativo"
# log_error "¡Algo salió mal!"
# log_info "Pod %s tiene %d réplicas" "nginx-123" 3
# red "Texto en rojo"
# bgBlue "Texto con fondo azul"
# bgBlue "Pod de %s tiene %d réplicas" "nginx-123" 3
# bold "Texto en negrita"
# bold "Hola %s, bienvenido" "Juan"
# custom_color "WHITE" "BLUE" "Texto personalizado"
# custom_color "WHITE" "BLUE" "Hola %s, tienes %d mensajes" "Juan" 5
