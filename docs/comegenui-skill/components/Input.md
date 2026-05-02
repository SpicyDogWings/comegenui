# Input - Componente de Campo de Texto

**`<cu-input>`** es un componente de entrada de texto con múltiples variantes de estilo, colores y tipos de input. Similar a Textarea pero para texto de una sola línea. Soporta v-model, valor inicial alternativo, estados de deshabilitado/lectura, y métodos programáticos.

## Importación

```html
<script src="../dist/vendor/vue-runtime.iife.js"></script>
<script src="../dist/cuInput.umd.js"></script>
```

## Uso Básico

```html
<cu-input placeholder="Escribe algo..." />
<cu-input type="email" placeholder="Correo electrónico" />
<cu-input type="password" placeholder="Contraseña" />
```

## Props

| Prop | Tipo | Default | Valores válidos | Descripción |
|------|------|---------|----------------|-------------|
| `modelValue` | String | `""` | - | Valor del input (v-model). Si cambia externamente, actualiza el valor interno |
| `startValue` | String | `undefined` | - | Valor inicial alternativo. Usado si modelValue no está definido |
| `color` | String | `neutral` | `primary`, `neutral`, `success`, `warning`, `danger` | Color base del input |
| `variant` | String | `none` | `outlined`, `soft`, `ghost`, `subtle`, `none` | Variante de estilo visual |
| `type` | String | `text` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` | Tipo de input HTML |
| `placeholder` | String | `undefined` | - | Texto de placeholder mostrado cuando está vacío |
| `disabled` | Boolean | `false` | `true`/`false` | Desactiva el input y evita interacción |
| `readOnly` | Boolean | `false` | `true`/`false` | Solo lectura (puede copiar pero no editar) |

## Events

| Evento | Argumento | Descripción |
|--------|-----------|-------------|
| `update:modelValue` | `string` (nuevo valor) | Se emite cuando el usuario cambia el texto |

Todos los eventos nativos del input también están disponibles: `input`, `change`, `focus`, `blur`, `keydown`, `keyup`, etc.

## Slots

El componente no acepta slots. El contenido se controla mediante props.

## Métodos Expuestos

El componente expone métodos a través de su instancia (accesibles vía JavaScript o refs en Vue):

| Método | Argumentos | Retorno | Descripción |
|--------|------------|---------|-------------|
| `get()` | - | `string` | Obtiene el valor actual del input |
| `set(value)` | `string \| number` | `void` | Establece el valor del input (convierte a string) |
| `reset()` | - | `void` | Limpia el valor del input (establece a "") |
| `focus()` | - | `void` | Enfoca el input |

## Ejemplos por Propiedad

### Propiedad: `modelValue`

Uso con v-model en Vue:

```html
<cu-input v-model="username" placeholder="Nombre de usuario" />

<script>
let username = "user123";
</script>
```

Uso manual con update:modelValue:

```html
<cu-input 
  :modelValue="email" 
  @update:modelValue="email = $event"
  placeholder="Correo electrónico"
/>

<script>
let email = "";
</script>
```

### Propiedad: `startValue`

Valor inicial alternativo (útil cuando no usas v-model):

```html
<cu-input 
  startValue="valor@inicial.com"
  placeholder="Escribe aquí"
/>
```

### Propiedad: `color`

Todos los colores disponibles:

```html
<div class="space-y-4">
  <cu-input color="primary" placeholder="Primary" />
  <cu-input color="neutral" placeholder="Neutral" />
  <cu-input color="success" placeholder="Success" />
  <cu-input color="warning" placeholder="Warning" />
  <cu-input color="danger" placeholder="Danger" />
</div>
```

### Propiedad: `variant`

Todas las variantes para el color primary:

```html
<div class="space-y-4">
  <cu-input color="primary" variant="none" placeholder="None" />
  <cu-input color="primary" variant="outlined" placeholder="Outlined" />
  <cu-input color="primary" variant="soft" placeholder="Soft" />
  <cu-input color="primary" variant="ghost" placeholder="Ghost" />
  <cu-input color="primary" variant="subtle" placeholder="Subtle" />
</div>
```

### Propiedad: `type`

Todos los tipos de input disponibles:

```html
<div class="space-y-4">
  <cu-input type="text" placeholder="Texto normal" />
  <cu-input type="email" placeholder="correo@ejemplo.com" />
  <cu-input type="password" placeholder="Contraseña" />
  <cu-input type="number" placeholder="123" />
  <cu-input type="tel" placeholder="+1234567890" />
  <cu-input type="url" placeholder="https://ejemplo.com" />
  <cu-input type="search" placeholder="Buscar..." />
