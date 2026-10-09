# Collapse — `<cu-collapse>` / `<Collapse>`

Sección colapsable con trigger (botón + chevron animado) y transición de altura.

## Cuándo usarlo

Para acordeones, FAQ, "más información" u opciones avanzadas; también para árboles de menú
anidando varios. Para un panel flotante anclado a un botón usá `cu-dropdown-menu`; para un
modal, `cu-modal`.

## Receta

1. El trigger lleva `label` (**obligatorio**) y, opcionalmente, `icon` (SVG/HTML como string) y `description` (texto secundario bajo el label).
2. El contenido va por el slot default.
3. `default-open` arranca abierto.
4. Escuchá `toggle` (boolean) o llamá `open()`, `close()`, `toggle()` e `isOpen()`.
5. `color` colorea el trigger.
6. `disabled` deja el trigger inerte: no responde al click y `open()`/`toggle()` son no-op
   (`close()` sigue funcionando). En HTML plano es el atributo booleano `disabled`.

```html
<!-- HTML plano (UMD) -->
<script src="dist-libs/umd-core/CuCollapse.umd.js"></script>

<cu-collapse id="faq" label="¿Qué es ComegenUI?" description="Librería de Custom Elements" color="primary">
  <p>Una librería de componentes UI como Custom Elements nativos.</p>
</cu-collapse>

<cu-collapse label="Sección bloqueada" disabled>
  <p>El trigger no responde al click.</p>
</cu-collapse>

<script>
  const faq = document.getElementById('faq');
  faq.addEventListener('toggle', (e) => console.log('abierto:', e.detail));
  faq.toggle();
</script>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Collapse from "@/components/overlay/Collapse.vue";
import { ref } from "vue";

const abierto = ref(false);
</script>

<template>
  <Collapse label="¿Qué es ComegenUI?" description="Librería de Custom Elements" color="primary" @toggle="abierto = $event">
    <p>Una librería de componentes UI como Custom Elements nativos.</p>
  </Collapse>

  <Collapse label="Sección bloqueada" disabled>
    <p>El trigger no responde al click.</p>
  </Collapse>
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`),
`label`, `description`, `icon`, `default-open`, `disabled`, slot default, el evento `toggle` y los métodos
`open`/`close`/`toggle`/`isOpen`. Se puede anidar.

**No puede:**

- **No tiene `variant` ni `theme`:** el trigger siempre es `ghost` y el color se controla con
  `color`.
- **No soporta `v-model` de apertura:** el estado inicial se fija con `default-open` y después
  sólo cambia por el trigger o por métodos (no hay `update:open`).
- **Con `disabled`, `open()` y `toggle()` son no-op**; sólo `close()` actúa.
- **Un solo slot (`default`):** no se puede cambiar el trigger ni el chevron.
- **`label` es obligatorio.**
- **`toggle` sólo se emite cuando el estado cambia:** llamar `open()` estando abierto no
  re-emite.
- **`icon` es un string HTML/SVG** (se inyecta crudo); no es un componente ni una URL.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del trigger: `primary`, `neutral`, `success`, `warning`, `danger` |
| `disabled` | `boolean` | `false` | Deshabilita el trigger: no responde al click del usuario |
| `icon` | `string` | `""` | Ícono del trigger (SVG/HTML) |
| `description` | `string` | `""` | Texto secundario que se muestra bajo el label en el trigger |
| `default-open` | `boolean` | `false` | — |
| `label` | `string` | `—` | Texto del trigger |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `toggle` | `boolean` | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `open` | Abre el collapse |
| `close` | Cierra el collapse |
| `toggle` | Alterna el estado |
| `isOpen` | Devuelve el estado actual (`boolean`) |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `'neutral'` | — |
| `disabled` | `boolean` | `false` | Deshabilita el trigger: no responde al click del usuario. |
| `icon` | `string` | `''` | Ícono del trigger (SVG/HTML). |
| `description` | `string` | `''` | Texto secundario que se muestra bajo el label en el trigger. |
| `defaultOpen` | `boolean` | `false` | — |
| `label` | `string` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `toggle` | `boolean` | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `open` | Abre el collapse. |
| `close` | Cierra el collapse. |
| `toggle` | Alterna el estado del collapse. |
| `isOpen` | Devuelve true si el collapse está abierto. |
<!-- /@api:expose -->
