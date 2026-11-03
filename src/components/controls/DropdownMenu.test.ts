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

describe("DropdownMenu — alineación del texto de los items", () => {
  // `text-align` no mueve nada dentro de un `Button` (es flex): la alineación real es
  // `justify-content`. Si sólo se aplica `text-align`, el demo no alinea nada.
  const items = [{ label: "Editar" }, { label: "Eliminar", color: "danger" }];

  async function itemsOf(textAlign?: "left" | "center" | "right") {
    const w = mount(DropdownMenu, { props: textAlign ? { items, textAlign } : { items } });
    vm(w).open();
    await flushPromises();
    return panel(w).findAll(".cu-dropdown-item").map((i) => i.element as HTMLElement);
  }

  it("por defecto alinea a la izquierda (flex-start)", async () => {
    const [item] = await itemsOf();
    expect(item!.style.justifyContent).toBe("flex-start");
    expect(item!.style.textAlign).toBe("left");
  });

  it("center centra el bloque de contenido (justify-content: center)", async () => {
    const found = await itemsOf("center");
    expect(found).toHaveLength(2);
    for (const item of found) {
      expect(item.style.justifyContent).toBe("center");
      expect(item.style.textAlign).toBe("center");
    }
  });

  it("right empuja el bloque de contenido al final (flex-end)", async () => {
    const [item] = await itemsOf("right");
    expect(item!.style.justifyContent).toBe("flex-end");
    expect(item!.style.textAlign).toBe("right");
  });

  it("con ícono alinea el bloque entero (ícono + label), sin descentrar el ícono", async () => {
    const w = mount(DropdownMenu, {
      props: {
        textAlign: "right",
        items: [{ label: "Editar", icon: '<svg class="mi-icono"></svg>' }],
      },
    });
    vm(w).open();
    await flushPromises();

    const item = panel(w).find(".cu-dropdown-item");
    expect((item.element as HTMLElement).style.justifyContent).toBe("flex-end");
    // El ícono sigue siendo hijo del mismo item: se mueve con el label, no por su cuenta.
    expect(item.find(".mi-icono").exists()).toBe(true);
    expect(item.find(".cu-dropdown-icon").exists()).toBe(true);
  });
});

describe("DropdownMenu — item seleccionado (check)", () => {
  it("un item con `selected: true` muestra el check al final; los demás no", async () => {
    const w = mount(DropdownMenu, {
      props: {
        items: [
          { label: "Ordenar por nombre", selected: true },
          { label: "Ordenar por fecha" },
        ],
      },
    });
    vm(w).open();
    await flushPromises();

    const items = panel(w).findAll(".cu-dropdown-item");
    const check = items[0]!.find(".cu-menu-option-check");
    expect(check.exists()).toBe(true);
    expect(check.element.parentElement!.lastElementChild).toBe(check.element);
    expect(items[1]!.find(".cu-menu-option-check").exists()).toBe(false);
  });

  it("sin `selected` ningún item dibuja el check (DOM por defecto intacto)", async () => {
    const w = mount(DropdownMenu, {
      props: { items: [{ label: "Editar" }, { label: "Eliminar", color: "danger" }] },
    });
    vm(w).open();
    await flushPromises();

    expect(panel(w).findAll(".cu-dropdown-item")).toHaveLength(2);
    expect(panel(w).findAll(".cu-menu-option-check")).toHaveLength(0);
  });

  it("un item `selected` deshabilitado conserva el check y no dispara onClick", async () => {
    const onClick = vi.fn();
    const w = mount(DropdownMenu, {
      props: { items: [{ label: "Fijo", selected: true, disabled: true, onClick }] },
    });
    vm(w).open();
    await flushPromises();

    const item = panel(w).find(".cu-dropdown-item");
    expect(item.find(".cu-menu-option-check").exists()).toBe(true);
    await item.trigger("click");
    await flushPromises();

    expect(onClick).not.toHaveBeenCalled();
    expect(vm(w).isOpen()).toBe(true);
  });
});

describe("DropdownMenu — el foco vuelve al trigger al cerrar", () => {
  it("Escape con el foco en un item lo devuelve al trigger", async () => {
    const w = mount(DropdownMenu, {
      attachTo: document.body,
      props: { items: [{ label: "Uno" }, { label: "Dos" }] },
    });
    const trigger = w.find(".cu-dropdown-toggle").element as HTMLElement;
    trigger.focus();
    vm(w).open();
    await flushPromises();
    const item = w.find(".cu-dropdown-item").element as HTMLElement;
    item.focus();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger);
    w.unmount();
  });
});

