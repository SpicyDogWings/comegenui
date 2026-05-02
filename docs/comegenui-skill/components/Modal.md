# Modal - Componente de Diálogo Modal

**`<cu-modal>`** es un componente de diálogo modal accesible con soporte para tamaños personalizables, control de altura, manejo de teclado, cierres automáticos y slots para contenido flexible.

## Importación

```html
<script src="../dist/vendor/vue-runtime.iife.js"></script>
<script src="../dist/cuModal.umd.js"></script>
```

**Nota:** Este componente usa internamente `<cu-button>`, por lo que también necesitas importar el componente Button:

```html
<script src="../dist/cuButton.umd.js"></script>
```

## Uso Básico

```html
<cu-button onclick="modal.open()">Abrir Modal</cu-button>

<cu-modal id="modal" title="Título del Modal">
  <p>Contenido del modal aquí.</p>
  <div slot="footer">
    <cu-button onclick="modal.close()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('modal');
</script>
```

## Props

| Prop | Tipo | Default | Valores válidos | Descripción |
|------|------|---------|----------------|-------------|
| `title` | String | `""` | - | Título del modal. Se muestra en el header |
| `description` | String | `""` | - | Descripción opcional. Se muestra debajo del título en el header |
| `persistent` | Boolean | `false` | `true`/`false` | Si es `true`, el modal no se cierra al hacer clic en el backdrop o presionar Escape |
| `size` | String | `"md"` | `sm`, `md`, `lg`, `xl`, `full` | Ancho máximo del modal |
| `height` | String | `"auto"` | `auto`, `sm`, `md`, `lg`, `xl`, `full` | Altura máxima del modal |

### Tamaños (size) - Ancho

| Valor | Clase CSS | Descripción | Ancho aproximado |
|-------|-----------|-------------|-----------------|
| `sm` | `max-w-sm` | Modal pequeño | ~24rem (384px) |
| `md` | `max-w-md` | Modal mediano (por defecto) | ~28rem (448px) |
| `lg` | `max-w-lg` | Modal grande | ~32rem (512px) |
| `xl` | `max-w-xl` | Modal extra grande | ~36rem (576px) |
| `full` | `max-w-[90vw]` | Modal ancho completo | 90% del viewport |

### Alturas (height) - Altura máxima

| Valor | Clase CSS | Descripción | Altura aproximada |
|-------|-----------|-------------|------------------|
| `auto` | `max-h-[90vh]` | Altura automática | Hasta 90% del viewport |
| `sm` | `max-h-[200px]` | Altura pequeña | 200px |
| `md` | `max-h-[300px]` | Altura mediana | 300px |
| `lg` | `max-h-[400px]` | Altura grande | 400px |
| `xl` | `max-h-[500px]` | Altura extra grande | 500px |
| `full` | `max-h-[90vh]` | Altura completa | 90% del viewport |

## Events

| Evento | Descripción |
|--------|-------------|
| `opened` | Se emite cuando el modal se ha abierto completamente |
| `closed` | Se emite cuando el modal se ha cerrado completamente |
| `close` | Se emite cuando se solicita cerrar el modal (antes de la animación de cierre) |

## Slots

| Nombre | Descripción |
|--------|-------------|
| `default` | Contenido principal del modal (cuerpo) |
| `footer` | Contenido del footer (normalmente botones de acción) |

## Métodos Expuestos

El componente expone métodos para control programático:

| Método | Argumentos | Retorno | Descripción |
|--------|------------|---------|-------------|
| `open()` | - | `void` | Abre el modal |
| `close()` | - | `void` | Cierra el modal |
| `toggle()` | - | `void` | Alterna entre abierto y cerrado |
| `isOpen` (getter) | - | `boolean` | Obtiene el estado actual (abierto/cerrado) |

## Ejemplos por Propiedad

### Propiedad: `title`

Título del modal mostrado en el header:

```html
<cu-button onclick="openModal()">Abrir</cu-button>

<cu-modal id="title-modal" title="Este es el título">
  <p>Contenido del modal con título.</p>
  <div slot="footer">
    <cu-button onclick="closeModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('title-modal');
function openModal() { modal.open(); }
function closeModal() { modal.close(); }
</script>
```

### Propiedad: `description`

Descripción opcional mostrada debajo del título:

