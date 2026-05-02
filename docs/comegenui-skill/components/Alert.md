# Alert - Componente de Alerta

**`<cu-alert>`** es un componente para mostrar mensajes de alerta con soporte para iconos, colores, variantes y botón de cierre. Ideal para notificaciones, mensajes de error, advertencias y confirmaciones visuales.

## Importación

```html
<script src="../dist/vendor/vue-runtime.iife.js"></script>
<script src="../dist/cuAlert.umd.js"></script>
```

**Nota:** Este componente usa internamente `<cu-button>`, por lo que también necesitas importar el componente Button:

```html
<script src="../dist/cuButton.umd.js"></script>
```

## Uso Básico

```html
<cu-alert title="Éxito" color="success" variant="soft" close>
  La operación se completó correctamente.
</cu-alert>
```

## Props

| Prop | Tipo | Default | Valores válidos | Descripción |
|------|------|---------|----------------|-------------|
| `color` | String | `neutral` | `primary`, `neutral`, `success`, `warning`, `danger` | Color de la alerta |
| `variant` | String | `soft` | `solid`, `outlined`, `soft`, `ghost`, `subtle` | Variante de estilo visual |
| `title` | String | `undefined` | - | Título de la alerta (opcional) |
| `close` | Boolean | `false` | `true`/`false` | Muestra el botón de cerrar |
| `show` | Boolean | `true` | `true`/`false` | Controla la visibilidad inicial de la alerta |

## Events

| Evento | Argumento | Descripción |
|--------|-----------|-------------|
| `close` | - | Se emite cuando el alert se cierra (por botón o método `close()`) |
| `open` | - | Se emite cuando el alert se abre (por método `open()` o `toggle()`) |
| `update:show` | `boolean` | Se emite cuando cambia el estado interno de visibilidad |

## Slots

| Nombre | Descripción |
|--------|-------------|
| `icon` | Contenedor para iconos (se muestra a la izquierda del título) |
| `default` | Contenido principal de la alerta (descripción, texto, etc.) |

## Métodos Expuestos

El componente expone métodos para control programático:

| Método | Argumentos | Retorno | Descripción |
|--------|------------|---------|-------------|
| `open()` | - | `void` | Muestra el alert |
| `close()` | - | `void` | Oculta el alert |
| `toggle()` | - | `void` | Alterna entre mostrar/ocultar |
| `isOpen` (getter) | - | `boolean` | Obtiene el estado actual (visible/oculto) |

## Ejemplos por Propiedad

### Propiedad: `color`

Todos los colores disponibles:

```html
<div class="space-y-4">
  <cu-alert color="primary" variant="soft">
    Mensaje de información (Primary)
  </cu-alert>
  
  <cu-alert color="neutral" variant="soft">
    Mensaje neutral
  </cu-alert>
  
  <cu-alert color="success" variant="soft">
    Mensaje de éxito
  </cu-alert>
  
  <cu-alert color="warning" variant="soft">
    Mensaje de advertencia
  </cu-alert>
  
  <cu-alert color="danger" variant="soft">
    Mensaje de error
  </cu-alert>
</div>
```

### Propiedad: `variant`

Todas las variantes para el color success:

```html
<div class="space-y-4">
  <cu-alert color="success" variant="solid">
    Variante Solid
  </cu-alert>
  
  <cu-alert color="success" variant="soft">
    Variante Soft
  </cu-alert>
  
  <cu-alert color="success" variant="subtle">
    Variante Subtle
  </cu-alert>
  
  <cu-alert color="success" variant="outlined">
    Variante Outlined
  </cu-alert>
  
  <cu-alert color="success" variant="ghost">
    Variante Ghost
  </cu-alert>
</div>
```

### Propiedad: `title`

Alerta con título:

```html
<cu-alert title="Operación Exitosa" color="success" variant="soft">
  La operación se completó correctamente.
</cu-alert>
```

