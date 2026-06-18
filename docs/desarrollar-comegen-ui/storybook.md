# Storybook

ComegenUI usa Storybook 10 con Vue 3 + Vite para desarrollo visual de componentes.

## ¿Qué es?

Storybook es una herramienta que renderiza componentes en aislamiento, con controles para cambiar las props en vivo. Es ideal para:

- Iterar sobre el diseño visual de un componente.
- Probar todas las variantes sin tener que armar HTML a mano.
- Documentar la API visualmente (con `tags: ["autodocs"]`).
- Hacer testing visual (Chromatic, addon-a11y, addon-vitest).

## Ubicación de las stories

```
src/stories/
├── Button.stories.ts
├── Alert.stories.ts
├── Badge.stories.ts
├── Modal.stories.ts
├── Pagination.stories.ts
├── TestTableData.stories.ts
├── components/        ← carpeta para stories agrupadas
├── form/              ← stories de form/*
├── custom/            ← stories custom
├── assets/            ← assets compartidos
└── Configure.mdx      ← página de inicio de Storybook
```

Storybook detecta automáticamente cualquier archivo `*.stories.@(js|jsx|mjs|ts|tsx)` o `*.mdx` bajo `src/` (configurado en `.storybook/main.ts`).

## Agregar una story para un componente nuevo

Ver [crear-componente.md §4](crear-componente.md) para el template completo. Resumen:

```ts
// src/stories/MiComponente.stories.ts
import MiComponente from "../components/MiComponente.vue";
// ↑ ajustar el path según la carpeta (form/, data/, labs/)

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof MiComponente> = {
  title: "Components/MiComponente",  // o "Form/MiComponente", "Data/MiComponente"
  component: MiComponente,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "color", description: "Color hex (ej: #ff0000)" },
    hightContrast: { control: "boolean", description: "Alto contraste" },
    variant: {
      control: "select",
      options: ["solid", "outlined", "soft", "ghost", "subtle"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MiComponente>;

export const Solid: Story = {
  args: { color: "#1774A4", variant: "solid" },
  render: (args) => ({
    components: { MiComponente },
    setup: () => ({ args }),
    template: `<MiComponente v-bind="args">Click me</MiComponente>`,
  }),
};
```

## Estructura típica de un archivo de stories

```ts
import Componente from "../components/X.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Componente> = {
  title: "Components/X",           // ← path en el árbol de Storybook
  component: Componente,
  tags: ["autodocs"],              // ← genera docs automáticas
  argTypes: { /* controles */ },
  parameters: { /* layout, etc. */ },
};

export default meta;
type Story = StoryObj<typeof Componente>;

// Cada export es una story individual
export const Default: Story = { /* ... */ };
export const Solid: Story = { /* ... */ };
export const Outlined: Story = { /* ... */ };
```

## Patrones comunes

### Args vs render

- **Args simples:** solo pasar props, sin slots.

  ```ts
  export const Default: Story = {
    args: { variant: "soft" },
  };
  ```

- **Con slots:** usar `render` para tener template completo.

  ```ts
  export const ConIcono: Story = {
    args: { variant: "solid" },
    render: (args) => ({
      components: { Button },
      setup: () => ({ args }),
      template: `
        <Button v-bind="args">
          <svg width="16" height="16">...</svg>
          Click me
        </Button>
      `,
    }),
  };
  ```

### Decorators

Para envolver la story con un contenedor o fondo:

```ts
export default meta;
type Story = StoryObj & { decorators: any };

export const EnFondoOscuro: Story = {
  args: { variant: "soft" },
  decorators: [
    () => ({ template: '<div style="background:#222; padding:20px"><story /></div>' }),
  ],
};
```

### Play functions (interacción)

Para simular interacciones:

```ts
import { userEvent, within } from "@storybook/testing-library";

export const ConClick: Story = {
  args: { variant: "solid" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
  },
};
```

## Addons habilitados

Ver `package.json` y `.storybook/main.ts`. Actualmente:

- `@chromatic-com/storybook` — Visual regression testing.
- `@storybook/addon-vitest` — Tests con Vitest dentro de Storybook.
- `@storybook/addon-a11y` — Verificador de accesibilidad.
- `@storybook/addon-docs` — Generación de docs automáticas.
- `@storybook/addon-onboarding` — Tour guiado para nuevos usuarios.

## Storybook vs documentación de uso

La story sirve para **desarrollar** y **explorar visualmente** el componente. La documentación para el **usuario final** está en `docs/comegen-ui/componentes/cu-*.md` (ver skill [`documentar-comegen-ui`](../documentar-comegen-ui/SKILL.md)).

- **Story:** para el contribuidor. Muestra todas las variantes con controles.
- **Doc de uso:** para el consumidor. Muestra cómo usar el componente en HTML plano + UMD.

## Tests de Vitest en Storybook

Con `addon-vitest` podés correr tests en el navegador directamente desde Storybook. Ver [testing.md](testing.md).

## Estructura del título (path en el árbol)

Convención:

- `Components/<Nombre>` para componentes en `src/components/` raíz.
- `Form/<Nombre>` para `src/components/form/`.
- `Data/<Nombre>` para `src/components/data/`.
- `Labs/<Nombre>` para `src/components/labs/`.
- `Archived/<Nombre>` para `src/components/archived/`.

Ejemplo: `src/stories/Button.stories.ts` → título `"Components/Button"`.
