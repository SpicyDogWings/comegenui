# Comegen UI - Biblioteca de Web Components

**Comegen UI** es una biblioteca de componentes Vue 3 empaquetados como **Custom Elements (Web Components)** para su uso en cualquier proyecto web, independientemente del framework.

## Características

- ✅ **Web Components nativos** - Funcionan en cualquier proyecto (Vue, React, Angular, vanilla JS)
- ✅ **Estilos con UnoCSS** - Sistema de diseño consistente y personalizable
- ✅ **Temática de colores** - Soporte para `primary`, `neutral`, `success`, `warning`, `danger`
- ✅ **Variantes de estilo** - Múltiples variantes (`solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`)
- ✅ **Shadow DOM** - Estilos aislados que no interfieren con el CSS de tu aplicación

## Instalación

```bash
npm install @comegen/ui
# o
pnpm add @comegen/ui
```

### Importación

Los componentes se exportan como archivos UMD que pueden ser cargados directamente en el navegador:

```html
<script src="https://cdn.jsdelivr.net/npm/@comegen/ui/dist/vendor/vue-runtime.iife.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@comegen/ui/dist/cuBadge.umd.js"></script>
<!-- Importar otros componentes según sea necesario -->
```

### Uso básico

```html
<!DOCTYPE html>
<html>
<head>
  <script src="./node_modules/@comegen/ui/dist/vendor/vue-runtime.iife.js"></script>
  <script src="./node_modules/@comegen/ui/dist/cuButton.umd.js"></script>
</head>
<body>
  <cu-button color="primary" variant="solid">Haz clic</cu-button>
</body>
</html>
```

## Componentes Disponibles

| Componente | Descripción | Custom Element |
|------------|-------------|----------------|
| [Badge](components/Badge.md) | Insignia/etiqueta para mostrar status o categorías | `<cu-badge>` |
| [Button](components/Button.md) | Botón interactivo con múltiples estilos | `<cu-button>` |
| [Input](components/Input.md) | Campo de texto de entrada | `<cu-input>` |
| [Pagination](components/Pagination.md) | Control de paginación | `<cu-pagination>` |
| [Table](components/Table.md) | Tabla de datos con búsqueda y paginación | `<cu-table>` |
| [Textarea](components/Textarea.md) | Área de texto multilineal | `<cu-textarea>` |

## Temática y Personalización

### Colores disponibles
- `primary` - Color principal de la marca
- `neutral` - Grises y colores neutros
- `success` - Verde (éxito, confirmación)
- `warning` - Amarillo (advertencia)
- `danger` - Rojo (error, peligro)

### Variantes de estilo
- `solid` - Fondo sólido con color
- `outlined` - Borde sólido, fondo transparente
- `soft` - Fondo claro con color suave
- `ghost` - Fondo transparente, color de texto
- `subtle` - Fondo claro con borde sutil
- `link` - Estilo de enlace (solo para Button)
- `none` - Sin estilo adicional (solo para Input/Textarea)

## Ejemplo de importación masiva

```html
<!-- Importar Vue runtime -->
<script src="./dist/vendor/vue-runtime.iife.js"></script>

<!-- Importar todos los componentes -->
<script src="./dist/cuBadge.umd.js"></script>
<script src="./dist/cuButton.umd.js"></script>
<script src="./dist/cuInput.umd.js"></script>
<script src="./dist/cuPagination.umd.js"></script>
<script src="./dist/cuTable.umd.js"></script>
<script src="./dist/cuTextarea.umd.js"></script>
```

## Construcción

Para construir los componentes desde el código fuente:

```bash
pnpm install
pnpm run build
```

Los componentes se generarán en la carpeta `/dist`.
