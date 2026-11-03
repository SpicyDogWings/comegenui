// Comportamiento de Dropdown según su ficha (docs/componentes/vue/dropdown.md).
//
// Aserciones escritas a MANO desde la prosa de la ficha (motor de panel
// desplegable: toggle + panel + valor seleccionable), no derivadas del código.
import { describe, it, expect, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
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

describe("Dropdown — rol del panel", () => {
  it("por defecto el panel es un `menu`", async () => {
    const w = mount(Dropdown);
    vm(w).open();
    await flushPromises();
    expect(panel(w).attributes("role")).toBe("menu");
  });

  it("`panelRole` cambia el rol (el date-picker usa `dialog`)", async () => {
    const w = mount(Dropdown, { props: { panelRole: "dialog" } });
    vm(w).open();
    await flushPromises();
    expect(panel(w).attributes("role")).toBe("dialog");
  });
});

describe("Dropdown — el foco vuelve al trigger al cerrar", () => {
  it("Escape con el foco en un item lo devuelve al trigger", async () => {
    const w = mount(Dropdown, {
      attachTo: document.body,
      props: { items: [{ label: "Uno" }, { label: "Dos" }] },
    });
    const trigger = w.find(".cu-dropdown button").element as HTMLElement;
    trigger.focus();
    vm(w).open();
    await flushPromises();
    const item = panel(w).find("button.cu-dropdown-menu-item").element as HTMLElement;
    item.focus();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger);
    w.unmount();
  });
});

describe("Dropdown — íconos saneados", () => {
  const LEGIT =
    '<svg class="mi-icono" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4z"/></svg>';
  const EVIL = '<img src=x onerror="window.__xss=1"><script>window.__xss=2</script>';

  it("conserva el SVG válido de un item (botón y link)", async () => {
    const w = mount(Dropdown, {
      props: { items: [{ label: "Uno", icon: LEGIT }, { label: "Dos", icon: LEGIT, to: "/dos" }] },
    });
    vm(w).open();
    await flushPromises();
    expect(panel(w).findAll(".cu-dropdown-menu-item-icon svg.mi-icono")).toHaveLength(2);
  });

  it("elimina `<script>` y handlers `on*` del ícono de un item", async () => {
    type XssWindow = Window & { __xss?: number };
    const probe = window as XssWindow;
    delete probe.__xss;

    const w = mount(Dropdown, { props: { items: [{ label: "Malo", icon: EVIL }] } });
    vm(w).open();
    await flushPromises();

    const icon = panel(w).find(".cu-dropdown-menu-item-icon");
    expect(icon.html()).not.toContain("onerror");
    expect(icon.html()).not.toContain("<script");
    expect(probe.__xss).toBeUndefined();
  });

  it("sanitiza el `icon` del trigger anidado (submenú)", async () => {
    type XssWindow = Window & { __xss?: number };
    const probe = window as XssWindow;
    delete probe.__xss;

    const Wrapper = defineComponent({
      setup() {
        return () =>
          h(Dropdown, null, {
            default: () =>
              h(Dropdown, { label: "Sub", icon: EVIL }, { default: () => h("span", "sub") }),
          });
      },
    });
    const w = mount(Wrapper);
    (w.findComponent(Dropdown).vm as unknown as DropdownVm).open();
    await flushPromises();

    const nestedIcon = w.find(".cu-dropdown-menu-item .cu-dropdown-menu-item-icon");
    expect(nestedIcon.exists()).toBe(true);
    expect(nestedIcon.html()).not.toContain("onerror");
    expect(nestedIcon.html()).not.toContain("<script");
    expect(probe.__xss).toBeUndefined();
  });
});

// ── `items` como menú de verdad ───────────────────────────────────────────────
// Antes las filas eran `<button>`/`<a>` sueltos: sin rol, sin teclado y con una parada
// de tabulación por item. El patrón es el de `DropdownMenu` (una sola parada, roving).

describe("Dropdown — items como menú (roles y roving)", () => {
  const menuItems = [{ label: "Editar" }, { label: "Duplicar" }, { label: "Eliminar" }];

  const openWith = async (props: Record<string, unknown> = {}) => {
    const w = mount(Dropdown, { attachTo: document.body, props: { items: menuItems, ...props } });
    vm(w).open();
    await flushPromises();
    return w;
  };

  it("cada fila es `menuitem` y la fila activa es la única parada de tabulación", async () => {
    const w = await openWith();
    const rows = panel(w).findAll(".cu-dropdown-menu-item");

    expect(rows.map((row) => row.attributes("role"))).toEqual([
      "menuitem",
      "menuitem",
      "menuitem",
    ]);
    expect(rows.map((row) => row.attributes("tabindex"))).toEqual(["0", "-1", "-1"]);
    w.unmount();
  });

  it("el trigger por defecto anuncia el menú y el panel que controla", async () => {
    const w = await openWith();
    const trigger = w.find(".cu-dropdown button");
    expect(trigger.attributes("aria-haspopup")).toBe("menu");
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(trigger.attributes("aria-controls")).toBe(panel(w).attributes("id"));
    w.unmount();
  });

  it("un link deshabilitado es un `menuitem` deshabilitado y sale del tab order", async () => {
    const w = await openWith({
      items: [{ label: "Ir", href: "#ir" }, { label: "Bloqueado", href: "#no", disabled: true }],
    });
    const link = panel(w).findAll("a.cu-dropdown-menu-item")[1]!;

    expect(link.attributes("role")).toBe("menuitem");
    expect(link.attributes("aria-disabled")).toBe("true");
    expect(link.attributes("tabindex")).toBe("-1");
    w.unmount();
  });

  it("sin `items` el panel no se convierte en menú ni toca el trigger", async () => {
    const w = mount(Dropdown, { attachTo: document.body, slots: { default: "<p>libre</p>" } });
    vm(w).open();
    await flushPromises();

    expect(panel(w).attributes("id")).toBeUndefined();
    expect(w.find(".cu-dropdown button").attributes("aria-haspopup")).toBeUndefined();
    w.unmount();
  });
});

