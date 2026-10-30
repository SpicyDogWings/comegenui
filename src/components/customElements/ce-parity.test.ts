// Paridad de los wrappers CE con su `.vue`: props que no llegaban al componente
// interno, eventos y slots que no se reenviaban, y métodos que no se exponían.
import { beforeAll, describe, expect, it, vi } from "vitest";
import { defineCustomElement } from "vue";
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
import SideOverCe from "@/components/customElements/overlay/SideOver.ce.vue";
import TooltipCe from "@/components/customElements/overlay/Tooltip.ce.vue";
import MarkdownCe from "@/components/customElements/markdown/Markdown.ce.vue";
import TableCe from "@/components/customElements/data/AdvancedTable.ce.vue";
import { defineComegenElement } from "@/utils/comegen-element";

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

  it("forwardea `disabled` y no togglea al clickear", async () => {
    const w = mount(CollapseCe, { props: { label: "Título", disabled: true } });
    expect(w.findComponent(Collapse).props("disabled")).toBe(true);
    await w.find(".cu-collapse-trigger").trigger("click");
    await flushPromises();
    expect(w.vm.isOpen()).toBe(false);
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

  it("selectedItem() devuelve la opción y el check marca sólo la elegida", async () => {
    const w = mount(SelectCe, { props: { options, modelValue: "b" } });
    await w.find(".cu-select-toggle").trigger("click");
    await flushPromises();

    const opts = w.findAll(".cu-select-option");
    expect(opts[1]!.find(".cu-menu-option-check").exists()).toBe(true);
    expect(opts[0]!.find(".cu-menu-option-check").exists()).toBe(false);
    expect(w.vm.selectedItem()).toMatchObject({ value: "b" });
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

  it("forwardea `readOnly` y no abre el dropdown", async () => {
    const w = mount(SelectCe, { props: { options, readOnly: true } });

    expect(w.findComponent(Select).props("readOnly")).toBe(true);
    expect(w.find(".cu-select-toggle").attributes("aria-readonly")).toBe("true");

    await w.find(".cu-select-toggle").trigger("click");
    await flushPromises();
    expect(w.vm.isOpen()).toBe(false);
  });

  it("acepta el atributo HTML `read-only`", async () => {
    const tag = "cu-select-readonly-test";
    if (!customElements.get(tag)) customElements.define(tag, defineCustomElement(SelectCe));

    const el = document.createElement(tag) as HTMLElement & { isOpen: () => boolean };
    el.setAttribute("read-only", "");
    document.body.appendChild(el);
    await flushPromises();

    const toggle = el.shadowRoot?.querySelector(".cu-select-toggle") as HTMLElement | null;
    expect(toggle).not.toBeNull();
    toggle?.click();
    await flushPromises();

    expect(el.isOpen()).toBe(false);
    el.remove();
  });

  it("expone el patrón combobox + listbox y no comparte ids entre instancias", async () => {
    const a = mount(SelectCe, { props: { options } });
    const b = mount(SelectCe, { props: { options } });
    const trigger = a.find(".cu-select-toggle");
    expect(trigger.attributes("role")).toBe("combobox");
    expect(trigger.attributes("aria-haspopup")).toBe("listbox");

    await trigger.trigger("click");
    await a.find(".cu-select-toggle").trigger("click");
    await flushPromises();
    for (const w of [a, b]) {
      const t = w.find(".cu-select-toggle");
      if (t.attributes("aria-expanded") !== "true") {
        await t.trigger("click");
        await flushPromises();
      }
    }

    const panel = a.find(".cu-popover-panel");
    expect(panel.attributes("role")).toBe("listbox");
    expect(a.find(".cu-select-toggle").attributes("aria-controls")).toBe(panel.attributes("id"));
    expect(a.findAll(".cu-select-option")[0]!.attributes("role")).toBe("option");
    expect(a.find(".cu-popover-panel").attributes("id")).not.toBe(
      b.find(".cu-popover-panel").attributes("id"),
    );
  });

  it("no re-emite `blur` como CustomEvent: el nativo del control ya llega al host", async () => {
    const w = mount(SelectCe, { props: { options }, attachTo: document.body });
    const recibidos: Event[] = [];
    w.element.addEventListener("blur", (e: Event) => recibidos.push(e));

    w.findComponent(Select).vm.$emit("blur");
    await flushPromises();

    expect(recibidos.filter((e) => e instanceof CustomEvent)).toHaveLength(0);
    w.unmount();
  });
});

describe("Popover · foco dentro de un custom element (shadow root)", () => {
  // jsdom: dentro de un shadow root `activeElement` es `null` cuando el foco está afuera,
  // y `Popover.restoreFocus` lo leía como "foco perdido" (robaba el foco al cerrar el
  // panel, así que un Tab desde una opción no salía del control).
  it("no roba el foco cuando el usuario se fue a otro control", async () => {
    const tag = "cu-select-foco-test";
    if (!customElements.get(tag)) customElements.define(tag, defineCustomElement(SelectCe));

    const outside = document.createElement("button");
    document.body.appendChild(outside);
    const el = document.createElement(tag) as HTMLElement;
    document.body.appendChild(el);
    await flushPromises();

    const trigger = el.shadowRoot!.querySelector(".cu-select-toggle") as HTMLElement;
    (el as HTMLElement & { options: unknown[] }).options = [{ value: "a", label: "A" }];
    await flushPromises();
    trigger.focus();
    trigger.click();
    await flushPromises();
    expect(el.shadowRoot!.querySelector(".cu-select-options")).not.toBeNull();

    outside.focus();
    // El componente difiere el cierre una tarea para que el foco termine de moverse.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await flushPromises();

    expect(document.activeElement).toBe(outside);
    expect(el.shadowRoot!.querySelector(".cu-select-options")).toBeNull();
    el.remove();
    outside.remove();
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

const SwitchElement = defineCustomElement(SwitchCe);
customElements.define("cu-switch-label-test", SwitchElement);

async function mountSwitchElement(html: string) {
  const el = document.createElement("cu-switch-label-test") as HTMLElement & { label: string };
  el.setAttribute("label", "Notificaciones");
  el.innerHTML = html;
  document.body.appendChild(el);
  await flushPromises();
  return el;
}

describe("Switch.ce", () => {
  it("renderiza el `label` del atributo cuando el host no tiene hijos", async () => {
    const el = await mountSwitchElement("");
    expect(el.shadowRoot?.querySelector(".cu-switch-label")?.textContent).toBe("Notificaciones");
    el.remove();
  });

  it("ignora hijos de solo espacios y mantiene el `label` del atributo", async () => {
    const el = await mountSwitchElement("\n    ");
    expect(el.shadowRoot?.querySelector(".cu-switch-label")?.textContent).toBe("Notificaciones");
    el.remove();
  });

  it("sigue proyectando el slot cuando el host tiene contenido", async () => {
    const el = await mountSwitchElement("Desde el slot");
    expect(el.shadowRoot?.querySelector(".cu-switch-label slot")).not.toBeNull();
    expect(el.textContent).toContain("Desde el slot");
    el.remove();
  });

  it("pasa a mostrar el slot si el host recibe contenido después del mount", async () => {
    const el = await mountSwitchElement("");
    expect(el.shadowRoot?.querySelector(".cu-switch-label")?.textContent).toBe("Notificaciones");

    el.textContent = "Contenido tardío";
    await flushPromises();

    expect(el.shadowRoot?.querySelector(".cu-switch-label slot")).not.toBeNull();
    expect(el.textContent).toContain("Contenido tardío");
    el.remove();
  });

  it("mapea el atributo `label-position` a la prop `labelPosition`", async () => {
    const el = await mountSwitchElement("");
    expect(el.shadowRoot?.querySelector(".cu-switch")?.className).toContain(
      "cu-switch--label-end",
    );

    el.setAttribute("label-position", "start");
    await flushPromises();

    expect(el.shadowRoot?.querySelector(".cu-switch")?.className).toContain(
      "cu-switch--label-start",
    );
    el.remove();
  });

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

  it("marca con el check el item elegido aunque los items lleguen crudos por la propiedad del CE", async () => {
    const w = mount(AutocompleteCe, {
      props: { items: [{ label: "Alfa" }, { label: "Beta" }] },
    });
    await w.find("input").setValue("Al");
    await flushPromises();
    await w.find(".cu-autocomplete-option").trigger("click");
    await flushPromises();

    const opts = w.findAll(".cu-autocomplete-option");
    expect(opts).toHaveLength(2);
    expect(opts[0]!.find(".cu-menu-option-check").exists()).toBe(true);
    expect(opts[1]!.find(".cu-menu-option-check").exists()).toBe(false);
  });

  it("selectedItem() devuelve el item elegido", async () => {
    const w = mount(AutocompleteCe, {
      props: { items: [{ label: "Alfa" }, { label: "Beta" }] },
    });
    await w.find("input").setValue("Al");
    await flushPromises();
    await w.find(".cu-autocomplete-option").trigger("click");
    await flushPromises();

    expect(w.vm.selectedItem()).toMatchObject({ label: "Alfa" });
  });

  it("en el custom element real, el check aparece con items crudos (propiedad JS)", async () => {
    if (!customElements.get("test-cu-autocomplete")) {
      customElements.define("test-cu-autocomplete", defineCustomElement(AutocompleteCe));
    }
    const el = document.createElement("test-cu-autocomplete") as HTMLElement & {
      items: { label: string }[];
    };
    el.items = [{ label: "Alfa" }, { label: "Beta" }];
    document.body.append(el);
    await flushPromises();
    await flushPromises();

    const sr = el.shadowRoot!;
    const input = sr.querySelector("input") as HTMLInputElement;
    input.focus();
    input.value = "Al";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await flushPromises();
    (sr.querySelector(".cu-autocomplete-option") as HTMLElement).click();
    await flushPromises();
    await flushPromises();

    expect(sr.querySelectorAll(".cu-autocomplete-option")).toHaveLength(2);
    expect(sr.querySelectorAll(".cu-menu-option-check")).toHaveLength(1);
    el.remove();
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

  it("expone el patrón combobox + listbox y no comparte ids entre instancias", async () => {
    const items = [{ label: "Alfa" }, { label: "Beta" }];
    const a = mount(AutocompleteCe, { props: { items } });
    const b = mount(AutocompleteCe, { props: { items } });
    expect(a.find("input").attributes("role")).toBe("combobox");
    expect(a.find("input").attributes("aria-autocomplete")).toBe("list");
    expect(a.find("input").attributes("aria-haspopup")).toBe("listbox");

    a.vm.open();
    b.vm.open();
    await flushPromises();

    const panel = a.find(".cu-popover-panel");
    expect(panel.attributes("role")).toBe("listbox");
    expect(a.find("input").attributes("aria-controls")).toBe(panel.attributes("id"));
    expect(a.findAll(".cu-autocomplete-option")[0]!.attributes("role")).toBe("option");
    expect(panel.attributes("id")).not.toBe(b.find(".cu-popover-panel").attributes("id"));
  });

  it("no re-emite `blur` como CustomEvent: el nativo del campo ya llega al host", async () => {
    const w = mount(AutocompleteCe, {
      props: { items: [{ label: "María" }] },
      attachTo: document.body,
    });
    const recibidos: Event[] = [];
    w.element.addEventListener("blur", (e: Event) => recibidos.push(e));

    w.findComponent(Autocomplete).vm.$emit("blur");
    await flushPromises();

    expect(recibidos.filter((e) => e instanceof CustomEvent)).toHaveLength(0);
    w.unmount();
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

const SideOverElement = defineCustomElement(SideOverCe);
customElements.define("cu-side-over-method-test", SideOverElement);

// Ruta real de los bundles: `defineComegenElement` es quien reenvía al nodo
// interno los atributos que no son props (p. ej. `aria-label`).
defineComegenElement("cu-side-over-attr-test", SideOverCe);

type SideOverTestElement = HTMLElement & {
  open: boolean;
  show: () => void;
  close: () => void;
  isOpen: () => boolean;
};

async function mountSideOverElement() {
  const el = document.createElement("cu-side-over-method-test") as SideOverTestElement;
  document.body.appendChild(el);
  await flushPromises();
  return el;
}

describe("SideOver.ce", () => {
  it("expone `show()` sin que la prop booleana `open` lo tape", async () => {
    const el = await mountSideOverElement();

    expect(typeof el.show).toBe("function");
    expect(typeof el.open).toBe("boolean");

    el.show();
    await flushPromises();
    expect(el.isOpen()).toBe(true);

    el.close();
    await flushPromises();
    expect(el.isOpen()).toBe(false);

    el.remove();
  });

  it("el atributo `open` abre y cierra el panel", async () => {
    const el = await mountSideOverElement();

    el.setAttribute("open", "");
    await flushPromises();
    expect(el.isOpen()).toBe(true);

    el.removeAttribute("open");
    await flushPromises();
    expect(el.isOpen()).toBe(false);

    el.remove();
  });

  it("proyecta el slot del host dentro del panel", async () => {
    const el = document.createElement("cu-side-over-method-test") as SideOverTestElement;
    el.innerHTML = "<p>Contenido del panel</p>";
    document.body.appendChild(el);
    await flushPromises();

    el.show();
    await flushPromises();

    // El panel tiene que quedar dentro del shadow root: si se teleporta a body,
    // el <slot> sale del shadow tree y el contenido del host no se proyecta.
    const body = el.shadowRoot?.querySelector(".cu-sideover-body");
    expect(body).not.toBeNull();
    expect(body?.querySelector("slot")).not.toBeNull();

    el.remove();
  });

  it("show()/close()/toggle() emiten update:open y close", async () => {
    const el = await mountSideOverElement();
    const events: Array<[string, unknown?]> = [];
    el.addEventListener("update:open", (e) => events.push(["update:open", (e as CustomEvent).detail]));
    el.addEventListener("close", () => events.push(["close"]));

    el.show();
    await flushPromises();
    expect(events).toEqual([["update:open", true]]);

    el.close();
    await flushPromises();
    expect(events).toEqual([["update:open", true], ["update:open", false], ["close"]]);

    el.remove();
  });

  it("cerrar por el backdrop emite update:open(false) y un solo close", async () => {
    const el = await mountSideOverElement();
    el.show();
    await flushPromises();

    const events: Array<[string, unknown?]> = [];
    el.addEventListener("update:open", (e) => events.push(["update:open", (e as CustomEvent).detail]));
    el.addEventListener("close", () => events.push(["close"]));

    el.shadowRoot!.querySelector(".cu-sideover-backdrop")!.dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
    await flushPromises();

    expect(events).toEqual([["update:open", false], ["close"]]);
    expect(el.isOpen()).toBe(false);

    el.remove();
  });

  it("el diálogo toma el título como nombre accesible y acepta aria-label del host", async () => {
    const withTitle = await mountSideOverElement();
    withTitle.setAttribute("open", "");
    withTitle.setAttribute("title", "Filtros");
    await flushPromises();
    const dialog = withTitle.shadowRoot!.querySelector("[role='dialog']")!;
    const title = withTitle.shadowRoot!.querySelector(".cu-sideover-title") as HTMLElement;
    expect(dialog.getAttribute("aria-labelledby")).toBe(title.id);
    withTitle.remove();

    const labelled = document.createElement("cu-side-over-attr-test") as SideOverTestElement;
    labelled.setAttribute("aria-label", "Panel de filtros");
    document.body.appendChild(labelled);
    await flushPromises();
    labelled.show();
    await flushPromises();
    expect(
      labelled.shadowRoot!.querySelector("[role='dialog']")!.getAttribute("aria-label"),
    ).toBe("Panel de filtros");
    labelled.remove();
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