```html
<cu-button onclick="openModal()">Abrir</cu-button>

<cu-modal 
  id="desc-modal" 
  title="Título del Modal"
  description="Esta es una descripción detallada del propósito del modal."
>
  <p>Contenido del modal.</p>
  <div slot="footer">
    <cu-button onclick="closeModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('desc-modal');
function openModal() { modal.open(); }
function closeModal() { modal.close(); }
</script>
```

### Propiedad: `persistent`

Modal que no se cierra con Escape o clic fuera:

```html
<cu-button onclick="openModal()">Abrir Modal Persistente</cu-button>

<cu-modal id="persistent-modal" title="Importante" persistent>
  <p>Este modal no se cerrará al presionar Escape o hacer clic fuera.</p>
  <p>Debes usar el botón de cerrar o el botón Cerrar.</p>
  <div slot="footer">
    <cu-button onclick="closeModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('persistent-modal');
function openModal() { modal.open(); }
function closeModal() { modal.close(); }
</script>
```

### Propiedad: `size`

Todas las opciones de tamaño (ancho):

```html
<div class="flex gap-2 flex-wrap mb-4">
  <cu-button onclick="openSize('sm')">Tamaño SM</cu-button>
  <cu-button onclick="openSize('md')">Tamaño MD</cu-button>
  <cu-button onclick="openSize('lg')">Tamaño LG</cu-button>
  <cu-button onclick="openSize('xl')">Tamaño XL</cu-button>
  <cu-button onclick="openSize('full')">Tamaño FULL</cu-button>
</div>

<cu-modal id="size-modal" title="Modal de Tamaño" size="md">
  <p>Este modal muestra el tamaño seleccionado.</p>
  <div slot="footer">
    <cu-button onclick="closeModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('size-modal');

function openSize(size) {
  modal.setAttribute('size', size);
  modal.open();
}

function closeModal() {
  modal.close();
}
</script>
```

### Propiedad: `height`

Todas las opciones de altura:

```html
<div class="flex gap-2 flex-wrap mb-4">
  <cu-button onclick="openHeight('auto')">Altura AUTO</cu-button>
  <cu-button onclick="openHeight('sm')">Altura SM</cu-button>
  <cu-button onclick="openHeight('md')">Altura MD</cu-button>
  <cu-button onclick="openHeight('lg')">Altura LG</cu-button>
  <cu-button onclick="openHeight('xl')">Altura XL</cu-button>
  <cu-button onclick="openHeight('full')">Altura FULL</cu-button>
</div>

<cu-modal id="height-modal" title="Modal de Altura" height="auto">
  <div class="space-y-2">
    <p>Contenido con altura controlada.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse.</p>
  </div>
  <div slot="footer">
    <cu-button onclick="closeModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('height-modal');

function openHeight(height) {
  modal.setAttribute('height', height);
  modal.open();
}

function closeModal() {
  modal.close();
}
</script>
```

## Ejemplos por Método

### Método: `open()`

Abrir el modal programáticamente:

```html
<cu-button onclick="openModal()">Abrir Modal</cu-button>

<cu-modal id="modal" title="Mi Modal">
  <p>Contenido del modal.</p>
  <div slot="footer">
    <cu-button onclick="closeModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('modal');

function openModal() {
  modal.open();
}

function closeModal() {
  modal.close();
}
</script>
```

### Método: `close()`

Cerrar el modal programáticamente:

```html
<cu-button onclick="openModal()">Abrir Modal</cu-button>

<cu-modal id="modal" title="Mi Modal">
  <p>Haz clic en el botón de abajo para cerrar.</p>
  <div slot="footer">
    <cu-button onclick="closeModal()">Cerrar Modal</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('modal');

function openModal() {
  modal.open();
}

function closeModal() {
  modal.close();
}
</script>
```

### Método: `toggle()`

Alternar entre abierto y cerrado:

```html
<cu-button onclick="toggleModal()">Alternar Modal</cu-button>

<cu-modal id="modal" title="Modal Togleable">
  <p>Este modal se alterna con el botón.</p>
  <div slot="footer">
    <cu-button onclick="toggleModal()">Alternar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('modal');

function toggleModal() {
  modal.toggle();
}
</script>
```

### Método: `isOpen` (getter)

Verificar si el modal está abierto:

