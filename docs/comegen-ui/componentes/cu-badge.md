# `<cu-badge>`

Etiqueta o badge pequeño para estados, categorías o metadata. Componente de presentación pura: no emite eventos ni expone métodos.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"ghost"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `hightContrast` | `boolean` | `false` | Modo de alto contraste para el texto |

## Slots

| Slot | Descripción |
|------|-------------|
| `default` | Contenido textual o ícono del badge |

## Eventos

Ninguno.

## Métodos

Ninguno.

---

## Uso en HTML plano

```html
<script src="dist/CuBadge.umd.js"></script>

<cu-badge color="primary" variant="solid">Nuevo</cu-badge>
<cu-badge color="success" variant="soft">Activo</cu-badge>
<cu-badge color="warning" variant="outlined">Pendiente</cu-badge>
<cu-badge color="danger" variant="subtle">Error</cu-badge>
```

## Variantes visuales

```html
<cu-badge color="primary" variant="solid">solid</cu-badge>
<cu-badge color="primary" variant="outlined">outlined</cu-badge>
<cu-badge color="primary" variant="soft">soft</cu-badge>
<cu-badge color="primary" variant="ghost">ghost</cu-badge>
<cu-badge color="primary" variant="subtle">subtle</cu-badge>
```

## Con ícono

```html
<cu-badge color="success" variant="soft">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block;vertical-align:middle;margin-right:4px">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
  Verificado
</cu-badge>
```
