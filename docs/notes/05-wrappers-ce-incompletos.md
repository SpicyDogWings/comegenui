# Wrappers CE incompletos (Avatar `src` y CommandPalette `commands`)

Hallazgos durante la auditoría del 2026-09-07 (agregado de los 7 componentes faltantes a la skill de uso).

## `cu-avatar` — prop `src` no se forwardea

`Avatar.ce.vue` declara `src` en `defineProps` pero en el `<template>` solo pasa `color`, `size` e `initials` al `Avatar.vue` interno:

```html
<Avatar :color="props.color" :size="props.size" :initials="props.initials" />
```

Resultado: la prop `src` (imagen) existe en la superficie pública del CE pero **no llega** al componente interno, por lo que la imagen no se renderiza vía Custom Element.

Severidad: **Media**. Acción: forwardear `:src="props.src"` en `Avatar.ce.vue`.

## `cu-command-palette` — sin prop `commands` ni métodos expuestos

`CommandPalette.ce.vue` NO declara la prop `commands` (solo existe en `CommandPalette.vue` interno) y NO llama a `defineExpose`, aunque define `open()`/`close()` locales que nunca se exponen:

- No hay forma de pasar `commands` desde HTML/JS → el CE queda sin datos.
- No se exponen `open()`/`close()`/`run()` → no se puede abrir programáticamente.

Severidad: **Alta** (el componente es no-funcional vía CE). Acción: agregar `commands` a `defineProps` y forwardearlo, y exponer `open`/`close`/`run`/`getCommands`/`isOpen` con `defineExpose` (arrow functions).

La documentación de `componentes/cu-command-palette.md` refleja la API pública real actual (props `color`, `title`, `placeholder`, `size`, `height`; eventos `select`/`close`) y quedará desactualizada cuando se corrija el wrapper.