```html
<cu-button onclick="checkStatus()">Verificar Estado</cu-button>
<cu-button onclick="toggleModal()">Alternar</cu-button>

<cu-modal id="modal" title="Mi Modal">
  <p>Contenido del modal.</p>
  <div slot="footer">
    <cu-button onclick="toggleModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('modal');

function toggleModal() {
  modal.toggle();
}

function checkStatus() {
  const isOpen = modal.isOpen;
  alert(`El modal está ${isOpen ? 'abierto' : 'cerrado'}`);
}
</script>
```

## Ejemplos por Evento

### Evento: `opened`

Se ejecuta cuando el modal se abre:

```html
<cu-button onclick="openModal()">Abrir Modal</cu-button>

<cu-modal id="modal" @opened="handleOpened">
  <p>Contenido del modal.</p>
  <div slot="footer">
    <cu-button onclick="closeModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('modal');

function openModal() {
  modal.open();
}

function closeModal() {
  modal.close();
}

function handleOpened() {
  console.log('Modal abierto!');
  // Puedes enfocar un elemento aquí
}
</script>
```

### Evento: `closed`

Se ejecuta cuando el modal se cierra:

```html
<cu-button onclick="openModal()">Abrir Modal</cu-button>

<cu-modal id="modal" @closed="handleClosed">
  <p>Contenido del modal.</p>
  <div slot="footer">
    <cu-button onclick="closeModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('modal');

function openModal() {
  modal.open();
}

function closeModal() {
  modal.close();
}

function handleClosed() {
  console.log('Modal cerrado!');
  // Puedes limpiar formularios o resetear estados aquí
}
</script>
```

### Evento: `close`

Se ejecuta cuando se solicita cerrar el modal (antes de cerrarse):

```html
<cu-button onclick="openModal()">Abrir Modal</cu-button>

<cu-modal id="modal" @close="handleClose">
  <p>Contenido del modal.</p>
  <div slot="footer">
    <cu-button onclick="closeModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('modal');

function openModal() {
  modal.open();
}

function closeModal() {
  modal.close();
}

function handleClose() {
  console.log('Solicitud de cierre recibida');
  // Puedes mostrar un diálogo de confirmación aquí
}
</script>
```

## Ejemplos por Slot

### Slot: `default` (contenido principal)

Contenido principal del modal:

```html
<cu-button onclick="openModal()">Abrir</cu-button>

<cu-modal id="modal" title="Contenido Personalizado">
  <div class="space-y-4">
    <p>Este es el contenido principal del modal.</p>
    <p>Puedes poner cualquier HTML aquí.</p>
    <div class="bg-primary bg-opacity-10 p-4 rounded">
      <p>Incluso componentes anidados.</p>
    </div>
  </div>
  <div slot="footer">
    <cu-button onclick="closeModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('modal');
function openModal() { modal.open(); }
function closeModal() { modal.close(); }
</script>
```

### Slot: `footer`

Área para botones de acción:

```html
<cu-button onclick="openModal()">Abrir</cu-button>

<cu-modal id="modal" title="Con Footer">
  <p>Contenido del modal.</p>
  <div slot="footer" class="flex justify-end gap-2">
    <cu-button color="neutral" variant="ghost" onclick="closeModal()">
      Cancelar
    </cu-button>
    <cu-button color="primary" onclick="confirmAction()">
      Confirmar
    </cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('modal');

function openModal() { modal.open(); }
function closeModal() { modal.close(); }

function confirmAction() {
  console.log('Acción confirmada');
  modal.close();
}
</script>
```

## Casos de Uso Combinados

### Modal de confirmación

```html
<cu-button color="danger" onclick="showConfirm()">Eliminar</cu-button>

<cu-modal id="confirm-modal" title="Confirmar Eliminación" size="sm">
  <p>¿Estás seguro de que quieres eliminar este elemento?</p>
  <p class="text-sm text-charcoal-500 mt-2">
    Esta acción no se puede deshacer.
  </p>
  <div slot="footer" class="flex justify-end gap-2">
    <cu-button color="neutral" variant="outlined" onclick="cancelDelete()">
      Cancelar
    </cu-button>
    <cu-button color="danger" onclick="confirmDelete()">
      Sí, Eliminar
    </cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('confirm-modal');

function showConfirm() {
  modal.open();
}

function cancelDelete() {
  modal.close();
  console.log('Eliminación cancelada');
}

function confirmDelete() {
  modal.close();
  console.log('Elemento eliminado');
  // Lógica de eliminación aquí
}
</script>
```

