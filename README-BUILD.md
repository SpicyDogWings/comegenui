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

## Versión y metadatos

Cada UMD viaja con la versión del bundle con la que se construyó. El archivo arranca con un
banner y, en runtime, cada componente la expone como metadata:

```js
// banner del archivo: /*! comegenui v5.0.0-alpha.3 · CuAlert (cu-alert) */

// en runtime, desde la clase o desde el elemento
customElements.get('cu-alert').comegen
document.querySelector('cu-alert').comegen
// { lib: 'comegenui', name: 'CuAlert', tag: 'cu-alert',
//   version: '5.0.0-alpha.3', versionedTag: 'cu-alert--v5-0-0-alpha-3' }
```

### Convivir varias versiones

Además del tag normal, cada componente registra un **tag versionado**
(`<cu-alert--v5-0-0-alpha-3>`). El tag normal se lo queda la primera versión que se cargue; si
después se carga otra, se avisa por consola y la nueva queda disponible sólo con su tag
versionado. Cargar dos veces el mismo UMD no rompe: el registro es idempotente.

```html
<script src="vendor/5.0.0/CuAlert.umd.js"></script>
<script src="vendor/5.1.0/CuAlert.umd.js"></script>

<cu-alert>…</cu-alert>                  <!-- 5.0.0 (primera cargada) -->
<cu-alert--v5-1-0>…</cu-alert--v5-1-0>  <!-- 5.1.0 -->
```

## Temas

### Cambiar tema

```html
<html data-theme="dark">
```

### Prioridad

```
data-theme (<html>) → prefers-color-scheme (OS)
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

## Estructura del zip

La salida final es el zip con los archivos de la lib, al mismo nivel. La instalación es manual:
descomprimí el zip y copiá los archivos a tu proyecto.

```
comegenui-v{version}.zip
├── Cu*.umd.js          ← Componentes UMD
├── css/
│   ├── themes.css      ← Todos los temas
│   ├── light.css       ← Tema light
│   └── dark.css        ← Tema dark
└── README-BUILD.md     ← Este archivo
```
