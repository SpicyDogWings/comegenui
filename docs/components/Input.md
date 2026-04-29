# Input - Componente de Campo de Texto

**`<cu-input>`** es un componente de entrada de texto con múltiples variantes de estilo, colores y tipos de input.

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

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `modelValue` | String | `""` | Valor del input (v-model) |
| `startValue` | String | - | Valor inicial alternativo |
| `color` | String | `neutral` | Color del input. Opciones: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | String | `none` | Variante de estilo. Opciones: `outlined`, `soft`, `ghost`, `subtle`, `none` |
| `type` | String | `text` | Tipo de input. Opciones: `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `placeholder` | String | - | Texto de placeholder |
| `disabled` | Boolean | `false` | Desactiva el input |
| `readOnly` | Boolean | `false` | Solo lectura |

## Variantes de Color y Estilo

### Variante: Outlined

```html
<cu-input color="primary" variant="outlined" placeholder="Primary Outlined" />
<cu-input color="neutral" variant="outlined" placeholder="Neutral Outlined" />
<cu-input color="success" variant="outlined" placeholder="Success Outlined" />
<cu-input color="warning" variant="outlined" placeholder="Warning Outlined" />
<cu-input color="danger" variant="outlined" placeholder="Danger Outlined" />
```

### Variante: Soft

```html
<cu-input color="primary" variant="soft" placeholder="Primary Soft" />
<cu-input color="neutral" variant="soft" placeholder="Neutral Soft" />
<cu-input color="success" variant="soft" placeholder="Success Soft" />
<cu-input color="warning" variant="soft" placeholder="Warning Soft" />
<cu-input color="danger" variant="soft" placeholder="Danger Soft" />
```

### Variante: Ghost

```html
<cu-input color="primary" variant="ghost" placeholder="Primary Ghost" />
<cu-input color="neutral" variant="ghost" placeholder="Neutral Ghost" />
<cu-input color="success" variant="ghost" placeholder="Success Ghost" />
<cu-input color="warning" variant="ghost" placeholder="Warning Ghost" />
<cu-input color="danger" variant="ghost" placeholder="Danger Ghost" />
```

### Variante: Subtle

```html
<cu-input color="primary" variant="subtle" placeholder="Primary Subtle" />
<cu-input color="neutral" variant="subtle" placeholder="Neutral Subtle" />
<cu-input color="success" variant="subtle" placeholder="Success Subtle" />
<cu-input color="warning" variant="subtle" placeholder="Warning Subtle" />
<cu-input color="danger" variant="subtle" placeholder="Danger Subtle" />
```

## Casos de Uso

### Formulario de login

```html
<div class="flex flex-col gap-4 max-w-sm">
  <cu-input 
    type="email" 
    color="primary" 
    variant="outlined"
    placeholder="Correo electrónico"
    id="email"
  />
  <cu-input 
    type="password" 
    color="primary" 
    variant="outlined"
    placeholder="Contraseña"
    id="password"
  />
</div>
```

### Búsqueda

```html
<div class="flex gap-2">
  <cu-input 
    type="search" 
    color="neutral" 
    variant="outlined"
    placeholder="Buscar..."
    id="search"
  />
  <cu-button color="primary" onclick="search()">Buscar</cu-button>
</div>
```

### Campos desactivados

```html
<cu-input 
  placeholder="Campo desactivado" 
  disabled
  value="No se puede editar"
/>
```

### Campos de solo lectura

```html
<cu-input 
  placeholder="Solo lectura" 
  read-only
  value="Valor fijo"
/>
```

### Tipos de input específicos

```html
<cu-input type="email" placeholder="correo@ejemplo.com" />
<cu-input type="tel" placeholder="+1234567890" />
<cu-input type="number" placeholder="123" />
<cu-input type="url" placeholder="https://ejemplo.com" />
<cu-input type="password" placeholder="••••••••" />
```

### Uso con v-model (en Vue)

```html
<cu-input v-model="username" placeholder="Nombre de usuario" />
```

### Uso con JavaScript

```html
<cu-input id="myInput" placeholder="Escribe aquí" />

<script>
const input = document.getElementById('myInput');

// Escuchar cambios
input.addEventListener('input', function(e) {
  console.log('Valor:', e.target.value);
});

// Establecer valor
input.value = 'Valor inicial';

// Obtener valor
console.log(input.value);
</script>
```

### Validación visual

```html
<div class="flex flex-col gap-2">
  <cu-input 
    color="success" 
    variant="outlined"
    placeholder="Campo válido"
  />
  <cu-input 
    color="warning" 
    variant="outlined"
    placeholder="Advertencia"
  />
  <cu-input 
    color="danger" 
    variant="outlined"
    placeholder="Error"
  />
</div>
```

## Métodos Expuestos

El componente expone varios métodos a través de su instancia:

### `get()`

Obtiene el valor actual del input.

```javascript
const input = document.querySelector('cu-input');
const value = input.get();
```

### `set(value)`

Establece el valor del input.

```javascript
const input = document.querySelector('cu-input');
input.set('Nuevo valor');
```

### `reset()`

Limpia el valor del input.

```javascript
const input = document.querySelector('cu-input');
input.reset();
```

### `focus()`

Enfoca el input.

```javascript
const input = document.querySelector('cu-input');
input.focus();
```

## Events

### Eventos nativos

```html
<cu-input 
  placeholder="Escribe aquí"
  oninput="handleInput(event)"
  onchange="handleChange(event)"
/>

<script>
function handleInput(e) {
  console.log('Input:', e.target.value);
}

function handleChange(e) {
  console.log('Change:', e.target.value);
}
</script>
```

### Evento `update:modelValue`

En Vue, puedes usar v-model:

```html
<cu-input v-model="myValue" />
<!-- o -->
<cu-input :modelValue="myValue" @update:modelValue="myValue = $event" />
```

## Estilos CSS

```css
cu-input {
  --uno-border-radius: 0.375rem;
}

cu-input[variant="outlined"] {
  --uno-border-width: 2px;
}
```

## Componentes Relacionados

- [Textarea](Textarea.md) - Para texto multilineal
- [Button](Button.md) - Para enviar formularios
- [Table](Table.md) - Usa Input para celdas editables
