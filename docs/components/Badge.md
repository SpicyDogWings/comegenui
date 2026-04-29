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

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `color` | String | `neutral` | Color de la insignia. Opciones: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | String | `ghost` | Variante de estilo. Opciones: `solid`, `outlined`, `soft`, `ghost`, `subtle` |

## Variantes de Color y Estilo

### Color: Primary

```html
<cu-badge color="primary" variant="solid">Primary Solid</cu-badge>
<cu-badge color="primary" variant="soft">Primary Soft</cu-badge>
<cu-badge color="primary" variant="subtle">Primary Subtle</cu-badge>
<cu-badge color="primary" variant="outlined">Primary Outlined</cu-badge>
<cu-badge color="primary" variant="ghost">Primary Ghost</cu-badge>
```

### Color: Success

```html
<cu-badge color="success" variant="solid">Success Solid</cu-badge>
<cu-badge color="success" variant="soft">Success Soft</cu-badge>
<cu-badge color="success" variant="subtle">Success Subtle</cu-badge>
<cu-badge color="success" variant="outlined">Success Outlined</cu-badge>
<cu-badge color="success" variant="ghost">Success Ghost</cu-badge>
```

### Color: Warning

```html
<cu-badge color="warning" variant="solid">Warning Solid</cu-badge>
<cu-badge color="warning" variant="soft">Warning Soft</cu-badge>
<cu-badge color="warning" variant="subtle">Warning Subtle</cu-badge>
<cu-badge color="warning" variant="outlined">Warning Outlined</cu-badge>
<cu-badge color="warning" variant="ghost">Warning Ghost</cu-badge>
```

### Color: Danger

```html
<cu-badge color="danger" variant="solid">Danger Solid</cu-badge>
<cu-badge color="danger" variant="soft">Danger Soft</cu-badge>
<cu-badge color="danger" variant="subtle">Danger Subtle</cu-badge>
<cu-badge color="danger" variant="outlined">Danger Outlined</cu-badge>
<cu-badge color="danger" variant="ghost">Danger Ghost</cu-badge>
```

## Casos de Uso

### Status de usuario

```html
<div class="flex gap-2">
  <cu-badge color="success" variant="soft">Verificado</cu-badge>
  <cu-badge color="warning" variant="soft">Pendiente</cu-badge>
  <cu-badge color="danger" variant="soft">Bloqueado</cu-badge>
</div>
```

### Categorías de productos

```html
<div class="flex gap-2 flex-wrap">
  <cu-badge color="primary" variant="ghost">Electrónica</cu-badge>
  <cu-badge color="primary" variant="ghost">Ropa</cu-badge>
  <cu-badge color="primary" variant="ghost">Libros</cu-badge>
  <cu-badge color="primary" variant="ghost">Deportes</cu-badge>
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
<cu-badge color="primary" variant="solid">5</cu-badge>
<cu-badge color="danger" variant="solid">23</cu-badge>
```

### Estados combinados

```html
<div class="flex gap-2">
  <cu-badge color="success" variant="outlined">
    <span style="font-size: 10px;">✓</span> Completado
  </cu-badge>
  <cu-badge color="neutral" variant="soft">
    <span style="font-size: 10px;">⏳</span> En progreso
  </cu-badge>
</div>
```

## Slots

El componente acepta contenido HTML en su interior:

```html
<cu-badge color="primary">
  <span>Custom Content</span>
</cu-badge>
```

## Estilos CSS

El componente usa clases de UnoCSS. Para personalizar globalmente, se puede sobreescribir:

```css
cu-badge {
  --uno-border-radius: 0.25rem;
}
```

## Componentes Relacionados

- [Button](Button.md) - Para acciones interactivas
- [Table](Table.md) - Usa Badge para mostrar status en celdas
