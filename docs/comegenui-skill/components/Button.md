# Button - Componente de Botón

**`<cu-button>`** es un componente de botón versátil con múltiples variantes de estilo, colores y estados.

## Importación

```html
<script src="../dist/vendor/vue-runtime.iife.js"></script>
<script src="../dist/cuButton.umd.js"></script>
```

## Uso Básico

```html
<cu-button>Botón Predeterminado</cu-button>
<cu-button color="primary">Botón Primary</cu-button>
<cu-button color="success">Botón Success</cu-button>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `color` | String | `neutral` | Color del botón. Opciones: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | String | `ghost` | Variante de estilo. Opciones: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link` |
| `to` | String | - | URL para enlace (convierte el botón en `<a>`) |
| `target` | String | `_self` | Target para el enlace. Opciones: `_self`, `_blank`, `_parent`, `_top` |
| `disabled` | Boolean | `false` | Desactiva el botón |

## Variantes de Color y Estilo

### Color: Primary

```html
<cu-button color="primary" variant="solid">Primary Solid</cu-button>
<cu-button color="primary" variant="soft">Primary Soft</cu-button>
<cu-button color="primary" variant="subtle">Primary Subtle</cu-button>
<cu-button color="primary" variant="outlined">Primary Outlined</cu-button>
<cu-button color="primary" variant="ghost">Primary Ghost</cu-button>
<cu-button color="primary" variant="link">Primary Link</cu-button>
```

### Color: Success

```html
<cu-button color="success" variant="solid">Success Solid</cu-button>
<cu-button color="success" variant="soft">Success Soft</cu-button>
<cu-button color="success" variant="subtle">Success Subtle</cu-button>
<cu-button color="success" variant="outlined">Success Outlined</cu-button>
<cu-button color="success" variant="ghost">Success Ghost</cu-button>
<cu-button color="success" variant="link">Success Link</cu-button>
```

### Color: Warning

```html
<cu-button color="warning" variant="solid">Warning Solid</cu-button>
<cu-button color="warning" variant="soft">Warning Soft</cu-button>
<cu-button color="warning" variant="subtle">Warning Subtle</cu-button>
<cu-button color="warning" variant="outlined">Warning Outlined</cu-button>
<cu-button color="warning" variant="ghost">Warning Ghost</cu-button>
<cu-button color="warning" variant="link">Warning Link</cu-button>
```

### Color: Danger

```html
<cu-button color="danger" variant="solid">Danger Solid</cu-button>
<cu-button color="danger" variant="soft">Danger Soft</cu-button>
<cu-button color="danger" variant="subtle">Danger Subtle</cu-button>
<cu-button color="danger" variant="outlined">Danger Outlined</cu-button>
<cu-button color="danger" variant="ghost">Danger Ghost</cu-button>
<cu-button color="danger" variant="link">Danger Link</cu-button>
```

## Casos de Uso

### Botones de acción principal

```html
<div class="flex gap-2">
  <cu-button color="primary" variant="solid">Guardar</cu-button>
  <cu-button color="neutral" variant="outlined">Cancelar</cu-button>
</div>
```

### Botones con enlaces

```html
<cu-button to="https://example.com" target="_blank" color="primary">
  Visitar Sitio Web
</cu-button>

<cu-button to="/dashboard" color="neutral" variant="link">
  Ir al Dashboard
</cu-button>
```

### Botones desactivados

```html
<cu-button disabled color="primary">Guardar (Desactivado)</cu-button>
<cu-button to="https://example.com" disabled color="success">
  Enlace Desactivado
</cu-button>
```

### Botones con iconos

```html
<cu-button color="primary" variant="solid">
  <span>📄</span> Nuevo Documento
</cu-button>

<cu-button color="danger" variant="ghost">
  <span>🗑️</span> Eliminar
</cu-button>

<cu-button color="success" variant="outlined">
  <span>✓</span> Confirmar
</cu-button>
```

### Botones de acción en table

Ver [Table - Función buttons](Table.md#función-buttons-para-columnas)

```html
<cu-button color="primary" variant="ghost" onclick="handleEdit()">Editar</cu-button>
<cu-button color="danger" variant="ghost" onclick="handleDelete()">Eliminar</cu-button>
```

### Botones de confirmación

```html
<div class="flex gap-2">
  <cu-button color="danger" variant="solid" onclick="confirmDelete()">
    Sí, Eliminar
  </cu-button>
  <cu-button color="neutral" variant="outlined" onclick="cancel()">
    Cancelar
  </cu-button>
</div>
```

### Botones con HTML

```html
<cu-button color="primary">
  <div class="flex items-center gap-2">
    <span>🔍</span>
    <span><strong>Buscar</strong> ahora</span>
  </div>
</cu-button>
```

### Grupo de botones

```html
<div class="flex gap-2">
  <cu-button color="neutral" variant="solid" onclick="prev()">← Anterior</cu-button>
  <cu-button color="neutral" variant="solid" onclick="next()">Siguiente →</cu-button>
</div>
```

### Botones de tamaño personalizado

```html
<cu-button color="primary" style="padding: 1rem 2rem; font-size: 1.25rem;">
  Botón Grande
</cu-button>
<cu-button color="neutral" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
  Botón Pequeño
</cu-button>
```

## Events

### Eventos nativos

El componente soporta todos los eventos nativos del elemento `<button>`:

```html
<cu-button onclick="handleClick()">Haz clic</cu-button>

<script>
function handleClick() {
  console.log('Botón clickeado');
}
</script>
```

### addEventListener

```javascript
document.querySelector('cu-button').addEventListener('click', function(e) {
  console.log('Botón clickeado', e);
});
```

## Slots

El componente acepta contenido HTML:

```html
<cu-button color="primary">
  <!-- Cualquier contenido HTML -->
  <span>Texto del botón</span>
  <em>con estilo</em>
</cu-button>
```

## Estilos CSS

Para personalizar el botón globalmente:

```css
cu-button {
  --uno-border-radius: 0.5rem;
}

cu-button[color="primary"][variant="solid"] {
  --uno-bg: #3b82f6;
}
```

## Componentes Relacionados

- [Input](Input.md) - Para campos de entrada
- [Table](Table.md) - Usa Button para acciones en celdas
- [Badge](Badge.md) - Para mostrar status junto a botones
- [Pagination](Pagination.md) - Usa Button para la navegación
