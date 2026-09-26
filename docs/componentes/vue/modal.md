# `Modal`

Modal/diálogo con backdrop, animación, soporte para `size`/`height` y slot `footer`. Distingue entre el evento de inicio de cierre (`close`) y la animación de cierre completa (`closed`).

[← Volver](../README.md)

---

## Uso en Vue

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

## Sizes

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

## Modal persistente

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

## Escuchar eventos

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

## Ejemplo completo

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

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `title` | `string` | — | Título del modal (se muestra en la cabecera) |
| `description` | `string` | — | Descripción bajo el título (texto secundario) |
| `persistent` | `boolean` | — | Si es `true`, no se cierra con click en el backdrop ni con `Escape` |
| `size` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Ancho del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |
| `height` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Alto del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |

## Emits

| Evento | Payload | Descripción |
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

## Expose

| Método | Descripción |
|------|------|
| `.open()` | Abre el modal |
| `.close()` | Cierra el modal |
| `.toggle()` | Alterna visibilidad |
| `.isOpen()` | Devuelve el estado actual (`boolean`) |
