# Modal - Componente de Diálogo Modal

**`<cu-modal>`** es un componente de diálogo modal accesible con soporte para tamaños personalizables, control de altura, manejo de teclado y slots para contenido flexible.

## Importación

```html
<script src="../dist/vendor/vue-runtime.iife.js"></script>
<script src="../dist/CuModal.umd.js"></script>
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

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | String | `""` | Título del modal. Se muestra en el header |
| `description` | String | `""` | Descripción opcional. Se muestra debajo del título |
| `persistent` | Boolean | `false` | Si es `true`, el modal no se cierra al hacer clic en el backdrop o presionar Escape |
| `size` | String | `"md"` | Ancho máximo del modal. Opciones: `sm`, `md`, `lg`, `xl`, `full` |
| `height` | String | `"auto"` | Altura máxima del modal. Opciones: `auto`, `sm`, `md`, `lg`, `xl`, `full` |

### Tamaños (size)

| Valor | Clase CSS | Descripción |
|-------|-----------|-------------|
| `sm` | `max-w-sm` | Modal pequeño |
| `md` | `max-w-md` | Modal mediano (por defecto) |
| `lg` | `max-w-lg` | Modal grande |
| `xl` | `max-w-xl` | Modal extra grande |
| `full` | `max-w-[90vw]` | Modal ancho completo (90% del viewport) |

### Alturas (height)

| Valor | Clase CSS | Descripción |
|-------|-----------|-------------|
| `auto` | `max-h-[90vh]` | Altura automática (hasta 90% del viewport) |
| `sm` | `max-h-[200px]` | 200px de altura máxima |
| `md` | `max-h-[300px]` | 300px de altura máxima |
| `lg` | `max-h-[400px]` | 400px de altura máxima |
| `xl` | `max-h-[500px]` | 500px de altura máxima |
| `full` | `max-h-[90vh]` | 90% del viewport height |

## Uso en Vue (SFC)

```vue
<script setup>
import { ref } from 'vue';
import Modal from './components/Modal.ce.vue';

const modalRef = ref(null);

function openModal() {
  modalRef.value?.open();
}
</script>

<template>
  <button @click="openModal">Abrir Modal</button>
  
  <Modal ref="modalRef" title="Mi Modal">
    <p>Contenido del modal.</p>
    <template #footer>
      <cu-button @click="modalRef?.close()">Cerrar</cu-button>
    </template>
  </Modal>
</template>
```

## Uso en HTML Plano

```html
<cu-button id="open-btn">Abrir Modal</cu-button>

<cu-modal id="my-modal" title="Confirmación" size="md" height="auto">
  <p>¿Estás seguro de que quieres continuar?</p>
  <div slot="footer">
    <cu-button color="neutral" onclick="cancel()">Cancelar</cu-button>
    <cu-button color="primary" onclick="confirm()">Confirmar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('my-modal');
const openBtn = document.getElementById('open-btn');

openBtn.addEventListener('click', () => modal.open());

function cancel() {
  modal.close();
  console.log('Acción cancelada');
}

function confirm() {
  modal.close();
  console.log('Acción confirmada');
}
</script>
```

## Slots

### Slot por defecto (contenido principal)

```html
<cu-modal title="Mi Modal">
  <!-- Contenido principal -->
  <p>Este es el contenido principal del modal.</p>
  <div>Puedes poner cualquier HTML aquí.</div>
</cu-modal>
```

### Slot footer

El slot `footer` se usa para botones de acción. En HTML plano, usa `slot="footer"`:

```html
<cu-modal title="Mi Modal">
  <p>Contenido del modal</p>
  <div slot="footer">
    <cu-button onclick=" handling()">Acción</cu-button>
  </div>
</cu-modal>
```

En Vue SFC, usa `<template #footer>`:

```vue
<Modal title="Mi Modal">
  <p>Contenido del modal</p>
  <template #footer>
    <cu-button @click="close()">Cerrar</cu-button>
  </template>
</Modal>
```

## Métodos Expuestos

El componente expone métodos para control programático:

### `open()`

Abre el modal.

```javascript
const modal = document.getElementById('my-modal');
modal.open();
```

### `close()`

Cierra el modal.

```javascript
const modal = document.getElementById('my-modal');
modal.close();
```

### `toggle()`

Alterna entre abierto y cerrado.

```javascript
const modal = document.getElementById('my-modal');
modal.toggle(); // Abre si está cerrado, cierra si está abierto
```

### `isOpen` (getter)

Obtiene el estado actual del modal.

```javascript
const modal = document.getElementById('my-modal');
console.log(modal.isOpen); // true o false
```

## Eventos

### Evento `opened`

Se emite cuando el modal se abre.

```html
<cu-modal id="modal" @opened="handleOpened">
  <p>Contenido</p>
</cu-modal>

<script>
function handleOpened() {
  console.log('Modal abierto');
}
</script>
```

### Evento `closed`

Se emite cuando el modal se cierra.

```html
<cu-modal id="modal" @closed="handleClosed">
  <p>Contenido</p>
</cu-modal>

<script>
function handleClosed() {
  console.log('Modal cerrado');
}
</script>
```

### Evento `close`

Se emite cuando se solicita cerrar el modal (antes de cerrarse).

```html
<cu-modal id="modal" @close="handleClose">
  <p>Contenido</p>
</cu-modal>

<script>
function handleClose() {
  console.log('Solicitud de cierre');
}
</script>
```

## Casos de Uso

### Modal de confirmación

