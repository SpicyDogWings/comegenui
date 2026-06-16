# Documentación de ComegenUI

Bienvenido a la documentación del proyecto **ComegenUI 2.0**.

---

## Para usuarios de los componentes

Si solo quieres **usar los componentes** en tu proyecto (HTML plano, React, Vue, etc.):

- [Guía de uso de ComegenUI](comegen-ui/SKILL.md) — Instalación, temas, variantes, API de componentes

### Componentes

| Componente | Documentación |
|------------|---------------|
| `<cu-button>` | [Ver docs](comegen-ui/componentes/cu-button.md) |
| `<cu-alert>` | [Ver docs](comegen-ui/componentes/cu-alert.md) |
| `<cu-badge>` | [Ver docs](comegen-ui/componentes/cu-badge.md) |
| `<cu-input>` | [Ver docs](comegen-ui/componentes/cu-input.md) |
| `<cu-checkbox>` | [Ver docs](comegen-ui/componentes/cu-checkbox.md) |
| `<cu-textarea>` | [Ver docs](comegen-ui/componentes/cu-textarea.md) |
| `<cu-select>` | [Ver docs](comegen-ui/componentes/cu-select.md) |
| `<cu-switch>` | [Ver docs](comegen-ui/componentes/cu-switch.md) |
| `<cu-label>` | [Ver docs](comegen-ui/componentes/cu-label.md) |
| `<cu-modal>` | [Ver docs](comegen-ui/componentes/cu-modal.md) |
| `<cu-pagination>` | [Ver docs](comegen-ui/componentes/cu-pagination.md) |
| `<cu-table>` | [Ver docs](comegen-ui/componentes/cu-table.md) |
| `<cu-dropdown>` | [Ver docs](comegen-ui/componentes/cu-dropdown.md) |

---

## Build y desarrollo del proyecto

Para **contribuir o modificar** la librería:

### Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Servidor de desarrollo Vite |
| `pnpm build` | Build completo (type-check + build Vue) |
| `pnpm build:lib` | Genera los archivos UMD en `dist/` |
| `pnpm build:lib -- X.Y.Z` | Build UMD con versión específica |
| `pnpm storybook` | Storybook en http://localhost:6006 |
| `pnpm type-check` | TypeScript check |

### Build de librería (`build:lib`)

Ejecuta `build-libs.ts` que:

1. Limpia `dist/`
2. Compila cada componente individualmente con Vite en formato UMD
3. Copia `README-BUILD.md` a `dist/`
4. Genera un `comegenui.zip` con todos los `.umd.js`

```bash
pnpm build:lib
```

### Temas personalizados

Para agregar un tema nuevo, edita `src/config/theme.ts`:

```ts
export const themes = {
  miTema: {
    primary: '#ff6600',
    neutral: '#333333',
    success: '#00cc66',
    warning: '#ffcc00',
    danger: '#ff3333',
  },
};
```

Luego reconstruye con `pnpm build:lib`. El tema se detecta automáticamente vía `data-theme="miTema"`.

### Versiones

Los archivos UMD generados están en `dist/` e incluyen un `README-BUILD.md` con la versión. El zip `comegenui.zip` contiene solo los UMD + README para distribución.

---

## Recursos

- [README-BUILD.md](../README-BUILD.md) — Documentación técnica incluida en la build
- [Storybook](.storybook/) — Exploración visual de componentes (dev)