describe("DropdownMenu — ARIA del trigger y del panel", () => {
  it("el trigger anuncia que abre un menú, su estado y el panel que controla", async () => {
    const w = mount(DropdownMenu, { props: { items: [{ label: "Uno" }] } });
    const trigger = w.find(".cu-dropdown-toggle");
    expect(trigger.attributes("aria-haspopup")).toBe("menu");
    expect(trigger.attributes("aria-expanded")).toBe("false");

    const controls = trigger.attributes("aria-controls");
    expect(controls).toBeTruthy();

    vm(w).open();
    await flushPromises();
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(panel(w).attributes("id")).toBe(controls);
    expect(panel(w).attributes("role")).toBe("menu");

    vm(w).close();
    await flushPromises();
    expect(trigger.attributes("aria-expanded")).toBe("false");
  });

  it("cada fila es `menuitem`; la seleccionada es `menuitemcheckbox` marcada", async () => {
    const w = mount(DropdownMenu, {
      props: {
        items: [
          { label: "Editar" },
          { label: "Ordenar por nombre", selected: true },
          { divider: true },
          { label: "Eliminar", disabled: true },
        ],
      },
    });
    vm(w).open();
    await flushPromises();

    const rows = panel(w).findAll(".cu-dropdown-item");
    expect(rows.map((row) => row.attributes("role"))).toEqual([
      "menuitem",
      "menuitemcheckbox",
      "menuitem",
    ]);
    expect(rows[1]!.attributes("aria-checked")).toBe("true");
    expect(rows[0]!.attributes("aria-checked")).toBeUndefined();
    expect(rows[2]!.attributes("disabled")).toBeDefined();
    // El divisor se anuncia como separador (un `<hr>` dentro de `role="menu"`).
    expect(panel(w).find(".cu-dropdown-divider").element.tagName).toBe("HR");
  });

  it("un item deshabilitado con `href` sigue siendo `menuitem` deshabilitado, sin href", async () => {
    const w = mount(DropdownMenu, {
      props: { items: [{ label: "Bloqueado", href: "/x", disabled: true }] },
    });
    vm(w).open();
    await flushPromises();

    const link = panel(w).find("a.cu-dropdown-item");
    expect(link.attributes("role")).toBe("menuitem");
    expect(link.attributes("aria-disabled")).toBe("true");
    expect(link.attributes("href")).toBeUndefined();
    expect(link.attributes("tabindex")).toBe("-1");
  });
});

