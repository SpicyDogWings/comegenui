# Modal — `<cu-modal>` / `<Modal>`

Modal/diálogo con backdrop, animación, `size`/`height` y slot `footer`. Distingue el inicio del
cierre (`close`) del cierre completo (`closed`).

## Cuándo usarlo

Para confirmaciones, formularios cortos o contenido que necesita foco y bloquear el fondo. Para
paneles laterales usá `<cu-side-over>`; para menús contextuales, `<cu-dropdown-menu>`.

## Receta

1. Abrí/cerrá con los métodos `open()`, `close()`, `toggle()` o consultá `isOpen()`. **No hay prop
   `open`** ni `v-model`.
2. El cuerpo va por el slot default; los botones de acción en `#footer` (en vanilla,
   `slot="footer"`). Si no pasás footer, hay uno por defecto.
3. Definí `title` y `description`; el color de acento con `color`.
4. Controlá el ancho con `size` y el alto con `height`: `auto`, `sm`, `md`, `lg`, `xl` o `full`.
5. `persistent` bloquea el cierre por backdrop y `Escape` (útil para formularios). En ese caso el
   footer por defecto emite `cancel` y `accept`.
6. Escuchá `opened` (terminó de abrir), `close` (inicia el cierre) y `closed` (cierre completo).

```html
<!-- HTML plano (UMD) -->
<cu-modal id="confirm" title="Confirmar eliminación" description="¿Estás seguro?" size="md">
  <p>Esta acción no se puede deshacer.</p>
  <div slot="footer">
    <cu-button color="danger" variant="solid"
      onclick="document.getElementById('confirm').close()">Eliminar</cu-button>
    <cu-button variant="ghost"
      onclick="document.getElementById('confirm').close()">Cancelar</cu-button>
  </div>
</cu-modal>

<cu-button onclick="document.getElementById('confirm').open()">Abrir modal</cu-button>

<script src="dist/CuModal.umd.js"></script>
<script src="dist/CuButton.umd.js"></script>
<script>
  const m = document.getElementById('confirm');
  m.addEventListener('opened', () => console.log('modal abierto'));
  m.addEventListener('close', () => console.log('iniciando cierre'));
  m.addEventListener('closed', () => console.log('cierre completo'));
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Modal from "@/components/overlay/Modal.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const modal = ref<InstanceType<typeof Modal> | null>(null);
</script>

<template>
  <Modal
    ref="modal"
    title="Confirmar eliminación"
    description="¿Estás seguro?"
    size="md"
    @closed="() => console.log('cerrado')"
  >
    <p>Esta acción no se puede deshacer.</p>
    <template #footer>
      <Button color="danger" variant="solid" @click="modal?.close()">Eliminar</Button>
      <Button variant="ghost" @click="modal?.close()">Cancelar</Button>
    </template>
  </Modal>

  <Button @click="modal?.open()">Abrir modal</Button>
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`),
`size`/`height` (`auto`, `sm`, `md`, `lg`, `xl`, `full`), `title`, `description`, `persistent` y los
slots `icon`, `default` y `footer`. Emite `close`, `opened`, `closed`, `cancel`, `accept`; expone
`open`, `close`, `toggle` e `isOpen`.

**No puede:**

- **No hay prop `open` ni `v-model`.** La visibilidad sólo se maneja por métodos.
- **No tiene `variant` ni `theme`.** El acento se controla con `color`.
- **`cancel` y `accept` sólo salen del footer por defecto** (modo `persistent` sin `#footer`). Si
  pasás tu propio `#footer`, no se emiten.
- **Con `persistent` no hay botón X ni cierre por backdrop/Escape:** sólo se cierra por código o con
  el footer por defecto.
- **`close` y `closed` se emiten juntos** al cerrar (mismo watcher): no hay detección real del fin de
  una animación. `opened`, en cambio, sale al abrir.
- **No hay slots para `title`/`description`:** son props de texto.
- **No se puede customizar el backdrop.**
- `size` y `height` se parecen a un enum de botón, pero incluyen `auto` y `full`.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `size` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Ancho del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |
| `height` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Alto del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |
| `persistent` | `boolean` | `—` | Si es `true`, no se cierra con click en el backdrop ni con `Escape` |
| `title` | `string` | `—` | Título del modal (se muestra en la cabecera) |
| `description` | `string` | `—` | Descripción bajo el título (texto secundario) |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `close` | — | — |
| `opened` | — | — |
| `closed` | — | — |
| `cancel` | — | — |
| `accept` | — | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `icon` | — |
| `default` | — |
| `footer` | — |
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `open` | Abre el modal |
| `close` | Cierra el modal |
| `toggle` | Alterna visibilidad |
| `isOpen` | Devuelve el estado actual (`boolean`) |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `size` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | — |
| `title` | `string` | `""` | — |
| `height` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | — |
| `description` | `string` | `""` | — |
| `persistent` | `boolean` | `false` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `close` | — | — |
| `accept` | — | — |
| `opened` | — | — |
| `closed` | — | — |
| `cancel` | — | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `icon` | — |
| `default` | — |
| `footer` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `open` | Abre el modal. |
| `close` | Cierra el modal. |
| `toggle` | Alterna la visibilidad del modal. |
| `isOpen` | Devuelve true si el modal está abierto. |
<!-- /@api:expose -->
