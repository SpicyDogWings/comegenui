# `Alert`

Alerta con color semántico, título opcional y botón de cerrar. Puede controlarse por atributo `show` o programáticamente.

[← Volver](../README.md)

---

## Uso en Vue

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

## Ejemplo completo

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

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `title` | `string` | — | Título visible en la cabecera |
| `close` | `boolean` | — | Muestra el botón de cerrar (X) |
| `show` | `boolean` | `true` | Controla visibilidad. Cambiar este atributo emite `update:show` |

> **Atributos booleanos:** en HTML se usan sin valor: `<cu-alert close show>...`

## Emits

| Evento | Payload | Descripción |
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

## Expose

| Método | Descripción |
|------|------|
| `.open()` | Muestra la alerta |
| `.close()` | Oculta la alerta |
| `.toggle()` | Alterna visibilidad |
| `.isOpen()` | Devuelve `true`/`false` según la visibilidad actual |

El control también puede hacerse via el atributo `show` o escuchando los eventos `open`/`close`.