describe("DropdownMenu — teclado del menú", () => {
  const press = async (el: Element, key: string) => {
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
    await flushPromises();
    await flushPromises();
  };

  const items = [{ label: "Editar" }, { label: "Duplicar" }, { label: "Eliminar" }];

  function setup(props: Record<string, unknown> = {}) {
    return mount(DropdownMenu, {
      attachTo: document.body,
      props: { items, ...props },
    });
  }

  const focused = (w: ReturnType<typeof mount>) =>
    (w.element.getRootNode() as ShadowRoot | Document).activeElement;

  it("Flecha abajo abre el menú y enfoca la primera fila", async () => {
    const w = setup();
    const trigger = w.find(".cu-dropdown-toggle").element as HTMLElement;
    trigger.focus();

    await press(trigger, "ArrowDown");
    expect(vm(w).isOpen()).toBe(true);
    expect(focused(w)).toBe(panel(w).findAll(".cu-dropdown-item")[0]!.element);
    w.unmount();
  });

  it("Flecha arriba abre el menú y enfoca la última fila", async () => {
    const w = setup();
    const trigger = w.find(".cu-dropdown-toggle").element as HTMLElement;
    trigger.focus();

    await press(trigger, "ArrowUp");
    expect(vm(w).isOpen()).toBe(true);
    const rows = panel(w).findAll(".cu-dropdown-item");
    expect(focused(w)).toBe(rows[rows.length - 1]!.element);
    w.unmount();
  });

  it("las flechas recorren las filas habilitadas, saltean deshabilitadas y dan la vuelta", async () => {
    const w = setup({
      items: [{ label: "Uno" }, { label: "Dos", disabled: true }, { label: "Tres" }],
    });
    const trigger = w.find(".cu-dropdown-toggle").element as HTMLElement;
    trigger.focus();
    await press(trigger, "ArrowDown");

    const rows = panel(w).findAll(".cu-dropdown-item");
    expect(focused(w)).toBe(rows[0]!.element);

    await press(rows[0]!.element, "ArrowDown");
    expect(focused(w)).toBe(rows[2]!.element);

    await press(rows[2]!.element, "ArrowDown");
    expect(focused(w)).toBe(rows[0]!.element);

    await press(rows[0]!.element, "ArrowUp");
    expect(focused(w)).toBe(rows[2]!.element);
    w.unmount();
  });

  it("Home y End van a la primera y a la última fila habilitada", async () => {
    const w = setup();
    const trigger = w.find(".cu-dropdown-toggle").element as HTMLElement;
    trigger.focus();
    await press(trigger, "ArrowDown");

    const rows = panel(w).findAll(".cu-dropdown-item");
    await press(rows[0]!.element, "End");
    expect(focused(w)).toBe(rows[2]!.element);

    await press(rows[2]!.element, "Home");
    expect(focused(w)).toBe(rows[0]!.element);
    w.unmount();
  });

  it("el typeahead enfoca la fila que empieza con la letra tipeada", async () => {
    const w = setup();
    const trigger = w.find(".cu-dropdown-toggle").element as HTMLElement;
    trigger.focus();
    await press(trigger, "ArrowDown");

    const rows = panel(w).findAll(".cu-dropdown-item");
    await press(rows[0]!.element, "d");
    expect(focused(w)).toBe(rows[1]!.element);
    w.unmount();
  });

  it("Espacio activa una fila con `href` (un link no se activa solo con Espacio)", async () => {
    const onClick = vi.fn();
    const w = setup({ items: [{ label: "Ir", href: "#x", onClick }] });
    const trigger = w.find(".cu-dropdown-toggle").element as HTMLElement;
    trigger.focus();
    await press(trigger, "ArrowDown");

    const link = panel(w).find("a.cu-dropdown-item");
    await press(link.element, " ");

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(vm(w).isOpen()).toBe(false);
    w.unmount();
  });

  it("Tab saca el foco del menú y lo cierra sin devolverlo al trigger", async () => {
    const w = setup();
    const trigger = w.find(".cu-dropdown-toggle").element as HTMLElement;
    trigger.focus();
    await press(trigger, "ArrowDown");

    const item = panel(w).find(".cu-dropdown-item").element as HTMLElement;
    expect(focused(w)).toBe(item);

    const outside = document.createElement("button");
    document.body.appendChild(outside);
    await press(item, "Tab");
    outside.focus();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await flushPromises();

    expect(vm(w).isOpen()).toBe(false);
    expect(document.activeElement).toBe(outside);
    outside.remove();
    w.unmount();
  });

  it("el roving tabindex deja una sola fila como parada y la mueve con las flechas", async () => {
    const w = mount(DropdownMenu, { props: { items } });
    vm(w).open();
    await flushPromises();

    const rows = panel(w).findAll(".cu-dropdown-item");
    expect(rows.map((row) => row.attributes("tabindex"))).toEqual(["0", "-1", "-1"]);

    const trigger = w.find(".cu-dropdown-toggle").element as HTMLElement;
    trigger.focus();
    await press(trigger, "ArrowDown");
    await press(rows[0]!.element, "ArrowDown");

    expect(panel(w).findAll(".cu-dropdown-item").map((row) => row.attributes("tabindex"))).toEqual([
      "-1",
      "0",
      "-1",
    ]);
  });
});

describe("DropdownMenu — entradas inválidas", () => {
  it("las entradas nulas o que no son objetos de `items` se ignoran, sin romper el menú", async () => {
    const w = mount(DropdownMenu, {
      props: {
        items: [null, { label: "Uno" }, undefined, "texto", 42] as any,
      },
    });
    vm(w).open();
    await flushPromises();

    expect(w.find(".cu-dropdown-toggle").exists()).toBe(true);
    expect(panel(w).findAll(".cu-dropdown-item")).toHaveLength(1);
  });

  it("`items` que no es un array no rompe el menú (queda vacío)", async () => {
    const w = mount(DropdownMenu, { props: { items: "hola" as any } });
    vm(w).open();
    await flushPromises();

    expect(w.find(".cu-dropdown-toggle").exists()).toBe(true);
    expect(panel(w).findAll(".cu-dropdown-item")).toHaveLength(0);
  });

  it("`position`, `align` y `textAlign` fuera del set caen al default documentado", async () => {
    const w = mount(DropdownMenu, {
      props: {
        position: "diagonal" as any,
        align: "banana" as any,
        textAlign: "banana" as any,
        items: [{ label: "Uno" }],
      },
    });
    vm(w).open();
    await flushPromises();

    const panelEl = panel(w).element as HTMLElement;
    expect(panelEl.style.position).toBe("absolute");
    expect(panelEl.style.top).toBe("100%"); // bottom
    expect(panelEl.style.left).toBe("0px"); // start
    const item = panel(w).find(".cu-dropdown-item").element as HTMLElement;
    expect(item.style.justifyContent).toBe("flex-start"); // left
  });
});
