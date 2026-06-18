# Testing

ComegenUI usa **Vitest** para tests unitarios (específicamente, de composables). Storybook incluye `addon-vitest` para tests visuales en navegador.

## Estado actual

- ✅ Tests de composables: `usePagination`, `useSearch` (en `src/composables/`).
- ❌ No hay tests unitarios de componentes (`.vue` o `.ce.vue`).
- ❌ No hay tests E2E.
- ✅ Tests visuales con Storybook + `addon-vitest` (configurados pero sin tests aún).

## Composables testeados

### `usePagination.test.ts`

Cubre:

- Cálculo de `totalPages` según `itemsPerPage`.
- Slicing de datos para `displayData`.
- Métodos `setCurrentPage`, `setItemsPerPage`.
- Edge cases: páginas fuera de rango, datos vacíos.

### `useSearch.test.ts`

Cubre:

- Filtrado por `searchQuery`.
- Filtrado por `searchFields` específicos.
- Acento-insensitivity.
- Case-insensitivity.

## Cómo correr los tests

```bash
pnpm vitest              # modo watch (interactivo)
pnpm vitest run          # corre una vez y sale
pnpm vitest --coverage   # con cobertura
```

## Cómo escribir un test

```ts
// src/composables/usePagination.test.ts
import { describe, it, expect } from "vitest";
import { usePagination } from "./usePagination";

describe("usePagination", () => {
  it("calcula totalPages correctamente", () => {
    const data = Array.from({ length: 25 }, (_, i) => ({ id: i }));
    const p = usePagination(data, { itemsPerPage: 10 });
    expect(p.totalPages.value).toBe(3);
  });

  it("hace slice de displayData", () => {
    const data = Array.from({ length: 25 }, (_, i) => ({ id: i }));
    const p = usePagination(data, { initialPage: 2, itemsPerPage: 10 });
    expect(p.displayData.value).toHaveLength(10);
    expect(p.displayData.value[0].id).toBe(10);
  });
});
```

## Tests visuales con Storybook (`addon-vitest`)

Configurado pero sin uso actualmente. Para activarlo:

1. Crear un archivo `*.test.ts` o agregar `play` functions a una story.
2. Storybook detecta automáticamente con `@storybook/addon-vitest`.

```ts
// src/stories/Button.stories.ts
import { userEvent, within, expect } from "@storybook/test";

export const ClickTest: Story = {
  args: { label: "Click me" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.click(button);
    // expect(button).toHaveAttribute("aria-pressed", "true");
  },
};
```

## Tests de componentes (`.vue`)

No hay tests unitarios de componentes Vue todavía. Para agregar:

```ts
// src/components/Button.test.ts
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Button from "./Button.vue";

describe("Button", () => {
  it("renderiza el slot", () => {
    const wrapper = mount(Button, {
      props: { color: "#ff0000" },
      slots: { default: "Click me" },
    });
    expect(wrapper.text()).toBe("Click me");
  });
});
```

> **Nota:** los `.vue` internos esperan `color` en hex. Para tests, pasá siempre un hex, no un nombre semántico.

## Tests de Custom Elements (`.ce.vue`)

Los `.ce.vue` requieren un DOM (porque hacen `customElements.define` indirectamente). Para testearlos:

- Montar el `.vue` interno directamente (más simple).
- O usar `@vue/test-utils` con un entorno jsdom + `@web/test-runner` para tests reales de CE.

> El proyecto no tiene tests de `.ce.vue` actualmente. La cobertura se delega a Storybook y al playground.

## Cobertura

`pnpm vitest --coverage` genera un reporte en `coverage/`. Configurable en `vitest.config.ts` (no presente, valores por default).

## Convenciones

- **Naming:** `<archivo>.test.ts` al lado del archivo que testea.
- **Imports:** `describe`, `it`, `expect` de `vitest`.
- **No** tests de snapshot (frágiles y ruidosos).
- **No** tests de detalles de implementación. Testear comportamiento observable.
- **Mocks:** usar `vi.mock(...)` solo cuando sea estrictamente necesario.

## Resumen

| Para testear... | Usá... |
|-----------------|--------|
| Composables | `vitest` (tests ya existen) |
| Lógica de un componente Vue | `vitest` + `@vue/test-utils` (agregar) |
| Interacción visual | Storybook + `play` functions |
| Comportamiento end-to-end | (no hay, considerar Playwright) |
| Accesibilidad | Storybook + `addon-a11y` |
