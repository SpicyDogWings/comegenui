# Button - Componente de Botón

**`<cu-button>`** es un componente de botón versátil con múltiples variantes de estilo, colores y estados. Soporta enlaces, botones deshabilitados y contenido HTML personalizado.

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

| Prop | Tipo | Default | Valores válidos | Descripción |
|------|------|---------|----------------|-------------|
| `color` | String | `neutral` | `primary`, `neutral`, `success`, `warning`, `danger` | Color base del botón |
| `variant` | String | `ghost` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link` | Variante de estilo visual |
| `to` | String | `undefined` | Cualquier URL válida | URL para convertir el botón en un enlace (`<a>`) |
| `target` | String | `_self` | `_self`, `_blank`, `_parent`, `_top` | Target para el enlace (solo cuando `to` está definido) |
| `disabled` | Boolean | `false` | `true`/`false` | Desactiva el botón y evita clics |

## Events

El componente soporta todos los eventos nativos del elemento `<button>` y `<a>`:

| Evento | Descripción |
|--------|-------------|
| `click` | Se dispara cuando el botón es clickeado (si no está disabled) |
| `mouseenter` | Se dispara cuando el ratón entra en el área del botón |
| `mouseleave` | Se dispara cuando el ratón sale del área del botón |
| `focus` | Se dispara cuando el botón recibe foco |
| `blur` | Se dispara cuando el botón pierde foco |
| `keydown` | Se dispara cuando una tecla es presionada mientras el botón tiene foco |

## Slots

| Nombre | Descripción |
|--------|-------------|
| `default` | Contenido a mostrar dentro del botón (texto, iconos, HTML) |

## Funciones Expuestas

El componente no expone métodos públicos. Todas las interacciones se manejan a través de eventos.

## Ejemplos por Propiedad

### Propiedad: `color`

Todos los colores disponibles con variante por defecto (ghost):

```html
<div class="flex gap-2 flex-wrap">
  <cu-button color="primary">Primary</cu-button>
  <cu-button color="neutral">Neutral</cu-button>
  <cu-button color="success">Success</cu-button>
  <cu-button color="warning">Warning</cu-button>
  <cu-button color="danger">Danger</cu-button>
</div>
```

### Propiedad: `variant`

Todas las variantes para el color primary:

```html
<div class="flex gap-2 flex-wrap">
  <cu-button color="primary" variant="solid">Solid</cu-button>
  <cu-button color="primary" variant="soft">Soft</cu-button>
  <cu-button color="primary" variant="subtle">Subtle</cu-button>
  <cu-button color="primary" variant="outlined">Outlined</cu-button>
  <cu-button color="primary" variant="ghost">Ghost</cu-button>
  <cu-button color="primary" variant="link">Link</cu-button>
</div>
```

### Propiedad: `to`

Convierte el botón en un enlace que navega a una URL:

```html
<cu-button to="https://example.com" target="_blank" color="primary">
  Visitar Sitio Web
</cu-button>

<cu-button to="/dashboard" color="neutral" variant="link">
  Ir al Dashboard
</cu-button>

<cu-button to="/settings" color="neutral" variant="ghost">
  Configuración
</cu-button>
```

### Propiedad: `target`

Controla cómo se abre el enlace:

```html
<div class="space-y-2">
  <!-- Abre en la misma ventana/pestaña (default) -->
  <cu-button to="/page1" target="_self" color="primary">
    Misma ventana (_self)
  </cu-button>
  
  <!-- Abre en una nueva pestaña -->
  <cu-button to="https://example.com" target="_blank" color="primary">
    Nueva pestaña (_blank)
  </cu-button>
  
  <!-- Abre en el frame padre -->
  <cu-button to="/page2" target="_parent" color="neutral">
    Frame padre (_parent)
  </cu-button>
  
  <!-- Abre en toda la ventana -->
  <cu-button to="/page3" target="_top" color="neutral">
    Ventana completa (_top)
  </cu-button>
</div>
```

### Propiedad: `disabled`

Desactiva el botón (no se puede hacer clic):

```html
<div class="space-y-2">
  <cu-button disabled color="primary">Guardar (Desactivado)</cu-button>
  
  <cu-button to="https://example.com" disabled color="success">
    Enlace Desactivado
  </cu-button>
  
  <cu-button id="loading-btn" color="primary" variant="solid" disabled>
    Guardando...
  </cu-button>
