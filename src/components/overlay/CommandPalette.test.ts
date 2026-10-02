// Comportamiento de CommandPalette según su ficha (docs/componentes/vue/command-palette.md).
//
// Paleta de comandos (búsqueda + lista) en un modal, con agrupado por categoría
// y selección por teclado o click. Emite `select`/`close`; expone open, close,
// run, getCommands e isOpen. Aserciones escritas a mano desde la prosa.
import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
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
