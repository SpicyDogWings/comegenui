# Alert - Componente de Alerta

**`<cu-alert>`** es un componente para mostrar mensajes de alerta con soporte para iconos, colores, variantes y botón de cierre. El componente maneja su propia visibilidad internamente.

## Importación

```html
<script src="../dist/vendor/vue-runtime.iife.js"></script>
<script src="../dist/cuAlert.umd.js"></script>
```

## Uso Básico

```html
<cu-alert title="Éxito" color="success" variant="soft" close>
  La operación se completó correctamente.
</cu-alert>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `color` | String | `neutral` | Color de la alerta. Opciones: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | String | `soft` | Variante de estilo. Opciones: `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `title` | String | - | Título de la alerta (opcional) |
| `close` | Boolean | `false` | Muestra el botón de cerrar |
| `show` | Boolean | `true` | Controla la visibilidad de la alerta |

## Slots

| Slot | Descripción |
|------|-------------|
| `icon` | Contenedor para iconos (se muestra a la izquierda del título) |
| `default` | Contenido principal de la alerta (descripción, texto, etc.) |

## Uso con Iconos

```html
<cu-alert title="Éxito" color="success" variant="soft" close>
  <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
  La operación se completó correctamente.
</cu-alert>
```

## Control de Visibilidad

El componente maneja su propia visibilidad internamente. Puedes usar los métodos expuestos para controlar el alert.

### Métodos Expuestos

| Método | Descripción |
|--------|-------------|
| `open()` | Muestra el alert |
| `close()` | Oculta el alert |
| `toggle()` | Alterna entre mostrar/ocultar |
| `isOpen` | Getter que devuelve `true` si el alert está visible |

### Uso con ref (Vue)

```vue
<script setup lang="ts">
import { ref } from "vue";
import Alert from "./components/Alert.ce.vue";

const alertRef = ref<InstanceType<typeof Alert> | null>(null);
</script>

<template>
  <Alert ref="alertRef" title="Información" color="primary" close />
  
  <button @click="alertRef?.open()">Abrir Alert</button>
  <button @click="alertRef?.close()">Cerrar Alert</button>
  <button @click="alertRef?.toggle()">Toggle Alert</button>
  
  <p>Estado: {{ alertRef?.isOpen ? 'Visible' : 'Oculto' }}</p>
</template>
```

### Uso con vanilla JS

```html
<cu-alert id="my-alert" title="Mensaje" color="warning" close></cu-alert>
<button id="open-btn">Abrir</button>
<button id="close-btn">Cerrar</button>
<button id="toggle-btn">Toggle</button>

<script>
const myAlert = document.getElementById("my-alert");

document.getElementById("open-btn").addEventListener("click", () => {
  myAlert.open();
});

document.getElementById("close-btn").addEventListener("click", () => {
  myAlert.close();
});

document.getElementById("toggle-btn").addEventListener("click", () => {
  myAlert.toggle();
});
</script>
```

### Sincronización con prop `show`

```vue
<Alert :show="isVisible" @update:show="isVisible = $event" title="Alert" />
```

## Eventos

| Evento | Descripción |
|--------|-------------|
| `close` | Se emite cuando el alert se cierra (por botón o método) |
| `open` | Se emite cuando el alert se abre (por método) |
| `update:show` | Se emite cuando cambia el estado interno (para v-model) |

### Ejemplo con eventos

```javascript
const alert = document.getElementById("my-alert");

alert.addEventListener("close", () => {
  console.log("Alert cerrado");
});

alert.addEventListener("open", () => {
  console.log("Alert abierto");
});

alert.addEventListener("update:show", (e) => {
  console.log("Estado cambiado:", e.detail);
});
```

## Variantes de Color y Estilo

### Color: Primary

```html
<cu-alert title="Información" color="primary" variant="solid" close>
  Mensaje informativo importante.
</cu-alert>

<cu-alert title="Información" color="primary" variant="soft" close>
  Mensaje informativo suave.
</cu-alert>

<cu-alert title="Información" color="primary" variant="subtle" close>
  Mensaje informativo sutil.
</cu-alert>

<cu-alert title="Información" color="primary" variant="outlined" close>
  Mensaje informativo con borde.
</cu-alert>

<cu-alert title="Información" color="primary" variant="ghost" close>
  Mensaje informativo transparente.
</cu-alert>
```

### Color: Success

```html
<cu-alert title="Éxito" color="success" variant="solid" close>
  Operación completada exitosamente.
</cu-alert>

<cu-alert title="Éxito" color="success" variant="soft" close>
  Operación completada con estilo suave.
</cu-alert>
```

### Color: Warning

```html
<cu-alert title="Advertencia" color="warning" variant="solid" close>
  Atención, esta acción no se puede deshacer.
</cu-alert>

<cu-alert title="Advertencia" color="warning" variant="subtle" close>
  Tenga cuidado con esta acción.
</cu-alert>
```

### Color: Danger

```html
<cu-alert title="Error" color="danger" variant="solid" close>
  Algo salió mal. Intente de nuevo.
</cu-alert>

<cu-alert title="Error" color="danger" variant="outlined" close>
  Error: No se pudo completar la operación.
</cu-alert>
```

### Color: Neutral

```html
<cu-alert title="Información" color="neutral" variant="soft">
  Mensaje neutral sin color destacado.
</cu-alert>

<cu-alert title="Información" color="neutral" variant="ghost">
  Mensaje con fondo transparente.
</cu-alert>
```

## Casos de Uso

### Alerta con auto-cierre

```html
<cu-alert id="auto-close-alert" title="Notificación" color="success" variant="soft" close>
  Esta alerta se cerrará en 3 segundos.
</cu-alert>

<script>
const alert = document.getElementById("auto-close-alert");
setTimeout(() => alert.close(), 3000);
</script>
```

### Múltiples alertas con controles

```html
<cu-alert id="alert1" title="Alerta 1" color="success" close></cu-alert>
<cu-alert id="alert2" title="Alerta 2" color="warning" close></cu-alert>
<cu-alert id="alert3" title="Alerta 3" color="danger" close></cu-alert>

<div class="flex gap-2">
  <cu-button onclick="alert1.open()">Mostrar 1</cu-button>
  <cu-button onclick="alert2.open()">Mostrar 2</cu-button>
  <cu-button onclick="alert3.open()">Mostrar 3</cu-button>
  <cu-button onclick="[alert1, alert2, alert3].forEach(a => a.close())">Cerrar Todas</cu-button>
</div>
```

### Alerta sin botón de cierre

```html
<cu-alert title="Información" color="primary" variant="soft">
  Este alert no tiene botón de cierre. Usa los métodos para controlarlo.
</cu-alert>
```

### Alerta sin título

```html
<cu-alert color="info" variant="soft" close>
  <p>Mensaje sin título, solo contenido.</p>
</cu-alert>
```

## Personalización

### Con contenido HTML

```html
<cu-alert color="success" variant="soft" close>
  <svg slot="icon">...</svg>
  <h3>Operación Exitosa</h3>
  <p>La operación <strong>finalizó</strong> correctamente a las <em>14:30</em>.</p>
</cu-alert>
```

### Estilos personalizados

```css
cu-alert {
  --uno-border-radius: 0.5rem;
}

cu-alert[color="primary"] {
  --uno-bg: #3b82f6;
}
```

## Componentes Relacionados

- [Button](Button.md) - Usado internamente para el botón de cierre
- [Badge](Badge.md) - Para mostrar indicadores junto a alertas
- [Modal](Modal.md) - Para diálogos modales
