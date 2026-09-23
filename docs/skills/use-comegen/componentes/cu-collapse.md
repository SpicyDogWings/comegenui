# `<cu-collapse>`

Sección colapsable con trigger (botón + chevron animado). El contenido se muestra/oculta con una transición de altura. Útil para acordeones, menús anidados o secciones "más información".

[← Volver](../SKILL.md)

---

---

## Uso en HTML plano

```html
<script src="dist/CuCollapse.umd.js"></script>

<cu-collapse label="Más información">
  <p>Este contenido está oculto por defecto.</p>
</cu-collapse>
```

---

## Abierto por defecto

```html
<cu-collapse label="Opciones avanzadas" default-open>
  <p>Visible desde el inicio gracias a <code>default-open</code>.</p>
</cu-collapse>
```

---

## Colores

```html
<cu-collapse label="Información" color="primary">...</cu-collapse>
<cu-collapse label="Éxito" color="success">...</cu-collapse>
<cu-collapse label="Advertencia" color="warning">...</cu-collapse>
<cu-collapse label="Peligro" color="danger">...</cu-collapse>
```

---

## Anidados

Los collapses se pueden anidar para construir árboles de menú:

```html
<cu-collapse label="Sección padre" color="primary" default-open>
  <p>Contenido de nivel superior.</p>
  <cu-collapse label="Hijo">
    <p>Contenido anidado con su propio toggle.</p>
  </cu-collapse>
</cu-collapse>
```

---

## Escuchar eventos

```js
const collapse = document.getElementById('miCollapse');

collapse.addEventListener('toggle', (e) => {
  console.log('abierto:', e.detail); // true | false
});
```

---

## Control programático

```html
<cu-collapse id="miCollapse" label="Programático">
  <p>Controlado desde JS con open()/close()/toggle().</p>
</cu-collapse>

<script>
  const c = document.getElementById('miCollapse');
  c.open();
  c.close();
  c.toggle();
  c.isOpen(); // boolean
</script>
```

---

## Ejemplo completo

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Collapse Demo</title>
</head>
<body>
  <cu-collapse id="faq" label="¿Qué es ComegenUI?" color="primary">
    <p>Una librería de componentes UI como Custom Elements nativos.</p>
  </cu-collapse>

  <cu-button onclick="toggleFaq()">Alternar FAQ</cu-button>

  <script src="dist/CuCollapse.umd.js"></script>
  <script src="dist/CuButton.umd.js"></script>
  <script>
    const faq = document.getElementById('faq');

    faq.addEventListener('toggle', (e) => {
      console.log('FAQ abierto:', e.detail);
    });

    function toggleFaq() {
      faq.toggle();
    }
  </script>
</body>
</html>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `label` | `string` | — | Texto del trigger |
| `defaultOpen` | `boolean` | `false` |  |
| `color` | `"neutral" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del trigger: `primary`, `neutral`, `success`, `warning`, `danger` |

> El Custom Element **no expone** prop `variant` ni `theme`. El trigger siempre usa la variante `ghost` y el color se controla con `color`.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `toggle` | `boolean` | Se emite al cambiar el estado abierto/cerrado. El payload es el nuevo estado (`true` = abierto) |

## Slots

| Slot | Descripción |
|------|------|
| `default` | Contenido colapsable |

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.open()` | Abre el collapse |
| `.close()` | Cierra el collapse |
| `.toggle()` | Alterna el estado |
| `.isOpen()` | Devuelve el estado actual (`boolean`) |
