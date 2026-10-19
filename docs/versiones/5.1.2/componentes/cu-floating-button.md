[← Volver](../README.md)

# `<cu-floating-button>`

Botón flotante (FAB) fijo en la esquina inferior derecha. Es un `Button` (hereda color, variante, tamaño y estados) posicionado de forma flotante. Pensado para acciones primarias rápidas (agregar, flotante de guardar, etc.). Normalmente se usa con un ícono en el slot.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuFloatingButton.umd.js"></script>

<cu-floating-button color="primary" id="fab">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
</cu-floating-button>

<script>
  document.getElementById('fab').addEventListener('click', () => {
    console.log('FAB clickeado');
  });
</script>
```

<!-- demo:floating-button-uso -->

> Es `position: fixed` en la esquina inferior derecha (`bottom` y `right`: `var(--cu-space-lg)`), con `z-index: 1000` y sombra elevada. El contenido (normalmente un SVG) debe usar `stroke="currentColor"` para heredar el color; el `click` es el evento nativo del `Button` interno.

## Colores

`color` es el color semántico del FAB (`primary` es el default) y se resuelve con los tokens del tema activo.

```html
<cu-floating-button color="primary" variant="solid" size="sm"><svg><!-- ícono --></svg></cu-floating-button>
<cu-floating-button color="secondary" variant="solid" size="sm"><svg><!-- ícono --></svg></cu-floating-button>
<cu-floating-button color="neutral" variant="solid" size="sm"><svg><!-- ícono --></svg></cu-floating-button>
<cu-floating-button color="success" variant="solid" size="sm"><svg><!-- ícono --></svg></cu-floating-button>
<cu-floating-button color="warning" variant="solid" size="sm"><svg><!-- ícono --></svg></cu-floating-button>
<cu-floating-button color="danger" variant="solid" size="sm"><svg><!-- ícono --></svg></cu-floating-button>
```

<!-- demo:floating-button-colores -->

## Variantes y tamaños

`variant` y `size` se heredan de `Button`: las 7 variantes (`solid` es el default) y los 3 tamaños (`lg` es el default).

```html
<cu-floating-button variant="solid" color="primary" size="md"><svg><!-- ícono --></svg></cu-floating-button>
<cu-floating-button variant="outlined" color="primary" size="md"><svg><!-- ícono --></svg></cu-floating-button>
<cu-floating-button variant="soft" color="primary" size="md"><svg><!-- ícono --></svg></cu-floating-button>
<cu-floating-button variant="ghost" color="primary" size="md"><svg><!-- ícono --></svg></cu-floating-button>
<cu-floating-button variant="subtle" color="primary" size="md"><svg><!-- ícono --></svg></cu-floating-button>
<cu-floating-button variant="link" color="primary" size="md"><svg><!-- ícono --></svg></cu-floating-button>
<cu-floating-button variant="none" color="primary" size="md"><svg><!-- ícono --></svg></cu-floating-button>

<cu-floating-button size="sm" color="primary" variant="solid"><svg><!-- ícono --></svg></cu-floating-button>
<cu-floating-button size="md" color="primary" variant="solid"><svg><!-- ícono --></svg></cu-floating-button>
<cu-floating-button size="lg" color="primary" variant="solid"><svg><!-- ícono --></svg></cu-floating-button>
```

<!-- demo:floating-button-variantes-tamanos -->

> No fija tamaño ni forma: hereda de `Button` el `padding`, el `size` y el `border-radius`, y crece con su contenido.

## Estados

`disabled` atenúa el FAB y bloquea el click; `loading` lo deshabilita igual y antepone un spinner mientras está activo.

```html
<cu-floating-button disabled color="neutral" variant="soft" size="sm"><svg><!-- ícono --></svg></cu-floating-button>
<cu-floating-button loading color="primary" variant="solid" size="sm"><svg><!-- ícono --></svg></cu-floating-button>
```

<!-- demo:floating-button-estados -->

## Atributos

<!--@include: ../partials/floating-button/props.md-->

> El Custom Element **no expone** prop `theme` ni `hightContrast`.

## Eventos

<!--@include: ../partials/floating-button/eventos.md-->

## Slots

<!--@include: ../partials/floating-button/slots.md-->

## Métodos expuestos

<!--@include: ../partials/floating-button/metodos.md-->