### Propiedad: `close`

Alerta con botón de cierre (visible):

```html
<cu-alert title="Notificación" color="primary" variant="soft" close>
  Esta alerta tiene botón de cierre.
</cu-alert>
```

Alerta sin botón de cierre:

```html
<cu-alert title="Información" color="neutral" variant="soft">
  Esta alerta no tiene botón de cierre.
</cu-alert>
```

### Propiedad: `show`

Controlar visibilidad inicial:

```html
<cu-alert id="alert1" title="Visible" color="success" show>
  Esta alerta es visible al cargar.
</cu-alert>

<cu-alert id="alert2" title="Oculta" color="info" show="false">
  Esta alerta está oculta al cargar.
</cu-alert>
```

> **Nota:** En HTML plano, usa el atributo `show` (sin `:`). Para actualizar dinámicamente: `alert.show = true;`

## Ejemplos por Método

### Método: `open()`

Abrir alerta programáticamente:

```html
<cu-alert id="myAlert" title="Notificación" color="primary" variant="soft" close>
  Esta alerta se abre con el método open().
</cu-alert>
<cu-button onclick="openAlert()">Abrir Alerta</cu-button>

<script>
const alert = document.getElementById('myAlert');

function openAlert() {
  alert.open();
}
</script>
```

### Método: `close()`

Cerrar alerta programáticamente:

```html
<cu-alert id="myAlert" title="Notificación" color="success" variant="soft" close>
  Esta alerta se cierra con el método close().
</cu-alert>
<cu-button onclick="closeAlert()">Cerrar Alerta</cu-button>

<script>
const alert = document.getElementById('myAlert');

function closeAlert() {
  alert.close();
}
</script>
```

### Método: `toggle()`

Alternar alerta entre visible y oculta:

```html
<cu-alert id="myAlert" title="Notificación" color="warning" variant="soft">
  Esta alerta se alterna con el método toggle().
</cu-alert>
<cu-button onclick="toggleAlert()">Alternar Alerta</cu-button>

<script>
const alert = document.getElementById('myAlert');

function toggleAlert() {
  alert.toggle();
}
</script>
```

### Método: `isOpen` (getter)

Verificar estado de la alerta:

```html
<cu-alert id="myAlert" title="Notificación" color="info" variant="soft">
  Contenido de la alerta.
</cu-alert>
<cu-button onclick="checkStatus()">Verificar Estado</cu-button>

<script>
const alert = document.getElementById('myAlert');

function checkStatus() {
  const isOpen = alert.isOpen;
  console.log(`La alerta está ${isOpen ? 'visible' : 'oculta'}`);
}
</script>
```

## Ejemplos por Evento

### Evento: `close`

Escuchar cuando la alerta se cierra:

```html
<cu-alert id="myAlert" title="Notificación" color="success" close @close="handleClose">
  Esta alerta emite evento close al cerrarse.
</cu-alert>

<script>
const alert = document.getElementById('myAlert');

function handleClose() {
  console.log('Evento close recibido: alerta cerrada');
}

// También puedes escuchar con addEventListener
alert.addEventListener('close', () => {
  console.log('Alerta cerrada (addEventListener)');
});
</script>
```

### Evento: `open`

Escuchar cuando la alerta se abre:

```html
<cu-alert id="myAlert" title="Notificación" color="primary" @open="handleOpen">
  Esta alerta emite evento open al abrirse.
</cu-alert>
<cu-button onclick="openAlert()">Abrir</cu-button>

<script>
const alert = document.getElementById('myAlert');

function openAlert() {
  alert.open();
}

function handleOpen() {
  console.log('Evento open recibido: alerta abierta');
}

// También con addEventListener
alert.addEventListener('open', () => {
  console.log('Alerta abierta (addEventListener)');
});
</script>
```

### Evento: `update:show`

Sincronización bidireccional con v-model estilo (en Vue SFC):

