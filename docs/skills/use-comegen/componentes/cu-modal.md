# `<cu-modal>`

Modal/diálogo con backdrop, animación, soporte para `size`/`height` y slot `footer`. Distingue entre el evento de inicio de cierre (`close`) y la animación de cierre completa (`closed`).

[← Volver](../SKILL.md)

---

## Uso en HTML plano

```html
<script src="dist/CuModal.umd.js"></script>

<cu-modal id="modalConfirm" title="Confirmar eliminación" description="¿Estás seguro?" size="md">
  <p>Esta acción no se puede deshacer.</p>

  <div slot="footer">
    <cu-button color="danger" variant="solid"
      onclick="document.getElementById('modalConfirm').close()">
      Eliminar
    </cu-button>
    <cu-button variant="ghost"
      onclick="document.getElementById('modalConfirm').close()">
      Cancelar
    </cu-button>
  </div>
</cu-modal>

<button onclick="document.getElementById('modalConfirm').open()">
  Abrir modal
</button>
```

---

## Sizes

```html
<cu-modal size="sm" title="Pequeño">...</cu-modal>
<cu-modal size="md" title="Mediano">...</cu-modal>
<cu-modal size="lg" title="Grande">...</cu-modal>
<cu-modal size="xl" title="Extra grande">...</cu-modal>
<cu-modal size="full" title="Pantalla completa">...</cu-modal>
```

`size` controla el ancho; `height` controla el alto. Aceptan los mismos valores.

---

## Modal persistente

Útil para formularios donde no querés perder datos por un click accidental:

```html
<cu-modal id="modalForm" persistent title="Editar perfil">
  <cu-input placeholder="Nombre"></cu-input>
  <div slot="footer">
    <cu-button variant="solid"
      onclick="document.getElementById('modalForm').close()">
      Guardar
    </cu-button>
  </div>
</cu-modal>
```

---

## Escuchar eventos

```js
const modal = document.getElementById('modalConfirm');

modal.addEventListener('opened', () => console.log('modal abierto'));
modal.addEventListener('close', () => console.log('iniciando cierre'));
modal.addEventListener('closed', () => console.log('cierre completo'));
```

---

## Ejemplo completo

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Modal Demo</title>
</head>
<body>
  <cu-modal id="myModal" title="Mi Modal" description="Ventana de ejemplo">
    <div>Contenido del modal.</div>
    <div slot="footer">
      <cu-button variant="ghost" onclick="closeModal()">Cancelar</cu-button>
      <cu-button color="primary" variant="solid" onclick="handleAction()">Acción</cu-button>
    </div>
  </cu-modal>

  <cu-button color="primary" variant="solid" onclick="openModal()">Abrir Modal</cu-button>

  <script src="dist/CuModal.umd.js"></script>
  <script src="dist/CuButton.umd.js"></script>
  <script>
    const m = document.getElementById('myModal');
    function openModal() { m.open(); }
    function closeModal() { m.close(); }
    function handleAction() {
      console.log('Acción ejecutada');
      m.close();
    }
  </script>
</body>
</html>
```

---

## Vista Vue

### Uso en Vue

```vue
<script setup lang="ts">
import Modal from "@/components/overlay/Modal.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const modalConfirm = ref<InstanceType<typeof Modal> | null>(null);
</script>

<template>
  <Modal ref="modalConfirm" title="Confirmar eliminación" description="¿Estás seguro?" size="md">
    <p>Esta acción no se puede deshacer.</p>

    <template #footer>
      <Button color="danger" variant="solid" @click="modalConfirm?.close()">Eliminar</Button>
      <Button variant="ghost" @click="modalConfirm?.close()">Cancelar</Button>
    </template>
  </Modal>

  <Button @click="modalConfirm?.open()">Abrir modal</Button>
</template>
```

### Sizes

```vue
<script setup lang="ts">
import Modal from "@/components/overlay/Modal.vue";
</script>

<template>
  <Modal size="sm" title="Pequeño">...</Modal>
  <Modal size="md" title="Mediano">...</Modal>
  <Modal size="lg" title="Grande">...</Modal>
  <Modal size="xl" title="Extra grande">...</Modal>
  <Modal size="full" title="Pantalla completa">...</Modal>
</template>
```

`size` controla el ancho; `height` controla el alto. Aceptan los mismos valores.

### Modal persistente

Útil para formularios donde no querés perder datos por un click accidental:

```vue
<script setup lang="ts">
import Modal from "@/components/overlay/Modal.vue";
import Input from "@/components/form/Input.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const modalForm = ref<InstanceType<typeof Modal> | null>(null);
</script>

<template>
  <Modal ref="modalForm" persistent title="Editar perfil">
    <Input placeholder="Nombre"></Input>
    <template #footer>
      <Button variant="solid" @click="modalForm?.close()">Guardar</Button>
    </template>
  </Modal>
</template>
```

### Escuchar eventos

```vue
<script setup lang="ts">
import Modal from "@/components/overlay/Modal.vue";
</script>

<template>
  <Modal
    @opened="() => console.log('modal abierto')"
    @close="() => console.log('iniciando cierre')"
    @closed="() => console.log('cierre completo')"
  />
</template>
```

### Ejemplo completo

```vue
<script setup lang="ts">
import Modal from "@/components/overlay/Modal.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const myModal = ref<InstanceType<typeof Modal> | null>(null);

function openModal() { myModal.value?.open(); }
function closeModal() { myModal.value?.close(); }
function handleAction() {
  console.log('Acción ejecutada');
  myModal.value?.close();
}
</script>

<template>
  <Modal ref="myModal" title="Mi Modal" description="Ventana de ejemplo">
    <div>Contenido del modal.</div>
    <template #footer>
      <Button variant="ghost" @click="closeModal">Cancelar</Button>
      <Button color="primary" variant="solid" @click="handleAction">Acción</Button>
    </template>
  </Modal>

  <Button color="primary" variant="solid" @click="openModal">Abrir Modal</Button>
</template>
```

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `title` | `string` | — | Título del modal (se muestra en la cabecera) |
| `description` | `string` | — | Descripción bajo el título (texto secundario) |
| `persistent` | `boolean` | — | Si es `true`, no se cierra con click en el backdrop ni con `Escape` |
| `size` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Ancho del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |
| `height` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Alto del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |

> El Custom Element **no expone** prop `variant` ni `theme`. El estilo se controla con `color`.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `close` | — | Se inicia el cierre (click en backdrop, Escape, llamada a `.close()`) |
| `opened` | — | El modal pasó a `isOpen = true` (animación de apertura completa) |
| `closed` | — | La animación de cierre terminó y `isOpen = false` |
| `cancel` | — | Se emite con el footer por defecto de un modal `persistent` al pulsar "Cancelar" (luego cierra el modal) |
| `accept` | — | Se emite con el footer por defecto de un modal `persistent` al pulsar "Aceptar" (luego cierra el modal) |

> Si el modal es `persistent`, no se emiten `close`/`closed`/`cancel` por click en backdrop o `Escape`. Solo se emiten cuando llamás a `.close()` programáticamente.

## Slots

| Slot | Descripción |
|------|------|
| `icon` | Ícono en la cabecera (junto al título) |
| `default` | Cuerpo del modal |
| `footer` | Pie del modal (típicamente botones de acción) |

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.open()` | Abre el modal |
| `.close()` | Cierra el modal |
| `.toggle()` | Alterna visibilidad |
| `.isOpen()` | Devuelve el estado actual (`boolean`) |