</div>

<script>
let isLoading = false;
const loadingBtn = document.getElementById('loading-btn');

// Para actualizar disabled dinámicamente en HTML plano:
// loadingBtn.disabled = true;  // Deshabilitar
// loadingBtn.removeAttribute('disabled');  // Habilitar
</script>
```

## Ejemplos por Evento

### Evento: `click`

Manejar clic del botón:

```html
<cu-button onclick="handleClick()" color="primary">
  Haz clic
</cu-button>

<script>
function handleClick() {
  console.log('Botón clickeado');
  alert('¡Botón clickeado!');
}
</script>
```

Con parámetros:

```html
<cu-button onclick="handleClickWithParam('guardar')" color="primary">
  Guardar
</cu-button>
<cu-button onclick="handleClickWithParam('eliminar')" color="danger">
  Eliminar
</cu-button>

<script>
function handleClickWithParam(action) {
  console.log('Acción:', action);
  if (action === 'guardar') {
    saveData();
  } else if (action === 'eliminar') {
    deleteData();
  }
}
</script>
```

### Evento: `mouseenter` y `mouseleave`

Efectos al pasar el ratón:

```html
<cu-button 
  onmouseenter="handleMouseEnter()"
  onmouseleave="handleMouseLeave()"
  color="primary"
>
  Pasa el ratón sobre mí
</cu-button>

<script>
function handleMouseEnter() {
  console.log('Ratón entró');
}

function handleMouseLeave() {
  console.log('Ratón salió');
}
</script>
```

### Evento: `focus` y `blur`

Efectos al recibir o perder foco:

```html
<cu-button 
  onfocus="handleFocus()"
  onblur="handleBlur()"
  color="primary"
>
  Botón con foco
</cu-button>

<script>
function handleFocus() {
  console.log('Botón recibió foco');
}

function handleBlur() {
  console.log('Botón perdió foco');
}
</script>
```

### Evento con `addEventListener`

Usando addEventListener en JavaScript:

```html
<cu-button id="myButton" color="primary">Haz clic</cu-button>

<script>
const button = document.getElementById('myButton');

button.addEventListener('click', function(e) {
  console.log('Botón clickeado con addEventListener:', e);
});

// También puedes escuchar otros eventos
button.addEventListener('mouseenter', function() {
  console.log('Ratón entró');
});

button.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    console.log('Botón activado con tecla:', e.key);
  }
});
</script>
```

## Casos de Uso Combinados

### Botones de acción principal

```html
<div class="flex gap-2">
  <cu-button color="primary" variant="solid" onclick="save()">
    Guardar
  </cu-button>
  <cu-button color="neutral" variant="outlined" onclick="cancel()">
    Cancelar
  </cu-button>
</div>

<script>
function save() {
  console.log('Guardando...');
}

function cancel() {
  console.log('Cancelado');
}
</script>
```

### Botones con iconos

```html
<div class="flex gap-2 flex-wrap">
  <cu-button color="primary" variant="solid" onclick="create()">
    <span>📄</span> Nuevo Documento
  </cu-button>
  
  <cu-button color="danger" variant="ghost" onclick="remove()">
    <span>🗑️</span> Eliminar
  </cu-button>
  
  <cu-button color="success" variant="outlined" onclick="confirm()">
    <span>✓</span> Confirmar
  </cu-button>
  
  <cu-button color="warning" variant="soft" onclick="warn()">
    <span>⚠️</span> Advertencia
  </cu-button>
  
  <cu-button color="primary" variant="link" onclick="info()">
    <span>ℹ️</span> Más información
  </cu-button>
</div>
```

### Botones de confirmación

```html
<div class="flex gap-2">
  <cu-button color="danger" variant="solid" onclick="confirmDelete()">
    Sí, Eliminar
  </cu-button>
  <cu-button color="neutral" variant="outlined" onclick="cancelDelete()">
    Cancelar
  </cu-button>
</div>

<script>
function confirmDelete() {
  if (confirm('¿Estás seguro de que quieres eliminar?')) {
    deleteItem();
  }
}

