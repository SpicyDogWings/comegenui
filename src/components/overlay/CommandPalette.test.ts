// Comportamiento de CommandPalette según su ficha (docs/componentes/vue/command-palette.md).
//
// Paleta de comandos (búsqueda + lista) en un modal, con agrupado por categoría
// y selección por teclado o click. Emite `select`/`close`; expone open, close,
// run, getCommands e isOpen. Aserciones escritas a mano desde la prosa.
import { describe, it, expect, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import CommandPalette from "./CommandPalette.vue";

type Cmd = {
  id: string;
  label: string;
  category?: string;
  shortcut?: string;
  action: () => void;
};

type PaletteVm = {
  open: () => void;
  close: () => void;
  run: (id: string) => Cmd | null;
  getCommands: () => Cmd[];
  isOpen: () => boolean;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as PaletteVm;

function makeCommands(seen: string[]): Cmd[] {
  return [
    { id: "guardar", label: "Guardar", category: "Archivo", shortcut: "⌘S", action: () => seen.push("guardar") },
    { id: "buscar", label: "Buscar", category: "Navegación", shortcut: "⌘K", action: () => seen.push("buscar") },
  ];
}

describe("CommandPalette — apertura y API imperativa", () => {
  it("arranca cerrado", () => {
    const w = mount(CommandPalette, { props: { commands: makeCommands([]) } });
    expect(vm(w).isOpen()).toBe(false);
  });

  it("open() abre y close() cierra", async () => {
    const w = mount(CommandPalette, { props: { commands: makeCommands([]) } });
    vm(w).open();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);

    vm(w).close();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
  });

  it("getCommands() devuelve los comandos recibidos", () => {
    const cmds = makeCommands([]);
    const w = mount(CommandPalette, { props: { commands: cmds } });
    expect(vm(w).getCommands()).toEqual(cmds);
  });
});

describe("CommandPalette — run()", () => {
  it("ejecuta la action del comando y emite select", async () => {
    const seen: string[] = [];
    const w = mount(CommandPalette, { props: { commands: makeCommands(seen) } });

    const cmd = vm(w).run("guardar");
    await flushPromises();

    expect(seen).toEqual(["guardar"]);
    expect(cmd?.label).toBe("Guardar");
    expect(w.emitted("select")?.[0]?.[0]).toMatchObject({ id: "guardar" });
  });

  it("con un id inexistente devuelve null y no emite select", async () => {
    const seen: string[] = [];
    const w = mount(CommandPalette, { props: { commands: makeCommands(seen) } });

    expect(vm(w).run("nope")).toBeNull();
    await flushPromises();
    expect(seen).toEqual([]);
    expect(w.emitted("select")).toBeUndefined();
  });
});

describe("CommandPalette — render de comandos", () => {
  it("al abrir muestra los comandos y sus categorías", async () => {
    const w = mount(CommandPalette, { props: { commands: makeCommands([]) } });
    vm(w).open();
    await flushPromises();

    const items = w.findAll(".cu-command-palette-item");
    expect(items.length).toBe(2);
    expect(w.find(".cu-command-palette-group-label").text()).toBe("Archivo");
    expect(w.text()).toContain("Guardar");
    expect(w.text()).toContain("⌘S");
  });

  it("click en un comando lo ejecuta, emite select y cierra", async () => {
    const seen: string[] = [];
    const w = mount(CommandPalette, { props: { commands: makeCommands(seen) } });
    vm(w).open();
    await flushPromises();

    await w.findAll(".cu-command-palette-item")[0]!.trigger("click");
    await flushPromises();

    expect(seen).toEqual(["guardar"]);
    expect(w.emitted("select")).toHaveLength(1);
    expect(vm(w).isOpen()).toBe(false);
  });

  it("con una búsqueda sin coincidencias muestra el estado vacío", async () => {
    const w = mount(CommandPalette, { props: { commands: makeCommands([]) } });
    vm(w).open();
    await flushPromises();

    await w.find("input").setValue("zzzz");
    await flushPromises();

    expect(w.find(".cu-command-palette-empty").exists()).toBe(true);
    expect(w.findAll(".cu-command-palette-item").length).toBe(0);
  });

  it("la búsqueda filtra por label", async () => {
    const w = mount(CommandPalette, { props: { commands: makeCommands([]) } });
    vm(w).open();
    await flushPromises();

    await w.find("input").setValue("Buscar");
    await flushPromises();

    const items = w.findAll(".cu-command-palette-item");
    expect(items.length).toBe(1);
    expect(items[0]!.text()).toContain("Buscar");
  });
});

describe("CommandPalette — selección por teclado", () => {
  it("ArrowDown mueve el activo y Enter ejecuta el comando activo", async () => {
    const seen: string[] = [];
    const w = mount(CommandPalette, { props: { commands: makeCommands(seen) } });
    vm(w).open();
    await flushPromises();

    const container = w.find(".cu-command-palette");
    await container.trigger("keydown", { key: "ArrowDown" });
    await container.trigger("keydown", { key: "Enter" });
    await flushPromises();

    // Sin bajar, el activo es el primero (Guardar); al bajar una vez, Buscar.
    expect(seen).toEqual(["buscar"]);
  });

  it("ArrowUp desde el primero envuelve al último", async () => {
    const seen: string[] = [];
    const w = mount(CommandPalette, { props: { commands: makeCommands(seen) } });
    vm(w).open();
    await flushPromises();

    const container = w.find(".cu-command-palette");
    await container.trigger("keydown", { key: "ArrowUp" });
    await container.trigger("keydown", { key: "Enter" });
    await flushPromises();

    expect(seen).toEqual(["buscar"]);
  });
});

describe("CommandPalette — combobox (aria-activedescendant)", () => {
  it("el buscador es el combobox y el listado expone el comando activo", async () => {
    const w = mount(CommandPalette, { props: { commands: makeCommands([]), title: "Comandos" } });
    vm(w).open();
    await flushPromises();

    const input = w.find("input");
    expect(input.attributes("role")).toBe("combobox");
    expect(input.attributes("aria-autocomplete")).toBe("list");
    expect(input.attributes("aria-expanded")).toBe("true");

    const listboxId = input.attributes("aria-controls");
    expect(listboxId).toBeTruthy();
    const listbox = w.find(`[id="${listboxId}"]`);
    expect(listbox.exists()).toBe(true);
    expect(listbox.attributes("role")).toBe("listbox");
    expect(listbox.attributes("aria-label")).toBe("Comandos");

    const activeId = input.attributes("aria-activedescendant");
    expect(activeId).toBeTruthy();
    const active = w.find(`[id="${activeId}"]`);
    expect(active.attributes("role")).toBe("option");
    expect(active.attributes("aria-selected")).toBe("true");
    expect(active.text()).toContain("Guardar");

    const options = w.findAll(".cu-command-palette-item");
    expect(options).toHaveLength(2);
    expect(options[1]!.attributes("aria-selected")).toBe("false");
    // Los comandos no son paradas de tab: el foco se queda en el buscador.
    for (const option of options) expect(option.attributes("tabindex")).toBe("-1");
  });

  it("las categorías se agrupan con role=group y etiqueta accesible", async () => {
    const w = mount(CommandPalette, { props: { commands: makeCommands([]) } });
    vm(w).open();
    await flushPromises();

    const groups = w.findAll('[role="group"]');
    expect(groups.map((g) => g.attributes("aria-label"))).toEqual(["Archivo", "Navegación"]);
    // La etiqueta visual no se anuncia dos veces.
    expect(w.find(".cu-command-palette-group-label").attributes("aria-hidden")).toBe("true");
  });

  it("dos paletas en la misma app no comparten ids (listbox/opciones)", async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h("div", [
            h(CommandPalette, { commands: makeCommands([]) }),
            h(CommandPalette, { commands: makeCommands([]) }),
          ]);
      },
    });
    const w = mount(Host);
    const palettes = w.findAllComponents(CommandPalette);
    expect(palettes).toHaveLength(2);
    vm(palettes[0]!).open();
    vm(palettes[1]!).open();
    await flushPromises();

    const idA = palettes[0]!.find("input").attributes("aria-controls");
    const idB = palettes[1]!.find("input").attributes("aria-controls");
    expect(idA).toBeTruthy();
    expect(idB).toBeTruthy();
    expect(idA).not.toBe(idB);

    const optionA = palettes[0]!.find("input").attributes("aria-activedescendant");
    const optionB = palettes[1]!.find("input").attributes("aria-activedescendant");
    expect(optionA).not.toBe(optionB);
  });

  it("flechas, Home y End mueven aria-activedescendant sin ejecutar nada", async () => {
    const seen: string[] = [];
    const w = mount(CommandPalette, { props: { commands: makeCommands(seen) } });
    vm(w).open();
    await flushPromises();

    const input = w.find("input");
    const optionText = (id?: string) => (id ? w.find(`[id="${id}"]`).text() : undefined);

    await input.trigger("keydown", { key: "ArrowDown" });
    expect(optionText(input.attributes("aria-activedescendant"))).toContain("Buscar");

    await input.trigger("keydown", { key: "ArrowDown" });
    // Con dos comandos vuelve al primero (circular).
    expect(optionText(input.attributes("aria-activedescendant"))).toContain("Guardar");

    await input.trigger("keydown", { key: "End" });
    expect(optionText(input.attributes("aria-activedescendant"))).toContain("Buscar");

    await input.trigger("keydown", { key: "Home" });
    expect(optionText(input.attributes("aria-activedescendant"))).toContain("Guardar");

    expect(seen).toEqual([]);
    expect(w.emitted("select")).toBeUndefined();
  });

  it("Enter ejecuta el comando activo, una sola vez", async () => {
    const seen: string[] = [];
    const w = mount(CommandPalette, { props: { commands: makeCommands(seen) } });
    vm(w).open();
    await flushPromises();

    const input = w.find("input");
    await input.trigger("keydown", { key: "ArrowDown" });
    await input.trigger("keydown", { key: "Enter" });
    await flushPromises();

    expect(seen).toEqual(["buscar"]);
    expect(w.emitted("select")).toHaveLength(1);
    expect(vm(w).isOpen()).toBe(false);
  });

  it("un Enter originado en un comando no ejecuta además el activo", async () => {
    const seen: string[] = [];
    const w = mount(CommandPalette, { props: { commands: makeCommands(seen) } });
    vm(w).open();
    await flushPromises();

    // Defensa: aunque algo enfoque una opción por código, el handler de la paleta
    // no debe ejecutar el activo a la vez que el botón.
    const items = w.findAll(".cu-command-palette-item");
    await items[1]!.trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(seen).toEqual([]);
    expect(w.emitted("select")).toBeUndefined();

    await items[1]!.trigger("click");
    await flushPromises();
    expect(seen).toEqual(["buscar"]);
  });
});

