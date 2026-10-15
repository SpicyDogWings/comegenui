[← Volver](../README.md)

# `FloatingButton`

Botón flotante (FAB) fijo en la esquina inferior derecha. Es un `Button` (hereda color, variante, tamaño y estados) posicionado de forma flotante. Pensado para acciones primarias rápidas (agregar, flotante de guardar, etc.). Normalmente se usa con un ícono en el slot.

## Uso en Vue

```vue
<script setup lang="ts">
import FloatingButton from "@/components/buttons/FloatingButton.vue";

function onClick() {
  console.log("FAB clickeado");
}
</script>

<template>
  <FloatingButton color="primary" @click="onClick">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  </FloatingButton>
</template>
```

> Es `position: fixed` en la esquina inferior derecha (`bottom` y `right`: `var(--cu-space-lg)`), con `z-index: 1000` y sombra elevada. El contenido (normalmente un SVG) debe usar `stroke="currentColor"` para heredar el color; el `click` es el evento nativo.

## Colores

`color` es el color semántico del FAB (`primary` es el default) y se resuelve con los tokens del tema activo.

```vue
<FloatingButton color="primary" variant="solid" size="sm"><svg><!-- ícono --></svg></FloatingButton>
<FloatingButton color="secondary" variant="solid" size="sm"><svg><!-- ícono --></svg></FloatingButton>
<FloatingButton color="neutral" variant="solid" size="sm"><svg><!-- ícono --></svg></FloatingButton>
<FloatingButton color="success" variant="solid" size="sm"><svg><!-- ícono --></svg></FloatingButton>
<FloatingButton color="warning" variant="solid" size="sm"><svg><!-- ícono --></svg></FloatingButton>
<FloatingButton color="danger" variant="solid" size="sm"><svg><!-- ícono --></svg></FloatingButton>
```

## Variantes y tamaños

`variant` y `size` se heredan de `Button`: las 7 variantes (`solid` es el default) y los 3 tamaños (`lg` es el default).

```vue
<FloatingButton variant="solid" color="primary" size="md"><svg><!-- ícono --></svg></FloatingButton>
<FloatingButton variant="outlined" color="primary" size="md"><svg><!-- ícono --></svg></FloatingButton>
<FloatingButton variant="soft" color="primary" size="md"><svg><!-- ícono --></svg></FloatingButton>
<FloatingButton variant="ghost" color="primary" size="md"><svg><!-- ícono --></svg></FloatingButton>
<FloatingButton variant="subtle" color="primary" size="md"><svg><!-- ícono --></svg></FloatingButton>
<FloatingButton variant="link" color="primary" size="md"><svg><!-- ícono --></svg></FloatingButton>
<FloatingButton variant="none" color="primary" size="md"><svg><!-- ícono --></svg></FloatingButton>

<FloatingButton size="sm" color="primary" variant="solid"><svg><!-- ícono --></svg></FloatingButton>
<FloatingButton size="md" color="primary" variant="solid"><svg><!-- ícono --></svg></FloatingButton>
<FloatingButton size="lg" color="primary" variant="solid"><svg><!-- ícono --></svg></FloatingButton>
```

> No fija tamaño ni forma: hereda de `Button` el `padding`, el `size` y el `border-radius`, y crece con su contenido.

## Estados

`disabled` atenúa el FAB y bloquea el click; `loading` lo deshabilita igual y antepone un spinner mientras está activo.

```vue
<FloatingButton disabled color="neutral" variant="soft" size="sm"><svg><!-- ícono --></svg></FloatingButton>
<FloatingButton loading color="primary" variant="solid" size="sm"><svg><!-- ícono --></svg></FloatingButton>
```

## Props

<!--@include: ../../partials/floating-button/props.md-->

## Emits

<!--@include: ../../partials/floating-button/eventos.md-->

## Slots

<!--@include: ../../partials/floating-button/slots.md-->

## Expose

<!--@include: ../../partials/floating-button/metodos.md-->