function cancelDelete() {
  console.log('Eliminación cancelada');
}
</script>
```

### Botones con HTML personalizado

```html
<cu-button color="primary">
  <div class="flex items-center gap-2">
    <span>🔍</span>
    <span><strong>Buscar</strong> ahora</span>
  </div>
</cu-button>

<cu-button color="success" variant="soft">
  <div class="text-left">
    <div class="font-semibold">Guardar y</div>
    <div class="text-sm opacity-70">Continuar</div>
  </div>
</cu-button>
```

### Grupo de botones de navegación

```html
<div class="flex gap-2">
  <cu-button color="neutral" variant="solid" onclick="prev()" disabled>
    ← Anterior
  </cu-button>
  <cu-button color="neutral" variant="solid" onclick="next()">
    Siguiente →
  </cu-button>
</div>

<script>
let currentPage = 1;

function prev() {
  if (currentPage > 1) {
    currentPage--;
    updateButtons();
  }
}

function next() {
  currentPage++;
  updateButtons();
}

function updateButtons() {
  // Actualizar estado disabled
}
</script>
```

### Botones de tamaño personalizado

```html
<div class="flex gap-2 items-center">
  <cu-button color="primary" style="padding: 1.5rem 3rem; font-size: 1.25rem;">
    Botón Grande
  </cu-button>
  
  <cu-button color="neutral" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
    Botón Pequeño
  </cu-button>
  
  <cu-button color="success" style="width: 200px; height: 60px;">
    Botón de ancho fijo
  </cu-button>
</div>
```

### Botones con states dinámicos

```html
<cu-button 
  id="submit-btn"
  color="primary" 
  variant="solid"
  onclick="submitForm()"
>
  <span id="btn-text">Enviar</span>
</cu-button>

<script>
let isLoading = false;
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');

function submitForm() {
  isLoading = true;
  submitBtn.disabled = true;
  btnText.textContent = 'Enviando...';
  
  // Simular envío
  setTimeout(() => {
    isLoading = false;
    submitBtn.disabled = false;
    btnText.textContent = 'Enviar';
    alert('Formulario enviado');
  }, 2000);
}
</script>
```

### Botones en un formulario

```html
<form class="space-y-4 max-w-lg" onsubmit="handleSubmit(event)">
  <div>
    <label class="block mb-2">Nombre</label>
    <cu-input type="text" placeholder="Tu nombre" />
  </div>
  
  <div class="flex gap-2">
    <cu-button type="submit" color="primary" variant="solid">
      Enviar
    </cu-button>
    <cu-button type="reset" color="neutral" variant="outlined">
      Limpiar
    </cu-button>
  </div>
</form>

<script>
function handleSubmit(e) {
  e.preventDefault();
  console.log('Formulario enviado');
}
</script>
```

### Botones con enlaces externos

```html
<div class="space-y-2">
  <cu-button to="https://google.com" target="_blank" color="primary" variant="solid">
    Buscar en Google
  </cu-button>
  
  <cu-button to="https://github.com" target="_blank" color="neutral" variant="outlined">
    Ver en GitHub
  </cu-button>
  
  <cu-button to="/api/download" target="_blank" color="success" variant="ghost">
    Descargar PDF
  </cu-button>
</div>
```

### Botones con variantes de link

La variante `link` muestra el botón como un enlace de texto con subrayado al pasar el ratón:

```html
<div class="space-y-2">
  <cu-button color="primary" variant="link" onclick="goToHome()">
    Ir a Inicio
  </cu-button>
  
  <cu-button color="neutral" variant="link" onclick="goBack()">
    Volver atrás
  </cu-button>
  
  <cu-button color="danger" variant="link" onclick="deleteItem()">
    Eliminar item
  </cu-button>
</div>
```

### Botones en una tabla (acciones por fila)

Ver [Table - Función buttons](Table.md#función-buttons-para-columnas)

```html
<cu-button color="primary" variant="ghost" onclick="() => editRow(row)">
  Editar
</cu-button>
<cu-button color="danger" variant="ghost" onclick="() => deleteRow(row)">
  Eliminar
</cu-button>
```

## Combinaciones completas de color y variante

### Primary

```html
<div class="flex gap-2 flex-wrap">
  <cu-button color="primary" variant="solid">Primary Solid</cu-button>
  <cu-button color="primary" variant="soft">Primary Soft</cu-button>
  <cu-button color="primary" variant="subtle">Primary Subtle</cu-button>
  <cu-button color="primary" variant="outlined">Primary Outlined</cu-button>
  <cu-button color="primary" variant="ghost">Primary Ghost</cu-button>
  <cu-button color="primary" variant="link">Primary Link</cu-button>