describe("CommandPalette — estado vacío accesible", () => {
  it("sin resultados el listbox desaparece y el mensaje se anuncia", async () => {
    const w = mount(CommandPalette, { props: { commands: makeCommands([]) } });
    vm(w).open();
    await flushPromises();

    await w.find("input").setValue("zzzz");
    await flushPromises();

    const empty = w.find(".cu-command-palette-empty");
    expect(empty.attributes("role")).toBe("status");
    expect(w.find('[role="listbox"]').exists()).toBe(false);
    expect(w.find("input").attributes("aria-activedescendant")).toBeUndefined();
  });
});

describe("CommandPalette — cierre por el modal", () => {
  it("cerrar por el botón del modal limpia la búsqueda para la próxima apertura", async () => {
    const w = mount(CommandPalette, { props: { commands: makeCommands([]) } });
    vm(w).open();
    await flushPromises();

    await w.find("input").setValue("Buscar");
    await flushPromises();
    expect(w.findAll(".cu-command-palette-item").length).toBe(1);

    await w.find(".cu-modal-close").trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("close")).toHaveLength(1);
    // El combobox avisa que el popup ya no está desplegado.
    expect(w.find("input").attributes("aria-expanded")).toBe("false");

    vm(w).open();
    await flushPromises();
    expect((w.find("input").element as HTMLInputElement).value).toBe("");
    expect(w.findAll(".cu-command-palette-item").length).toBe(2);
  });
});

