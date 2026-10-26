// Comportamiento de MenuOption, la fila compartida por Select, Autocomplete y
// DropdownMenu. Es el único lugar que dibuja el check de la opción seleccionada.
import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MenuOption from "./MenuOption.vue";

const ICON = '<svg class="mi-icono" xmlns="http://www.w3.org/2000/svg"></svg>';

describe("MenuOption — contenido", () => {
  it("renderiza label e ícono inline", () => {
    const w = mount(MenuOption, { props: { label: "Editar", icon: ICON } });
    expect(w.text()).toBe("Editar");
    expect(w.find(".mi-icono").exists()).toBe(true);
  });

  it("respeta la clase de ícono de cada lista", () => {
    const w = mount(MenuOption, {
      props: { label: "Editar", icon: ICON, iconClass: "cu-dropdown-icon" },
    });
    expect(w.find(".cu-dropdown-icon").exists()).toBe(true);
    expect(w.find(".mi-icono").exists()).toBe(true);
  });

  it("sin selected no renderiza el check", () => {
    const w = mount(MenuOption, { props: { label: "Editar" } });
    expect(w.find(".cu-menu-option-check").exists()).toBe(false);
  });

  it("con selected renderiza el check de lucide al final de la fila", () => {
    const w = mount(MenuOption, { props: { label: "Editar", icon: ICON, selected: true } });
    const check = w.find(".cu-menu-option-check");
    expect(check.exists()).toBe(true);
    // Último hijo de la fila: después del ícono y el label.
    const row = check.element.parentElement!;
    expect(row.lastElementChild).toBe(check.element);
  });
});

describe("MenuOption — item", () => {
  it("disabled llega al botón nativo y atenúa la fila", () => {
    const w = mount(MenuOption, { props: { label: "Eliminar", disabled: true } });
    expect(w.find("button").attributes("disabled")).toBeDefined();
  });

  it("con href se renderiza como link con target", () => {
    const w = mount(MenuOption, {
      props: { label: "Perfil", href: "/perfil", target: "_blank" },
    });
    const link = w.find("a");
    expect(link.attributes("href")).toBe("/perfil");
    expect(link.attributes("target")).toBe("_blank");
  });

  it("el click del consumidor llega al handler", async () => {
    const onClick = vi.fn();
    const w = mount(MenuOption, { props: { label: "Editar" }, attrs: { onClick } });
    await w.find("button").trigger("click");
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