</div>
```

### Propiedad: `placeholder`

Texto de ayuda cuando el input está vacío:

```html
<cu-input 
  placeholder="Por favor, escribe tu nombre de usuario"
/>
```

### Propiedad: `disabled`

Input desactivado (no se puede editar ni enfocar):

```html
<cu-input 
  placeholder="Campo desactivado"
  disabled
  value="Este input está desactivado"
/>
```

### Propiedad: `readOnly`

Input de solo lectura (se puede seleccionar/copiar pero no editar):

```html
<cu-input 
  placeholder="Solo lectura"
  read-only
  value="Valor fijo que no se puede editar"
/>
```

## Ejemplos por Método

### Método: `get()`

Obtener el valor actual programáticamente:

```html
<cu-input id="myInput" placeholder="Escribe aquí" />
<button onclick="showValue()">Mostrar Valor</button>

<script>
function showValue() {
  const input = document.getElementById('myInput');
  const value = input.get();
  alert('Valor actual: ' + value);
}
</script>
```

### Método: `set(value)`

Establecer el valor programáticamente:

```html
<cu-input id="myInput" placeholder="Escribe aquí" />
<button onclick="setValue()">Establecer Valor</button>

<script>
function setValue() {
  const input = document.getElementById('myInput');
  input.set('Nuevo valor establecido desde JavaScript');
}
</script>
```

Establecer valor numérico (se convierte a string):

```html
<cu-input id="myInput" />
<button onclick="setNumber()">Establecer Número</button>

<script>
function setNumber() {
  const input = document.getElementById('myInput');
  input.set(42); // Se convierte a "42"
}
</script>
```

### Método: `reset()`

Limpiar el input:

```html
<cu-input id="myInput" value="Texto a borrar" />
<button onclick="resetInput()">Limpiar</button>

<script>
function resetInput() {
  const input = document.getElementById('myInput');
  input.reset();
}
</script>
```

### Método: `focus()`

Enfocar el input programáticamente:

```html
<cu-input id="myInput" placeholder="Escribe aquí" />
<button onclick="focusInput()">Enfocar Input</button>

<script>
function focusInput() {
  const input = document.getElementById('myInput');
  input.focus();
}
</script>
```

## Ejemplos por Evento

### Evento: `update:modelValue`

Manejar cambios en el valor:

```html
<cu-input 
  placeholder="Escribe aquí"
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

Manejar cada cambio de carácter:

```html
<cu-input 
  placeholder="Escribe aquí"
  oninput="handleInput(event)"
/>

<script>
function handleInput(e) {
  console.log('Valor actual:', e.target.value);
  console.log('Longitud:', e.target.value.length);
}
</script>
```

### Evento: `change` (nativo)

Manejar cuando el input pierde foco después de cambiar:

```html
<cu-input 
  placeholder="Escribe y haz clic fuera"
  onchange="handleChange(event)"
/>

<script>
function handleChange(e) {
  console.log('Valor final:', e.target.value);
}
</script>
```

### Evento: `focus` y `blur`

Manejar foco del input:

```html
<cu-input 
  placeholder="Escribe aquí"
  onfocus="handleFocus()"
  onblur="handleBlur()"
/>

<script>
function handleFocus() {
  console.log('Input recibió foco');
}

function handleBlur() {
  console.log('Input perdió foco');
  // Validar al salir del campo
}
</script>
```

### Evento con `addEventListener`

Usando addEventListener en JavaScript:

```html
<cu-input id="myInput" placeholder="Escribe aquí" />

<script>
const input = document.getElementById('myInput');

input.addEventListener('input', function(e) {
  console.log('Input:', e.target.value);
});

input.addEventListener('change', function(e) {
  console.log('Change:', e.target.value);
});

input.addEventListener('focus', function() {
  console.log('Input enfocado');
});

input.addEventListener('blur', function() {
  console.log('Input desconectado');
});

input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    console.log('Enter presionado');
  }
});
</script>
```

## Casos de Uso Combinados

### Formulario de login completo

```html
<form class="flex flex-col gap-4 max-w-sm" onsubmit="handleSubmit(event)">
  <cu-input 
    id="emailInput"
    type="email" 
    color="primary" 
    variant="outlined"
    placeholder="Correo electrónico"
    required
  />
  
  <cu-input 
    id="passwordInput"
    type="password" 
    color="primary" 
    variant="outlined"
    placeholder="Contraseña"
    required
  />
  
  <cu-button type="submit" color="primary" variant="solid">
    Iniciar Sesión
  </cu-button>
</form>

<script>
function handleSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('emailInput').get();
  const password = document.getElementById('passwordInput').get();
  
  console.log('Credenciales:', { email, password });
  // Autenticar...
}
</script>
```

