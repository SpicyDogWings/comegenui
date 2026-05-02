# Textarea - Componente de Área de Texto

**`<cu-textarea>`** es un componente de área de texto multilineal con múltiples variantes de estilo, colores y opciones de configuración. Soporta v-model, valor inicial alternativo, estados de deshabilitado/lectura, y métodos programáticos.

## Importación

```html
<script src="../dist/vendor/vue-runtime.iife.js"></script>
<script src="../dist/cuTextarea.umd.js"></script>
```

## Uso Básico

```html
<cu-textarea placeholder="Escribe tu mensaje aquí..." />
<cu-textarea rows="5" placeholder="Descripción detallada" />
```

## Props

| Prop | Tipo | Default | Valores válidos | Descripción |
|------|------|---------|----------------|-------------|
| `modelValue` | String | `""` | - | Valor del textarea (v-model). Si cambia externamente, actualiza el valor interno |
| `startValue` | String | `undefined` | - | Valor inicial alternativo. Usado si modelValue no está definido |
| `color` | String | `neutral` | `primary`, `neutral`, `success`, `warning`, `danger` | Color base del textarea |
| `variant` | String | `none` | `outlined`, `soft`, `ghost`, `subtle`, `none` | Variante de estilo visual |
| `placeholder` | String | `undefined` | - | Texto de placeholder mostrado cuando está vacío |
| `disabled` | Boolean | `false` | `true`/`false` | Desactiva el textarea y evita interacción |
| `readOnly` | Boolean | `false` | `true`/`false` | Solo lectura (puede copiar pero no editar) |
| `rows` | Number | `3` | >= 1 | Número de filas visibles por defecto |
| `noResize` | Boolean | `false` | `true`/`false` | Desactiva la capacidad de redimensionar manualmente |

## Events

| Evento | Argumento | Descripción |
|--------|-----------|-------------|
| `update:modelValue` | `string` (nuevo valor) | Se emite cuando el usuario cambia el texto |

## Slots

El componente no acepta slots. El contenido se controla mediante props.

## Métodos Expuestos

El componente expone métodos a través de su instancia (acccesibles vía JavaScript o refs en Vue):

| Método | Argumentos | Retorno | Descripción |
|--------|------------|---------|-------------|
| `get()` | - | `string` | Obtiene el valor actual del textarea |
| `set(value)` | `string \| number` | `void` | Establece el valor del textarea (convierte a string) |
| `reset()` | - | `void` | Limpia el valor del textarea (establece a "") |
| `focus()` | - | `void` | Enfoca el textarea |

## Ejemplos por Propiedad

### Propiedad: `modelValue`

Uso con v-model en Vue:

```html
<cu-textarea v-model="message" placeholder="Escribe un mensaje" rows="4" />

<script>
let message = "Hola Mundo";
</script>
```

Uso manual con update:modelValue:

```html
<cu-textarea 
  :modelValue="message" 
  @update:modelValue="message = $event"
  placeholder="Escribe aquí"
  rows="4"
/>

<script>
let message = "";
</script>
```

### Propiedad: `startValue`

Valor inicial alternativo (útil cuando no usas v-model):

```html
<cu-textarea 
  startValue="Texto inicial"
  placeholder="Escribe aquí"
  rows="4"
/>
```

### Propiedad: `color`

Todos los colores disponibles:

```html
<div class="space-y-4">
  <cu-textarea color="primary" placeholder="Primary" rows="3" />
  <cu-textarea color="neutral" placeholder="Neutral" rows="3" />
  <cu-textarea color="success" placeholder="Success" rows="3" />
  <cu-textarea color="warning" placeholder="Warning" rows="3" />
  <cu-textarea color="danger" placeholder="Danger" rows="3" />
</div>
```

### Propiedad: `variant`

Todas las variantes para el color primary:

```html
<div class="space-y-4">
  <cu-textarea color="primary" variant="none" placeholder="None" rows="3" />
  <cu-textarea color="primary" variant="outlined" placeholder="Outlined" rows="3" />
  <cu-textarea color="primary" variant="soft" placeholder="Soft" rows="3" />
  <cu-textarea color="primary" variant="ghost" placeholder="Ghost" rows="3" />
  <cu-textarea color="primary" variant="subtle" placeholder="Subtle" rows="3" />
</div>
```

### Propiedad: `placeholder`