describe("CommandPalette — comando resaltado visible", () => {
  it("al moverse con flechas, el comando resaltado se acerca a la vista", async () => {
    const proto = HTMLElement.prototype as unknown as { scrollIntoView?: (opts?: unknown) => void };
    const original = proto.scrollIntoView;
    const scrollSpy = vi.fn();
    proto.scrollIntoView = scrollSpy;

    try {
      const w = mount(CommandPalette, { props: { commands: makeCommands([]) } });
      vm(w).open();
      await flushPromises();

      await w.find(".cu-command-palette").trigger("keydown", { key: "ArrowDown" });
      await nextTick();
      await flushPromises();

      expect(scrollSpy).toHaveBeenCalled();
      expect(scrollSpy.mock.calls.at(-1)?.[0]).toEqual({ block: "nearest" });
    } finally {
      if (original) proto.scrollIntoView = original;
      else delete proto.scrollIntoView;
    }
  });
});

describe("CommandPalette — HTML en los comandos", () => {
  it("label, description e icon se muestran como texto, no como HTML", async () => {
    const evil = {
      id: "evil",
      label: '<img src=x onerror="window.__pwned=1">',
      description: "<b>negrita</b>",
      icon: '<svg onload="window.__pwned=2"></svg>',
      action: () => {},
    };
    const w = mount(CommandPalette, { props: { commands: [evil] } });
    vm(w).open();
    await flushPromises();

    expect(w.find(".cu-command-palette-item-label").text()).toBe(evil.label);
    expect(w.find(".cu-command-palette-item-desc").text()).toBe("<b>negrita</b>");
    expect(w.find(".cu-command-palette-item-icon").text()).toBe(evil.icon);
    expect(w.find(".cu-command-palette-item img").exists()).toBe(false);
    expect(w.find(".cu-command-palette-item svg").exists()).toBe(false);
    expect(w.find(".cu-command-palette-item b").exists()).toBe(false);
  });
});

