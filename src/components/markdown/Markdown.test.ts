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

// ── Ids de encabezado: anclas estables ────────────────────────────────────────
// La ficha dice que el `id` de cada heading sirve para anclas. Eso exige que
// salga del texto visible (no del HTML con clases) y que no se repita.
describe("Markdown — ids de encabezado", () => {
  it("ignora el formato al generar el id (negrita, código, link)", async () => {
    const negrita = await mountParsed("# **Hola**");
    expect(negrita.find("h1").attributes("id")).toBe("hola");

    const codigo = await mountParsed("# `code`");
    expect(codigo.find("h1").attributes("id")).toBe("code");

    const link = await mountParsed("# [Hola](https://x.test)");
    expect(link.find("h1").attributes("id")).toBe("hola");
  });

  it("numera los ids repetidos para que el ancla no colapse", async () => {
    const w = await mountParsed("# Igual\n\n## Igual\n\n# Igual");
    const ids = w.findAll("h1, h2").map((h) => h.attributes("id"));
    expect(ids).toEqual(["igual", "igual-1", "igual-2"]);
    expect(vm(w).headingIds()).toEqual(ids);
  });
});

// ── Tablas: cada columna conserva su celda ────────────────────────────────────
describe("Markdown — tablas con encabezados repetidos o vacíos", () => {
  it("no colapsa dos columnas con el mismo encabezado", async () => {
    const w = await mountParsed("| a | a |\n|---|---|\n| 1 | 2 |");
    const cells = w.findAll("td").map((td) => td.text());
    expect(cells).toEqual(["1", "2"]);
    expect(w.findAll("th")).toHaveLength(2);
  });

  it("no pierde la celda de una columna sin encabezado", async () => {
    const w = await mountParsed("| | b |\n|---|---|\n| 1 | 2 |");
    const cells = w.findAll("td").map((td) => td.text());
    expect(cells).toEqual(["1", "2"]);
  });

  it("muestra el texto del encabezado sin el marcado", async () => {
    const w = await mountParsed("| **A** | b |\n|---|---|\n| 1 | 2 |");
    const headers = w.findAll("th").map((th) => th.text());
    expect(headers).toEqual(["A", "b"]);
  });
});

// ── Seguridad: el markdown no inyecta HTML ni atributos ──────────────────────
describe("Markdown — seguridad", () => {
  it("no inyecta atributos desde la URL de una imagen", async () => {
    const w = await mountParsed('![x](<a" onerror="alert(1)>)');
    const img = w.find("img.cu-md-image");
    expect(img.exists()).toBe(true);
    expect(img.attributes("onerror")).toBeUndefined();
    expect(img.attributes("src")).toBe('a" onerror="alert(1)');
  });

  it("escapa el `<` de un escape de markdown dentro de un formato", async () => {
    const w = await mountParsed("**\\<img src=x onerror=alert(1)>**");
    expect(w.find("img").exists()).toBe(false);
    expect(w.find("strong").text()).toContain("<img src=x onerror=alert(1)>");
  });

  it("no inyecta atributos desde un link anidado en negrita", async () => {
    const w = await mountParsed('**[x](<a" onmouseover="alert(1)>)**');
    const link = w.find("a");
    expect(link.exists()).toBe(true);
    expect(link.attributes("onmouseover")).toBeUndefined();
  });

  it("respeta las entidades del texto y del alt", async () => {
    const parrafo = await mountParsed("A & B y A &amp; B");
    expect(parrafo.find(".cu-md-paragraph").text()).toBe("A & B y A & B");

    const img = await mountParsed("![a &amp; b](/foto.png)");
    expect(img.find("img.cu-md-image").attributes("alt")).toBe("a & b");
  });

  it("un link `javascript:` no navega", async () => {
    const w = await mountParsed("[x](javascript:alert(1))");
    expect(w.find("a").exists()).toBe(false);
    expect(w.findAll("a[href]")).toHaveLength(0);
  });

  it("un bloque de HTML crudo se muestra como código, no se ejecuta", async () => {
    const w = await mountParsed("<script>alert(1)</script>");
    expect(w.find("script").exists()).toBe(false);
    expect(w.find(".cu-code-block").text()).toContain("<script>alert(1)</script>");
  });
});

// ── Links dentro de HTML sanitizado (blockquote / celdas) ────────────────────
describe("Markdown — links en blockquote y celdas", () => {
  it("abren en una pestaña nueva, igual que los inline", async () => {
    const bq = await mountParsed("> [doc](https://ok.test)");
    const bqLink = bq.find(".cu-blockquote a");
    expect(bqLink.attributes("href")).toBe("https://ok.test");
    expect(bqLink.attributes("target")).toBe("_blank");
    expect(bqLink.attributes("rel")).toContain("noopener");

    const table = await mountParsed("| a |\n|---|\n| [doc](https://ok.test) |");
    const cellLink = table.find("td a");
    expect(cellLink.attributes("href")).toBe("https://ok.test");
    expect(cellLink.attributes("target")).toBe("_blank");
  });

  it("un link `javascript:` sigue bloqueado", async () => {
    const bq = await mountParsed("> [x](javascript:alert(1))");
    expect(bq.find(".cu-blockquote a[href]").exists()).toBe(false);

    const table = await mountParsed("| a |\n|---|\n| [x](javascript:alert(1)) |");
    expect(table.find("td a[href]").exists()).toBe(false);
  });
});
