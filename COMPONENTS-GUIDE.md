# ComegenUI — Web Components

Librería de componentes UI como Custom Elements nativos, construidos con Vue 3 pero **utilizables en HTML plano, vanilla JS, o cualquier framework** (React, Angular, Svelte, etc.).

---

## Índice

- [Instalación](#instalación)
- [Sistema de Temas](#sistema-de-temas)
- [Sistema de Color y Variantes](#sistema-de-color-y-variantes)
- [Componentes](#componentes)
  - [`<cu-button>`](#cu-button)
  - [`<cu-alert>`](#cu-alert)
  - [`<cu-badge>`](#cu-badge)
  - [`<cu-card>`](#cu-card)
  - [`<cu-input>`](#cu-input)
  - [`<cu-checkbox>`](#cu-checkbox)
  - [`<cu-textarea>`](#cu-textarea)
  - [`<cu-select>`](#cu-select)
  - [`<cu-switch>`](#cu-switch)
  - [`<cu-label>`](#cu-label)
  - [`<cu-modal>`](#cu-modal)
  - [`<cu-collapse>`](#cu-collapse)
  - [`<cu-month-slider>`](#cu-month-slider)
  - [`<cu-year-slider>`](#cu-year-slider)
  - [`<cu-pagination>`](#cu-pagination)
  - [`<cu-table>`](#cu-table)
  - [`<cu-dropdown-menu>`](#cu-dropdown-menu)
- [Notas Técnicas](#notas-técnicas)

---

## Instalación

Cada componente es un archivo **UMD** independiente. Incluye solo los que necesites:

```html
<!-- Componentes individuales -->
<script src="ruta/CuButton.umd.js"></script>
<script src="ruta/CuAlert.umd.js"></script>
<script src="ruta/CuBadge.umd.js"></script>
<script src="ruta/CuCard.umd.js"></script>
<script src="ruta/CuInput.umd.js"></script>
<script src="ruta/CuCheckbox.umd.js"></script>
<script src="ruta/CuTextarea.umd.js"></script>
<script src="ruta/CuSelect.umd.js"></script>
<script src="ruta/CuSwitch.umd.js"></script>
<script src="ruta/CuLabel.umd.js"></script>
<script src="ruta/CuModal.umd.js"></script>
<script src="ruta/CuCollapse.umd.js"></script>
<script src="ruta/CuMonth-slider.umd.js"></script>
<script src="ruta/CuYear-slider.umd.js"></script>
<script src="ruta/CuPagination.umd.js"></script>
<script src="ruta/CuTable.umd.js"></script>
<script src="ruta/CuDropdownMenu.umd.js"></script>
```

Cada script registra automáticamente su Custom Element. No necesitas instalar Vue ni ninguna dependencia.

### Archivos disponibles

| Archivo | Tag | Componente |
|---------|-----|------------|
| `CuButton.umd.js` | `<cu-button>` | Botón |
| `CuAlert.umd.js` | `<cu-alert>` | Alerta |
| `CuBadge.umd.js` | `<cu-badge>` | Badge |
| `CuCard.umd.js` | `<cu-card>` | Tarjeta de información |
| `CuInput.umd.js` | `<cu-input>` | Input de texto |
| `CuCheckbox.umd.js` | `<cu-checkbox>` | Checkbox |
| `CuTextarea.umd.js` | `<cu-textarea>` | Textarea |
| `CuSelect.umd.js` | `<cu-select>` | Selector |
| `CuSwitch.umd.js` | `<cu-switch>` | Switch/Toggle |
| `CuLabel.umd.js` | `<cu-label>` | Label |
| `CuModal.umd.js` | `<cu-modal>` | Modal |
| `CuCollapse.umd.js` | `<cu-collapse>` | Colapsable |
| `CuMonth-slider.umd.js` | `<cu-month-slider>` | Slider de meses con arrastre |
| `CuYear-slider.umd.js` | `<cu-year-slider>` | Slider de años (1 en 1) |
| `CuPagination.umd.js` | `<cu-pagination>` | Paginación |
| `CuTable.umd.js` | `<cu-table>` | Tabla avanzada |
| `CuDropdownMenu.umd.js` | `<cu-dropdown-menu>` | Menú desplegable |

---

## Sistema de Temas

Tres temas integrados: `light` (default), `dark`, `sigacadv2`.

### Tema global (recomendado)

```html
<html data-theme="dark">
  <!-- Todos los componentes usan el tema oscuro -->
  <cu-button color="primary">Guardar</cu-button>
</html>
```

### Tema por componente

```html
<cu-button color="primary" theme="sigacadv2">Guardar</cu-button>
```

Si se especifica `theme`, tiene prioridad sobre `data-theme`. Si se omite, hereda del `<html>`.

### Auto-detección

Si no hay `data-theme` en el documento ni `theme` en el componente, se detecta automáticamente `prefers-color-scheme` del OS. Prioridad completa:

```
theme prop (componente) → data-theme (<html>) → prefers-color-scheme (OS)
```

Colores de cada tema:

| Color | `light` | `dark` | `sigacadv2` |
|-------|---------|--------|-------------|
| `primary` | `#1774A4` | `#38bdf8` | `#0037FF` |
| `neutral` | `#2c2c2c` | `#e5e5e5` | `#1a1a1a` |
| `success` | `#22c55e` | `#4ade80` | `#28a745` |
| `warning` | `#f59e0b` | `#fbbf24` | `#ffc107` |
| `danger` | `#ef4444` | `#f87171` | `#dc3545` |
| `surface` | `#ffffff` | `#1a1a1a` | `#111827` |

---

## Sistema de Color y Variantes

Cada componente que usa color acepta dos props clave:

| Prop | Valores | Default | Descripción |
|------|---------|---------|-------------|
| `color` | `primary`, `neutral`, `success`, `warning`, `danger` | Componente | Color semántico |
| `variant` | Varía por componente | Varía | Estilo visual |

### Variantes disponibles por componente

| Variante | Button | Alert | Badge | Input | Checkbox | Textarea | Pagination | Table | DropdownMenu | Select | Collapse |
|----------|--------|-------|-------|-------|----------|----------|------------|-------|----------|--------|----------|
| `solid` | ✓ | ✓ | ✓ | — | — | — | — | ✓ | ✓ | ✓ | — |
| `outlined` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| `soft` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| `ghost` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| `subtle` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| `link` | ✓ | — | — | — | — | — | — | ✓ | — | ✓ | — |
| `none` | ✓ | — | — | ✓ | ✓ | ✓ | — | — | — | ✓ | — |

---

## Componentes

---

### `<cu-button>`

Botón con soporte de color, variante, link y estados.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"ghost"` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link` |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `hightContrast` | `boolean` | `false` | Alto contraste de texto |
| `to` | `string` | — | Si se especifica, renderiza un `<a>` (link) |
| `target` | `string` | `"_self"` | Target del link |

#### Slots

| Slot | Descripción |
|------|-------------|
| `default` | Contenido del botón |

#### Uso

```html
<cu-button color="primary" variant="solid">Guardar</cu-button>
<cu-button color="danger" variant="outlined" disabled>Eliminar</cu-button>
<cu-button color="success" variant="soft">
  <svg><!-- icono --></svg>
  Aceptar
</cu-button>
<cu-button to="/inicio" variant="link">Volver al inicio</cu-button>
```

---

### `<cu-alert>`

Alerta que puede abrirse, cerrarse y mostrarse con animación.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"soft"` | `solid`, `outlined`, `soft`, `subtle` |
| `close` | `boolean` | `false` | Muestra botón de cerrar |
| `title` | `string` | — | Título de la alerta |
| `show` | `boolean` | `true` | Controla visibilidad |
| `hightContrast` | `boolean` | `false` | Alto contraste |

#### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `close` | — | Se cierra la alerta |
| `open` | — | Se abre la alerta |

#### Slots

| Slot | Descripción |
|------|-------------|
| `default` | Cuerpo de la alerta |
| `icon` | Slot con nombre para un ícono junto al título |

#### Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.open()` | Abre la alerta |
| `.close()` | Cierra la alerta |
| `.toggle()` | Alterna visibilidad |
| `.isOpen` (getter) | Estado actual (`boolean`) |

#### Uso

```html
<cu-alert color="success" variant="solid" title="Operación exitosa" close>
  Los datos se guardaron correctamente.
</cu-alert>

<cu-alert color="danger" variant="outlined" id="miAlerta">
  <span slot="icon">
    <svg><!-- icono personalizado --></svg>
  </span>
  Ha ocurrido un error.
</cu-alert>

<script>
  const alerta = document.getElementById('miAlerta');
  alerta.open();
  alerta.close();
  console.log(alerta.isOpen); // true | false
</script>
```

---

### `<cu-badge>`

Etiqueta o badge pequeño.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"ghost"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `hightContrast` | `boolean` | `false` | Alto contraste |

#### Slots

| Slot | Descripción |
|------|-------------|
| `default` | Contenido del badge |

#### Uso

```html
<cu-badge color="primary" variant="solid">Nuevo</cu-badge>
<cu-badge color="success" variant="soft">Activo</cu-badge>
<cu-badge color="warning" variant="outlined">Pendiente</cu-badge>
<cu-badge color="danger" variant="subtle">Error</cu-badge>
```

---

### `<cu-card>`

Tarjeta para mostrar información agrupada con media, header (título + subtítulo), contenido y footer.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"ghost"` | `ghost`, `outlined`, `soft`, `subtle`, `solid` |
| `layout` | `string` | `"vertical"` | `vertical` (media arriba) o `horizontal` (media al costado) |
| `title` | `string` | — | Título del header |
| `subtitle` | `string` | — | Subtítulo bajo el título |
| `image` | `string` | — | URL de imagen de la media |
| `hightContrast` | `boolean` | `false` | Alto contraste |

#### Slots

| Slot | Descripción |
|------|-------------|
| `default` | Contenido principal del cuerpo |
| `media` | Contenido de la parte superior (reemplaza `image`) |
| `header` | Reemplaza el título/subtítulo por defecto |
| `footer` | Contenido al pie de la tarjeta |

#### Uso

```html
<cu-card title="Resumen" subtitle="Último corte" color="primary">
  Contenido de la tarjeta.
  <div slot="footer">
    <cu-button color="primary" variant="soft">Ver más</cu-button>
  </div>
</cu-card>

<!-- Layout horizontal: media al costado -->
<cu-card layout="horizontal" title="Perfil" image="https://example.com/avatar.jpg">
  Datos del perfil.
</cu-card>
```

---

### `<cu-input>`

Campo de texto con soporte de color y variantes.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"none"` | `outlined`, `soft`, `ghost`, `subtle`, `none` |
| `type` | `string` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `placeholder` | `string` | — | Placeholder |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `readOnly` | `boolean` | `false` | Solo lectura |
| `modelValue` | `string` | `""` | Valor controlado |
| `startValue` | `string` | — | Valor inicial |
| `hightContrast` | `boolean` | `false` | Alto contraste |

#### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `change` | `Event` | Cambio nativo |
| `input` | `Event` | Input nativo |

#### Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.get()` | Devuelve el valor actual (`string`) |
| `.set(value)` | Asigna un valor |
| `.reset()` | Limpia el valor |
| `.focus()` | Enfoca el input |

#### Uso

```html
<cu-input placeholder="Nombre" color="primary" variant="outlined"></cu-input>
<cu-input type="email" placeholder="correo@ejemplo.com" variant="soft" id="email"></cu-input>
<cu-input disabled value="No editable"></cu-input>

<script>
  const input = document.getElementById('email');
  input.set('usuario@dominio.com');
  console.log(input.get()); // "usuario@dominio.com"
  input.focus();
</script>
```

---

### `<cu-checkbox>`

Checkbox personalizado con label.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"none"` | `outlined`, `soft`, `ghost`, `subtle`, `none` |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `modelValue` | `boolean` | `false` | Valor controlado |
| `label` | `string` | — | Texto junto al checkbox |
| `hightContrast` | `boolean` | `false` | Alto contraste |

#### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `change` | `Event` | Evento nativo de cambio |
| `update:modelValue` | `boolean` | Cambio de valor |

#### Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.get()` | Devuelve el estado (`boolean`) |
| `.set(value)` | Asigna estado |
| `.reset()` | Pone en `false` |

#### Uso

```html
<cu-checkbox label="Acepto los términos" color="primary" variant="soft"></cu-checkbox>
<cu-checkbox label="Opción deshabilitada" disabled></cu-checkbox>

<script>
  const chk = document.querySelector('cu-checkbox');
  chk.set(true);
  console.log(chk.get()); // true
</script>
```

---

### `<cu-textarea>`

Área de texto multilínea.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"none"` | `outlined`, `soft`, `ghost`, `subtle`, `none` |
| `placeholder` | `string` | — | Placeholder |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `readOnly` | `boolean` | `false` | Solo lectura |
| `rows` | `number` | `3` | Número de filas |
| `noResize` | `boolean` | `false` | Deshabilita redimensionar |
| `modelValue` | `string` | `""` | Valor controlado |
| `startValue` | `string` | — | Valor inicial |
| `hightContrast` | `boolean` | `false` | Alto contraste |

#### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `change` | `Event` | Cambio nativo |
| `input` | `Event` | Input nativo |

#### Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.get()` | Devuelve el valor actual |
| `.set(value)` | Asigna un valor |
| `.reset()` | Limpia el valor |
| `.focus()` | Enfoca el textarea |

#### Uso

```html
<cu-textarea placeholder="Escribe aquí..." rows="5" color="primary" variant="outlined"></cu-textarea>
<cu-textarea no-resize variant="soft" id="comentarios"></cu-textarea>

<script>
  const ta = document.getElementById('comentarios');
  ta.set('Texto predefinido');
  console.log(ta.get());
</script>
```

---

### `<cu-select>`

Selector de opciones con soporte de color, variante e ícono chevron.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"none"` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` |
| `placeholder` | `string` | — | Placeholder |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `options` | `array` | `[]` | Opciones `[{ value, label }]` |
| `modelValue` | `string` | `""` | Valor seleccionado |
| `hightContrast` | `boolean` | `false` | Alto contraste |

#### Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.get()` | Devuelve el valor seleccionado |
| `.set(value)` | Asigna un valor |
| `.reset()` | Limpia la selección |
| `.focus()` | Enfoca el select |
| `.selectedItem` | Objeto `{ value, label }` de la opción seleccionada o `null` |

#### Uso

```html
<cu-select id="miSelect" placeholder="Seleccione una opción" color="primary" variant="outlined"></cu-select>

<script>
  const select = document.getElementById('miSelect');
  select.options = [
    { value: 'doc', label: 'Documento' },
    { value: 'pdf', label: 'PDF' },
  ];
  select.set('pdf');
  console.log(select.get()); // "pdf"
</script>
```

> **Nota:** Los `options` se pasan como propiedad DOM (no atributo) porque es un array.

---

### `<cu-switch>`

Toggle switch con soporte de color, tamaños y animación.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `size` | `string` | `"md"` | `sm`, `md` |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `modelValue` | `boolean` | `false` | Estado del toggle (v-model) |
| `checked` | `boolean` | `false` | Estado alternativo |
| `hightContrast` | `boolean` | `false` | Alto contraste |

#### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `update:modelValue` | `boolean` | Para v-model |
| `change` | `boolean` | Cuando cambia el estado |

#### Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.get()` | Devuelve el estado actual |
| `.set(value)` | Asigna un estado |
| `.reset()` | Pone en `false` |
| `.focus()` | Enfoca el switch |

#### Uso

```html
<cu-switch id="miSwitch" color="primary" size="md"></cu-switch>

<script>
  const sw = document.getElementById('miSwitch');
  sw.set(true);
  console.log(sw.get()); // true
  sw.reset();
</script>
```

> **Tamaños:** `sm` (32×20px) y `md` (48×32px).

---

### `<cu-label>`

Label semántico con auto-foco. Al hacer clic, busca un input hijo y lo enfoca.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | `""` | Texto del label |

#### Slots

| Slot | Descripción |
|------|-------------|
| `default` | Contenido asociado (input, checkbox, etc.) |

#### Uso

```html
<cu-label label="Correo electrónico">
  <cu-input type="email" placeholder="correo@ejemplo.com"></cu-input>
</cu-label>

<cu-label label="Acepto los términos">
  <cu-checkbox></cu-checkbox>
</cu-label>
```

---

### `<cu-modal>`

Modal/diálogo modal con backdrop, animación, y slots para footer.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | `string` | `""` | Título del modal |
| `description` | `string` | `""` | Descripción bajo el título |
| `persistent` | `boolean` | `false` | Si es `true`, no se cierra al hacer clic fuera |
| `size` | `string` | `"auto"` | `auto`, `sm`, `md`, `lg`, `xl`, `full` |
| `height` | `string` | `"auto"` | `auto`, `sm`, `md`, `lg`, `xl`, `full` |

#### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `close` | — | Se cierra el modal |
| `opened` | — | Se abre el modal |
| `closed` | — | Animación de cierre completada |

#### Slots

| Slot | Descripción |
|------|-------------|
| `default` | Cuerpo del modal |
| `footer` | Pie del modal (botones de acción) |

#### Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.open()` | Abre el modal |
| `.close()` | Cierra el modal |
| `.toggle()` | Alterna visibilidad |
| `.isOpen` (getter) | Estado actual (`boolean`) |

#### Uso

```html
<cu-modal title="Confirmar eliminación" description="¿Estás seguro?" id="modalConfirm">
  <p>Esta acción no se puede deshacer.</p>
  <div slot="footer">
    <cu-button color="danger" variant="solid" onclick="document.getElementById('modalConfirm').close()">
      Eliminar
    </cu-button>
    <cu-button variant="ghost" onclick="document.getElementById('modalConfirm').close()">
      Cancelar
    </cu-button>
  </div>
</cu-modal>

<button onclick="document.getElementById('modalConfirm').open()">Abrir modal</button>
```

---

### `<cu-collapse>`

Sección colapsable con trigger (botón + chevron animado). El contenido se muestra/oculta con una transición de altura. Útil para acordeones, menús anidados o secciones "más información".

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | *(requerido)* | Texto del trigger |
| `default-open` | `boolean` | `false` | Si es `true`, el contenido arranca visible |
| `color` | `string` | `"neutral"` | Color semántico del trigger: `primary`, `neutral`, `success`, `warning`, `danger` |

> No expone prop `variant` ni `theme`. El trigger siempre usa la variante `ghost` y el color se controla con `color`.

#### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `toggle` | `boolean` | Cambio de estado abierto/cerrado (`true` = abierto) |

#### Slots

| Slot | Descripción |
|------|-------------|
| `default` | Contenido colapsable |

#### Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.open()` | Abre el collapse |
| `.close()` | Cierra el collapse |
| `.toggle()` | Alterna el estado |
| `.isOpen()` | Devuelve el estado actual (`boolean`) |

#### Uso

```html
<cu-collapse label="Más información" color="primary">
  <p>Contenido oculto hasta que se hace click en el trigger.</p>
</cu-collapse>
```

Abierto por defecto:

```html
<cu-collapse label="Opciones avanzadas" default-open>
  <p>Visible desde el inicio.</p>
</cu-collapse>
```

Control programático y eventos:

```html
<cu-collapse id="faq" label="Pregunta">
  <p>Respuesta.</p>
</cu-collapse>

<script>
  const faq = document.getElementById('faq');
  faq.addEventListener('toggle', (e) => console.log('abierto:', e.detail));
  faq.open();
  faq.close();
  faq.toggle();
  faq.isOpen();
</script>
```

---

### `<cu-month-slider>`

Selector de mes con navegación por botones y arrastre. Muestra el mes actual (con el año al lado si no es el año en curso) y permite moverse mes a mes (`<` / `>`) o año a año (`<<` / `>>`, activable por prop). También se puede cambiar de mes arrastrando el label hacia la izquierda (mes siguiente) o derecha (mes anterior).

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `model-value` | `string \| number \| Date` | mes actual | Mes seleccionado (soporta `v-model`). Acepta `Date`, timestamp o string ISO (`"2026-03-01"`) |
| `month-format` | `string` | `"MMMM"` | Formato del label del mes (`MMMM`, `MMM`, `MM`, `M`, `yyyy`, `yy`) |
| `year-format` | `string` | `"yyyy"` | Formato del año mostrado al lado cuando no es el año actual |
| `locale` | `string` | `"es"` | Locale usado por `Intl` para los nombres de mes |
| `year-navigation` | `boolean` | `true` | Muestra/oculta los botones `<<` / `>>` de navegación anual (`year-navigation="false"` la desactiva) |
| `variant` | `string` | `"soft"` | Variante del label: `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `min` | `string \| number \| Date` | — | Fecha mínima navegable (botones deshabilitados en el borde, drag recortado) |
| `max` | `string \| number \| Date` | — | Fecha máxima navegable |
| `color` | `string` | `"primary"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `disabled` | `boolean` | `false` | Deshabilita la navegación y el arrastre |

> No expone prop `theme`.

**Año automático:** si `month-format` no incluye un token de año y el mes seleccionado no es del año en curso, el año se agrega al lado (ej.: `"agosto"` → `"agosto 2025"`).

#### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `change` | `Date` | Cambio de mes (botones, teclado o arrastre) |
| `update:modelValue` | `Date` | Nuevo mes (para `v-model` en Vue) |

#### Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.nextMonth()` / `.prevMonth()` | Avanza / retrocede un mes |
| `.nextYear()` / `.prevYear()` | Avanza / retrocede un año |
| `.goToMonth(value)` | Va a un mes puntual (`string \| number \| Date`) |
| `.getValue()` | Devuelve el mes actual como `Date` |
| `.setValue(value)` | Setea el mes actual |

#### Uso

```html
<script src="ruta/CuMonth-slider.umd.js"></script>

<cu-month-slider></cu-month-slider>

<cu-month-slider model-value="2025-03-01"></cu-month-slider>

<cu-month-slider month-format="MMM yyyy" year-navigation="false" color="success" variant="outlined"></cu-month-slider>

<cu-month-slider min="2026-01-01" max="2026-12-01"></cu-month-slider>
```

Control programático:

```html
<cu-month-slider id="mes"></cu-month-slider>

<script>
  const mes = document.getElementById('mes');
  mes.addEventListener('change', (e) => console.log('nuevo mes:', e.detail));
  mes.nextMonth();
  mes.goToMonth('2030-06-01');
</script>
```

---

### `<cu-year-slider>`

Selector de año con navegación por botones. Muestra el año actual y permite moverse de 1 en 1 con `<` / `>`. No usa `<<` / `>>` porque los años van de uno en uno. Soporta límites mínimos/máximos y las mismas variantes de color que el resto de la librería.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `model-value` | `number` | año actual | Año seleccionado (soporta `v-model`) |
| `variant` | `string` | `"soft"` | Variante del label: `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `min` | `number` | — | Año mínimo navegable (el botón `<` se deshabilita en el borde) |
| `max` | `number` | — | Año máximo navegable (el botón `>` se deshabilita en el borde) |
| `color` | `string` | `"primary"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `disabled` | `boolean` | `false` | Deshabilita la navegación |

> No expone prop `theme`.

#### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `change` | `number` | Cambio de año (botones o programático) |
| `update:modelValue` | `number` | Nuevo año (para `v-model` en Vue) |

#### Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.nextYear()` / `.prevYear()` | Avanza / retrocede un año |
| `.goToYear(value)` | Va a un año puntual (`number`), recortado por `min`/`max` |
| `.getValue()` | Devuelve el año actual como `number` |
| `.setValue(value)` | Setea el año actual |

#### Uso

```html
<script src="ruta/CuYear-slider.umd.js"></script>

<cu-year-slider></cu-year-slider>

<cu-year-slider model-value="2025" min="2020" max="2030"></cu-year-slider>

<cu-year-slider variant="outlined" color="success"></cu-year-slider>
```

Control programático:

```html
<cu-year-slider id="anio"></cu-year-slider>

<script>
  const anio = document.getElementById('anio');
  anio.addEventListener('change', (e) => console.log('nuevo año:', e.detail));
  anio.nextYear();
  anio.goToYear(2030);
</script>
```

---

### `<cu-pagination>`

Paginación para tablas o listas.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `current-page` | `number` | `1` | Página actual |
| `total-pages` | `number` | `1` | Total de páginas |
| `total-items` | `number` | `0` | Total de items |
| `items-per-page` | `number` | `10` | Items por página |
| `show-page-size` | `boolean` | `false` | Muestra selector de items por página |
| `page-size-options` | `array` | `[5,10,20,50]` | Opciones del selector |
| `show-first-and-last` | `boolean` | `false` | Muestra botones de primera/última página |

#### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `update:currentPage` | `number` | Cambio de página |
| `update:itemsPerPage` | `number` | Cambio de items por página |

#### Uso

```html
<cu-pagination
  current-page="1"
  total-pages="10"
  total-items="100"
  color="primary"
  variant="soft"
  show-page-size
  id="paginacion"
></cu-pagination>

<script>
  document.getElementById('paginacion').addEventListener('update:currentPage', (e) => {
    console.log('Página:', e.detail);
  });
  document.getElementById('paginacion').addEventListener('update:itemsPerPage', (e) => {
    console.log('Items por página:', e.detail);
  });
</script>
```

> **Nota:** Los eventos de Custom Elements usan `e.detail` para acceder al payload.

---

### `<cu-table>`

Tabla avanzada con búsqueda, edición inline, paginación, badges y botones por celda.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link` |
| `columns` | `array` | `[]` | Configuración de columnas (ver abajo) |
| `data` | `array` | `[]` | Datos de la tabla |
| `empty` | `string` | `""` | Texto cuando no hay datos |
| `pagination` | `boolean` | `false` | Habilita paginación |
| `items-per-page` | `number` | `10` | Items por página |
| `show-page-size` | `boolean` | `false` | Selector de items por página |
| `page-size-options` | `array` | `[5,10,20,50]` | Opciones del selector |
| `search-enabled` | `boolean` | `false` | Habilita búsqueda |
| `search-placeholder` | `string` | `"Buscar..."` | Placeholder del buscador |
| `search-fields` | `array` | `[]` | Columnas en las que buscar |
| `search-value` | `string` | `""` | Valor de búsqueda inicial |

#### Interfaz de columna (`Column`)

```ts
interface Column {
  key: string;              // Nombre del campo en data
  label?: string;           // Texto del encabezado (default: key)
  cell?: (row) => string | string[];  // Renderizado personalizado
  editable?: boolean | RegExp;        // Editable, opcional con regex de validación
  inputType?: "input" | "textarea";   // Tipo de editor (default: "input")
  validator?: (value, row) => boolean; // Validador personalizado
  singleClick?: boolean;              // Editar con 1 clic (default: 2)
  badges?: (row) => BadgeConfig[];    // Renderizar badges en la celda
  buttons?: (row) => ButtonConfig[];  // Renderizar botones en la celda
}

// Config para badges dentro de una celda
interface BadgeConfig {
  value: string;
  color?: string;    // Nombre semántico o hex
  variant?: string;
}

// Config para botones dentro de una celda
interface ButtonConfig {
  label: string;
  onClick?: (row) => void;
  to?: string;
  target?: string;
  color?: string;
  variant?: string;
}
```

#### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `update:currentPage` | `number` | Cambio de página |
| `update:itemsPerPage` | `number` | Cambio de items por página |
| `update:search` | `string` | Cambio en la búsqueda |
| `edit-start` | `{ row, column, index }` | Inicia edición de celda |
| `edit-save` | `{ row, column, value, index }` | Guarda edición |
| `edit-cancel` | `{ row, column, index }` | Cancela edición |
| `row-click` | `{ row, index, event }` | Click en fila |
| `row-dblclick` | `{ row, index, event }` | Doble click en fila |
| `cell-click` | `{ row, col, index, event }` | Click en celda |

#### Slots

| Slot | Bindings | Descripción |
|------|----------|-------------|
| `#header` | `{ column, color, variant }` | Personaliza el header completo |
| `#header-{key}` | `{ column, color, variant }` | Header de una columna específica |
| `#cell-{key}` | `{ row, column, index, value }` | Celda de una columna específica |
| `#empty` | — | Contenido cuando no hay datos |
| `#search` | `{ query, update }` | Personaliza el input de búsqueda |

#### Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.updateRow(index, newData)` | Actualiza una fila por índice |
| `.getData()` | Devuelve copia de todos los datos |
| `.getRow(index)` | Devuelve copia de una fila |
| `.removeRow(index)` | Elimina una fila |
| `.addRow(newRow)` | Agrega una fila |
| `.pushData(items[])` | Agrega múltiples filas |

#### Uso básico

```html
<cu-table
  id="miTabla"
  color="primary"
  variant="soft"
  search-enabled
  pagination
  items-per-page="5"
></cu-table>

<script>
  const tabla = document.getElementById('miTabla');

  // Configurar columnas
  tabla.columns = [
    { key: 'nombre', label: 'Nombre', editable: true },
    { key: 'email', label: 'Correo', editable: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { key: 'rol', label: 'Rol', badges: (row) => [
      { value: row.rol, color: row.rol === 'Admin' ? 'danger' : 'primary', variant: 'soft' }
    ]},
    { key: 'acciones', label: 'Acciones', buttons: (row) => [
      { label: 'Editar', color: 'primary', variant: 'ghost', onClick: (r) => console.log('Editar', r) },
      { label: 'Eliminar', color: 'danger', variant: 'ghost', onClick: (r) => console.log('Eliminar', r) },
    ]},
  ];

  // Cargar datos
  tabla.data = [
    { nombre: 'Juan Pérez', email: 'juan@ejemplo.com', rol: 'Admin' },
    { nombre: 'María García', email: 'maria@ejemplo.com', rol: 'Usuario' },
    { nombre: 'Carlos López', email: 'carlos@ejemplo.com', rol: 'Editor' },
  ];

  // Escuchar eventos
  tabla.addEventListener('edit-save', (e) => {
    console.log('Celda editada:', e.detail);
    // e.detail = { row, column, value, index }
  });

  // Manipular datos programáticamente
  tabla.addRow({ nombre: 'Nuevo', email: 'nuevo@ejemplo.com', rol: 'Usuario' });
  tabla.removeRow(0);
  console.log(tabla.getData());
</script>
```

#### Uso con badges y botones por celda

```html
<cu-table id="tablaAvanzada" color="primary" variant="soft"></cu-table>

<script>
  const t = document.getElementById('tablaAvanzada');
  t.columns = [
    { key: 'nombre', label: 'Nombre' },
    {
      key: 'estado',
      label: 'Estado',
      badges: (row) => [{
        value: row.estado,
        color: row.estado === 'Activo' ? 'success' : 'warning',
        variant: 'soft',
      }],
    },
    {
      key: 'acciones',
      label: '',
      buttons: (row) => [
        { label: '✏️', color: 'primary', variant: 'ghost', onClick: (r) => editar(r) },
        { label: '🗑️', color: 'danger', variant: 'ghost', onClick: (r) => eliminar(r) },
      ],
    },
  ];
  t.data = [
    { nombre: 'Proyecto Alpha', estado: 'Activo' },
    { nombre: 'Proyecto Beta', estado: 'Pendiente' },
  ];
</script>
```

---

### `<cu-dropdown-menu>`

Menú desplegable con toggle, posicionamiento y slots.

#### Props

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

#### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `open` | — | Se abre el menú |
| `close` | — | Se cierra el menú |

#### Slots

| Slot | Descripción |
|------|-------------|
| `default` | Contenido del menú desplegable |
| `toggle` | Reemplaza el botón toggle por defecto |

> **Importante:** Los slots en Custom Elements usan el atributo `slot="nombre"` en HTML plano. No uses `#nombre` (es sintaxis de Vue, no funciona con UMD).

#### Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.open()` | Abre el menú |
| `.close()` | Cierra el menú |
| `.toggle()` | Alterna visibilidad |
| `.isOpen` (getter) | Estado actual (`boolean`) |

#### Uso

```html
<cu-dropdown-menu label="Acciones" color="primary" variant="soft">
  <a href="/editar">Editar</a>
  <a href="/duplicar">Duplicar</a>
  <hr />
  <a href="/eliminar">Eliminar</a>
</cu-dropdown-menu>

<cu-dropdown-menu id="ddOpciones" color="danger" variant="outlined" placement="bottom-end">
  <button onclick="alert('Opción 1')">Opción 1</button>
  <button onclick="alert('Opción 2')">Opción 2</button>
</cu-dropdown-menu>

<script>
  document.getElementById('ddOpciones').addEventListener('open', () => {
    console.log('Dropdown abierto');
  });
  document.getElementById('ddOpciones').addEventListener('close', () => {
    console.log('Dropdown cerrado');
  });
</script>
```

#### Toggle personalizado

Reemplaza el botón por defecto usando `slot="toggle"`:

```html
<cu-dropdown-menu id="ddCustom">
  <button slot="toggle" onclick="document.getElementById('ddCustom').toggle()"
          style="background:#3b82f6;color:white;border:none;border-radius:4px;padding:6px 12px;cursor:pointer">
    ☰ Menú
  </button>
  <a href="/perfil">Perfil</a>
  <a href="/config">Configuración</a>
  <a href="/logout">Cerrar sesión</a>
</cu-dropdown-menu>
```

> **Nota:** Al usar un toggle personalizado, debes controlar la apertura/cierre manualmente, por ejemplo con `document.getElementById('id').toggle()`.

#### Control programático

```html
<cu-dropdown-menu id="ddAPI" label="Dropdown programático">
  <button onclick="console.log('Acción ejecutada')">Acción</button>
</cu-dropdown-menu>

<script>
  const dd = document.getElementById('ddAPI');
  dd.open();                // Abre el menú
  dd.close();               // Cierra el menú
  dd.toggle();              // Alterna visibilidad
  console.log(dd.isOpen);   // true | false
</script>
```

---

## Notas Técnicas

### Eventos en Custom Elements

Los eventos emitidos por los componentes (como `update:currentPage`, `edit-save`, etc.) se reciben en JavaScript estándar a través de `addEventListener`. El payload está en `event.detail`:

```js
element.addEventListener('edit-save', (e) => {
  console.log(e.detail); // { row, column, value, index }
});
```

### Definición de temas personalizados

Para agregar un nuevo tema, edita `src/config/theme.ts`:

```ts
export const themes = {
  // ... temas existentes
  miTema: {
    primary: '#ff6600',
    neutral: '#333333',
    success: '#00cc66',
    warning: '#ffcc00',
    danger: '#ff3333',
  },
};
```

Luego reconstruye la librería con `pnpm build:lib`. El nuevo tema se detecta automáticamente vía `data-theme="miTema"` o `theme="miTema"` sin modificar ningún componente.

### Tamaños de los bundles

Cada archivo UMD incluye el runtime de Vue 3 (no externalizado):

| Componente | Tamaño | Gzip |
|------------|--------|------|
| CuButton | ~184 kB | ~45 kB |
| CuAlert | ~195 kB | ~47 kB |
| CuBadge | ~182 kB | ~45 kB |
| CuInput | ~190 kB | ~47 kB |
| CuCheckbox | ~186 kB | ~46 kB |
| CuTextarea | ~185 kB | ~45 kB |
| CuSelect | ~188 kB | ~46 kB |
| CuSwitch | ~186 kB | ~45 kB |
| CuLabel | ~167 kB | ~40 kB |
| CuModal | ~204 kB | ~50 kB |
| CuCollapse | ~217 kB | ~52 kB |
| CuMonth-slider | ~208 kB | ~49 kB |
| CuYear-slider | ~208 kB | ~49 kB |
| CuPagination | ~197 kB | ~48 kB |
| CuTable | ~256 kB | ~57 kB |
| CuDropdownMenu | ~204 kB | ~49 kB |
| CuAutocomplete | ~214 kB | ~51 kB |

### Compatibilidad

- Funcionan en todos los navegadores modernos (Chrome, Firefox, Safari, Edge).
- Requieren soporte de Custom Elements v1 y Shadow DOM.
- No requieren polyfills para navegadores actuales.
- Funcionan en cualquier framework (React, Angular, Svelte, Vue, etc.) o sin framework.
- Atributos booleanos: en HTML plano, usa `disabled`, `close`, `pagination`, etc. (sin valor o con el nombre del atributo).
- Atributos numéricos/array: usa `current-page="1"`, `items-per-page="10"`. Para arrays, asigna vía JS: `element.columns = [...]`.
