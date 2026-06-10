# `<cu-alert>`

Alerta que puede abrirse, cerrarse y mostrarse con animación.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"soft"` | `solid`, `outlined`, `soft`, `subtle` |
| `close` | `boolean` | `false` | Muestra botón de cerrar |
| `title` | `string` | — | Título de la alerta |
| `show` | `boolean` | `true` | Controla visibilidad |
| `hightContrast` | `boolean` | `false` | Alto contraste |

## Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `close` | — | Se cierra la alerta |
| `open` | — | Se abre la alerta |

## Slots

| Slot | Descripción |
|------|-------------|
| `default` | Cuerpo de la alerta |
| `icon` | Ícono junto al título |

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.open()` | Abre la alerta |
| `.close()` | Cierra la alerta |
| `.toggle()` | Alterna visibilidad |
| `.isOpen` (getter) | Estado actual (`boolean`) |

## Uso en HTML plano

```html
<script src="dist/CuAlert.umd.js"></script>

<cu-alert color="success" variant="solid" title="Operación exitosa" close>
  Los datos se guardaron correctamente.
</cu-alert>

<cu-alert color="danger" variant="outlined" id="miAlerta">
  <template #icon>
    <svg><!-- icono --></svg>
  </template>
  Ha ocurrido un error.
</cu-alert>

<script>
  const alerta = document.getElementById('miAlerta');
  alerta.open();
  alerta.close();
  console.log(alerta.isOpen);
</script>
```