### Búsqueda con input y botón

```html
<div class="flex gap-2 max-w-lg">
  <cu-input 
    id="searchInput"
    type="search" 
    color="neutral" 
    variant="outlined"
    placeholder="Buscar..."
    onkeydown="handleKeyDown(event)"
  />
  <cu-button color="primary" onclick="search()">
    Buscar
  </cu-button>
</div>

<script>
function handleKeyDown(e) {
  if (e.key === 'Enter') {
    search();
  }
}

function search() {
  const query = document.getElementById('searchInput').get();
  console.log('Buscando:', query);
}
</script>
```

### Campos desactivados y de solo lectura

```html
<div class="space-y-4">
  <div>
    <label class="block mb-2">Desactivado (disabled)</label>
    <p class="text-sm text-charcoal-500 mb-1">No se puede editar ni enfocar</p>
    <cu-input 
      placeholder="Campo desactivado"
      disabled
      value="No se puede interactuar"
    />
  </div>
  
  <div>
    <label class="block mb-2">Solo lectura (readOnly)</label>
    <p class="text-sm text-charcoal-500 mb-1">Se puede seleccionar/copiar pero no editar</p>
    <cu-input 
      placeholder="Solo lectura"
      read-only
      value="Se puede seleccionar pero no editar"
    />
  </div>
</div>
```

### Validación visual con colores

```html
<form class="space-y-4 max-w-lg" id="validationForm">
  <div>
    <label class="block mb-2">Nombre (requerido)</label>
    <cu-input 
      id="nameInput"
      type="text" 
      color="neutral" 
      variant="outlined"
      placeholder="Tu nombre"
      onblur="validateName()"
    />
  </div>
  
  <div>
    <label class="block mb-2">Email (requerido)</label>
    <cu-input 
      id="emailInput"
      type="email" 
      color="neutral" 
      variant="outlined"
      placeholder="tu@email.com"
      onblur="validateEmail()"
    />
  </div>
  
  <cu-button type="button" color="primary" onclick="validateForm()">
    Validar Formulario
  </cu-button>
</form>

<script>
function validateName() {
  const input = document.getElementById('nameInput');
  const value = input.get();
  input.setAttribute('color', value ? 'success' : 'danger');
}

function validateEmail() {
  const input = document.getElementById('emailInput');
  const value = input.get();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  input.setAttribute('color', isValid ? 'success' : 'danger');
}

function validateForm() {
  validateName();
  validateEmail();
}
</script>
```

### Input con limite de caracteres

```html
<cu-input 
  id="limitedInput"
  placeholder="Máximo 50 caracteres"
  maxlength="50"
  @update:modelValue="checkLength"
/>
<p id="charCount" class="text-sm text-charcoal-500 mt-1">0/50 caracteres</p>

<script>
function checkLength(value) {
  const count = value.length;
  const max = 50;
  document.getElementById('charCount').textContent = `${count}/${max} caracteres`;
}
</script>
```

### Input con auto-enfoque

```html
<cu-input 
  id="autoFocusInput"
  placeholder="Escribe aquí (auto-enfocado)"
/>

<script>
// Enfocar automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('autoFocusInput');
  setTimeout(() => input.focus(), 100);
});
</script>
```

### Input con máscara de formato (teléfono)

```html
<cu-input 
  id="phoneInput"
  type="tel"
  placeholder="XXX-XXX-XXXX"
  maxlength="12"
  @update:modelValue="formatPhone"
/>

<script>
let rawValue = '';

function formatPhone(value) {
  // Remover caracteres no numéricos
  const numbers = value.replace(/\D/g, '');
  rawValue = numbers;
  
  // Formatear como XXX-XXX-XXXX
  let formatted = '';
  for (let i = 0; i < numbers.length; i++) {
    if (i === 3 || i === 6) {
      formatted += '-';
    }
    formatted += numbers[i];
  }
  
  const input = document.getElementById('phoneInput');
  // Evitar bucle infinito
  if (value !== formatted) {
    setTimeout(() => input.set(formatted), 0);
  }
}
</script>
```

### Formulario de registro