```vue
<cu-alert 
  id="myAlert" 
  title="Notificación" 
  color="warning"
  :show="isVisible"
  @update:show="isVisible = $event"
>
  Esta alerta sincroniza su visibilidad.
</cu-alert>

<script>
let isVisible = true;

// Cambiar visibilidad desde código
function toggleVisibility() {
  isVisible = !isVisible;
}
</script>
```

Para HTML plano, usa eventos JavaScript:

```html
<cu-alert id="myAlert" title="Notificación" color="warning" show="true">
  Esta alerta sincroniza su visibilidad.
</cu-alert>

<script>
const alert = document.getElementById('myAlert');

// Escuchar cambios
alert.addEventListener('update:show', (e) => {
  console.log('show cambió a:', e.detail);
});

// Cambiar visibilidad desde código
function toggleVisibility() {
  alert.show = !alert.show;
}
</script>
```

## Ejemplos por Slot

### Slot: `icon`

Añadir un icono a la alerta:

```html
<cu-alert title="Éxito" color="success" variant="soft" close>
  <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
  La operación se completó correctamente.
</cu-alert>
```

Usando emoji como icono:

```html
<cu-alert title="Éxito" color="success" variant="soft" close>
  <span slot="icon">✓</span>
  Operación exitosa.
</cu-alert>

<cu-alert title="Advertencia" color="warning" variant="soft" close>
  <span slot="icon">⚠️</span>
  Atención, esta acción no se puede deshacer.
</cu-alert>

<cu-alert title="Error" color="danger" variant="soft" close>
  <span slot="icon">✗</span>
  Algo salió mal.
</cu-alert>

<cu-alert title="Información" color="primary" variant="soft" close>
  <span slot="icon">ℹ️</span>
  Mensaje informativo.
</cu-alert>
```

### Slot: `default`

Contenido principal de la alerta:

```html
<cu-alert color="success" variant="soft">
  <div>
    <p><strong>Operación completada:</strong> El archivo ha sido guardado.</p>
    <p class="text-sm mt-2">Hora: 14:30 - Fecha: 01/05/2025</p>
  </div>
</cu-alert>

<cu-alert color="warning" variant="soft" close>
  <ul class="list-disc list-inside">
    <li>Item 1 a tener en cuenta</li>
    <li>Item 2 importante</li>
    <li>Item 3 crítico</li>
  </ul>
</cu-alert>
```

## Casos de Uso Combinados

### Uso con Iconos y Botón de Cierre

```html
<cu-alert title="Éxito" color="success" variant="soft" close>
  <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
  La operación se completó correctamente.
</cu-alert>
```

### Alerta con auto-cierre

```html
<cu-alert id="auto-close-alert" title="Notificación" color="success" variant="soft" close>
  Esta alerta se cerrará automáticamente en 3 segundos.
</cu-alert>

<script>
const alert = document.getElementById('auto-close-alert');

// Abrir y auto-cerrar
alert.open();
setTimeout(() => alert.close(), 3000);
</script>
```

### Múltiples alertas con controles

```html
<div class="space-y-4">
  <cu-alert id="alert1" title="Alerta 1" color="success" close>
    <span slot="icon">✓</span>
    Operación exitosa.
  </cu-alert>
  
  <cu-alert id="alert2" title="Alerta 2" color="warning" close>
    <span slot="icon">⚠️</span>
    Advertencia importante.
  </cu-alert>
  
  <cu-alert id="alert3" title="Alerta 3" color="danger" close>
    <span slot="icon">✗</span>
    Error crítico.
  </cu-alert>
</div>

<div class="flex gap-2 mt-4">
  <cu-button onclick="openAll()">Abrir Todas</cu-button>
  <cu-button onclick="closeAll()">Cerrar Todas</cu-button>
  <cu-button onclick="toggleAll()">Alternar Todas</cu-button>
</div>

<script>
const alert1 = document.getElementById('alert1');
const alert2 = document.getElementById('alert2');
const alert3 = document.getElementById('alert3');

function openAll() {
  alert1.open();
  alert2.open();
  alert3.open();
}

function closeAll() {
  alert1.close();
  alert2.close();
  alert3.close();
}

function toggleAll() {
  alert1.toggle();
  alert2.toggle();
  alert3.toggle();
}
</script>
```

