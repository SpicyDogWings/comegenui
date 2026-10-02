// Comportamiento de CodeBlock según su ficha (docs/componentes/vue/code-block.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import CodeBlock from "./CodeBlock.vue";

describe("CodeBlock — código y lenguaje", () => {
  it("muestra el código recibido por prop", () => {
    const w = mount(CodeBlock, { props: { code: "const x = 1" } });
    expect(w.text()).toContain("const x = 1");
  });

  it("muestra el badge del lenguaje cuando se especifica", () => {
    const w = mount(CodeBlock, { props: { code: "x", language: "js" } });
    const badge = w.find(".cu-code-block-lang");
    expect(badge.exists()).toBe(true);
    expect(badge.text()).toBe("js");
  });

  it("no muestra badge cuando no hay lenguaje", () => {
    const w = mount(CodeBlock, { props: { code: "x" } });
    expect(w.find(".cu-code-block-lang").exists()).toBe(false);
  });

  it("resuelve alias de lenguaje (ts → typescript) y resalta", () => {
    const w = mount(CodeBlock, { props: { code: "const x: number = 1", language: "ts" } });
    // highlight.js emite spans con clases hljs-*
    expect(w.find(".cu-code-block-hl").exists()).toBe(true);
    expect(w.html()).toContain("hljs-");
  });
});

describe("CodeBlock — variantes y números de línea", () => {
  it("aplica la clase de la variante", () => {
    expect(mount(CodeBlock, { props: { code: "x" } }).classes()).toContain(
      "cu-code-block--default",
    );
    expect(
      mount(CodeBlock, { props: { code: "x", variant: "outlined" } }).classes(),
    ).toContain("cu-code-block--outlined");
    expect(
      mount(CodeBlock, { props: { code: "x", variant: "solid" } }).classes(),
    ).toContain("cu-code-block--solid");
  });

  it("`lineNumbers` agrega la clase y numera cada línea", () => {
    const w = mount(CodeBlock, { props: { code: "uno\ndos\ntres", lineNumbers: true } });
    expect(w.classes()).toContain("cu-code-block--line-numbers");
    expect(w.findAll(".cu-code-block-line-number")).toHaveLength(3);
  });

  it("sin `lineNumbers` no numera las líneas", () => {
    const w = mount(CodeBlock, { props: { code: "uno\ndos" } });
    expect(w.classes()).not.toContain("cu-code-block--line-numbers");
    expect(w.findAll(".cu-code-block-line-number")).toHaveLength(0);
  });

  it("siempre incluye el botón de copiar", () => {
    const w = mount(CodeBlock, { props: { code: "copiame" } });
    expect(w.find(".cu-code-block-copy").exists()).toBe(true);
  });
});