### Modal con formulario

```html
<cu-button onclick="openForm()">Nuevo Contacto</cu-button>

<cu-modal id="form-modal" title="Formulario de Contacto" size="md" height="lg">
  <div class="flex flex-col gap-4">
    <div>
      <label class="block mb-2 text-sm font-medium">Nombre completo</label>
      <cu-input id="name" placeholder="Juan Pérez" />
    </div>
    
    <div>
      <label class="block mb-2 text-sm font-medium">Correo electrónico</label>
      <cu-input id="email" type="email" placeholder="juan@ejemplo.com" />
    </div>
    
    <div>
      <label class="block mb-2 text-sm font-medium">Teléfono</label>
      <cu-input id="phone" type="tel" placeholder="+1234567890" />
    </div>
  </div>
  
  <div slot="footer" class="flex justify-end gap-2">
    <cu-button color="neutral" variant="ghost" onclick="closeForm()">
      Cancelar
    </cu-button>
    <cu-button color="success" onclick="submitForm()">
      Guardar Contacto
    </cu-button>
  </div>
</cu-modal>

<script>
const formModal = document.getElementById('form-modal');

function openForm() {
  formModal.open();
}

function closeForm() {
  formModal.close();
}

function submitForm() {
  // Usar .get() para obtener valores de CuInput
  const data = {
    name: document.getElementById('name').get(),
    email: document.getElementById('email').get(),
    phone: document.getElementById('phone').get()
  };
  console.log('Formulario enviado:', data);
  formModal.close();
}
</script>
```

### Modal con formulario (usando CuInput - ejemplo completo)

```html
<cu-button onclick="openContactForm()">Abrir Formulario</cu-button>

<cu-modal id="contact-modal" title="Formulario de Contacto" size="md" height="lg">
  <div class="flex flex-col gap-4">
    <label class="text-sm font-medium">Nombre completo</label>
    <cu-input id="contact-name" placeholder="Juan Pérez" />

    <label class="text-sm font-medium">Correo electrónico</label>
    <cu-input id="contact-email" type="email" placeholder="juan@ejemplo.com" />

    <label class="text-sm font-medium">Mensaje</label>
    <cu-textarea id="contact-message" placeholder="Tu mensaje..." rows="3" />
  </div>
  
  <div slot="footer" class="flex justify-end gap-2">
    <cu-button color="neutral" variant="ghost" onclick="closeContactForm()">
      Cancelar
    </cu-button>
    <cu-button color="primary" onclick="submitContactForm()">
      Enviar
    </cu-button>
  </div>
</cu-modal>

<script>
const contactModal = document.getElementById('contact-modal');

function openContactForm() {
  contactModal.open();
}

function closeContactForm() {
  contactModal.close();
}

function submitContactForm() {
  // Obtener valores usando .get() expuesto por CuInput y CuTextarea
  const formData = {
    name: document.getElementById('contact-name').get(),
    email: document.getElementById('contact-email').get(),
    message: document.getElementById('contact-message').get()
  };
  console.log('Datos del formulario:', formData);
  
  // Limpiar formulario
  document.getElementById('contact-name').reset();
  document.getElementById('contact-email').reset();
  document.getElementById('contact-message').reset();
  
  contactModal.close();
}
</script>
```

### Modal con tabla

```html
<cu-button onclick="openTableModal()">Ver Datos</cu-button>

<cu-modal id="table-modal" title="Lista de Usuarios" size="xl" height="full">
  <cu-table
    :data="users"
    :columns="columns"
  />
  <div slot="footer">
    <cu-button color="neutral" onclick="closeTableModal()">
      Cerrar
    </cu-button>
  </div>
</cu-modal>

<script>
const tableModal = document.getElementById('table-modal');

const users = [
  { id: 1, name: 'Juan Pérez', email: 'juan@ejemplo.com', role: 'Admin' },
  { id: 2, name: 'María García', email: 'maria@ejemplo.com', role: 'User' },
  { id: 3, name: 'Carlos López', email: 'carlos@ejemplo.com', role: 'Editor' }
];

const columns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: 'Nombre' },
  { key: 'email', title: 'Correo' },
  { key: 'role', title: 'Rol' }
];

function openTableModal() {
  tableModal.open();
}

function closeTableModal() {
  tableModal.close();
}
</script>
```

