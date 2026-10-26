| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el valor actual (o `null` si el campo está vacío). |
| `set` | Setea el valor (clampeado a `min`/`max`) y emite `change`. |
| `reset` | Vacía el campo y emite `change` con `null`. |
| `focus` | Enfoca el campo. |
| `increment` | Incrementa el valor con el paso activo, respetando `max`. |
| `decrement` | Decrementa el valor con el paso activo, respetando `min`. |
