| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:open` | `boolean` | Estado nuevo. Se emite en cada cambio: `show()`, `close()`, `toggle()`, backdrop, `Escape` y botón de cerrar. |
| `close` | — | Se emite al cerrarse el panel, incluso cuando el cierre viene de `close()`. Una sola vez por cierre. |