### Alerta sin botón de cierre

```html
<cu-alert title="Información" color="primary" variant="soft">
  <span slot="icon">ℹ️</span>
  <p>Este alert no tiene botón de cierre.</p>
  <p>Usa los métodos para controlarlo programáticamente.</p>
</cu-alert>
```

### Alerta sin título

```html
<cu-alert color="info" variant="soft" close>
  <p>Mensaje sin título, solo contenido.</p>
</cu-alert>
```

### Alerta con contenido HTML complejo

```html
<cu-alert color="warning" variant="subtle" close>
  <span slot="icon">⚠️</span>
  <h4 class="font-semibold mb-1">Advertencia de Seguridad</h4>
  <p class="text-sm">
    Tu sesión expira en <strong>5 minutos</strong>. Por favor, guarda tu trabajo.
  </p>
  <p class="text-sm mt-2">
    <a href="#" class="underline" onclick="extendSession()">Extender sesión</a>
  </p>
</cu-alert>

<script>
function extendSession() {
  console.log('Sesión extendida');
}
</script>
```

### Alerta en un formulario (error de validación)

```html
<form class="space-y-4" onsubmit="handleSubmit(event)">
  <div>
    <label class="block mb-2">Correo Electrónico</label>
    <cu-input id="email" type="email" placeholder="tu@email.com" />
  </div>
  
  <div>
    <label class="block mb-2">Contraseña</label>
    <cu-input id="password" type="password" placeholder="••••••••" />
  </div>
  
  <cu-alert id="errorAlert" title="Error" color="danger" variant="soft" close show="false">
    <span slot="icon">✗</span>
    <p>Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.</p>
  </cu-alert>
  
  <cu-button type="submit" color="primary" variant="solid">
    Iniciar Sesión
  </cu-button>
</form>

<script>
const errorAlert = document.getElementById('errorAlert');

function handleSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('email').get();
  const password = document.getElementById('password').get();
  
  // Validación de ejemplo
  if (email !== 'admin@ejemplo.com' || password !== '1234') {
    errorAlert.open();
    return;
  }
  
  console.log('Login exitoso');
}
</script>
```

### Alerta de éxito después de acción

```html
<cu-button onclick="performAction()" color="primary" variant="solid">
  Realizar Acción
</cu-button>

<cu-alert id="successAlert" title="Éxito" color="success" variant="soft" close show="false">
  <span slot="icon">✓</span>
  <p>La acción se completó correctamente.</p>
</cu-alert>

<script>
const successAlert = document.getElementById('successAlert');

function performAction() {
  // Simular acción
  console.log('Realizando acción...');
  
  // Mostrar alerta de éxito
  setTimeout(() => {
    successAlert.open();
    // Auto-cerrar después de 3 segundos
    setTimeout(() => successAlert.close(), 3000);
  }, 1000);
}
</script>
```

### Alerta con acciones

```html
<cu-alert title="Advertencia" color="warning" variant="subtle" close>
  <span slot="icon">⚠️</span>
  <p>Tu suscripción está a punto de expirar.</p>
  <div class="flex gap-2 mt-3">
    <cu-button color="primary" variant="solid" size="sm" onclick="renew()">
      Renovar
    </cu-button>
    <cu-button color="neutral" variant="ghost" size="sm" onclick="remindLater()">
      Recordarme después
    </cu-button>
  </div>
</cu-alert>

<script>
function renew() {
  console.log('Redirigiendo a página de renovación...');
}

function remindLater() {
  console.log('Recordatorio programado');
}
</script>
```

