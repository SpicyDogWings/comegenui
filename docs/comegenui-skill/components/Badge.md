# Badge - Componente de Insignia

**`<cu-badge>`** es un componente de insignia/etiqueta para mostrar status, categorías, tags o cualquier información pequeña de forma visualmente destacada.

## Importación

```html
<script src="../dist/vendor/vue-runtime.iife.js"></script>
<script src="../dist/cuBadge.umd.js"></script>
```

## Uso Básico

```html
<cu-badge>Nuevo</cu-badge>
<cu-badge color="primary">Activo</cu-badge>
<cu-badge color="success">Éxito</cu-badge>
<cu-badge color="warning">Pendiente</cu-badge>
<cu-badge color="danger">Error</cu-badge>
```

## Props

| Prop | Tipo | Default | Valores válidos | Descripción |
|------|------|---------|----------------|-------------|
| `color` | String | `neutral` | `primary`, `neutral`, `success`, `warning`, `danger` | Color base de la insignia |
| `variant` | String | `ghost` | `solid`, `outlined`, `soft`, `ghost`, `subtle` | Estilo visual de la insignia |

## Slots

| Nombre | Descripción |
|--------|-------------|
| `default` | Contenido a mostrar dentro de la insignia |

## Ejemplos por Propiedad

### Propiedad: `color`

Todos los colores disponibles con variante por defecto (ghost):

```html
<div class="flex gap-2 flex-wrap">
  <cu-badge color="primary">Primary</cu-badge>
  <cu-badge color="neutral">Neutral</cu-badge>
  <cu-badge color="success">Success</cu-badge>
  <cu-badge color="warning">Warning</cu-badge>
  <cu-badge color="danger">Danger</cu-badge>
</div>
```

### Propiedad: `variant`

Todas las variantes para el color primary:

```html
<div class="flex gap-2 flex-wrap">
  <cu-badge color="primary" variant="solid">Solid</cu-badge>
  <cu-badge color="primary" variant="soft">Soft</cu-badge>
  <cu-badge color="primary" variant="subtle">Subtle</cu-badge>
  <cu-badge color="primary" variant="outlined">Outlined</cu-badge>
  <cu-badge color="primary" variant="ghost">Ghost</cu-badge>
</div>
```

## Combinaciones de Color y Variante

### Primary

```html
<div class="flex gap-2 flex-wrap">
  <cu-badge color="primary" variant="solid">Primary Solid</cu-badge>
  <cu-badge color="primary" variant="soft">Primary Soft</cu-badge>
  <cu-badge color="primary" variant="subtle">Primary Subtle</cu-badge>
  <cu-badge color="primary" variant="outlined">Primary Outlined</cu-badge>
  <cu-badge color="primary" variant="ghost">Primary Ghost</cu-badge>
</div>
```

### Neutral

```html
<div class="flex gap-2 flex-wrap">
  <cu-badge color="neutral" variant="solid">Neutral Solid</cu-badge>
  <cu-badge color="neutral" variant="soft">Neutral Soft</cu-badge>
  <cu-badge color="neutral" variant="subtle">Neutral Subtle</cu-badge>
  <cu-badge color="neutral" variant="outlined">Neutral Outlined</cu-badge>
  <cu-badge color="neutral" variant="ghost">Neutral Ghost</cu-badge>
</div>
```

### Success

```html
<div class="flex gap-2 flex-wrap">
  <cu-badge color="success" variant="solid">Success Solid</cu-badge>
  <cu-badge color="success" variant="soft">Success Soft</cu-badge>
  <cu-badge color="success" variant="subtle">Success Subtle</cu-badge>
  <cu-badge color="success" variant="outlined">Success Outlined</cu-badge>
  <cu-badge color="success" variant="ghost">Success Ghost</cu-badge>
</div>
```

### Warning

```html
<div class="flex gap-2 flex-wrap">
  <cu-badge color="warning" variant="solid">Warning Solid</cu-badge>
  <cu-badge color="warning" variant="soft">Warning Soft</cu-badge>
  <cu-badge color="warning" variant="subtle">Warning Subtle</cu-badge>
  <cu-badge color="warning" variant="outlined">Warning Outlined</cu-badge>
  <cu-badge color="warning" variant="ghost">Warning Ghost</cu-badge>
</div>
```

### Danger

```html
<div class="flex gap-2 flex-wrap">
  <cu-badge color="danger" variant="solid">Danger Solid</cu-badge>
  <cu-badge color="danger" variant="soft">Danger Soft</cu-badge>
  <cu-badge color="danger" variant="subtle">Danger Subtle</cu-badge>
  <cu-badge color="danger" variant="outlined">Danger Outlined</cu-badge>
  <cu-badge color="danger" variant="ghost">Danger Ghost</cu-badge>
</div>
```

