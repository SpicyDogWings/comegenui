// Comportamiento de DropdownMenu según su ficha (docs/componentes/vue/dropdown-menu.md).
//
// Aserciones escritas a MANO desde la prosa de la ficha (menú con items
// declarativos, slot de toggle, panel por items o por slot).
import { describe, it, expect, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import DropdownMenu from "./DropdownMenu.vue";

type DropdownMenuVm = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as DropdownMenuVm;
const panel = (w: ReturnType<typeof mount>) => w.find(".cu-dropdown-panel");

describe("DropdownMenu — visibilidad programática", () => {
  it("arranca cerrado; open/close/toggle controlan isOpen()", async () => {
    const w = mount(DropdownMenu);
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
    const w = mount(DropdownMenu);
    vm(w).open();
    await flushPromises();
    expect(w.emitted("open")).toHaveLength(1);

    vm(w).close();
    await flushPromises();
    expect(w.emitted("close")).toHaveLength(1);
  });
});

describe("DropdownMenu — trigger", () => {
  it("el botón por defecto muestra el label (`Menú` si no se pasa)", () => {
    expect(mount(DropdownMenu).find(".cu-dropdown-toggle").text()).toContain("Menú");
    expect(
      mount(DropdownMenu, { props: { label: "Acciones" } }).find(".cu-dropdown-toggle").text(),
    ).toContain("Acciones");
  });

  it("el slot `toggle` reemplaza el botón por defecto y expone { toggle }", async () => {
    const w = mount(DropdownMenu, {
      slots: {
        toggle: `<template #toggle="{ toggle }">
          <button class="mi-toggle" @click="toggle">abrir</button>
        </template>`,
      },
    });
    expect(w.find(".cu-dropdown-toggle").exists()).toBe(false);

    await w.find(".mi-toggle").trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
  });
});

describe("DropdownMenu — items", () => {
  it("renderiza un botón por item y una línea por `divider`", async () => {
    const w = mount(DropdownMenu, {
      props: {
        items: [
          { label: "Editar" },
          { divider: true },
          { label: "Eliminar", color: "danger" },
        ],
      },
    });
    vm(w).open();
    await flushPromises();

    expect(panel(w).findAll(".cu-dropdown-item")).toHaveLength(2);
    expect(panel(w).findAll(".cu-dropdown-divider")).toHaveLength(1);
  });

  it("un item con `href` se renderiza como link", async () => {
    const w = mount(DropdownMenu, {
      props: { items: [{ label: "Perfil", href: "/perfil", target: "_blank" }] },
    });
    vm(w).open();
    await flushPromises();

    const link = panel(w).find("a");
    expect(link.attributes("href")).toBe("/perfil");
    expect(link.attributes("target")).toBe("_blank");
  });

  it("click en un item dispara su onClick y cierra el menú", async () => {
    const onClick = vi.fn();
    const w = mount(DropdownMenu, { props: { items: [{ label: "Editar", onClick }] } });
    vm(w).open();
    await flushPromises();

    await panel(w).find(".cu-dropdown-item").trigger("click");
    await flushPromises();

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(vm(w).isOpen()).toBe(false);
  });

  it("un item `disabled` no dispara onClick ni cierra el menú", async () => {
    const onClick = vi.fn();
    const w = mount(DropdownMenu, {
      props: { items: [{ label: "Eliminar", disabled: true, onClick }] },
    });
    vm(w).open();
    await flushPromises();

    const item = panel(w).find(".cu-dropdown-item");
    expect(item.attributes("disabled")).toBeDefined();
    await item.trigger("click");
    await flushPromises();

    expect(onClick).not.toHaveBeenCalled();
    expect(vm(w).isOpen()).toBe(true);
  });

  it("un item `disabled` con `href` tampoco dispara onClick (un `<a>` no es nativo-deshabilitado: frena el guard)", async () => {
    const onClick = vi.fn();
    const w = mount(DropdownMenu, {
      props: { items: [{ label: "Eliminar", href: "/x", disabled: true, onClick }] },
    });
    vm(w).open();
    await flushPromises();

    await panel(w).find("a.cu-dropdown-item").trigger("click");
    await flushPromises();

    expect(onClick).not.toHaveBeenCalled();
    expect(vm(w).isOpen()).toBe(true);
  });

  it("sin items, el slot por defecto llena el panel", async () => {
    const w = mount(DropdownMenu, {
      slots: { default: '<div class="mi-libre">contenido</div>' },
    });
    vm(w).open();
    await flushPromises();
    expect(panel(w).find(".mi-libre").exists()).toBe(true);
  });
});
