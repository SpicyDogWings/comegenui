// Comportamiento de Dropdown según su ficha (docs/componentes/vue/dropdown.md).
//
// Aserciones escritas a MANO desde la prosa de la ficha (motor de panel
// desplegable: toggle + panel + valor seleccionable), no derivadas del código.
import { describe, it, expect, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Dropdown from "./Dropdown.vue";

type DropdownVm = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  get: () => string;
  set: (val: string) => void;
  reset: () => void;
  isOpen: () => boolean;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as DropdownVm;
const panel = (w: ReturnType<typeof mount>) => w.find(".cu-dropdown-panel");

describe("Dropdown — visibilidad programática", () => {
  it("arranca cerrado y `open()`/`close()`/`toggle()` controlan isOpen()", async () => {
    const w = mount(Dropdown);
    expect(vm(w).isOpen()).toBe(false);

    vm(w).open();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);

    vm(w).close();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);

    vm(w).toggle();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
  });

  it("emite open al abrir y close al cerrar", async () => {
    const w = mount(Dropdown);
    vm(w).open();
    await flushPromises();
    expect(w.emitted("open")).toHaveLength(1);

    vm(w).close();
    await flushPromises();
    expect(w.emitted("close")).toHaveLength(1);
  });

  it("con `disabled` no abre", async () => {
    const w = mount(Dropdown, { props: { disabled: true } });
    vm(w).open();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
  });
});

describe("Dropdown — v-model y valor seleccionable", () => {
  it("`set()`, `get()` y `reset()` controlan el valor del v-model", async () => {
    const w = mount(Dropdown);
    expect(vm(w).get()).toBe("");

    vm(w).set("b");
    await flushPromises();
    expect(vm(w).get()).toBe("b");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["b"]);

    vm(w).reset();
    await flushPromises();
    expect(vm(w).get()).toBe("");
  });
});

describe("Dropdown — trigger y slots", () => {
  it("renderiza el label del trigger por defecto y usa `label` cuando se pasa", () => {
    expect(mount(Dropdown).find(".cu-dropdown .cu-button").text()).toBe("Dropdown");
    const w = mount(Dropdown, { props: { label: "Acciones" } });
    expect(w.find(".cu-dropdown .cu-button").text()).toBe("Acciones");
  });

  it("el slot `toggle` expone { toggle, isOpen } y reemplaza al botón por defecto", async () => {
    const w = mount(Dropdown, {
      slots: {
        toggle: `<template #toggle="{ toggle, isOpen }">
          <button class="mi-toggle" @click="toggle">t:{{ isOpen }}</button>
        </template>`,
      },
    });
    expect(w.find(".cu-dropdown .cu-button").exists()).toBe(false);
    expect(w.find(".mi-toggle").text()).toBe("t:false");

    await w.find(".mi-toggle").trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
  });

  it("el slot default llena el panel", async () => {
    const w = mount(Dropdown, { slots: { default: '<span class="mi-item">uno</span>' } });
    vm(w).open();
    await flushPromises();
    expect(panel(w).find(".mi-item").exists()).toBe(true);
  });
});

describe("Dropdown — items", () => {
  it("renderiza los items como botones de menú y un link cuando tiene href", async () => {
    const w = mount(Dropdown, {
      props: {
        items: [
          { label: "Editar" },
          { label: "Perfil", href: "/perfil" },
        ],
      },
    });
    vm(w).open();
    await flushPromises();

    expect(panel(w).findAll("button.cu-dropdown-menu-item")).toHaveLength(1);
    const link = panel(w).find("a.cu-dropdown-menu-item");
    expect(link.attributes("href")).toBe("/perfil");
    expect(link.text()).toContain("Perfil");
  });

  it("usa `to` como destino del link", async () => {
    const w = mount(Dropdown, { props: { items: [{ label: "Inicio", to: "/inicio" }] } });
    vm(w).open();
    await flushPromises();
    expect(panel(w).find("a.cu-dropdown-menu-item").attributes("href")).toBe("/inicio");
  });

  it("`divider` renderiza una línea divisoria en vez de un item", async () => {
    const w = mount(Dropdown, {
      props: { items: [{ label: "Uno" }, { divider: true }, { label: "Dos" }] },
    });
    vm(w).open();
    await flushPromises();

    expect(panel(w).findAll(".cu-dropdown-menu-divider")).toHaveLength(1);
    expect(panel(w).findAll("button.cu-dropdown-menu-item")).toHaveLength(2);
  });

  it("click en un item dispara su onClick y cierra el panel", async () => {
    const onClick = vi.fn();
    const w = mount(Dropdown, { props: { items: [{ label: "Editar", onClick }] } });
    vm(w).open();
    await flushPromises();

    await panel(w).find("button.cu-dropdown-menu-item").trigger("click");
    await flushPromises();

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(vm(w).isOpen()).toBe(false);
  });

  it("un item `disabled` no dispara onClick ni cierra", async () => {
    const onClick = vi.fn();
    const w = mount(Dropdown, {
      props: { items: [{ label: "Eliminar", disabled: true, onClick }] },
    });
    vm(w).open();
    await flushPromises();

    const item = panel(w).find("button.cu-dropdown-menu-item");
    expect(item.attributes("disabled")).toBeDefined();
    await item.trigger("click");
    await flushPromises();

    expect(onClick).not.toHaveBeenCalled();
    expect(vm(w).isOpen()).toBe(true);
  });
});