### Combinaciones completas de color y variante

#### Primary

```html
<div class="space-y-3">
  <cu-alert color="primary" variant="solid">Solid</cu-alert>
  <cu-alert color="primary" variant="soft">Soft</cu-alert>
  <cu-alert color="primary" variant="subtle">Subtle</cu-alert>
  <cu-alert color="primary" variant="outlined">Outlined</cu-alert>
  <cu-alert color="primary" variant="ghost">Ghost</cu-alert>
</div>
```

#### Neutral

```html
<div class="space-y-3">
  <cu-alert color="neutral" variant="solid">Solid</cu-alert>
  <cu-alert color="neutral" variant="soft">Soft</cu-alert>
  <cu-alert color="neutral" variant="subtle">Subtle</cu-alert>
  <cu-alert color="neutral" variant="outlined">Outlined</cu-alert>
  <cu-alert color="neutral" variant="ghost">Ghost</cu-alert>
</div>
```

#### Success

```html
<div class="space-y-3">
  <cu-alert color="success" variant="solid">Solid</cu-alert>
  <cu-alert color="success" variant="soft">Soft</cu-alert>
  <cu-alert color="success" variant="subtle">Subtle</cu-alert>
  <cu-alert color="success" variant="outlined">Outlined</cu-alert>
  <cu-alert color="success" variant="ghost">Ghost</cu-alert>
</div>
```

#### Warning

```html
<div class="space-y-3">
  <cu-alert color="warning" variant="solid">Solid</cu-alert>
  <cu-alert color="warning" variant="soft">Soft</cu-alert>
  <cu-alert color="warning" variant="subtle">Subtle</cu-alert>
  <cu-alert color="warning" variant="outlined">Outlined</cu-alert>
  <cu-alert color="warning" variant="ghost">Ghost</cu-alert>
</div>
```

#### Danger

```html
<div class="space-y-3">
  <cu-alert color="danger" variant="solid">Solid</cu-alert>
  <cu-alert color="danger" variant="soft">Soft</cu-alert>
  <cu-alert color="danger" variant="subtle">Subtle</cu-alert>
  <cu-alert color="danger" variant="outlined">Outlined</cu-alert>
  <cu-alert color="danger" variant="ghost">Ghost</cu-alert>
</div>
```

## Personalización CSS

```css
/* Personalizar border-radius de todas las alertas */
cu-alert {
  --uno-border-radius: 0.5rem;
}

/* Personalizar alerta con variante solid */
cu-alert[color="primary"][variant="solid"] {
  --uno-bg: #2563eb;
}

/* Personalizar padding */
cu-alert {
  padding: 1rem;
}

/* Personalizar icono */
cu-alert svg {
  width: 24px;
  height: 24px;
}

/* Personalizar botón de cierre */
cu-alert button {
  padding: 0.25rem;
  min-height: auto;
}

/* Personalizar sombra */
cu-alert {
  --uno-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

## Notas Técnicas

- El componente usa `v-show` para controlar la visibilidad, lo que significa que el elemento siempre está en el DOM pero puede estar oculto.
- El botón de cierre solo aparece cuando `close` es `true`.
- Cuando el botón de cierre es clickeado, se emite el evento `close` y el alert se oculta.
- El estado interno `internalShow` se sincroniza con la prop `show` mediante watchers.
- El componente usa `role="alert"` para accesibilidad con lectores de pantalla.
- El color y variante determinan el estilo visual completo del alert (fondo, texto, bordes).

## Componentes Relacionados

- [Button](Button.md) - Usado internamente para el botón de cierre
- [Badge](Badge.md) - Para mostrar indicadores junto a alertas
- [Modal](Modal.md) - Para diálogos modales (más intrusivos que alertas)
- [Input](Input.md) - Para campos de entrada que pueden mostrar alertas de validación
- [Textarea](Textarea.md) - Similar a Input para texto multilineal
