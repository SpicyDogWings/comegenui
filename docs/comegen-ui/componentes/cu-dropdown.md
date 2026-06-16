# `<cu-dropdown>`

Menú desplegable con toggle, posicionamiento y slots para contenido personalizado.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"ghost"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `hightContrast` | `boolean` | `false` | Alto contraste |
| `label` | `string` | `""` | Texto del toggle |
| `placement` | `string` | `"bottom-start"` | `bottom-start`, `bottom-end`, `top-start`, `top-end` |
| `offset` | `number` | `4` | Gap entre toggle y menú (px) |

## Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `open` | — | Se abre el menú |
| `close` | — | Se cierra el menú |

## Slots

| Slot | Descripción |
|------|-------------|
| `default` | Contenido del menú desplegable |
| `toggle` | Reemplaza el botón toggle por defecto |

> **Importante:** Los slots en Custom Elements usan el atributo `slot="nombre"` en HTML plano. No uses `#nombre` (es sintaxis de Vue, no funciona con UMD).

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.open()` | Abre el menú |
| `.close()` | Cierra el menú |
| `.toggle()` | Alterna visibilidad |
| `.isOpen` (getter) | Estado actual (`boolean`) |

## Uso en HTML plano

```html
<script src="dist/CuDropdown.umd.js"></script>

<cu-dropdown label="Acciones" color="primary" variant="soft">
  <a href="/editar">Editar</a>
  <a href="/duplicar">Duplicar</a>
  <hr />
  <a href="/eliminar">Eliminar</a>
</cu-dropdown>

<cu-dropdown id="ddOpciones" color="danger" variant="outlined" placement="bottom-end">
  <button onclick="alert('Opción 1')">Opción 1</button>
  <button onclick="alert('Opción 2')">Opción 2</button>
</cu-dropdown>

<script>
  document.getElementById('ddOpciones').addEventListener('open', () => {
    console.log('Menú abierto');
  });
  document.getElementById('ddOpciones').addEventListener('close', () => {
    console.log('Menú cerrado');
  });
</script>
```

## Toggle personalizado

Reemplaza el botón por defecto usando `slot="toggle"`:

```html
<cu-dropdown id="ddCustom">
  <button slot="toggle"
          onclick="document.getElementById('ddCustom').toggle()"
          style="background:#3b82f6;color:white;border:none;border-radius:4px;padding:6px 12px;cursor:pointer">
    ☰ Menú
  </button>
  <a href="/perfil">Perfil</a>
  <a href="/config">Configuración</a>
  <a href="/logout">Cerrar sesión</a>
</cu-dropdown>
```

> **Nota:** Al usar un toggle personalizado, debes controlar la apertura/cierre manualmente, por ejemplo con `document.getElementById('id').toggle()`.

## Control programático

```html
<cu-dropdown id="ddAPI" label="Dropdown programático">
  <button onclick="console.log('Acción ejecutada')">Acción</button>
</cu-dropdown>

<script>
  const dd = document.getElementById('ddAPI');
  dd.open();                // Abre el menú
  dd.close();               // Cierra el menú
  dd.toggle();              // Alterna visibilidad
  console.log(dd.isOpen);   // true | false
</script>
```
