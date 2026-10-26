[← Volver](../README.md)

# `<cu-switch>`

Toggle de encendido/apagado con color semántico, dos tamaños y etiqueta opcional. Mantiene su
estado y también se controla vía `modelValue` o los métodos `get`/`set`.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuSwitch.umd.js"></script>

<cu-switch id="miSwitch" color="primary" size="md"></cu-switch>

<script>
  const sw = document.getElementById('miSwitch');
  sw.set(true);
  console.log(sw.get()); // true
  sw.reset();
</script>
```

<!-- demo:switch-uso -->

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`), así que el mismo nombre se ve distinto en cada tema. El color se ve en
el track cuando el switch está encendido.

```html
<cu-switch color="primary" label="primary"></cu-switch>
<cu-switch color="secondary" label="secondary"></cu-switch>
<cu-switch color="neutral" label="neutral"></cu-switch>
<cu-switch color="success" label="success"></cu-switch>
<cu-switch color="warning" label="warning"></cu-switch>
<cu-switch color="danger" label="danger"></cu-switch>

<script>
  // el color del track se ve con el switch encendido
  document.querySelectorAll('cu-switch').forEach((sw) => sw.set(true));
</script>
```

<!-- demo:switch-colores -->

## Tamaños

`size` acepta `sm` (32×20px) y `md` (**default**, 48×32px), y escala también la etiqueta.

```html
<cu-switch size="sm" color="primary"></cu-switch>
<cu-switch size="md" color="primary"></cu-switch>
```

<!-- demo:switch-tamanos -->

## Estado deshabilitado

`disabled` bloquea el click y atenúa el track y la etiqueta; el estado se sigue leyendo con
`get()`.

```html
<cu-switch disabled label="Encendido y deshabilitado" model-value="true"></cu-switch>
<cu-switch disabled label="Apagado y deshabilitado"></cu-switch>
```

<!-- demo:switch-deshabilitado -->

## Etiqueta

`label` es la etiqueta de texto y el slot `default` la reemplaza cuando hace falta marcado. El
`<label>` nativo envuelve el track, así que clickear la etiqueta también alterna el switch.

```html
<cu-switch color="primary" label="Notificaciones"></cu-switch>
<cu-switch color="success">Acepto los <strong>términos</strong></cu-switch>
```

<!-- demo:switch-etiqueta -->

## Posición de la etiqueta

`label-position` decide de qué lado del track va la etiqueta: `end` (**default**) la deja a la
derecha y `start` a la izquierda. El `<label>` nativo envuelve el track y la etiqueta, así que
clickear la etiqueta alterna el switch en cualquiera de las dos posiciones.

```html
<cu-switch color="primary" label-position="start" label="A la izquierda"></cu-switch>
<cu-switch color="primary" label="A la derecha (default)"></cu-switch>
```

<!-- demo:switch-label-position -->

## Escuchar cambios

El switch se mueve solo: hay dos eventos equivalentes para reaccionar, `update:modelValue`
(convención Vue) y `change`, los dos con el valor nuevo (`boolean`) en `e.detail`.

```html
<cu-switch id="toggle"></cu-switch>

<script>
  const sw = document.getElementById('toggle');
  sw.addEventListener('update:modelValue', (e) => {
    console.log('Estado:', e.detail);
  });
  sw.addEventListener('change', (e) => {
    console.log('Toggle a:', e.detail);
  });
</script>
```

<!-- demo:switch-cambios -->

## Estado y modo controlado

El estado vive en el componente: al clickearlo (o llamar `set()`/`reset()`) se mueve la UI y
`get()` devuelve el valor nuevo, sin reasignar `modelValue`. Si querés decidir vos el valor,
reasignalo en el evento (modo controlado).

```html
<cu-switch id="guardado"></cu-switch>

<script>
  const sw = document.getElementById('guardado');
  // Sólo permite activarlo: si el usuario lo apaga, lo volvemos a encender.
  sw.addEventListener('update:modelValue', (e) => {
    if (e.detail) return;
    // hay que forzar un cambio de la prop para que el CE vuelva a encenderse
    sw.modelValue = false;
    setTimeout(() => { sw.modelValue = true; });
  });
</script>
```

<!-- demo:switch-controlado -->

## Control programático

```html
<cu-switch id="auto" label="API imperativa"></cu-switch>

<script>
  const sw = document.getElementById('auto');
  sw.set(true);          // encender
  sw.reset();            // apagar
  console.log(sw.get()); // estado actual
  sw.focus();            // foco en el input
</script>
```

<!-- demo:switch-control-programatico -->

## Atributos

<!--@include: ../partials/switch/props-vanilla.md-->

> El Custom Element **no expone** una prop `checked` separada. El control se hace únicamente con `modelValue`. Tampoco tiene props `variant`, `theme` ni `hightContrast`; el tamaño se controla con `size`.

## Eventos

<!--@include: ../partials/switch/eventos.md-->

## Slots

<!--@include: ../partials/switch/slots.md-->

## Métodos expuestos

<!--@include: ../partials/switch/metodos-vanilla.md-->