Texto de ayuda cuando el textarea está vacío:

```html
<cu-textarea 
  placeholder="Por favor, escribe tu mensaje aquí..."
  rows="5"
/>
```

### Propiedad: `disabled`

Textarea desactivado (no se puede editar ni enfocar):

```html
<cu-textarea 
  placeholder="Campo desactivado"
  disabled
  value="Este textarea está desactivado"
  rows="4"
/>
```

### Propiedad: `readOnly`

Textarea de solo lectura (se puede seleccionar/copiar pero no editar):

```html
<cu-textarea 
  placeholder="Solo lectura"
  read-only
  value="Valor fijo que no se puede editar"
  rows="4"
/>
```

### Propiedad: `rows`

Número de filas visibles:

```html
<div class="space-y-4">
  <cu-textarea placeholder="2 filas" rows="2" />
  <cu-textarea placeholder="4 filas (default)" rows="4" />
  <cu-textarea placeholder="8 filas" rows="8" />
  <cu-textarea placeholder="10 filas" rows="10" />
</div>
```

### Propiedad: `noResize`

Desactiva la capacidad de redimensionar manualmente (arrastrar la esquina):

```html
<cu-textarea 
  placeholder="No se puede redimensionar"
  no-resize
  rows="6"
/>
```

## Ejemplos por Método

### Método: `get()`

Obtener el valor actual programáticamente:

```html
<cu-textarea id="myTextarea" placeholder="Escribe aquí" rows="4" />
<button onclick="showValue()">Mostrar Valor</button>

<script>
function showValue() {
  const textarea = document.getElementById('myTextarea');
  const value = textarea.get();
  alert('Valor actual: ' + value);
}
</script>
```

### Método: `set(value)`

Establecer el valor programáticamente:

```html
<cu-textarea id="myTextarea" placeholder="Escribe aquí" rows="4" />
<button onclick="setValue()">Establecer Valor</button>

<script>
function setValue() {
  const textarea = document.getElementById('myTextarea');
  textarea.set('Nuevo valor establecido desde JavaScript');
}
</script>
```

Establecer valor numérico (se convierte a string):

```html
<cu-textarea id="myTextarea" rows="4" />
<button onclick="setNumber()">Establecer Número</button>

<script>
function setNumber() {
  const textarea = document.getElementById('myTextarea');
  textarea.set(42); // Se convierte a "42"
}
</script>
```

### Método: `reset()`

Limpiar el textarea:

```html
<cu-textarea id="myTextarea" startValue="Texto a borrar" rows="4" />
<button onclick="resetTextarea()">Limpiar</button>

<script>
function resetTextarea() {
  const textarea = document.getElementById('myTextarea');
  textarea.reset();
}
</script>
```

### Método: `focus()`

Enfocar el textarea programáticamente:

```html
<cu-textarea id="myTextarea" placeholder="Escribe aquí" rows="4" />
<button onclick="focusTextarea()">Enfocar Textarea</button>

<script>
function focusTextarea() {
  const textarea = document.getElementById('myTextarea');
  textarea.focus();
}
</script>
```

## Ejemplos por Evento

### Evento: `update:modelValue`

Manejar cambios en el valor:

```html
<cu-textarea 
  placeholder="Escribe aquí"
  rows="4"
  @update:modelValue="handleChange"
/>

<script>
function handleChange(newValue) {
  console.log('Nuevo valor:', newValue);
  // Validar, guardar, etc.
}
</script>
```

### Evento: `input` (nativo)

Usando evento nativo del textarea:

```html
<cu-textarea 
  placeholder="Escribe aquí"
  rows="4"
  oninput="handleInput(event)"
/>

<script>
function handleInput(e) {
  console.log('Valor actual:', e.target.value);
  console.log('Longitud:', e.target.value.length);
}
</script>
```

## Casos de Uso Combinados

### Comentarios en un sistema

