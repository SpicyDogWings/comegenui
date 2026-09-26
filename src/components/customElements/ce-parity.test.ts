// Paridad de los wrappers CE con su `.vue`: props que no llegaban al componente
// interno, eventos y slots que no se reenviaban, y métodos que no se exponían
// (ver docs/notes/05-wrappers-ce-incompletos.md y 06-cu-markdown-api.md).
import { describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";

import AvatarCe from "@/components/customElements/information/Avatar.ce.vue";
import CollapseCe from "@/components/customElements/overlay/Collapse.ce.vue";
import InputCe from "@/components/customElements/form/Input.ce.vue";
import AutocompleteCe from "@/components/customElements/form/Autocomplete.ce.vue";
import CommandPaletteCe from "@/components/customElements/overlay/CommandPalette.ce.vue";
import TooltipCe from "@/components/customElements/overlay/Tooltip.ce.vue";
import MarkdownCe from "@/components/customElements/markdown/Markdown.ce.vue";
import TableCe from "@/components/customElements/data/AdvancedTable.ce.vue";

import Avatar from "@/components/information/Avatar.vue";
import Collapse from "@/components/overlay/Collapse.vue";
import Input from "@/components/form/Input.vue";
import Autocomplete from "@/components/form/Autocomplete.vue";
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
});

describe("Input.ce", () => {
  it("forwardea `size`", () => {
    const w = mount(InputCe, { props: { size: "lg" } });
    expect(w.findComponent(Input).props("size")).toBe("lg");
    expect(w.find("input").classes()).toContain("cu-input--lg");
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

  it("no declara props que el `.vue` no tiene (`theme`, `hightContrast`, `label`)", () => {
    const declared = Object.keys(AutocompleteCe.props ?? {});
    expect(declared).not.toContain("theme");
    expect(declared).not.toContain("hightContrast");
    expect(declared).not.toContain("label");
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
});

describe("AdvancedTable.ce (cu-table)", () => {
  it("forwardea `compact`, `inlineEditing` y `tableMaxHeight`", () => {
    const w = mount(TableCe, {
      props: { compact: true, inlineEditing: true, tableMaxHeight: "20rem" },
    });
    const inner = w.findComponent(AdvancedTable);
    expect(inner.props("compact")).toBe(true);
    expect(inner.props("inlineEditing")).toBe(true);
    expect(inner.props("tableMaxHeight")).toBe("20rem");
  });

  it("reenvía los slots del host", () => {
    const w = mount(TableCe, {
      props: { data: [], columns: [] },
      slots: { footer: '<span class="mi-footer">total</span>' },
    });
    expect(w.html()).toContain("mi-footer");
  });

  it("no declara la prop muerta `theme`", () => {
    expect(Object.keys(TableCe.props ?? {})).not.toContain("theme");
  });
});
