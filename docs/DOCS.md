# Documentación de ComegenUI

Bienvenido a la documentación del proyecto **ComegenUI 2.0** (librería de Web Components construida con Vue 3).

---

## ¿Qué necesitás?

### Solo quiero **usar** los componentes

Si querés consumir los componentes en tu proyecto (HTML plano, React, Vue, etc.):

- **[Guía de uso de ComegenUI](skills/use-comegen/SKILL.md)** — instalación, temas, variantes, API de cada componente.
- **[Documentación por componente](skills/use-comegen/componentes/)** — referencia detallada de la API.

### Quiero **contribuir / desarrollar**

Si vas a modificar o agregar componentes a la librería:

- **[DEV.md](DEV.md)** — guía práctica de desarrollo (setup, crear componentes, playground, build).
- **[Skill `desarrollar-comegen-ui`](desarrollar-comegen-ui/SKILL.md)** — guía detallada (para agentes y contribuidores).
- **[Skill `documentar-comegen-ui`](documentar-comegen-ui/SKILL.md)** — cómo documentar componentes.
- **[Skill `generate-release`](skills/generate-release/SKILL.md)** — preparar la próxima release (stories faltantes, fichas, todos los tests, build del zip).

### Quiero ver el **estado del proyecto**

- **[Notas de auditoría](notes/)** — problemas pendientes y decisiones técnicas.

---

## Componentes disponibles

| Componente | Documentación |
|------------|---------------|
| `<cu-alert>` | [Ver docs](skills/use-comegen/componentes/cu-alert.md) |
| `<cu-author-card>` | [Ver docs](skills/use-comegen/componentes/cu-author-card.md) |
| `<cu-autocomplete>` | [Ver docs](skills/use-comegen/componentes/cu-autocomplete.md) |
| `<cu-avatar>` | [Ver docs](skills/use-comegen/componentes/cu-avatar.md) |
| `<cu-badge>` | [Ver docs](skills/use-comegen/componentes/cu-badge.md) |
| `<cu-button>` | [Ver docs](skills/use-comegen/componentes/cu-button.md) |
| `<cu-calendar>` | [Ver docs](skills/use-comegen/componentes/cu-calendar.md) |
| `<cu-card>` | [Ver docs](skills/use-comegen/componentes/cu-card.md) |
| `<cu-cells-importer>` | [Ver docs](skills/use-comegen/componentes/cu-cells-importer.md) |
| `<cu-checkbox>` | [Ver docs](skills/use-comegen/componentes/cu-checkbox.md) |
| `<cu-collapse>` | [Ver docs](skills/use-comegen/componentes/cu-collapse.md) |
| `<cu-command-palette>` | [Ver docs](skills/use-comegen/componentes/cu-command-palette.md) |
| `<cu-color-picker>` | [Ver docs](skills/use-comegen/componentes/cu-color-picker.md) |
| `<cu-date-picker>` | [Ver docs](skills/use-comegen/componentes/cu-date-picker.md) |
| `<cu-date-picker-range>` | [Ver docs](skills/use-comegen/componentes/cu-date-picker-range.md) |
| `<cu-dropdown-menu>` | [Ver docs](skills/use-comegen/componentes/cu-dropdown-menu.md) |
| `<cu-file-input>` | [Ver docs](skills/use-comegen/componentes/cu-file-input.md) |
| `<cu-file-input-zone>` | [Ver docs](skills/use-comegen/componentes/cu-file-input-zone.md) |
| `<cu-floating-button>` | [Ver docs](skills/use-comegen/componentes/cu-floating-button.md) |
| `<cu-input>` | [Ver docs](skills/use-comegen/componentes/cu-input.md) |
| `<cu-label>` | [Ver docs](skills/use-comegen/componentes/cu-label.md) |
| `<cu-markdown>` | [Ver docs](skills/use-comegen/componentes/cu-markdown.md) |
| `<cu-modal>` | [Ver docs](skills/use-comegen/componentes/cu-modal.md) |
| `<cu-navbar>` | [Ver docs](skills/use-comegen/componentes/cu-navbar.md) |
| `<cu-navbar-horizontal>` | [Ver docs](skills/use-comegen/componentes/cu-navbar-horizontal.md) |
| `<cu-pagination>` | [Ver docs](skills/use-comegen/componentes/cu-pagination.md) |
| `<cu-select>` | [Ver docs](skills/use-comegen/componentes/cu-select.md) |
| `<cu-side-over>` | [Ver docs](skills/use-comegen/componentes/cu-side-over.md) |
| `<cu-switch>` | [Ver docs](skills/use-comegen/componentes/cu-switch.md) |
| `<cu-tabs>` | [Ver docs](skills/use-comegen/componentes/cu-tabs.md) |
| `<cu-table>` | [Ver docs](skills/use-comegen/componentes/cu-table.md) |
| `<cu-textarea>` | [Ver docs](skills/use-comegen/componentes/cu-textarea.md) |
| `<cu-tooltip>` | [Ver docs](skills/use-comegen/componentes/cu-tooltip.md) |

---

## Recursos rápidos

| Recurso | Descripción |
|---------|-------------|
| [DEV.md](DEV.md) | Guía práctica para desarrollar y contribuir |
| [Playground](../playground/) | HTML estático para experimentar con los UMD |
| [Storybook](../.storybook/) | Exploración visual de componentes (`pnpm storybook`) |
| [Build config](../build-libs.ts) | Pipeline que genera los UMD |
| [Temas](../src/config/theme.ts) | Configuración de temas (`light`, `dark`, `sigacadv2`) |

---

## Estructura de la documentación

```
docs/
├── DOCS.md                          ← este archivo
├── DEV.md                           ← guía de desarrollo
├── comegen-ui/                      ← documentación de uso (para usuarios finales)
│   ├── SKILL.md
│   └── componentes/
├── desarrollar-comegen-ui/          ← skill de desarrollo (para contribuidores)
│   ├── SKILL.md
│   ├── arquitectura.md
│   ├── crear-componente.md
│   ├── ...
├── documentar-comegen-ui/           ← skill de documentación (para quien documenta)
│   ├── SKILL.md
│   ├── arquitectura.md
│   ├── ...
└── notes/                           ← notas internas de auditoría
    ├── 00-README.md
    ├── 01-build-glob.md
    ├── ...
```