```html
<div class="max-w-2xl">
  <label class="block mb-2 font-medium text-charcoal-800">Deja un comentario</label>
  <cu-textarea 
    id="commentTextarea"
    color="neutral" 
    variant="outlined"
    placeholder="Escribe tu comentario aquí..."
    rows="5"
  />
  <div class="mt-4 flex gap-2">
    <cu-button color="primary" variant="solid" onclick="submitComment()">
      Publicar Comentario
    </cu-button>
    <cu-button color="neutral" variant="ghost" onclick="clearComment()">
      Limpiar
    </cu-button>
  </div>
</div>

<script>
function submitComment() {
  const textarea = document.getElementById('commentTextarea');
  const comment = textarea.get();
  if (comment.trim()) {
    console.log('Comentario a publicar:', comment);
    textarea.reset();
  }
}

function clearComment() {
  const textarea = document.getElementById('commentTextarea');
  textarea.reset();
}
</script>
```

### Descripción de producto

```html
<div class="max-w-3xl">
  <label class="block mb-2 font-medium text-charcoal-800">Descripción del producto</label>
  <cu-textarea 
    color="primary" 
    variant="soft"
    placeholder="Descripción detallada del producto..."
    rows="8"
  />
  <p class="mt-2 text-sm text-charcoal-500">
    Escribe una descripción clara y detallada para ayudar a los clientes
  </p>
</div>
```

### Mensajes con validación visual

```html
<div class="space-y-4 max-w-2xl">
  <div>
    <label class="block mb-2">Mensaje válido</label>
    <cu-textarea 
      color="success" 
      variant="outlined"
      placeholder="Todo correcto"
      rows="4"
    />
  </div>
  
  <div>
    <label class="block mb-2">Advertencia</label>
    <cu-textarea 
      color="warning" 
      variant="outlined"
      placeholder="El mensaje es muy corto"
      rows="4"
    />
  </div>
  
  <div>
    <label class="block mb-2">Error</label>
    <cu-textarea 
      color="danger" 
      variant="outlined"
      placeholder="El mensaje no puede estar vacío"
      rows="4"
    />
  </div>
</div>
```

### Textarea en formulario de contacto

```html
<form class="space-y-4 max-w-lg" id="contactForm">
  <div>
    <label class="block mb-2">Nombre</label>
    <cu-input 
      id="nameInput"
      type="text" 
      placeholder="Tu nombre"
      color="primary" 
      variant="outlined"
    />
  </div>
  
  <div>
    <label class="block mb-2">Correo electrónico</label>
    <cu-input 
      id="emailInput"
      type="email" 
      placeholder="tu@email.com"
      color="primary" 
      variant="outlined"
    />
  </div>
  
  <div>
    <label class="block mb-2">Mensaje</label>
    <cu-textarea 
      id="messageTextarea"
      placeholder="¿En qué podemos ayudarte?"
      color="primary" 
      variant="outlined" 
      rows="6"
    />
  </div>
  
  <cu-button 
    color="primary" 
    variant="solid" 
    type="button"
    onclick="submitForm()"
  >
    Enviar
  </cu-button>
</form>

<script>
function submitForm() {
  const name = document.getElementById('nameInput').get();
  const email = document.getElementById('emailInput').get();
  const message = document.getElementById('messageTextarea').get();
  
  console.log('Formulario enviado:', { name, email, message });
  
  // Limpiar formulario
  document.getElementById('nameInput').reset();
  document.getElementById('emailInput').reset();
  document.getElementById('messageTextarea').reset();
}
</script>
```

### Textarea con limite de caracteres

```html
<cu-textarea 
  id="limitedTextarea"
  placeholder="Escribe aquí (máx 200 caracteres)"
  rows="4"
  @update:modelValue="checkLength"
/>
<p id="charCount" class="text-sm text-charcoal-500 mt-1">0/200 caracteres</p>

<script>
function checkLength(value) {
  const count = value.length;
  const max = 200;
  document.getElementById('charCount').textContent = `${count}/${max} caracteres`;
  
  if (count > max) {
    // Truncar o mostrar error
    const textarea = document.getElementById('limitedTextarea');
    textarea.set(value.substring(0, max));
  }
}
</script>
```

### Textarea con auto-enfoque

```html
<cu-textarea 
  id="autoFocusTextarea"
  placeholder="Escribe aquí (auto-enfocado)"
  rows="4"
/>

<script>
// Enfocar automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  const textarea = document.getElementById('autoFocusTextarea');
  setTimeout(() => textarea.focus(), 100);
});
</script>
```

### Textarea desactivado y de solo lectura (comparación)