### Modal anidado (abrir otro modal dentro)

```html
<cu-button onclick="openFirstModal()">Abrir Primer Modal</cu-button>

<cu-modal id="first-modal" title="Primer Modal" size="md">
  <p>Este es el primer modal.</p>
  <p>Puedes abrir un segundo modal desde aquí.</p>
  <cu-button onclick="openSecondModal()">Abrir Segundo Modal</cu-button>
  
  <div slot="footer">
    <cu-button color="neutral" onclick="closeFirstModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<cu-modal id="second-modal" title="Segundo Modal" size="sm">
  <p>Este es el segundo modal.</p>
  <p>Se abre sobre el primero.</p>
  
  <div slot="footer">
    <cu-button color="neutral" onclick="closeSecondModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const firstModal = document.getElementById('first-modal');
const secondModal = document.getElementById('second-modal');

function openFirstModal() {
  firstModal.open();
}

function closeFirstModal() {
  firstModal.close();
}

function openSecondModal() {
  secondModal.open();
}

function closeSecondModal() {
  secondModal.close();
}
</script>
```

### Modal con imagen

```html
<cu-button onclick="openImageModal()">Ver Imagen</cu-button>

<cu-modal id="image-modal" title="Imagen" size="lg">
  <img 
    src="https://via.placeholder.com/800x600"
    alt="Imagen de ejemplo"
    class="w-full h-auto rounded"
  />
  <p class="mt-4 text-center text-charcoal-500">
    Descripción de la imagen
  </p>
  <div slot="footer">
    <cu-button color="neutral" onclick="closeImageModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const imageModal = document.getElementById('image-modal');

function openImageModal() {
  imageModal.open();
}

function closeImageModal() {
  imageModal.close();
}
</script>
```

### Modal con pestañas

```html
<cu-button onclick="openTabsModal()">Abrir Modal con Pestañas</cu-button>

<cu-modal id="tabs-modal" title="Configuración" size="lg">
  <div class="flex border-b border-charcoal-200 mb-4">
    <button 
      id="tab-btn-profile"
      onclick="switchTab('profile')" 
      class="px-4 py-2 font-medium text-charcoal-500 tab-btn"
    >
      Perfil
    </button>
    <button 
      id="tab-btn-settings"
      onclick="switchTab('settings')" 
      class="px-4 py-2 font-medium text-charcoal-500 tab-btn"
    >
      Configuración
    </button>
    <button 
      id="tab-btn-notifications"
      onclick="switchTab('notifications')" 
      class="px-4 py-2 font-medium text-charcoal-500 tab-btn"
    >
      Notificaciones
    </button>
  </div>
  
  <div id="tab-content" class="p-2">
    <div id="tab-profile" class="space-y-2">
      <p>Contenido de Perfil</p>
    </div>
    <div id="tab-settings" class="space-y-2" style="display: none;">
      <p>Contenido de Configuración</p>
    </div>
    <div id="tab-notifications" class="space-y-2" style="display: none;">
      <p>Contenido de Notificaciones</p>
    </div>
  </div>
  
  <div slot="footer">
    <cu-button color="neutral" onclick="closeTabsModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const tabsModal = document.getElementById('tabs-modal');
let activeTab = 'profile';

function openTabsModal() {
  tabsModal.open();
}

function closeTabsModal() {
  tabsModal.close();
}

function switchTab(tab) {
  activeTab = tab;
  
  // Actualizar clases de botones
  document.getElementById('tab-btn-profile').className = 'px-4 py-2 font-medium text-charcoal-500 tab-btn';
  document.getElementById('tab-btn-settings').className = 'px-4 py-2 font-medium text-charcoal-500 tab-btn';
  document.getElementById('tab-btn-notifications').className = 'px-4 py-2 font-medium text-charcoal-500 tab-btn';
  document.getElementById(`tab-btn-${tab}`).className = 'px-4 py-2 font-medium border-b-2 border-primary text-primary tab-btn';
  
  // Ocultar todas las pestañas
  document.getElementById('tab-profile').style.display = 'none';
  document.getElementById('tab-settings').style.display = 'none';
  document.getElementById('tab-notifications').style.display = 'none';
  // Mostrar la pestaña seleccionada
  document.getElementById(`tab-${tab}`).style.display = 'block';
}
</script>

<style>
.tab-btn {
  border-bottom: 2px solid transparent;
}
</style>
```

