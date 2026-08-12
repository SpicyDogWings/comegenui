---
version:
---

# Comegen UI

Librería de componentes UI como Web Components (Custom Elements) construidos con Vue 3.

## Uso

### 1. Incluir CSS del tema

```html
<!-- Todos los temas -->
<link rel="stylesheet" href="css/themes.css">

<!-- O solo un tema específico -->
<link rel="stylesheet" href="css/light.css">
```

### 2. Incluir los componentes que necesites

```html
<script src="CuButton.umd.js"></script>
<script src="CuAlert.umd.js"></script>
<script src="CuBadge.umd.js"></script>
```

### 3. Usar en HTML

```html
<cu-button color="primary">Click me</cu-button>
<cu-alert color="success" variant="soft">Guardado correctamente</cu-alert>
<cu-badge color="neutral">12</cu-badge>
```

## Temas

### Cambiar tema global

```html
<html data-theme="dark">
```

### Cambiar tema por componente

```html
<cu-button theme="sigacadv2" color="primary">Botón</cu-button>
```

### Prioridad

```
theme prop → data-theme (<html>) → prefers-color-scheme (OS)
```

## Colores disponibles

Cada tema define 6 colores semánticos: `primary`, `neutral`, `success`, `warning`, `danger`, `surface`.

## Variantes

Los componentes soportan variantes via el prop `variant`:

- `solid` — fondo con el color, texto contrastado
- `soft` — fondo suave, texto del color
- `subtle` — fondo muy sutil, borde del color
- `outline` — solo borde, fondo transparente
- `ghost` — sin fondo ni borde, solo hover

## Props comunes

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `color` | `String` | `"neutral"` | Color semántico |
| `variant` | `String` | `"solid"` | Variante visual |
| `size` | `String` | `"md"` | Tamaño (`sm`, `md`, `lg`) |
| `disabled` | `Boolean` | `false` | Deshabilitado |
| `theme` | `String` | — | Override de tema |

## Estructura del zip

La salida final es el zip con los archivos de la lib y el folder de la skill de uso, al mismo nivel:

```
comegenui-v{version}.zip
├── Cu*.umd.js          ← Componentes UMD
├── css/
│   ├── themes.css      ← Todos los temas
│   ├── light.css       ← Tema light
│   └── dark.css        ← Tema dark
├── comegen-ui/         ← Skill de uso: SKILL.md + docs por componente
├── update.sh           ← Actualizador del proyecto huésped (./update.sh; instala la skill en .agents/skills/)
└── README-BUILD.md     ← Este archivo
```
