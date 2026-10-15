[← Volver](../README.md)

# `Alert`

Alerta con color semántico, 5 variantes, título opcional, ícono y botón de cerrar. `color`
elige el color, `variant` el aspecto y `title` / el slot `icon` la cabecera; se controla con
la prop `show` (con `v-model:show`) o con los métodos `open()` / `close()` / `toggle()` /
`isOpen()`.

## Uso en Vue

```vue
<script setup lang="ts">
import Alert from "@/components/information/Alert.vue";
</script>

<template>
  <Alert color="primary" variant="soft" title="Aviso">
    El contenido va en el slot `default`.
  </Alert>
</template>
```

En HTML plano, cargá el bundle `CuAlert` (ver [ficha vanilla](/componentes/cu-alert)).

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`), así que el mismo nombre se ve distinto en cada tema.

```vue
<Alert color="primary" variant="soft">primary</Alert>
<Alert color="secondary" variant="soft">secondary</Alert>
<Alert color="neutral" variant="soft">neutral</Alert>
<Alert color="success" variant="soft">success</Alert>
<Alert color="warning" variant="soft">warning</Alert>
<Alert color="danger" variant="soft">danger</Alert>
```

## Variantes

`variant` decide el aspecto: `solid` (relleno), `outlined` (borde), `soft` (fondo tenue y el
**default**), `ghost` (transparente) y `subtle` (tenue con borde).

```vue
<Alert color="primary" variant="solid">solid</Alert>
<Alert color="primary" variant="outlined">outlined</Alert>
<Alert color="primary" variant="soft">soft</Alert>
<Alert color="primary" variant="ghost">ghost</Alert>
<Alert color="primary" variant="subtle">subtle</Alert>
```

## Título e ícono

`title` escribe el título de la cabecera. El slot `icon` pone un ícono ahí mismo y **también
arma la cabecera** aunque no haya `title`; sin ninguno de los dos sólo se ve el cuerpo.

```vue
<Alert color="neutral" variant="soft">Sin título ni ícono.</Alert>

<Alert color="primary" variant="soft" title="Con título">
  El título va en la cabecera.
</Alert>

<Alert color="primary" variant="soft">
  <template #icon>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4m0 4h.01" />
    </svg>
  </template>
  Sólo ícono: el slot arma la cabecera.
</Alert>

<Alert color="success" variant="soft" title="Con título e ícono">
  <template #icon>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  </template>
  Título e ícono juntos.
</Alert>
```

## Cierre

`close` agrega el botón de cerrar (X). Con cabecera (hay `title` o ícono) la X va dentro de
ella; sin cabecera flota sobre la primera fila del cuerpo.

```vue
<Alert color="neutral" variant="soft" title="Con cabecera" close>
  La X acompaña al título.
</Alert>

<Alert color="danger" variant="soft" close>
  Sin título ni ícono, la X flota sobre el cuerpo.
</Alert>

<Alert color="neutral" variant="soft">Sin `close` no hay botón de cierre.</Alert>
```

> El botón no desmonta la alerta: la **oculta** (`show` pasa a `false`) y emite `close`. Para
> volver a mostrarla, llamá a `open()` o poné `show` en `true`.

## Visibilidad

`show` controla si se ve (default `true`); `open()`, `close()` y `toggle()` hacen lo mismo
desde JS y `isOpen()` devuelve el estado actual. Con `v-model:show` la prop queda
sincronizada sola.

```vue
<script setup lang="ts">
import Alert from "@/components/information/Alert.vue";
import { ref } from "vue";

const show = ref(true);
const alerta = ref<InstanceType<typeof Alert> | null>(null);
const estado = ref("isOpen() → true");

function sync() {
  estado.value = `isOpen() → ${alerta.value?.isOpen()}`;
}

function abrir() {
  alerta.value?.open();
  sync();
}

function cerrar() {
  alerta.value?.close();
  sync();
}

function alternar() {
  alerta.value?.toggle();
  sync();
}
</script>

<template>
  <button @click="show = true">show = true</button>
  <button @click="show = false">show = false</button>

  <Alert v-model:show="show" color="primary" variant="soft" title="Control por show">
    La visibilidad sigue a <code>show</code>.
  </Alert>

  <button @click="abrir">open()</button>
  <button @click="cerrar">close()</button>
  <button @click="alternar">toggle()</button>

  <Alert ref="alerta" color="success" variant="soft" title="Control por métodos">
    Sin <code>show</code>: se maneja con <code>open()</code>, <code>close()</code> y
    <code>toggle()</code>.
  </Alert>

  <p>{{ estado }}</p>
</template>
```

## Interacción

`open` y `close` avisan cada vez que la alerta se muestra o se oculta; `update:show` avisa
cualquier cambio de visibilidad, con el valor nuevo como primer argumento.

```vue
<script setup lang="ts">
import Alert from "@/components/information/Alert.vue";
import { ref } from "vue";

const alerta = ref<InstanceType<typeof Alert> | null>(null);
const log = ref<string[]>([]);

function record(entry: string) {
  log.value = [entry, ...log.value].slice(0, 6);
}
</script>

<template>
  <button @click="alerta?.open()">open()</button>
  <button @click="alerta?.close()">close()</button>

  <Alert
    ref="alerta"
    color="danger"
    variant="soft"
    title="Errores"
    close
    @open="record('open')"
    @close="record('close')"
    @update:show="(value: boolean) => record(`update:show → ${value}`)"
  >
    <code>update:show</code> avisa cada cambio; <code>open</code> y <code>close</code> se
    disparan con los métodos y con el botón de cierre.
  </Alert>

  <p>{{ log.join("\n") }}</p>
</template>
```

## Props

<!--@include: ../../partials/alert/props-vue.md-->

> **Atributos booleanos:** en HTML se usan sin valor: `<cu-alert close show>...`

## Emits

<!--@include: ../../partials/alert/eventos.md-->

> Los eventos custom se escuchan con `addEventListener` y el payload está en `e.detail`.

## Slots

<!--@include: ../../partials/alert/slots.md-->

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

<!--@include: ../../partials/alert/metodos-vue.md-->

El control también puede hacerse via el atributo `show` o escuchando los eventos `open`/`close`.