describe("Dropdown — teclado del menú de items", () => {
  const menuItems = [{ label: "Editar" }, { label: "Duplicar" }, { label: "Eliminar" }];

  const press = async (el: Element, key: string) => {
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
    await flushPromises();
    await flushPromises();
  };

  const rows = (w: ReturnType<typeof mount>) => panel(w).findAll(".cu-dropdown-menu-item");
  const focused = () => document.activeElement;

  it("Flecha abajo abre el menú y enfoca la primera fila", async () => {
    const w = mount(Dropdown, { attachTo: document.body, props: { items: menuItems } });
    const trigger = w.find(".cu-dropdown button").element as HTMLElement;
    trigger.focus();

    await press(trigger, "ArrowDown");

    expect(vm(w).isOpen()).toBe(true);
    expect(focused()).toBe(rows(w)[0]!.element);
    w.unmount();
  });

  it("las flechas recorren las filas habilitadas, saltean deshabilitadas y dan la vuelta", async () => {
    const w = mount(Dropdown, {
      attachTo: document.body,
      props: {
        items: [{ label: "Uno" }, { label: "Dos", disabled: true }, { label: "Tres" }],
      },
    });
    const trigger = w.find(".cu-dropdown button").element as HTMLElement;
    trigger.focus();
    await press(trigger, "ArrowDown");

    const all = rows(w);
    expect(focused()).toBe(all[0]!.element);

    await press(all[0]!.element, "ArrowDown");
    expect(focused()).toBe(all[2]!.element);

    await press(all[2]!.element, "ArrowDown");
    expect(focused()).toBe(all[0]!.element);

    await press(all[0]!.element, "ArrowUp");
    expect(focused()).toBe(all[2]!.element);
    w.unmount();
  });

  it("Home y End van a la primera y a la última fila habilitada", async () => {
    const w = mount(Dropdown, { attachTo: document.body, props: { items: menuItems } });
    const trigger = w.find(".cu-dropdown button").element as HTMLElement;
    trigger.focus();
    await press(trigger, "ArrowDown");

    const all = rows(w);
    await press(all[0]!.element, "End");
    expect(focused()).toBe(all[2]!.element);

    await press(all[2]!.element, "Home");
    expect(focused()).toBe(all[0]!.element);
    w.unmount();
  });

  it("el typeahead enfoca la fila que empieza con la letra tipeada", async () => {
    const w = mount(Dropdown, { attachTo: document.body, props: { items: menuItems } });
    const trigger = w.find(".cu-dropdown button").element as HTMLElement;
    trigger.focus();
    await press(trigger, "ArrowDown");

    const all = rows(w);
    await press(all[0]!.element, "d");
    expect(focused()).toBe(all[1]!.element);
    w.unmount();
  });

  it("Espacio activa una fila con `href` (un link no se activa solo con Espacio)", async () => {
    const onClick = vi.fn();
    const w = mount(Dropdown, {
      attachTo: document.body,
      props: { items: [{ label: "Ir", href: "#x", onClick }] },
    });
    const trigger = w.find(".cu-dropdown button").element as HTMLElement;
    trigger.focus();
    await press(trigger, "ArrowDown");

    const link = panel(w).find("a.cu-dropdown-menu-item");
    await press(link.element, " ");

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(vm(w).isOpen()).toBe(false);
    w.unmount();
  });

  it("Tab saca el foco del menú y lo cierra sin devolverlo al trigger", async () => {
    const w = mount(Dropdown, { attachTo: document.body, props: { items: menuItems } });
    const trigger = w.find(".cu-dropdown button").element as HTMLElement;
    trigger.focus();
    await press(trigger, "ArrowDown");

    const item = rows(w)[0]!.element as HTMLElement;
    expect(focused()).toBe(item);

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
});

describe("Dropdown — submenú (fila nativa)", () => {
  it("el trigger de un dropdown anidado es una fila `menuitem` con chevron decorativo", async () => {
    const Wrapper = defineComponent({
      setup() {
        return () =>
          h(Dropdown, null, {
            default: () =>
              h(Dropdown, { label: "Sub" }, { default: () => h("span", "sub") }),
          });
      },
    });
    const w = mount(Wrapper);
    vm(w.findComponent(Dropdown)).open();
    await flushPromises();

    const row = w.find(".cu-dropdown-menu-item");
    expect(row.exists()).toBe(true);
    expect(row.attributes("role")).toBe("menuitem");
    expect(row.attributes("aria-haspopup")).toBe("menu");
    expect(row.attributes("aria-expanded")).toBe("false");

    const chevron = w.find(".cu-dropdown-menu-item-chevron");
    expect(chevron.attributes("aria-hidden")).toBe("true");
    expect(chevron.attributes("focusable")).toBe("false");
  });
});
