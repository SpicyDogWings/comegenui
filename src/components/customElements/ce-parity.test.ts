// Paridad de los wrappers CE con su `.vue`: props que no llegaban al componente
// interno, eventos y slots que no se reenviaban, y métodos que no se exponían.
import { beforeAll, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";

import AvatarCe from "@/components/customElements/information/Avatar.ce.vue";
import CollapseCe from "@/components/customElements/overlay/Collapse.ce.vue";
import InputCe from "@/components/customElements/form/Input.ce.vue";
import AutocompleteCe from "@/components/customElements/form/Autocomplete.ce.vue";
import FileInputCe from "@/components/customElements/form/FileInput.ce.vue";
import FileInputZoneCe from "@/components/customElements/form/FileInputZone.ce.vue";
import SwitchCe from "@/components/customElements/form/Switch.ce.vue";
import CheckboxCe from "@/components/customElements/form/Checkbox.ce.vue";
import ColorPickerCe from "@/components/customElements/form/ColorPicker.ce.vue";
import TextareaCe from "@/components/customElements/form/Textarea.ce.vue";
import SelectCe from "@/components/customElements/form/Select.ce.vue";
import CommandPaletteCe from "@/components/customElements/overlay/CommandPalette.ce.vue";
import TooltipCe from "@/components/customElements/overlay/Tooltip.ce.vue";
import MarkdownCe from "@/components/customElements/markdown/Markdown.ce.vue";
import TableCe from "@/components/customElements/data/AdvancedTable.ce.vue";

import Avatar from "@/components/information/Avatar.vue";
import Collapse from "@/components/overlay/Collapse.vue";
import Input from "@/components/form/Input.vue";
import Autocomplete from "@/components/form/Autocomplete.vue";
import Textarea from "@/components/form/Textarea.vue";
import Select from "@/components/form/Select.vue";
import CommandPalette from "@/components/overlay/CommandPalette.vue";
import Tooltip from "@/components/overlay/Tooltip.vue";
import Markdown from "@/components/markdown/Markdown.vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";

describe("Avatar.ce", () => {
  it("forwardea `src` al componente interno", () => {
    const w = mount(AvatarCe, { props: { src: "/foto.png" } });
    expect(w.findComponent(Avatar).props("src")).toBe("/foto.png");
    expect(w.find("img").attributes("src")).toBe("/foto.png");
  });

  it("forwardea el slot default", () => {
    const w = mount(AvatarCe, { slots: { default: "AB" } });
    expect(w.text()).toContain("AB");
  });
});

describe("Collapse.ce", () => {
  it("forwardea `icon` y lo renderiza", () => {
    const w = mount(CollapseCe, { props: { label: "Título", icon: "<b>x</b>" } });
    expect(w.findComponent(Collapse).props("icon")).toBe("<b>x</b>");
    expect(w.find(".cu-collapse-icon").html()).toContain("<b>x</b>");
  });

  it("forwardea `description` y la renderiza", () => {
    const w = mount(CollapseCe, { props: { label: "Título", description: "Ayuda" } });
    expect(w.findComponent(Collapse).props("description")).toBe("Ayuda");
    expect(w.find(".cu-collapse-description").text()).toBe("Ayuda");
  });
});

describe("Input.ce", () => {
  it("forwardea `size`", () => {
    const w = mount(InputCe, { props: { size: "lg" } });
    expect(w.findComponent(Input).props("size")).toBe("lg");
    expect(w.find("input").classes()).toContain("cu-input--lg");
  });

  it("tipear emite `update:modelValue` y refleja el valor sin reasignar la prop", async () => {
    const w = mount(InputCe);
    const updates: string[] = [];
    w.element.addEventListener("update:modelValue", (e: Event) =>
      updates.push((e as CustomEvent).detail),
    );

    await w.find("input").setValue("hola");
    await flushPromises();

    expect(w.vm.get()).toBe("hola");
    expect(w.find("input").element.value).toBe("hola");
    expect(updates).toEqual(["hola"]);
  });

  it("set() actualiza el valor interno y `get()` lo refleja", async () => {
    const w = mount(InputCe);
    w.vm.set("programático");
    await flushPromises();
    expect(w.vm.get()).toBe("programático");
    expect(w.find("input").element.value).toBe("programático");
  });

  it("`reset()` limpia el campo y `get()` devuelve `\"\"`", async () => {
    const w = mount(InputCe, { props: { modelValue: "algo" } });
    w.vm.reset();
    await flushPromises();
    expect(w.vm.get()).toBe("");
  });
});

describe("Textarea.ce", () => {
  it("tipear emite `update:modelValue` y refleja el valor sin reasignar la prop", async () => {
    const w = mount(TextareaCe);
    const updates: string[] = [];
    w.element.addEventListener("update:modelValue", (e: Event) =>
      updates.push((e as CustomEvent).detail),
    );

    await w.find("textarea").setValue("comentario");
    await flushPromises();

    expect(w.vm.get()).toBe("comentario");
    expect(w.find("textarea").element.value).toBe("comentario");
    expect(updates).toEqual(["comentario"]);
  });

  it("set() actualiza el valor interno y `get()` lo refleja", async () => {
    const w = mount(TextareaCe);
    w.vm.set("programático");
    await flushPromises();
    expect(w.vm.get()).toBe("programático");
  });

  it("`reset()` limpia el campo", async () => {
    const w = mount(TextareaCe, { props: { modelValue: "algo" } });
    w.vm.reset();
    await flushPromises();
    expect(w.vm.get()).toBe("");
  });
});

describe("Select.ce", () => {
  const options = [
    { value: "a", label: "A" },
    { value: "b", label: "B" },
  ];

  it("elegir una opción emite `update:modelValue` y `get()` refleja el valor", async () => {
    const w = mount(SelectCe, { props: { options } });
    const updates: string[] = [];
    w.element.addEventListener("update:modelValue", (e: Event) =>
      updates.push((e as CustomEvent).detail),
    );

    await w.find(".cu-select-toggle").trigger("click");
    await flushPromises();
    await w.findAll(".cu-select-option")[1]!.trigger("click");
    await flushPromises();

    expect(w.vm.get()).toBe("b");
    expect(updates).toContain("b");
  });

  it("set() actualiza el valor y emite `update:modelValue`", async () => {
    const w = mount(SelectCe, { props: { options } });
    const updates: string[] = [];
    w.element.addEventListener("update:modelValue", (e: Event) =>
      updates.push((e as CustomEvent).detail),
    );

    w.vm.set("a");
    await flushPromises();

    expect(w.vm.get()).toBe("a");
    expect(updates).toEqual(["a"]);
  });

  it("reset() limpia el valor y emite `update:modelValue` con `\"\"`", async () => {
    const w = mount(SelectCe, { props: { options, modelValue: "a" } });
    const updates: string[] = [];
    w.element.addEventListener("update:modelValue", (e: Event) =>
      updates.push((e as CustomEvent).detail),
    );

    w.vm.reset();
    await flushPromises();

    expect(w.vm.get()).toBe("");
    expect(updates).toEqual([""]);
  });
});

describe("FileInput.ce", () => {
  beforeAll(() => {
    // jsdom no implementa createObjectURL, que `FileInput.vue` usa para el link.
    URL.createObjectURL = vi.fn(() => "blob:mock");
    URL.revokeObjectURL = vi.fn();
  });

  it("set() actualiza el archivo interno y get() lo refleja", async () => {
    const w = mount(FileInputCe);
    const file = new File(["hola"], "hola.txt", { type: "text/plain" });
    w.vm.set(file);
    await flushPromises();
    expect(w.vm.get()).toBe(file);
  });

  it("emite `update:modelValue` al setear", async () => {
    const w = mount(FileInputCe);
    const updates: (File | null)[] = [];
    w.element.addEventListener("update:modelValue", (e: Event) =>
      updates.push((e as CustomEvent).detail),
    );
    const file = new File(["hola"], "hola.txt", { type: "text/plain" });
    w.vm.set(file);
    await flushPromises();
    expect(updates).toEqual([file]);
  });
});

describe("FileInputZone.ce", () => {
  it("set() actualiza los archivos internos y get() los refleja", async () => {
    const w = mount(FileInputZoneCe);
    const files = [new File(["a"], "a.txt", { type: "text/plain" })];
    w.vm.set(files);
    await flushPromises();
    expect(w.vm.get()).toEqual(files);
  });

  it("emite `update:modelValue` al setear", async () => {
    const w = mount(FileInputZoneCe);
    const updates: unknown[] = [];
    w.element.addEventListener("update:modelValue", (e: Event) =>
      updates.push((e as CustomEvent).detail),
    );
    const files = [new File(["a"], "a.txt", { type: "text/plain" })];
    w.vm.set(files);
    await flushPromises();
    expect(updates).toEqual([files]);
  });
});

describe("Switch.ce", () => {
  it("set() actualiza el estado interno y get() lo refleja", async () => {
    const w = mount(SwitchCe);
    w.vm.set(true);
    await flushPromises();
    expect(w.vm.get()).toBe(true);
  });

  it("emite `update:modelValue` al cambiar", async () => {
    const w = mount(SwitchCe);
    const updates: boolean[] = [];
    w.element.addEventListener("update:modelValue", (e: Event) =>
      updates.push((e as CustomEvent).detail),
    );
    w.vm.set(true);
    await flushPromises();
    expect(updates).toEqual([true]);
  });

  it("el CLICK mantiene el estado sin que el host reasigne modelValue", async () => {
    // El caso del reporte: se escucha el evento pero no se escribe `modelValue`.
    const w = mount(SwitchCe);
    const updates: boolean[] = [];
    w.element.addEventListener("update:modelValue", (e) =>
      updates.push((e as CustomEvent).detail),
    );

    await w.find('input[type="checkbox"]').setValue(true);
    await flushPromises();

    expect(w.vm.get()).toBe(true);
    expect(w.find(".cu-switch-track").classes()).toContain("cu-switch--checked");
    expect(updates).toEqual([true]);
  });

  it("`reset()` apaga la UI y `get()`", async () => {
    const w = mount(SwitchCe);
    w.vm.set(true);
    await flushPromises();
    w.vm.reset();
    await flushPromises();

    expect(w.vm.get()).toBe(false);
    expect(w.find(".cu-switch-track").classes()).not.toContain("cu-switch--checked");
  });
});

describe("Checkbox.ce", () => {
  it("set() actualiza el estado interno y get() lo refleja", async () => {
    const w = mount(CheckboxCe);
    w.vm.set(true);
    await flushPromises();
    expect(w.vm.get()).toBe(true);
  });

  it("emite `update:modelValue` al cambiar", async () => {
    const w = mount(CheckboxCe);
    const updates: boolean[] = [];
    w.element.addEventListener("update:modelValue", (e: Event) =>
      updates.push((e as CustomEvent).detail),
    );
    w.vm.set(true);
    await flushPromises();
    expect(updates).toEqual([true]);
  });

  it("el CLICK mantiene el estado sin que el host reasigne modelValue", async () => {
    const w = mount(CheckboxCe);
    const updates: boolean[] = [];
    w.element.addEventListener("update:modelValue", (e) =>
      updates.push((e as CustomEvent).detail),
    );

    await w.find('input[type="checkbox"]').setValue(true);
    await flushPromises();

    expect(w.vm.get()).toBe(true);
    expect(w.find("input").element.checked).toBe(true);
    expect(updates).toEqual([true]);
  });
});

describe("ColorPicker.ce", () => {
  it("set() actualiza el color interno y get() lo refleja", async () => {
    const w = mount(ColorPickerCe);
    w.vm.set("#ff0000");
    await flushPromises();
    expect(w.vm.get()).toBe("#ff0000");
  });

  it("emite `update:modelValue` al cambiar", async () => {
    const w = mount(ColorPickerCe);
    const updates: string[] = [];
    w.element.addEventListener("update:modelValue", (e: Event) =>
      updates.push((e as CustomEvent).detail),
    );
    w.vm.set("#ff0000");
    await flushPromises();
    expect(updates).toEqual(["#ff0000"]);
  });
});

describe("Autocomplete.ce", () => {
  it("forwardea `fixed`", () => {
    const w = mount(AutocompleteCe, { props: { fixed: true } });
    expect(w.findComponent(Autocomplete).props("fixed")).toBe(true);
  });

  it("expone `reset` e `isOpen()` como booleano", () => {
    const w = mount(AutocompleteCe);
    expect(typeof w.vm.reset).toBe("function");
    expect(w.vm.isOpen()).toBe(false);
  });

  it("expone `open`, `close` y `toggle` y controlan el panel", async () => {
    const w = mount(AutocompleteCe, { props: { items: [{ label: "María" }] } });
    expect(typeof w.vm.open).toBe("function");
    expect(typeof w.vm.close).toBe("function");
    expect(typeof w.vm.toggle).toBe("function");

    w.vm.open();
    await flushPromises();
    expect(w.vm.isOpen()).toBe(true);

    w.vm.close();
    await flushPromises();
    expect(w.vm.isOpen()).toBe(false);

    w.vm.toggle();
    await flushPromises();
    expect(w.vm.isOpen()).toBe(true);
  });

  it("set() refleja el texto y no abre el panel", async () => {
    const w = mount(AutocompleteCe, { props: { items: [{ label: "María" }] } });
    w.vm.set("María");
    await flushPromises();
    expect(w.vm.get()).toBe("María");
    expect(w.vm.isOpen()).toBe(false);
  });

  it("no declara props que el `.vue` no tiene (`theme`, `hightContrast`, `label`)", () => {
    const declared = Object.keys(AutocompleteCe.props ?? {});
    expect(declared).not.toContain("theme");
    expect(declared).not.toContain("hightContrast");
    expect(declared).not.toContain("label");
  });

  it("emite `update:modelValue` al teclear y `get()` refleja el texto", async () => {
    const w = mount(AutocompleteCe, { props: { items: [{ label: "María" }] } });
    const updates: string[] = [];
    w.element.addEventListener("update:modelValue", (e: Event) =>
      updates.push((e as CustomEvent).detail),
    );

    await w.find("input").setValue("María");
    await flushPromises();

    expect(w.vm.get()).toBe("María");
    expect(updates).toEqual(["María"]);
  });

  it("seleccionar una sugerencia emite `select` y actualiza `get()`", async () => {
    const w = mount(AutocompleteCe, { props: { items: [{ label: "María" }] } });
    const selects: { label: string }[] = [];
    w.element.addEventListener("select", (e: Event) =>
      selects.push((e as CustomEvent).detail),
    );

    await w.find("input").setValue("María");
    await flushPromises();
    await w.find(".cu-autocomplete-option").trigger("click");
    await flushPromises();

    expect(w.vm.get()).toBe("María");
    expect(selects[0]?.label).toBe("María");
  });
});

describe("CommandPalette.ce", () => {
  const commands = [{ id: "a", label: "A", action: () => {} }];

  it("declara y forwardea `commands`", () => {
    const w = mount(CommandPaletteCe, { props: { commands } });
    expect(w.findComponent(CommandPalette).props("commands")).toEqual(commands);
  });

  it("expone la API del `.vue`", () => {
    const w = mount(CommandPaletteCe, { props: { commands } });
    expect(w.vm.getCommands()).toEqual(commands);
    expect(w.vm.isOpen()).toBe(false);
    expect(typeof w.vm.open).toBe("function");
    expect(typeof w.vm.run).toBe("function");
  });
});

describe("Tooltip.ce", () => {
  it("no manda el slot `content` si el host no lo trae (deja actuar al fallback `text`)", () => {
    const w = mount(TooltipCe, { props: { text: "ayuda" } });
    const inner = w.findComponent(Tooltip);
    const slots = (inner.vm as unknown as { $slots: Record<string, unknown> }).$slots;
    expect(inner.props("text")).toBe("ayuda");
    expect(slots.content).toBeUndefined();
  });

  it("reenvía el slot `content` del host", () => {
    const w = mount(TooltipCe, { props: { text: "ayuda" }, slots: { content: "<i>rico</i>" } });
    const inner = w.findComponent(Tooltip);
    const slots = (inner.vm as unknown as { $slots: Record<string, unknown> }).$slots;
    expect(slots.content).toBeDefined();
  });
});

describe("Markdown.ce", () => {
  it("bridgea `parsed` y expone `headingIds()`", async () => {
    // `Markdown.vue` reintenta el parseo con `setTimeout` hasta que el contenido
    // del slot está en el DOM.
    vi.useFakeTimers();
    const w = mount(MarkdownCe, { slots: { default: "# Hola\n\ntexto" } });
    const onParsed = vi.fn();
    w.element.addEventListener("parsed", onParsed);
    await vi.advanceTimersByTimeAsync(300);
    await flushPromises();
    vi.useRealTimers();
    expect(onParsed).toHaveBeenCalled();
    expect(w.vm.headingIds().length).toBeGreaterThan(0);
  });

  it("no declara la prop muerta `theme`", () => {
    expect(Object.keys(MarkdownCe.props ?? {})).not.toContain("theme");
  });
});

describe("AdvancedTable.ce (cu-table)", () => {
  it("forwardea `compact`, `inlineEditing`, `tableMaxHeight` y `actionsLabel`", () => {
    const w = mount(TableCe, {
      props: { compact: true, inlineEditing: true, tableMaxHeight: "20rem", actionsLabel: "Acciones" },
    });
    const inner = w.findComponent(AdvancedTable);
    expect(inner.props("compact")).toBe(true);
    expect(inner.props("inlineEditing")).toBe(true);
    expect(inner.props("tableMaxHeight")).toBe("20rem");
    expect(inner.props("actionsLabel")).toBe("Acciones");
  });

  it("reenvía los slots del host (montado como componente Vue)", () => {
    const w = mount(TableCe, {
      props: { data: [], columns: [] },
      slots: { footer: '<span class="mi-footer">total</span>' },
    });
    expect(w.html()).toContain("mi-footer");
  });

  it("no declara la prop muerta `theme`", () => {
    expect(Object.keys(TableCe.props ?? {})).not.toContain("theme");
    expect(Object.keys(AdvancedTable.props ?? {})).not.toContain("theme");
  });

  it("no declara los eventos de fila que nadie emite", () => {
    const emits = (AdvancedTable.emits ?? []) as string[];
    expect(emits).not.toContain("row-click");
    expect(emits).not.toContain("row-dblclick");
    expect(emits).not.toContain("cell-click");
  });
});
