// Contrato de API desde la ficha. Por cada `docs/componentes/vue/<kebab>.md`,
// verifica contra la definición del componente que la API documentada exista:
// props (nombre + default), emits declarados, slots que renderizan y métodos
// expuestos. La ficha es la especificación; `gen-api --check` valida el código
// fuente, esto valida la definición/el runtime.
import { describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";

import { fichaSpec, type FichaSpec } from "../../scripts/ficha-api.mjs";
import { fichasWithComponent } from "../../scripts/component-map.mjs";
import { SLOT_SETUP } from "./slot-setup";

type ComponentLike = {
  props?: Record<string, unknown> | string[];
  emits?: string[] | Record<string, unknown>;
};

// jsdom no trae estas APIs que algunos componentes usan al montar.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;
globalThis.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent() {
    return false;
  },
})) as unknown as typeof matchMedia;

/** Props declaradas por la definición del componente (objeto u array). */
function declaredProps(component: ComponentLike): string[] {
  const props = component.props ?? {};
  if (Array.isArray(props)) return props;
  return Object.keys(props);
}

/** Emits declarados (`emits: [...]` u objeto). */
function declaredEmits(component: ComponentLike): string[] {
  const emits = component.emits ?? [];
  return Array.isArray(emits) ? emits : Object.keys(emits);
}

/**
 * Un default documentado es un literal JS (`"md"`, `'md'`, `false`, `true`,
 * `null`, `[]`, `{}`, `20`) o una descripción de objeto
 * (`{ enabled: false, type: "csv" }`). Se intenta parsear como JSON; si no es
 * JSON válido (claves sin comillas, `undefined`), se compara como texto.
 * `—` (o vacío) significa "sin default declarado".
 */
function documentedDefault(raw: unknown): { has: false } | { has: true; kind: "value" | "text"; value: unknown } {
  const text = String(raw ?? "").trim();
  if (text === "" || text === "—" || text === "undefined") return { has: false };
  const jsonish = text.replace(/'([^']*)'/g, '"$1"');
  try {
    return { has: true, kind: "value", value: JSON.parse(jsonish) };
  } catch {
    return { has: true, kind: "text", value: text };
  }
}

/** Valor del default que declara la definición de props de Vue. */
function runtimeDefault(component: ComponentLike, name: string): { declared: boolean; value: unknown } {
  const props = component.props ?? {};
  if (Array.isArray(props)) return { declared: false, value: undefined };
  const def = props[name];
  if (def === null || def === undefined) return { declared: false, value: undefined };
  if (typeof def === "function" && !def.prototype) {
    return { declared: true, value: (def as () => unknown)() };
  }
  if (typeof def === "object" && def !== null && "default" in def) {
    const d = (def as { default: unknown }).default;
    return {
      declared: true,
      value: typeof d === "function" && !d.prototype ? (d as () => unknown)() : d,
    };
  }
  return { declared: false, value: undefined };
}

const FICHAS = fichasWithComponent()
  .map(({ kebab, vue }) => ({ kebab, vue, spec: fichaSpec(kebab) }))
  .filter((entry): entry is { kebab: string; vue: string; spec: FichaSpec } => entry.spec !== null)
  // Sin API documentada (props/emits/slots/expose) no hay contrato que verificar.
  .filter(
    ({ spec }) =>
      spec.props.length || spec.emits.length || spec.slots.length || spec.expose.length,
  );

describe("contrato de API (ficha ↔ componente)", () => {
  it("hay fichas para verificar", () => {
    expect(FICHAS.length).toBeGreaterThan(0);
  });

  for (const { kebab, vue, spec } of FICHAS) {
    const importar = async () => (await import(/* @vite-ignore */ `../../${vue}`)).default;

    describe(`${kebab}`, () => {
      for (const prop of spec.props) {
        it(`declara la prop \`${prop.name}\``, async () => {
          const Component = await importar();
          expect(declaredProps(Component)).toContain(prop.name);
        });

        const documented = documentedDefault(prop.default);
        if (documented.has) {
          it(`default de \`${prop.name}\` = ${JSON.stringify(documented.value)}`, async () => {
            const Component = await importar();
            const runtime = runtimeDefault(Component, prop.name);
            expect(runtime.declared).toBe(true);
            if (documented.kind === "text") {
              // El default documentado no es JSON puro (objeto con claves sin
              // comillas): se comparan las claves/valores, sin comillas de string.
              const shape = (v: unknown) => JSON.stringify(v).replace(/"/g, "").replace(/\s+/g, "");
              expect(shape(runtime.value)).toBe(String(documented.value).replace(/"/g, "").replace(/\s+/g, ""));
            } else {
              expect(runtime.value).toEqual(documented.value);
            }
          });
        }
      }

      for (const emit of spec.emits) {
        it(`declara el evento \`${emit.name}\``, async () => {
          const Component = await importar();
          expect(declaredEmits(Component)).toContain(emit.name);
        });
      }

      for (const name of spec.expose) {
        it(`expone \`${name}\``, async () => {
          const Component = await importar();
          const setup = SLOT_SETUP[kebab] ?? {};
          const w = mount(Component, { props: setup.slotProps ?? {}, attachTo: document.body });
          setup.reveal?.(w as never);
          await flushPromises();
          expect(typeof (w.vm as Record<string, unknown>)[name]).toBe("function");
        });
      }

      for (const slot of spec.slots) {
        it(`renderiza el slot \`${slot}\``, async () => {
          const Component = await importar();
          const setup = SLOT_SETUP[kebab] ?? {};
          const perSlot = setup.slots?.[slot] ?? {};
          const marker = `__slot_${slot}__`;
          const w = mount(Component, {
            props: { ...(setup.slotProps ?? {}), ...(perSlot.slotProps ?? {}) },
            slots: { [slot]: `<span>${marker}</span>` },
            attachTo: document.body,
          });
          (perSlot.reveal ?? setup.reveal)?.(w as never);
          await flushPromises();
          // Algunos componentes (SideOver) teleportan su panel a `document.body`.
          const rendered = w.html() + (document.body.innerHTML ?? "");
          expect(rendered).toContain(marker);
          w.unmount();
        });
      }
    });
  }
});