describe("CommandPalette — apertura con scroll previo", () => {
  it("al reabrir, el listado vuelve arriba", async () => {
    const w = mount(CommandPalette, { props: { commands: makeCommands([]) } });
    vm(w).open();
    await flushPromises();

    const results = w.find(".cu-command-palette-results").element as HTMLElement;
    results.scrollTop = 240;

    vm(w).close();
    await flushPromises();
    vm(w).open();
    await flushPromises();

    expect(results.scrollTop).toBe(0);
  });
});

describe("CommandPalette — nombre accesible del diálogo", () => {
  it("sin `title` el diálogo se anuncia como paleta de comandos (no queda sin nombre)", async () => {
    const w = mount(CommandPalette, { props: { commands: makeCommands([]) } });
    vm(w).open();
    await flushPromises();

    const dialog = w.find("[role=dialog]");
    expect(dialog.attributes("aria-labelledby")).toBeUndefined();
    expect(dialog.attributes("aria-label")).toBe("Paleta de comandos");
  });

  it("con `title`, el nombre sale del título", async () => {
    const w = mount(CommandPalette, { props: { commands: makeCommands([]), title: "Comandos" } });
    vm(w).open();
    await flushPromises();

    const dialog = w.find("[role=dialog]");
    expect(dialog.attributes("aria-labelledby")).toBe("modal-title");
    expect(dialog.find(".cu-modal-title").text()).toBe("Comandos");
  });
});

describe("CommandPalette — foco al abrir", () => {
  it("el buscador recibe el foco al abrir (el Modal no lo pisa)", async () => {
    const w = mount(CommandPalette, { props: { commands: makeCommands([]) }, attachTo: document.body });
    vm(w).open();
    await flushPromises();

    expect(document.activeElement).toBe(w.find(".cu-command-palette-input").element);
  });
});
