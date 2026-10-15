[← Volver](../README.md)

# `<cu-modal>`

Modal/diálogo con backdrop, animación, `color`, `size`/`height` y slots `icon`/`default`/`footer`.
Distingue el inicio del cierre (`close`) del final de la animación (`closed`).

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuModal.umd.js"></script>

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

<!-- demo:modal-uso -->

El modal no se monta ni se desmonta: se abre y se cierra con `open()`/`close()`. El contenido va
en el slot `default` y la cabecera se arma con `title` + `description`.

## Colores

`color` tiñe el título y el acento de la cabecera (`--cu-color-{color}`).

```html
<cu-modal color="primary" title="primary">...</cu-modal>
<cu-modal color="secondary" title="secondary">...</cu-modal>
<cu-modal color="neutral" title="neutral">...</cu-modal>
<cu-modal color="success" title="success">...</cu-modal>
<cu-modal color="warning" title="warning">...</cu-modal>
<cu-modal color="danger" title="danger">...</cu-modal>
```

<!-- demo:modal-colores -->

## Tamaños

`size` controla el ancho máximo y `height`, el alto: cada uno acepta `auto` (**default**), `sm`,
`md`, `lg`, `xl` y `full`.

```html
<cu-modal size="auto" title="Ancho auto (default)">...</cu-modal>
<cu-modal size="sm" title="Ancho sm">...</cu-modal>
<cu-modal size="md" title="Ancho md">...</cu-modal>
<cu-modal size="lg" title="Ancho lg">...</cu-modal>
<cu-modal size="xl" title="Ancho xl">...</cu-modal>
<cu-modal size="full" title="Ancho full">...</cu-modal>

<cu-modal size="md" height="auto" title="Alto auto (default)">...</cu-modal>
<cu-modal size="md" height="sm" title="Alto sm">...</cu-modal>
<cu-modal size="md" height="md" title="Alto md">...</cu-modal>
<cu-modal size="md" height="lg" title="Alto lg">...</cu-modal>
<cu-modal size="md" height="xl" title="Alto xl">...</cu-modal>
<cu-modal size="md" height="full" title="Alto full">...</cu-modal>
```

<!-- demo:modal-sizes -->

## Persistente

`persistent` saca la cruz de cierre y hace que el modal **no** se cierre con click en el backdrop
ni con `Escape`: los datos de un formulario no se pierden por un click accidental.

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

<!-- demo:modal-persistente -->

> En `persistent`, el footer por defecto muestra `Cancelar` y `Aceptar`, que emiten `cancel` y
> `accept`.

## Contenido y pie

`icon` va a la izquierda del título, `default` es el cuerpo y `footer` reemplaza los botones por
defecto.

```html
<cu-modal id="modalSlots" title="Slots del modal" color="success">
  <svg slot="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>

  <p>Este es el slot <code>default</code>.</p>

  <div slot="footer">
    <cu-button variant="ghost" onclick="document.getElementById('modalSlots').close()">
      Cancelar
    </cu-button>
    <cu-button color="success" variant="solid" onclick="document.getElementById('modalSlots').close()">
      Confirmar
    </cu-button>
  </div>
</cu-modal>
```

<!-- demo:modal-slots -->

## Interacción

`opened` avisa al abrir; al cerrar se emiten `close` (arranca el cierre) y `closed` (terminó la
animación). `accept` y `cancel` sólo salen de los botones del footer por defecto.

```html
<cu-modal id="modalEventos" title="Todos los eventos">...</cu-modal>

<script>
  const modal = document.getElementById('modalEventos');

  modal.addEventListener('opened', () => console.log('modal abierto'));
  modal.addEventListener('close', () => console.log('iniciando cierre'));
  modal.addEventListener('closed', () => console.log('cierre completo'));
  modal.addEventListener('accept', () => console.log('aceptado'));
  modal.addEventListener('cancel', () => console.log('cancelado'));
</script>
```

<!-- demo:modal-eventos -->

> Si el modal es `persistent`, no se emiten `close`/`closed`/`cancel` por click en backdrop o
> `Escape`: sólo cuando llamás a `.close()` programáticamente.

## API imperativa

`open()` abre, `close()` cierra, `toggle()` alterna y `isOpen()` devuelve el estado actual.

```html
<cu-modal id="modalProgramatico" title="Control programático">...</cu-modal>

<script>
  const modal = document.getElementById('modalProgramatico');

  modal.open();            // open()
  modal.close();           // close()
  modal.toggle();          // toggle()
  console.log(modal.isOpen()); // isOpen() → true | false
</script>
```

<!-- demo:modal-metodos -->

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

  <script src="dist-libs/umd-core/CuModal.umd.js"></script>
  <script src="dist-libs/umd-core/CuButton.umd.js"></script>
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

<!-- demo:modal-completo -->

## Atributos

<!--@include: ../partials/modal/props-vanilla.md-->

> El Custom Element **no expone** prop `variant` ni `theme`. El estilo se controla con `color`.

## Eventos

<!--@include: ../partials/modal/eventos-vanilla.md-->

> Si el modal es `persistent`, no se emiten `close`/`closed`/`cancel` por click en backdrop o `Escape`. Solo se emiten cuando llamás a `.close()` programáticamente.

## Slots

<!--@include: ../partials/modal/slots.md-->

## Métodos expuestos

<!--@include: ../partials/modal/metodos-vanilla.md-->
