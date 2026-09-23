# `<cu-avatar>`

Avatar circular (imagen o iniciales) con color semántico y tres tamaños. Si no se pasa `color`, elige un color determinístico a partir de las iniciales.

[← Volver](../SKILL.md)

---

---

## Uso en HTML plano

```html
<script src="dist/CuAvatar.umd.js"></script>

<cu-avatar initials="JP" color="primary"></cu-avatar>
<cu-avatar initials="MR" color="success" size="lg"></cu-avatar>
<cu-avatar initials="CD" size="sm"></cu-avatar>
```

---

## Tamaños

```html
<cu-avatar initials="A" size="sm"></cu-avatar>
<cu-avatar initials="A" size="md"></cu-avatar>
<cu-avatar initials="A" size="lg"></cu-avatar>
```

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"neutral" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `""` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. Si se omite, se elige por hash de las iniciales |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño: `sm`, `md`, `lg` |
| `initials` | `string` | `""` | Texto que se muestra como iniciales cuando no hay `src` |
| `src` | `string` | `""` | URL de la imagen. **Nota:** el wrapper CE declara la prop pero no la forwardea al componente interno (ver `docs/notes/05-wrappers-ce-incompletos.md`); por ahora la imagen no se renderiza vía Custom Element |

## Eventos

Ninguno.

## Slots

| Slot | Descripción |
|------|------|
| `default` | Iniciales o contenido del avatar. |

Ninguno (el wrapper CE no forwardea slots).

## Métodos expuestos

Ninguno.
