# Textarea - Componente de Área de Texto

**`<cu-textarea>`** es un componente de área de texto multilineal con múltiples variantes de estilo, colores y opciones de configuración.

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

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `modelValue` | String | `""` | Valor del textarea (v-model) |
| `startValue` | String | - | Valor inicial alternativo |
| `color` | String | `neutral` | Color del textarea. Opciones: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | String | `none` | Variante de estilo. Opciones: `outlined`, `soft`, `ghost`, `subtle`, `none` |
| `placeholder` | String | - | Texto de placeholder |
| `disabled` | Boolean | `false` | Desactiva el textarea |
| `readOnly` | Boolean | `false` | Solo lectura |
| `rows` | Number | `3` | Número de filas visibles |
| `noResize` | Boolean | `false` | Desactiva la redimensión del textarea |

## Variantes de Color y Estilo

### Variante: Outlined

```html
<cu-textarea color="primary" variant="outlined" placeholder="Primary Outlined" rows="4" />
<cu-textarea color="neutral" variant="outlined" placeholder="Neutral Outlined" rows="4" />
<cu-textarea color="success" variant="outlined" placeholder="Success Outlined" rows="4" />
<cu-textarea color="warning" variant="outlined" placeholder="Warning Outlined" rows="4" />
<cu-textarea color="danger" variant="outlined" placeholder="Danger Outlined" rows="4" />
```

### Variante: Soft

```html
<cu-textarea color="primary" variant="soft" placeholder="Primary Soft" rows="4" />
<cu-textarea color="neutral" variant="soft" placeholder="Neutral Soft" rows="4" />
<cu-textarea color="success" variant="soft" placeholder="Success Soft" rows="4" />
<cu-textarea color="warning" variant="soft" placeholder="Warning Soft" rows="4" />
<cu-textarea color="danger" variant="soft" placeholder="Danger Soft" rows="4" />
```

### Variante: Ghost

```html
<cu-textarea color="primary" variant="ghost" placeholder="Primary Ghost" rows="4" />
<cu-textarea color="neutral" variant="ghost" placeholder="Neutral Ghost" rows="4" />
<cu-textarea color="success" variant="ghost" placeholder="Success Ghost" rows="4" />
<cu-textarea color="warning" variant="ghost" placeholder="Warning Ghost" rows="4" />
<cu-textarea color="danger" variant="ghost" placeholder="Danger Ghost" rows="4" />
```

### Variante: Subtle

```html
<cu-textarea color="primary" variant="subtle" placeholder="Primary Subtle" rows="4" />
<cu-textarea color="neutral" variant="subtle" placeholder="Neutral Subtle" rows="4" />
<cu-textarea color="success" variant="subtle" placeholder="Success Subtle" rows="4" />
<cu-textarea color="warning" variant="subtle" placeholder="Warning Subtle" rows="4" />
<cu-textarea color="danger" variant="subtle" placeholder="Danger Subtle" rows="4" />
```

## Casos de Uso

### Comentarios

```html
<div class="max-w-2xl">
  <label class="block mb-2 font-medium text-charcoal-800">Deja un comentario</label>
  <cu-textarea 
    color="neutral" 
    variant="outlined"
    placeholder="Escribe tu comentario aquí..."
    rows="5"
  />
</div>
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
</div>
```

### Mensaje con validación visual

```html
<div class="space-y-4">
  <cu-textarea 
    color="success" 
    variant="outlined"
    placeholder="Mensaje válido"
    rows="4"
  />
  
  <cu-textarea 
    color="warning" 
    variant="outlined"
    placeholder="Advertencia: el mensaje es muy corto"
    rows="4"
  />
  
  <cu-textarea 
    color="danger" 
    variant="outlined"
    placeholder="Error: el mensaje no puede estar vacío"
    rows="4"
  />
</div>
```

### Textarea desactivado

```html
<cu-textarea 
  placeholder="Campo desactivado"
  disabled
  value="Este textarea está desactivado"
  rows="4"
/>
```

### Textarea de solo lectura

```html
<cu-textarea 
  placeholder="Solo lectura"
  read-only
  value="Valor fijo que no se puede editar"
  rows="4"
/>
```

### Textarea sin redimensión

```html
<cu-textarea 
  placeholder="No se puede redimensionar"
  no-resize
  rows="6"
/>
```

### Textarea con un tamaño específico

```html
<cu-textarea 
  placeholder="Área de texto pequeña"
  rows="2"
/>

<cu-textarea 
  placeholder="Área de texto mediana"
  rows="4"
/>

<cu-textarea 
  placeholder="Área de texto grande"
  rows="10"
/>
```

### Uso con v-model (en Vue)

```html
<cu-textarea v-model="description" placeholder="Descripción" rows="5" />
```

### Uso con JavaScript

```html
<cu-textarea id="myTextarea" placeholder="Escribe aquí" rows="5" />

<script>
const textarea = document.getElementById('myTextarea');

// Escuchar cambios
textarea.addEventListener('input', function(e) {
  console.log('Valor:', e.target.value);
});

// Establecer valor
textarea.value = 'Texto inicial';

// Obtener valor
console.log(textarea.value);
</script>
```

### Formulario de contacto

```html
<form class="space-y-4 max-w-lg">
  <cu-input type="text" placeholder="Nombre" color="primary" variant="outlined" />
  
  <cu-input type="email" placeholder="Correo electrónico" color="primary" variant="outlined" />
  
  <cu-textarea 
    placeholder="Mensaje" 
    color="primary" 
    variant="outlined" 
    rows="6"
  />
  
  <cu-button color="primary" variant="solid" type="submit">
    Enviar
  </cu-button>
</form>
```

## Métodos Expuestos

El componente expone varios métodos a través de su instancia:

### `get()`

Obtiene el valor actual del textarea.

```javascript
const textarea = document.querySelector('cu-textarea');
const value = textarea.get();
```

### `set(value)`

Establece el valor del textarea.

```javascript
const textarea = document.querySelector('cu-textarea');
textarea.set('Nuevo valor de texto');
```

### `reset()`

Limpia el valor del textarea.

```javascript
const textarea = document.querySelector('cu-textarea');
textarea.reset();
```

### `focus()`

Enfoca el textarea.

```javascript
const textarea = document.querySelector('cu-textarea');
textarea.focus();
```

## Events

### Eventos nativos

```html
<cu-textarea 
  placeholder="Escribe aquí"
  rows="4"
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
<cu-textarea v-model="myText" rows="5" />
<!-- o -->
<cu-textarea :modelValue="myText" @update:modelValue="myText = $event" rows="5" />
```

## Estilos CSS

```css
cu-textarea {
  --uno-border-radius: 0.375rem;
}

cu-textarea[variant="outlined"] {
  --uno-border-width: 2px;
}

cu-textarea[no-resize] {
  resize: none;
}
```

## Componentes Relacionados

- [Input](Input.md) - Para texto de una sola línea
- [Table](Table.md) - Usa Textarea para celdas editables de texto largo
- [Button](Button.md) - Para enviar formularios con textarea