```html
<div class="space-y-4">
  <div>
    <label class="block mb-2">Desactivado (disabled)</label>
    <p class="text-sm text-charcoal-500 mb-1">No se puede editar ni enfocar</p>
    <cu-textarea 
      placeholder="Campo desactivado"
      disabled
      value="No se puede interactuar"
      rows="3"
    />
  </div>
  
  <div>
    <label class="block mb-2">Solo lectura (readOnly)</label>
    <p class="text-sm text-charcoal-500 mb-1">Se puede seleccionar/copiar pero no editar</p>
    <cu-textarea 
      placeholder="Solo lectura"
      read-only
      value="Se puede seleccionar pero no editar"
      rows="3"
    />
  </div>
</div>
```

### Variantes de estilo completas

Todos los colores con todas las variantes:

```html
<div class="space-y-6">
  <!-- Primary -->
  <div>
    <h3 class="text-lg font-semibold mb-2">Primary</h3>
    <div class="flex gap-2 flex-wrap">
      <cu-textarea color="primary" variant="none" placeholder="None" rows="2" class="w-40" />
      <cu-textarea color="primary" variant="outlined" placeholder="Outlined" rows="2" class="w-40" />
      <cu-textarea color="primary" variant="soft" placeholder="Soft" rows="2" class="w-40" />
      <cu-textarea color="primary" variant="ghost" placeholder="Ghost" rows="2" class="w-40" />
      <cu-textarea color="primary" variant="subtle" placeholder="Subtle" rows="2" class="w-40" />
    </div>
  </div>
  
  <!-- Neutral -->
  <div>
    <h3 class="text-lg font-semibold mb-2">Neutral</h3>
    <div class="flex gap-2 flex-wrap">
      <cu-textarea color="neutral" variant="none" placeholder="None" rows="2" class="w-40" />
      <cu-textarea color="neutral" variant="outlined" placeholder="Outlined" rows="2" class="w-40" />
      <cu-textarea color="neutral" variant="soft" placeholder="Soft" rows="2" class="w-40" />
      <cu-textarea color="neutral" variant="ghost" placeholder="Ghost" rows="2" class="w-40" />
      <cu-textarea color="neutral" variant="subtle" placeholder="Subtle" rows="2" class="w-40" />
    </div>
  </div>
  
  <!-- Success -->
  <div>
    <h3 class="text-lg font-semibold mb-2">Success</h3>
    <div class="flex gap-2 flex-wrap">
      <cu-textarea color="success" variant="none" placeholder="None" rows="2" class="w-40" />
      <cu-textarea color="success" variant="outlined" placeholder="Outlined" rows="2" class="w-40" />
      <cu-textarea color="success" variant="soft" placeholder="Soft" rows="2" class="w-40" />
      <cu-textarea color="success" variant="ghost" placeholder="Ghost" rows="2" class="w-40" />
      <cu-textarea color="success" variant="subtle" placeholder="Subtle" rows="2" class="w-40" />
    </div>
  </div>
</div>
```

## Personalización CSS

```css
/* Personalizar border-radius de todos los textarea */
cu-textarea {
  --uno-border-radius: 0.5rem;
}

/* Personalizar textarea con variante outlined */
cu-textarea[variant="outlined"] {
  --uno-border-width: 2px;
}

/* Desactivar resize para todos */
cu-textarea {
  resize: none;
}

/* Personalizar colores de foco */
cu-textarea[color="primary"][variant="outlined"]:focus {
  --uno-ring-color: #60a5fa;
}

/* Personalizar padding */
cu-textarea {
  padding: 0.75rem 1rem;
}
```

## Notas Técnicas

- **modelValue vs startValue**: Si `modelValue` está definido, se usa como valor inicial. Si no, se usa `startValue`. Esto permite inicializar el componente sin usar v-model.
- **Conversión de tipos**: El método `set()` convierte automáticamente números a strings usando `String(value)`.
- **Reactividad**: Cuando `modelValue` cambia externamente (vía prop), el valor interno se actualiza automáticamente gracias al watcher interno.
- **Eventos**: Además del evento custom `update:modelValue`, todos los eventos nativos del textarea (input, change, focus, blur, etc.) están disponibles.

## Componentes Relacionados

- [Input](Input.md) - Para texto de una sola línea (similar API)
- [Button](Button.md) - Para acciones de formulario
- [Modal](Modal.md) - Usa Textarea en formularios dentro de modales
- [Table](Table.md) - Usa Textarea para celdas editables de texto largo
