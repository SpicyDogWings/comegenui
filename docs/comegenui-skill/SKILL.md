---
name: comegen-ui
description: Uso de componentes de comegen UI para sistemas legacy
---

# Comegen UI - Biblioteca de Web Components

**Comegen UI** es una biblioteca de componentes Vue 3 empaquetados como **Custom Elements (Web Components)** para su uso en cualquier proyecto web, independientemente del framework.

## 📋 Indice

- [Caracteristicas](#caracteristicas)
- [Instalacion](#instalacion)
- [Componentes Disponibles](#componentes-disponibles)
- [Tematica y Personalizacion](#tematica-y-personalizacion)
- [Proyectos](#proyectos)

---

## Caracteristicas

- Web Components nativos - Funcionan en cualquier proyecto (Vue, React, Angular, vanilla JS)
- Estilos con UnoCSS - Sistema de diseno consistente y personalizable
- Tematica de colores - Soporte para `primary`, `neutral`, `success`, `warning`, `danger`
- Variantes de estilo - Multiples variantes (`solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`)
- Shadow DOM - Estilos aislados que no interfieren con el CSS de tu aplicacion

---

## Instalacion

```bash
npm install @comegen/ui
# o
pnpm add @comegen/ui
```

### Importacion

Los componentes se exportan como archivos UMD que pueden ser cargados directamente en el navegador:

```html
<script src="https://cdn.jsdelivr.net/npm/@comegen/ui/dist/vendor/vue-runtime.iife.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@comegen/ui/dist/cuBadge.umd.js"></script>
<!-- Importar otros componentes segun sea necesario -->
```

### Uso basico

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

---

## Componentes Disponibles

| Componente | Descripcion | Custom Element |
|------------|-------------|----------------|
| [Badge](components/Badge.md) | Insignia/etiqueta para mostrar status o categorias | `<cu-badge>` |
| [Button](components/Button.md) | Boton interactivo con multiples estilos | `<cu-button>` |
| [Input](components/Input.md) | Campo de texto de entrada | `<cu-input>` |
| [Pagination](components/Pagination.md) | Control de paginacion | `<cu-pagination>` |
| [Table](components/Table.md) | Tabla de datos con busqueda y paginacion | `<cu-table>` |
| [Textarea](components/Textarea.md) | Area de texto multilineal | `<cu-textarea>` |

---

## Tematica y Personalizacion

### Colores disponibles
- `primary` - Color principal de la marca
- `neutral` - Grises y colores neutros
- `success` - Verde (exito, confirmacion)
- `warning` - Amarillo (advertencia)
- `danger` - Rojo (error, peligro)

### Variantes de estilo
- `solid` - Fondo solido con color
- `outlined` - Borde solido, fondo transparente
- `soft` - Fondo claro con color suave
- `ghost` - Fondo transparente, color de texto
- `subtle` - Fondo claro con borde sutil
- `link` - Estilo de enlace (solo para Button)
- `none` - Sin estilo adicional (solo para Input/Textarea)

---

## Proyectos

Para ver la documentacion especifica de un proyecto, consulte [Proyectos](proyectos.md).

> ⚠️ **Nota:** Al utilizar esta skill, se le preguntara en que proyecto desea trabajar (ej: Finanzas, SIGFI, etc.) para mostrar la documentacion correspondiente.

---

## Ejemplo de importacion masiva

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

---

## Construccion

Para construir los componentes desde el codigo fuente:

```bash
pnpm install
pnpm run build:lib
```

Los componentes se generaran en la carpeta `/dist`.
