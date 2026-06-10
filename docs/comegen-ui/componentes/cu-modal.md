# `<cu-modal>`

Modal/diálogo con backdrop, animación y slots para footer.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | `string` | `""` | Título del modal |
| `description` | `string` | `""` | Descripción bajo el título |
| `persistent` | `boolean` | `false` | No se cierra al hacer clic fuera |
| `size` | `string` | `"auto"` | `auto`, `sm`, `md`, `lg`, `xl`, `full` |
| `height` | `string` | `"auto"` | `auto`, `sm`, `md`, `lg`, `xl`, `full` |

## Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `close` | — | Se cierra el modal |
| `opened` | — | Se abre el modal |
| `closed` | — | Animación de cierre completada |

## Slots

| Slot | Descripción |
|------|-------------|
| `default` | Cuerpo del modal |
| `footer` | Pie del modal (botones de acción) |

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.open()` | Abre el modal |
| `.close()` | Cierra el modal |
| `.toggle()` | Alterna visibilidad |
| `.isOpen` (getter) | Estado actual (`boolean`) |

## Uso en HTML plano

```html
<script src="dist/CuModal.umd.js"></script>

<cu-modal title="Confirmar eliminación" description="¿Estás seguro?" id="modalConfirm">
  <p>Esta acción no se puede deshacer.</p>
  <template #footer>
    <cu-button color="danger" variant="solid"
      onclick="document.getElementById('modalConfirm').close()">
      Eliminar
    </cu-button>
    <cu-button variant="ghost"
      onclick="document.getElementById('modalConfirm').close()">
      Cancelar
    </cu-button>
  </template>
</cu-modal>

<button onclick="document.getElementById('modalConfirm').open()">
  Abrir modal
</button>
```

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
      <button onclick="closeModal()">Cancelar</button>
      <button onclick="handleAction()">Acción</button>
    </div>
  </cu-modal>

  <button onclick="openModal()">Abrir Modal</button>

  <script src="dist/CuModal.umd.js"></script>
  <script>
    function openModal() {
      document.getElementById('myModal').open();
    }
    function closeModal() {
      document.getElementById('myModal').close();
    }
    function handleAction() {
      alert('¡Acción!');
      closeModal();
    }
  </script>
</body>
</html>
```
