---
name: comegen-ui
description: 'Receta para usar componentes ComegenUI (Web Components/Custom Elements) en HTML plano, vanilla JS, o cualquier framework. Usar cuando el usuario pida instalar, cargar, configurar temas, o usar componentes comegen-ui en su proyecto. Frases: "instalar comegen-ui", "usar comegen-ui", "cargar componente", "configurar tema", "cambiar tema", "usar cu-button", "usar cu-modal". NO la uses para documentar componentes (eso es documentar-comegen-ui) ni para desarrollar componentes (eso es desarrollar-comegen-ui).'
---

# ComegenUI — Web Components

Componentes UI como Custom Elements nativos. Construidos con Vue 3 pero **utilizables en HTML plano, vanilla JS, o cualquier framework**.

> **Regla de oro:** cada componente es un archivo UMD independiente que se auto-registra al cargarse. No necesitas Vue ni ninguna dependencia.

## Cuándo se activa

- "Instalar/usar/cargar comegen-ui".
- "Configurar/cambiar tema".
- "Cómo usar cu-button/cu-modal/etc.".
- "Escuchar eventos de cu-componente".

## Cuándo NO se activa

- Documentar un componente → `documentar-comegen-ui`.
- Crear/modificar un componente → `desarrollar-comegen-ui`.

---

## Instalación

### HTML plano (recomendado)

**Estructura de archivos:**
```
mi-proyecto/
├── index.html
└── dist/                    ← el contenido del zip de comegenui
    ├── css/themes.css
    ├── CuButton.umd.js
    └── ...
```

**index.html:**
```html
<!DOCTYPE html>
<html data-theme="dark">
<head>
  <link rel="stylesheet" href="dist/css/themes.css">
</head>
<body>
  <cu-button color="primary" variant="solid">Guardar</cu-button>

  <script src="dist/CuButton.umd.js"></script>
</body>
</html>
```

> Los paths son **relativos al HTML**. Si el HTML está en la raíz del proyecto, los paths son `dist/css/...` y `dist/CuButton.umd.js`. Si servís desde `dist/`, los paths son `css/...` y `CuButton.umd.js`.

### Con bundler

```bash
pnpm add comegenui
```

```js
import 'comegenui/dist/CuButton.umd.js';
```

---

## Configurar tema

```html
<html data-theme="dark">     <!-- Global: light, dark, sigacadv2 -->
<cu-button theme="sigacadv2"> <!-- Por componente (override) -->
```

Prioridad: `theme` prop → `data-theme` en `<html>` → `prefers-color-scheme` (OS).

---

## Usar componentes

### Props como atributos

```html
<cu-button color="primary" variant="soft" disabled>Guardar</cu-button>
<cu-pagination current-page="1" total-pages="10" items-per-page="5"></cu-pagination>
```

### Arrays/objetos vía JS

```js
const select = document.getElementById('miSelect');
select.options = [
  { value: 'op1', label: 'Opción 1' },
  { value: 'op2', label: 'Opción 2' },
];
```

### Eventos

```js
element.addEventListener('edit-save', (e) => {
  console.log(e.detail);
});
```

### Esperar a que esté listo

```js
await customElements.whenDefined('cu-modal');
document.getElementById('miModal').open();
```

---

## Uso básico

```html
<!-- 1. Cargar tema -->
<link rel="stylesheet" href="dist/css/themes.css">

<!-- 2. Cargar componente -->
<script src="dist/CuButton.umd.js"></script>

<!-- 3. Usar -->
<cu-button color="primary" variant="solid">Guardar</cu-button>
```

## Uso avanzado

### Props complejas (arrays/objetos)

```js
const tabla = document.getElementById('miTabla');
tabla.columns = [{ key: 'nombre', label: 'Nombre' }];
tabla.data = [{ nombre: 'Juan' }];
```

### Eventos custom

```js
element.addEventListener('edit-save', (e) => console.log(e.detail));
```

### Esperar a que el componente esté listo

```js
await customElements.whenDefined('cu-modal');
document.getElementById('miModal').open();
```

### camelCase vs kebab-case

```html
<!-- HTML: kebab-case -->
<cu-input read-only placeholder="..."></cu-input>

<!-- JS: camelCase -->
input.readOnly = true;
```

---

## Referencia de componentes

Para la API completa de cada componente (props, eventos, slots, variantes) → [`componentes/`](componentes/).
