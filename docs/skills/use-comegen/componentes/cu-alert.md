# `<cu-alert>`

Alerta con color semántico, título opcional y botón de cerrar. Puede controlarse por atributo `show` o programáticamente.

[← Volver](../SKILL.md)

---

---

## Uso en HTML plano

```html
<script src="dist/CuAlert.umd.js"></script>

<cu-alert color="success" variant="solid" title="Operación exitosa" close>
  Los datos se guardaron correctamente.
</cu-alert>

<cu-alert color="danger" variant="outlined" id="miAlerta">
  <span slot="icon">
    <svg><!-- icono --></svg>
  </span>
  Ha ocurrido un error.
</cu-alert>

<script>
  const alerta = document.getElementById('miAlerta');
  alerta.show = true;   // mostrar
  alerta.show = false;  // ocultar

  alerta.addEventListener('update:show', (e) => {
    console.log('show es ahora:', e.detail);
  });
</script>
```

---

## Ejemplo completo

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Alerts Demo</title>
</head>
<body>
  <button id="btnMostrar">Mostrar alerta</button>
  <button id="btnOcultar">Ocultar alerta</button>

  <cu-alert id="miAlerta" color="warning" title="Atención" close show>
    Este es un mensaje de advertencia.
  </cu-alert>

  <script src="dist/CuAlert.umd.js"></script>
  <script>
    const alerta = document.getElementById('miAlerta');
    document.getElementById('btnMostrar').onclick = () => alerta.show = true;
    document.getElementById('btnOcultar').onclick = () => alerta.show = false;

    alerta.addEventListener('close', () => console.log('Alerta cerrada'));
  </script>
</body>
</html>
```

---

## Vista Vue

### Uso en Vue

```vue
<script setup lang="ts">
import Alert from "@/components/information/Alert.vue";
import { ref } from "vue";

const show = ref(true);
</script>

<template>
  <Alert
    v-model:show="show"
    color="success"
    variant="solid"
    title="Operación exitosa"
    close
  >
    Los datos se guardaron correctamente.
  </Alert>

  <Alert color="danger" variant="outlined">
    <template #icon>
      <svg><!-- icono --></svg>
    </template>
    Ha ocurrido un error.
  </Alert>
</template>
```

### Ejemplo completo

```vue
<script setup lang="ts">
import Alert from "@/components/information/Alert.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const show = ref(true);

function onClose() {
  console.log("Alerta cerrada");
}
</script>

<template>
  <Button @click="show = true">Mostrar alerta</Button>
  <Button @click="show = false">Ocultar alerta</Button>

  <Alert v-model:show="show" color="warning" title="Atención" close @close="onClose">
    Este es un mensaje de advertencia.
  </Alert>
</template>
```

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"neutral" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `title` | `string` | — | Título visible en la cabecera |
| `close` | `boolean` | — | Muestra el botón de cerrar (X) |
| `show` | `boolean` | `true` | Controla visibilidad. Cambiar este atributo emite `update:show` |

> **Atributos booleanos:** en HTML se usan sin valor: `<cu-alert close show>...`

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `close` | — | Se emite cuando se cierra la alerta (vía botón X) |
| `open` | — | Se emite cuando la alerta pasa a mostrarse |
| `update:show` | `boolean` | Se emite cuando cambia `show` (vía prop o interacción) |

> Los eventos custom se escuchan con `addEventListener` y el payload está en `e.detail`.

## Slots

| Slot | Descripción |
|------|------|
| `icon` | Ícono junto al título (slot HTML nativo) |
| `default` | Cuerpo principal de la alerta |

```html
<cu-alert color="success" title="Listo">
  <span slot="icon">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  </span>
  Operación completada.
</cu-alert>
```

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.open()` | Muestra la alerta |
| `.close()` | Oculta la alerta |
| `.toggle()` | Alterna visibilidad |
| `.isOpen()` | Devuelve `true`/`false` según la visibilidad actual |

El control también puede hacerse via el atributo `show` o escuchando los eventos `open`/`close`.