</div>
```

### Neutral

```html
<div class="flex gap-2 flex-wrap">
  <cu-button color="neutral" variant="solid">Neutral Solid</cu-button>
  <cu-button color="neutral" variant="soft">Neutral Soft</cu-button>
  <cu-button color="neutral" variant="subtle">Neutral Subtle</cu-button>
  <cu-button color="neutral" variant="outlined">Neutral Outlined</cu-button>
  <cu-button color="neutral" variant="ghost">Neutral Ghost</cu-button>
  <cu-button color="neutral" variant="link">Neutral Link</cu-button>
</div>
```

### Success

```html
<div class="flex gap-2 flex-wrap">
  <cu-button color="success" variant="solid">Success Solid</cu-button>
  <cu-button color="success" variant="soft">Success Soft</cu-button>
  <cu-button color="success" variant="subtle">Success Subtle</cu-button>
  <cu-button color="success" variant="outlined">Success Outlined</cu-button>
  <cu-button color="success" variant="ghost">Success Ghost</cu-button>
  <cu-button color="success" variant="link">Success Link</cu-button>
</div>
```

### Warning

```html
<div class="flex gap-2 flex-wrap">
  <cu-button color="warning" variant="solid">Warning Solid</cu-button>
  <cu-button color="warning" variant="soft">Warning Soft</cu-button>
  <cu-button color="warning" variant="subtle">Warning Subtle</cu-button>
  <cu-button color="warning" variant="outlined">Warning Outlined</cu-button>
  <cu-button color="warning" variant="ghost">Warning Ghost</cu-button>
  <cu-button color="warning" variant="link">Warning Link</cu-button>
</div>
```

### Danger

```html
<div class="flex gap-2 flex-wrap">
  <cu-button color="danger" variant="solid">Danger Solid</cu-button>
  <cu-button color="danger" variant="soft">Danger Soft</cu-button>
  <cu-button color="danger" variant="subtle">Danger Subtle</cu-button>
  <cu-button color="danger" variant="outlined">Danger Outlined</cu-button>
  <cu-button color="danger" variant="ghost">Danger Ghost</cu-button>
  <cu-button color="danger" variant="link">Danger Link</cu-button>
</div>
```

## Personalización CSS

```css
/* Personalizar border-radius de todos los botones */
cu-button {
  --uno-border-radius: 0.5rem;
}

/* Personalizar botón primary solid */
cu-button[color="primary"][variant="solid"] {
  --uno-bg: #2563eb;
}

/* Personalizar hover de botón outlined */
cu-button[color="primary"][variant="outlined"]:hover {
  --uno-bg: rgba(59, 130, 246, 0.1);
}

/* Personalizar padding */
cu-button {
  padding: 0.75rem 1.5rem;
}

/* Personalizar transición */
cu-button {
  --uno-transition: all 0.2s ease;
}

/* Personalizar cursor disabled */
cu-button[disabled] {
  cursor: not-allowed;
}
```

## Notas Técnicas

- Cuando `to` está definido y `disabled=false`, el componente renderiza un `<a>` con un `<button>` dentro
- Cuando `to` está definido y `disabled=true`, el componente renderiza un `<a>` deshabilitado con un `<button>` dentro
- Cuando `to` no está definido, el componente renderiza solo un `<button>`
- La variante `link` no muestra bordes ni fondos, solo texto con subrayado al hover
- El botón tiene `type="button"` por defecto (no envía formularios)
- Para usar en formularios, explicitamente establece `type="submit"` o `type="reset"`
- Los botones deshabilitados (`disabled`) no emiten eventos de clic

## Componentes Relacionados

- [Input](Input.md) - Para campos de entrada
- [Textarea](Textarea.md) - Para texto multilineal
- [Table](Table.md) - Usa Button para acciones en celdas
- [Badge](Badge.md) - Para mostrar status junto a botones
- [Pagination](Pagination.md) - Usa Button para la navegación entre páginas
- [Modal](Modal.md) - Usa Button para abrir/cerrar modales
