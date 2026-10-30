[← Volver](../README.md)

# `Modal`

Modal/diálogo con backdrop, animación, `color`, `size`/`height` y slots `icon`/`default`/`footer`.
Distingue el inicio del cierre (`close`) del final de la animación (`closed`).

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

En HTML plano, cargá el bundle `CuModal` (ver [ficha vanilla](/componentes/cu-modal)).

El modal no se monta ni se desmonta: se abre y se cierra con `open()`/`close()` sobre la `ref`.

## Colores

`color` tiñe el título y el acento de la cabecera (`--cu-color-{color}`).

```vue
<Modal color="primary" title="primary">...</Modal>
<Modal color="secondary" title="secondary">...</Modal>
<Modal color="neutral" title="neutral">...</Modal>
<Modal color="success" title="success">...</Modal>
<Modal color="warning" title="warning">...</Modal>
<Modal color="danger" title="danger">...</Modal>
```

## Tamaños

`size` controla el ancho máximo y `height`, el alto: cada uno acepta `auto` (**default**), `sm`,
`md`, `lg`, `xl` y `full`.

```vue
<Modal size="auto" title="Ancho auto (default)">...</Modal>
<Modal size="sm" title="Ancho sm">...</Modal>
<Modal size="md" title="Ancho md">...</Modal>
<Modal size="lg" title="Ancho lg">...</Modal>
<Modal size="xl" title="Ancho xl">...</Modal>
<Modal size="full" title="Ancho full">...</Modal>

<Modal size="md" height="auto" title="Alto auto (default)">...</Modal>
<Modal size="md" height="sm" title="Alto sm">...</Modal>
<Modal size="md" height="md" title="Alto md">...</Modal>
<Modal size="md" height="lg" title="Alto lg">...</Modal>
<Modal size="md" height="xl" title="Alto xl">...</Modal>
<Modal size="md" height="full" title="Alto full">...</Modal>
```

## Persistente

`persistent` saca la cruz de cierre y hace que el modal **no** se cierre con click en el backdrop
ni con `Escape`:

```vue
<script setup lang="ts">
import Modal from "@/components/overlay/Modal.vue";
import Input from "@/components/form/Input.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const modalForm = ref<InstanceType<typeof Modal> | null>(null);
const nombre = ref("");
</script>

<template>
  <Modal ref="modalForm" persistent title="Editar perfil">
    <Input v-model="nombre" placeholder="Nombre" />
    <template #footer>
      <Button variant="solid" @click="modalForm?.close()">Guardar</Button>
    </template>
  </Modal>
</template>
```

> En `persistent`, el footer por defecto muestra `Cancelar` y `Aceptar`, que emiten `cancel` y
> `accept`.

## Contenido y pie

`icon` va a la izquierda del título, `default` es el cuerpo y `footer` reemplaza los botones por
defecto.

```vue
<script setup lang="ts">
import Modal from "@/components/overlay/Modal.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const modal = ref<InstanceType<typeof Modal> | null>(null);
</script>

<template>
  <Modal ref="modal" title="Slots del modal" color="success">
    <template #icon>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </template>

    <p>Este es el slot <code>default</code>.</p>

    <template #footer>
      <Button variant="ghost" @click="modal?.close()">Cancelar</Button>
      <Button color="success" variant="solid" @click="modal?.close()">Confirmar</Button>
    </template>
  </Modal>
</template>
```

## Interacción

`opened` avisa al abrir; al cerrar se emiten `close` (arranca el cierre) y `closed` (terminó la
animación). `accept` y `cancel` sólo salen de los botones del footer por defecto.

```vue
<script setup lang="ts">
import Modal from "@/components/overlay/Modal.vue";
</script>

<template>
  <Modal
    title="Todos los eventos"
    @opened="() => console.log('modal abierto')"
    @close="() => console.log('iniciando cierre')"
    @closed="() => console.log('cierre completo')"
    @accept="() => console.log('aceptado')"
    @cancel="() => console.log('cancelado')"
  />
</template>
```

> Si el modal es `persistent`, no se emiten `close`/`closed`/`cancel` por click en backdrop o
> `Escape`: sólo cuando llamás a `.close()` programáticamente.

## API imperativa

`open()`, `close()`, `toggle()` e `isOpen()` se llaman sobre la `ref` del componente.

```vue
<script setup lang="ts">
import Modal from "@/components/overlay/Modal.vue";
import { ref } from "vue";

const modal = ref<InstanceType<typeof Modal> | null>(null);
</script>

<template>
  <Modal ref="modal" title="Control programático" />

  <button @click="modal?.open()">open()</button>
  <button @click="modal?.close()">close()</button>
  <button @click="modal?.toggle()">toggle()</button>
  <button @click="console.log(modal?.isOpen())">isOpen()</button>
</template>
```

## Ejemplo completo

```vue
<script setup lang="ts">
import Modal from "@/components/overlay/Modal.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const myModal = ref<InstanceType<typeof Modal> | null>(null);

function cleanUp() {
  console.log("Acción ejecutada");
  myModal.value?.close();
}
</script>

<template>
  <Modal ref="myModal" title="Mi Modal" description="Ventana de ejemplo">
    <div>Contenido del modal.</div>
    <template #footer>
      <Button variant="ghost" @click="myModal?.close()">Cancelar</Button>
      <Button color="primary" variant="solid" @click="cleanUp">Acción</Button>
    </template>
  </Modal>

  <Button color="primary" variant="solid" @click="myModal?.open()">Abrir Modal</Button>
</template>
```

## Accesibilidad y foco

El diálogo se anuncia con `role="dialog"` y `aria-modal="true"`. Con `title`, el nombre accesible
sale de ese título (`aria-labelledby`); sin `title` se usa `aria-label` (por defecto «Diálogo», o el
que pongas en el host). Un `aria-label` explícito siempre gana.

Al abrir, el foco entra al diálogo (primer control, o el `[autofocus]` del contenido) y queda
atrapado: `Tab` cicla entre los controles del modal y `Shift+Tab` retrocede, sin escaparse al resto
de la página. Al cerrar —con el botón, el backdrop o `Escape`— el foco vuelve al elemento que abrió
el modal.

```vue
<template>
  <!-- Sin `title`: el nombre accesible es el `aria-label` del host -->
  <Modal aria-label="Confirmar eliminación">
    <p>¿Seguro?</p>
  </Modal>
</template>
```

## Props

<!--@include: ../../partials/modal/props-vue.md-->

## Emits

<!--@include: ../../partials/modal/eventos-vue.md-->

> Si el modal es `persistent`, no se emiten `close`/`closed`/`cancel` por click en backdrop o `Escape`. Solo se emiten cuando llamás a `.close()` programáticamente.

## Slots

<!--@include: ../../partials/modal/slots.md-->

## Expose

<!--@include: ../../partials/modal/metodos-vue.md-->
