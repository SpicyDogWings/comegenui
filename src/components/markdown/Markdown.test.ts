// Comportamiento de Markdown según su ficha (docs/componentes/vue/markdown.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
//
// La ficha dice: el contenido entra como texto del slot, se parsea al montar,
// las tablas salen como `<cu-table>`, los code blocks como `<cu-code-block>` y
// se emite `parsed` con los ids de los encabezados (que también expone
// `headingIds()`).
import { describe, it, expect, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { h } from "vue";
import Markdown from "./Markdown.vue";

type MarkdownVm = { headingIds: () => string[] };

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as MarkdownVm;

// El slot se pasa como función que devuelve un nodo de texto crudo: si se pasa
// un string, el compilador de templates colapsa los `\n` a espacios y se pierde
// el markdown multilínea.
const textSlot = (text: string) => () => h("span", text);

// `Markdown.vue` reintenta el parseo con `setTimeout` hasta que el contenido del
// slot está en el DOM; hay que dejar correr los timers.
async function mountParsed(text: string) {
  vi.useFakeTimers();
  const w = mount(Markdown, { slots: { default: textSlot(text) } });
  await vi.advanceTimersByTimeAsync(300);
  await flushPromises();
  vi.useRealTimers();
  return w;
}

describe("Markdown — parseo del contenido del slot", () => {
  it("emite `parsed` con los ids de los encabezados", async () => {
    const w = await mountParsed("# Hola\n\n## Adiós\n\ntexto");
    const parsed = w.emitted("parsed");
    expect(parsed).toBeTruthy();
    expect(parsed![0]![0]).toEqual(["hola", "adios"]);
  });

  it("`headingIds()` devuelve los mismos ids generados", async () => {
    const w = await mountParsed("# Hola\n\n## Adiós");
    expect(vm(w).headingIds()).toEqual(["hola", "adios"]);
  });

  it("no emite `parsed` con contenido vacío", async () => {
    const w = await mountParsed("   ");
    expect(w.emitted("parsed")).toBeUndefined();
  });
});

describe("Markdown — render de bloques", () => {
  it("renderiza los encabezados con su id", async () => {
    const w = await mountParsed("# Título");
    const h1 = w.find("h1");
    expect(h1.exists()).toBe(true);
    expect(h1.attributes("id")).toBe("titulo");
    expect(h1.text()).toBe("Título");
  });

  it("renderiza los párrafos", async () => {
    const w = await mountParsed("Un párrafo");
    expect(w.find("p.cu-md-paragraph").text()).toContain("Un párrafo");
  });

  it("renderiza los blockquotes con el componente Blockquote", async () => {
    const w = await mountParsed("> Cita importante");
    const bq = w.find(".cu-blockquote");
    expect(bq.exists()).toBe(true);
    expect(bq.text()).toContain("Cita importante");
  });

  it("renderiza los code blocks con el lenguaje", async () => {
    const w = await mountParsed("```js\nconst x = 1\n```");
    const cb = w.find(".cu-code-block");
    expect(cb.exists()).toBe(true);
    expect(cb.text()).toContain("const x = 1");
    expect(cb.text()).toContain("js");
  });

  it("renderiza las tablas con el componente Table", async () => {
    const w = await mountParsed("| Col A | Col B |\n|-------|-------|\n| a     | b     |");
    const table = w.find("table");
    expect(table.exists()).toBe(true);
    expect(table.text()).toContain("Col A");
    expect(table.text()).toContain("Col B");
    expect(table.text()).toContain("a");
  });

  it("renderiza listas no ordenadas", async () => {
    const w = await mountParsed("- Item 1\n- Item 2");
    const ul = w.find("ul.cu-md-list");
    expect(ul.exists()).toBe(true);
    expect(ul.findAll("li.cu-md-list-item")).toHaveLength(2);
  });

  it("oculta el slot de entrada cuando hay contenido parseado", async () => {
    const w = await mountParsed("# Título");
    expect(w.find(".cu-md-slot").attributes("style")).toContain("display: none");
  });
});