## Casos de Uso Prácticos

### Status de usuario

```html
<div class="flex gap-2">
  <cu-badge color="success" variant="soft">Verificado</cu-badge>
  <cu-badge color="warning" variant="soft">Pendiente</cu-badge>
  <cu-badge color="danger" variant="soft">Bloqueado</cu-badge>
  <cu-badge color="neutral" variant="soft">Inactivo</cu-badge>
</div>
```

### Categorías de productos

```html
<div class="flex gap-2 flex-wrap">
  <cu-badge color="primary" variant="ghost">Electrónica</cu-badge>
  <cu-badge color="primary" variant="ghost">Ropa</cu-badge>
  <cu-badge color="primary" variant="ghost">Libros</cu-badge>
  <cu-badge color="primary" variant="ghost">Deportes</cu-badge>
  <cu-badge color="primary" variant="ghost">Hogar</cu-badge>
</div>
```

### Prioridad de tareas

```html
<ul class="space-y-2">
  <li class="flex items-center gap-2">
    <cu-badge color="danger" variant="solid">Alta</cu-badge>
    <span>Fix critical bug</span>
  </li>
  <li class="flex items-center gap-2">
    <cu-badge color="warning" variant="soft">Media</cu-badge>
    <span>Add new feature</span>
  </li>
  <li class="flex items-center gap-2">
    <cu-badge color="success" variant="subtle">Baja</cu-badge>
    <span>Refactor code</span>
  </li>
</ul>
```

### Contador de notificaciones

```html
<div class="flex gap-2">
  <cu-badge color="primary" variant="solid">5</cu-badge>
  <cu-badge color="danger" variant="solid">23</cu-badge>
  <cu-badge color="success" variant="solid">0</cu-badge>
</div>
```

### Estados combinados con iconos

```html
<div class="flex gap-2">
  <cu-badge color="success" variant="outlined">
    <span>✓</span> Completado
  </cu-badge>
  <cu-badge color="neutral" variant="soft">
    <span>⏳</span> En progreso
  </cu-badge>
  <cu-badge color="warning" variant="soft">
    <span>⏸️</span> Pausado
  </cu-badge>
</div>
```

### Badge con contenido HTML

```html
<cu-badge color="primary" variant="soft">
  <strong>Importante</strong>
</cu-badge>

<cu-badge color="success" variant="soft">
  <span style="font-style: italic;">Éxito</span>
</cu-badge>
```

### Badge en tablas (uso dentro de Table.ce.vue)

```html
<cu-table
  :data="[
    { name: 'Producto A', status: 'active', stock: 10 },
    { name: 'Producto B', status: 'low', stock: 2 },
    { name: 'Producto C', status: 'out', stock: 0 }
  ]"
  :columns="[
    { key: 'name', title: 'Nombre' },
    { 
      key: 'status', 
      title: 'Estado',
      cell: (row) => {
        const colors = { active: 'success', low: 'warning', out: 'danger' };
        const labels = { active: 'Activo', low: 'Bajo', out: 'Agotado' };
        return `<cu-badge color="${colors[row.status]}" variant="soft">${labels[row.status]}</cu-badge>`;
      }
    },
    { key: 'stock', title: 'Stock' }
  ]"
></cu-table>
```

### Badge con classes personalizadas

```html
<cu-badge color="primary" variant="solid" class="text-xs">Pequeño</cu-badge>
<cu-badge color="primary" variant="solid" class="text-lg px-4 py-1">Grande</cu-badge>
```

## Personalización CSS

El componente usa clases de UnoCSS. Para personalizar globalmente:

```css
cu-badge {
  border-radius: 0.5rem;
}

cu-badge[color="primary"][variant="solid"] {
  background-color: #3b82f6;
}
```

O sobreescribir variables CSS:

```css
:root {
  --badge-padding-x: 0.75rem;
  --badge-padding-y: 0.25rem;
}
```

## Notas Técnicas

- El componente no emite eventos
- El componente no tiene métodos expuestos
- El contenido se pasa mediante el slot por defecto
- Todas las combinaciones de color/variante están predefinidas en el componente

## Componentes Relacionados

- [Button](Button.md) - Para acciones interactivas
- [Table](Table.md) - Usa Badge para mostrar status en celdas
- [Alert](Alert.md) - Para mensajes de alerta más elaborados