```html
<cu-button onclick="showConfirm()">Eliminar</cu-button>

<cu-modal id="confirm-modal" title="Confirmar Eliminación" size="sm">
  <p>¿Estás seguro de que quieres eliminar este elemento?</p>
  <div slot="footer">
    <cu-button color="neutral" onclick="cancelDelete()">Cancelar</cu-button>
    <cu-button color="danger" onclick="confirmDelete()">Eliminar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('confirm-modal');

function showConfirm() {
  modal.open();
}

function cancelDelete() {
  modal.close();
}

function confirmDelete() {
  modal.close();
  // Lógica de eliminación aquí
  console.log('Elemento eliminado');
}
</script>
```

### Modal con formulario

```html
<cu-button onclick="openForm()">Nuevo Contacto</cu-button>

<cu-modal id="form-modal" title="Formulario de Contacto" size="md" height="lg">
  <div class="flex flex-col gap-4">
    <cu-input id="name" placeholder="Nombre completo" />
    <cu-input id="email" type="email" placeholder="Correo electrónico" />
    <cu-textarea id="message" placeholder="Mensaje" rows="3" />
  </div>
  <div slot="footer">
    <cu-button color="neutral" onclick="closeForm()">Cancelar</cu-button>
    <cu-button color="success" onclick="submitForm()">Enviar</cu-button>
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
  // Usar .get() para obtener valores de CuInput y CuTextarea
  const data = {
    name: document.getElementById('name').get(),
    email: document.getElementById('email').get(),
    message: document.getElementById('message').get()
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
  </div>
  <div slot="footer" class="flex justify-end gap-2">
    <cu-button color="neutral" variant="ghost" onclick="closeContactForm()">Cancelar</cu-button>
    <cu-button color="primary" onclick="submitContactForm()">Enviar</cu-button>
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
  // Obtener valores usando .get() expuesto por CuInput
  const formData = {
    name: document.getElementById('contact-name').get(),
    email: document.getElementById('contact-email').get()
  };
  console.log('Datos del formulario:', formData);
  contactModal.close();
}
</script>
```

### Modal persistente (no se cierra con Escape o clic fuera)

```html
<cu-button onclick="openPersistent()">Abrir Modal Persistente</cu-button>

<cu-modal id="persistent-modal" title="Importante" persistent>
  <p>Este modal no se cerrará al presionar Escape o hacer clic fuera.</p>
  <p>Debes usar el botón de cerrar.</p>
  <div slot="footer">
    <cu-button onclick="closePersistent()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('persistent-modal');

function openPersistent() {
  modal.open();
}

function closePersistent() {
  modal.close();
}
</script>
```

### Modal con todas las opciones de tamaño

```html
<div class="flex gap-2 flex-wrap">
  <cu-button onclick="openSize('sm')">SM</cu-button>
  <cu-button onclick="openSize('md')">MD</cu-button>
  <cu-button onclick="openSize('lg')">LG</cu-button>
  <cu-button onclick="openSize('xl')">XL</cu-button>
  <cu-button onclick="openSize('full')">FULL</cu-button>
</div>

<cu-modal id="size-modal" title="Modal de Tamaño">
  <p>Este modal muestra el tamaño seleccionado.</p>
  <div slot="footer">
    <cu-button onclick="closeSize()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('size-modal');

function openSize(size) {
  modal.setAttribute('size', size);
  modal.open();
}

function closeSize() {
  modal.close();
}
</script>
```

### Modal con todas las opciones de altura

```html
<div class="flex gap-2 flex-wrap">
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
  </div>
  <div slot="footer">
    <cu-button onclick="closeHeight()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('height-modal');

function openHeight(height) {
  modal.setAttribute('height', height);
  modal.open();
}

function closeHeight() {
  modal.close();
}
</script>
```

### Modal con descripción

```html
<cu-button onclick="openWithDesc()">Abrir con Descripción</cu-button>

<cu-modal 
  id="desc-modal"
  title="Título del Modal"
  description="Esta es una descripción detallada del propósito del modal."
>
  <p>Contenido del modal.</p>
  <div slot="footer">
    <cu-button onclick="closeDesc()">Cerrar</cu-button>
  </div>
</cu-modal>

<script>
const modal = document.getElementById('desc-modal');

function openWithDesc() {
  modal.open();
}

function closeDesc() {
  modal.close();
}
</script>
```

### Modal sin header

```html
<cu-button onclick="openNoHeader()">Abrir sin Header</cu-button>

<cu-modal id="no-header-modal" title="">
  <h2 class="text-xl font-bold mb-4">Título personalizado</h2>
  <p>Contenido del modal sin el header predeterminado.</p>
  <div slot="footer">
    <cu-button onclick="closeNoHeader()">Cerrar</cu-button>
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

## Comportamiento del Teclado

- **Escape**: Cierra el modal (a menos que `persistent` sea `true`)
- **Tab**: Navega entre elementos enfocables dentro del modal

## Accesibilidad

El componente incluye automáticamente:

- `role="dialog"` para lectores de pantalla
- `aria-modal="true"` para indicar que es un diálogo modal
- `aria-labelledby` apuntando al título
- `aria-describedby` apuntando a la descripción (si existe)
- Manejo de foco cuando se abre/cierra
- Cierre con la tecla Escape

## Estilos CSS

Para personalizar el modal globalmente:

```css
cu-modal {
  --uno-bg: #ffffff;
  --uno-border-radius: 0.5rem;
}

cu-modal .overlay {
  --uno-bg-opacity: 0.5;
  --uno-backdrop-blur: 4px;
}
```

## Componentes Relacionados

- [Button](Button.md) - Para botones de acción en el footer
- [Input](Input.md) - Para campos de entrada en formularios dentro del modal
- [Textarea](Textarea.md) - Para áreas de texto en formularios
- [Badge](Badge.md) - Para mostrar status dentro del modal
- [Table](Table.md) - Para mostrar datos en formato de tabla dentro del modal
