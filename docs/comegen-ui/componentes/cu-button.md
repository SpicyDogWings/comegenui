# `<cu-button>`

Botón con soporte de color, variante, link y estados.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"ghost"` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link` |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `hightContrast` | `boolean` | `false` | Alto contraste de texto |
| `to` | `string` | — | Si se especifica, renderiza un `<a>` (link) |
| `target` | `string` | `"_self"` | Target del link |

## Slots

| Slot | Descripción |
|------|-------------|
| `default` | Contenido del botón |

## Uso en HTML plano

```html
<script src="dist/CuButton.umd.js"></script>

<cu-button color="primary" variant="solid">Guardar</cu-button>
<cu-button color="danger" variant="outlined" disabled>Eliminar</cu-button>
<cu-button color="success" variant="soft">
  <svg><!-- icono --></svg>
  Aceptar
</cu-button>
<cu-button to="/inicio" variant="link">Volver al inicio</cu-button>
```

## Ejemplo completo

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Botones Demo</title>
</head>
<body>
  <cu-button color="primary" variant="solid" id="miBoton">
    Haz clic
  </cu-button>

  <script src="dist/CuButton.umd.js"></script>
  <script>
    document.getElementById('miBoton').addEventListener('click', () => {
      alert('¡Click!');
    });
  </script>
</body>
</html>
```