```html
<form class="space-y-4 max-w-md" onsubmit="handleRegister(event)">
  <cu-input 
    id="fullName"
    type="text" 
    color="primary" 
    variant="outlined"
    placeholder="Nombre completo"
    required
  />
  
  <cu-input 
    id="email"
    type="email" 
    color="primary" 
    variant="outlined"
    placeholder="Correo electrónico"
    required
  />
  
  <cu-input 
    id="password"
    type="password" 
    color="primary" 
    variant="outlined"
    placeholder="Contraseña"
    required
  />
  
  <cu-input 
    id="confirmPassword"
    type="password" 
    color="primary" 
    variant="outlined"
    placeholder="Confirmar contraseña"
    required
  />
  
  <cu-button type="submit" color="primary" variant="solid">
    Registrarse
  </cu-button>
  
  <cu-button type="reset" color="neutral" variant="outlined">
    Limpiar
  </cu-button>
</form>

<script>
function handleRegister(e) {
  e.preventDefault();
  
  const fullName = document.getElementById('fullName').get();
  const email = document.getElementById('email').get();
  const password = document.getElementById('password').get();
  const confirmPassword = document.getElementById('confirmPassword').get();
  
  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }
  
  console.log('Registro:', { fullName, email, password });
}
</script>
```

### Input con sugerencias (autocomplete)

```html
<cu-input 
  id="countryInput"
  type="text" 
  placeholder="País"
  list="countries"
/>
<datalist id="countries">
  <option value="España">
  <option value="México">
  <option value="Argentina">
  <option value="Colombia">
  <option value="Perú">
  <option value="Chile">
  <option value="Ecuador">
</datalist>
```

### Variantes de estilo completas

Todos los colores con todas las variantes:

```html
<div class="space-y-6">
  <div>
    <h3 class="text-lg font-semibold mb-2">Primary</h3>
    <div class="flex gap-2 flex-wrap">
      <cu-input color="primary" variant="none" placeholder="None" class="w-40" />
      <cu-input color="primary" variant="outlined" placeholder="Outlined" class="w-40" />
      <cu-input color="primary" variant="soft" placeholder="Soft" class="w-40" />
      <cu-input color="primary" variant="ghost" placeholder="Ghost" class="w-40" />
      <cu-input color="primary" variant="subtle" placeholder="Subtle" class="w-40" />
    </div>
  </div>
  
  <div>
    <h3 class="text-lg font-semibold mb-2">Neutral</h3>
    <div class="flex gap-2 flex-wrap">
      <cu-input color="neutral" variant="none" placeholder="None" class="w-40" />
      <cu-input color="neutral" variant="outlined" placeholder="Outlined" class="w-40" />
      <cu-input color="neutral" variant="soft" placeholder="Soft" class="w-40" />
      <cu-input color="neutral" variant="ghost" placeholder="Ghost" class="w-40" />
      <cu-input color="neutral" variant="subtle" placeholder="Subtle" class="w-40" />
    </div>
  </div>
</div>
```

## Personalización CSS

```css
/* Personalizar border-radius de todos los inputs */
cu-input {
  --uno-border-radius: 0.5rem;
}

/* Personalizar input con variante outlined */
cu-input[variant="outlined"] {
  --uno-border-width: 2px;
}

/* Personalizar colores de foco */
cu-input[color="primary"][variant="outlined"]:focus {
  --uno-ring-color: #60a5fa;
}

/* Personalizar padding */
cu-input {
  padding: 0.75rem 1rem;
}

/* Personalizar ancho */
cu-input {
  width: 100%;
}

/* Personalizar Transition */
cu-input {
  --uno-transition: all 0.2s ease;
}
```

## Notas Técnicas

- **modelValue vs startValue**: Si `modelValue` está definido, se usa como valor inicial. Si no, se usa `startValue`. Esto permite inicializar el componente sin usar v-model.
- **Conversión de tipos**: El método `set()` convierte automáticamente números a strings usando `String(value)`.
- **Reactividad**: Cuando `modelValue` cambia externamente (vía prop), el valor interno se actualiza automáticamente gracias al watcher interno.
- **Eventos**: Además del evento custom `update:modelValue`, todos los eventos nativos del input (input, change, focus, blur, keydown, keyup, etc.) están disponibles.
- **Tipo number**: Aunque el prop `type` acepta "number", el valor interno siempre se maneja como string. Usa `parseFloat()` o `parseInt()` si necesitas el valor numérico.
- **Atributos HTML**: Puedes usar cualquier atributo HTML válido para `<input>` como `maxlength`, `minlength`, `pattern`, `required`, `autocomplete`, etc.

## Componentes Relacionados

- [Textarea](Textarea.md) - Para texto multilineal (API similar)
- [Button](Button.md) - Para acciones de formulario
- [Modal](Modal.md) - Usa Input en formularios dentro de modales
- [Table](Table.md) - Usa Input para celdas editables
