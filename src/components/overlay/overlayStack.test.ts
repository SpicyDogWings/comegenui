// Pila compartida de overlays: `Escape` y el bloqueo del scroll son del *conjunto* de
// overlays abiertos, no de cada componente.
//
// Antes cada overlay escuchaba `keydown` por su cuenta: un solo `Escape` cerraba el menú
// y su submenú (o un `Modal` y el `SideOver` de al lado) a la vez. Aserciones escritas a
// mano desde la prosa de las fichas: "cierre por Escape", "sólo el panel de arriba".
import { afterEach, describe, it, expect } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import Modal from "./Modal.vue";
import SideOver from "./SideOver.vue";
import Dropdown from "./Dropdown.vue";

/** API expuesta por los overlays que se manejan por código. */
interface OverlayVm {
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
}

const overlayVm = (w: VueWrapper): OverlayVm => w.vm as unknown as OverlayVm;

let wrappers: VueWrapper[] = [];

function track<T extends VueWrapper>(w: T): T {
  wrappers.push(w);
  return w;
}

afterEach(() => {
  for (const w of wrappers) {
    try {
      w.unmount();
    } catch {
      /* ya desmontado */
    }
  }
  wrappers = [];
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const pressEscape = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

const sideOver = (title: string) =>
  track(mount(SideOver, { attachTo: document.body, props: { modelValue: true, title } }));

const openModal = async (persistent = false) => {
  const modal = track(mount(Modal, { attachTo: document.body, props: { persistent } }));
  overlayVm(modal).open();
  await flushPromises();
  return modal;
};

describe("Pila de overlays — Escape sólo cierra el de arriba", () => {
  it("con un Modal y un SideOver abiertos, Escape cierra el SideOver y el segundo cierra el Modal", async () => {
    const modal = await openModal();
    const panel = sideOver("Filtros");
    await flushPromises();

    pressEscape();
    await flushPromises();

    expect(panel.emitted("update:modelValue")).toEqual([[false]]);
    expect(overlayVm(modal).isOpen()).toBe(true);

    // El consumidor aplica el v-model: el panel sale de la pila y el tope es el modal.
    await panel.setProps({ modelValue: false });
    pressEscape();
    await flushPromises();
    expect(overlayVm(modal).isOpen()).toBe(false);
  });

  it("un menú con un submenú abierto cierra primero el submenú", async () => {
    const Nested = defineComponent({
      render() {
        return h(
          Dropdown,
          { label: "Menú" },
          {
            default: () =>
              h(Dropdown, { label: "Submenú" }, { default: () => h("span", "x") }),
          },
        );
      },
    });

    const w = track(mount(Nested, { attachTo: document.body }));
    const menu = w.findComponent(Dropdown);
    overlayVm(menu).open();
    await flushPromises();

    const nested = w.findAllComponents(Dropdown)[1]!;
    overlayVm(nested).open();
    await flushPromises();
    expect(overlayVm(nested).isOpen()).toBe(true);

    pressEscape();
    await flushPromises();

    expect(overlayVm(nested).isOpen()).toBe(false);
    expect(overlayVm(menu).isOpen()).toBe(true);
  });

  it("un overlay `persistent` sigue arriba de la pila y no se cierra con Escape", async () => {
    const modal = await openModal(true);
    const panel = sideOver("Arriba");
    await flushPromises();

    pressEscape();
    await flushPromises();
    expect(panel.emitted("update:modelValue")).toEqual([[false]]);

    pressEscape();
    await flushPromises();
    expect(overlayVm(modal).isOpen()).toBe(true);
  });
});

describe("Pila de overlays — scroll lock coordinado", () => {
  it("el scroll se libera recién cuando el último overlay que lo pidió se cierra", async () => {
    document.body.style.overflow = "auto";

    const first = sideOver("Primero");
    await flushPromises();
    expect(document.body.style.overflow).toBe("hidden");

    // El modal también pide el lock: cerrarlo no debe soltar el del SideOver.
    const modal = await openModal();
    overlayVm(modal).close();
    await flushPromises();
    expect(document.body.style.overflow).toBe("hidden");

    await first.setProps({ modelValue: false });
    await flushPromises();
    expect(document.body.style.overflow).toBe("auto");
  });
});