### Modal sin header

```html
<cu-button onclick="openNoHeader()">Abrir sin Header</cu-button>

<cu-modal id="no-header-modal" title="">
  <h2 class="text-xl font-bold mb-4">Título personalizado</h2>
  <p>Contenido del modal sin el header predeterminado.</p>
  <p>Puedes crear tu propio header o no usarlo.</p>
  
  <div slot="footer">
    <cu-button color="neutral" onclick="closeNoHeader()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('no-header-modal');

function openNoHeader() {
  modal.open();
}

function closeNoHeader() {
  modal.close();
}
</script>
```

### Modal con eventos completos

```html
<cu-button onclick="openEventModal()">Abrir Modal</cu-button>

<cu-modal 
  id="event-modal" 
  title="Eventos del Modal"
  @opened="handleOpened"
  @closed="handleClosed"
  @close="handleClose"
>
  <p>Contenido del modal.</p>
  <p class="text-sm text-charcoal-500">
    Abre la consola para ver los eventos.
  </p>
  
  <div slot="footer">
    <cu-button color="neutral" onclick="closeEventModal()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('event-modal');

function openEventModal() {
  console.log('Abriendo modal...');
  modal.open();
}

function closeEventModal() {
  console.log('Cerrando modal...');
  modal.close();
}

function handleOpened() {
  console.log('Evento: opened - Modal abierto completamente');
}

function handleClosed() {
  console.log('Evento: closed - Modal cerrado completamente');
}

function handleClose() {
  console.log('Evento: close - Solicitud de cierre recibida');
}
</script>
```

## Comportamiento del Teclado

- **Escape**: Cierra el modal (a menos que `persistent` sea `true`)
- **Tab**: Navega entre elementos enfocables dentro del modal

## Accesibilidad

El componente incluye automáticamente:

- `role="dialog"` para lectores de pantalla
- `aria-modal="true"` para indicar que es un diálogo modal
- `aria-labelledby` apuntando al título (si existe)
- `aria-describedby` apuntando a la descripción (si existe)
- Manejo de foco cuando se abre/cierra
- Cierre con la tecla Escape (a menos que sea persistente)
- Click fuera cierra el modal (a menos que sea persistente)

## Personalización CSS

```css
/* Personalizar background del modal */
cu-modal .overlay {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
}

/* Personalizar border-radius del modal */
cu-modal div[role="dialog"] {
  --uno-border-radius: 0.75rem;
}

/* Personalizar sombra */
cu-modal div[role="dialog"] {
  --uno-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Personalizar padding */
cu-modal div[role="dialog"] header {
  padding: 1rem;
}

/* Personalizar z-index */
cu-modal {
  --uno-z-index: 1000;
}

/* Personalizar colores del header */
cu-modal div[role="dialog"] h2 {
  color: #1f2937;
}

cu-modal div[role="dialog"] p {
  color: #6b7280;
}
```

## Notas Técnicas

- El modal se renderiza en el DOM aunque esté cerrado (usando `v-show`), lo que permite mantener el estado de los componentes hijos.
- El modal usa `z-1000` para asegurarse de que aparezca sobre otros elementos.
- El backdrop (overlay) tiene `bg-black/30 backdrop-blur-sm` para un efecto de oscurecimiento y blur.
- Cuando `persistent` es `true`, ni el clic en el backdrop ni la tecla Escape cerrarán el modal.
- El botón de cierre (X) solo aparece si `persistent` es `false`.
- El modal es scrollable internamente si el contenido excede la altura máxima.

## Componentes Relacionados

- [Button](Button.md) - Para botones de acción en el footer
- [Input](Input.md) - Para campos de entrada en formularios dentro del modal
- [Textarea](Textarea.md) - Para áreas de texto en formularios
- [Badge](Badge.md) - Para mostrar status dentro del modal
- [Table](Table.md) - Para mostrar datos en formato de tabla dentro del modal
- [Alert](Alert.md) - Para mostrar mensajes de alerta dentro del modal
