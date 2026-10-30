// Comportamiento de InlineRenderer según su ficha (docs/componentes/vue/inline-renderer.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InlineRenderer from "./InlineRenderer.vue";

const render = (tokens: any[]) => mount(InlineRenderer, { props: { tokens } });

describe("InlineRenderer — tokens inline de marked", () => {
  it("renderiza texto plano", () => {
    const w = render([{ type: "text", text: "hola mundo" }]);
    expect(w.text()).toContain("hola mundo");
  });

  it("renderiza negrita como <strong>", () => {
    const w = render([{ type: "strong", tokens: [{ type: "text", text: "fuerte" }] }]);
    expect(w.find("strong").exists()).toBe(true);
    expect(w.find("strong").text()).toBe("fuerte");
  });

  it("renderiza itálica como <em>", () => {
    const w = render([{ type: "em", tokens: [{ type: "text", text: "énfasis" }] }]);
    expect(w.find("em").exists()).toBe(true);
    expect(w.find("em").text()).toBe("énfasis");
  });

  it("renderiza tachado como <del>", () => {
    const w = render([{ type: "del", tokens: [{ type: "text", text: "viejo" }] }]);
    expect(w.find("del").exists()).toBe(true);
  });

  it("renderiza código inline con la clase cu-md-code-inline", () => {
    const w = render([{ type: "codespan", text: "const x" }]);
    const code = w.find("code.cu-md-code-inline");
    expect(code.exists()).toBe(true);
    expect(code.text()).toBe("const x");
  });

  it("escapa el HTML de un codespan", () => {
    const w = render([{ type: "codespan", text: "<script>" }]);
    expect(w.find("code.cu-md-code-inline").html()).toContain("&lt;script&gt;");
  });

  it("renderiza saltos de línea como <br>", () => {
    const w = render([{ type: "br" }]);
    expect(w.find("br").exists()).toBe(true);
  });

  it("renderiza links como un botón/ancla con href", () => {
    const w = render([
      { type: "link", href: "https://ejemplo.com", tokens: [{ type: "text", text: "sitio" }] },
    ]);
    const link = w.find("a.cu-button-link");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toBe("https://ejemplo.com");
    expect(link.text()).toContain("sitio");
  });

  it("renderiza imágenes con src y alt", () => {
    const w = render([
      { type: "image", href: "/foto.png", text: "una foto", tokens: [{ type: "text", text: "una foto" }] },
    ]);
    const img = w.find("img.cu-md-image");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("/foto.png");
    expect(img.attributes("alt")).toBe("una foto");
  });
});

// ── Seguridad: los tokens no pueden inyectar HTML ni atributos ───────────────
describe("InlineRenderer — seguridad", () => {
  it("escapa las comillas del src de una imagen", () => {
    const w = render([{ type: "image", href: 'a" onerror="alert(1)', text: "x" }]);
    const img = w.find("img.cu-md-image");
    expect(img.exists()).toBe(true);
    expect(img.attributes("onerror")).toBeUndefined();
    expect(img.attributes("src")).toBe('a" onerror="alert(1)');
  });

  it("no vuelve a escapar las entidades del texto", () => {
    const w = render([{ type: "text", text: "a & b < c" }]);
    expect(w.text()).toBe("a & b < c");
  });

  it("respeta las entidades ya codificadas en el alt", () => {
    const w = render([
      {
        type: "image",
        href: "/foto.png",
        text: "a &amp; b",
        tokens: [{ type: "text", text: "a &amp; b" }],
      },
    ]);
    expect(w.find("img.cu-md-image").attributes("alt")).toBe("a & b");
  });

  it("usa el texto plano como alt, sin marcado", () => {
    const w = render([
      {
        type: "image",
        href: "/foto.png",
        text: "**una foto**",
        tokens: [{ type: "strong", tokens: [{ type: "text", text: "una foto" }] }],
      },
    ]);
    expect(w.find("img.cu-md-image").attributes("alt")).toBe("una foto");
  });

  it("escapa el `<` de un token escape anidado", () => {
    const w = render([
      {
        type: "strong",
        tokens: [
          { type: "escape", text: "<" },
          { type: "text", text: "img src=x onerror=alert(1)>" },
        ],
      },
    ]);
    expect(w.find("img").exists()).toBe(false);
    expect(w.find("strong").text()).toBe("<img src=x onerror=alert(1)>");
  });

  it("escapa las comillas del href de un link anidado", () => {
    const w = render([
      {
        type: "strong",
        tokens: [
          {
            type: "link",
            href: 'a" onmouseover="alert(1)',
            tokens: [{ type: "text", text: "x" }],
          },
        ],
      },
    ]);
    const link = w.find("a");
    expect(link.exists()).toBe(true);
    expect(link.attributes("onmouseover")).toBeUndefined();
  });

  it("un link ejecutable no se renderiza como ancla", () => {
    const w = render([
      { type: "link", href: "javascript:alert(1)", tokens: [{ type: "text", text: "x" }] },
    ]);
    expect(w.find("a").exists()).toBe(false);
    expect(w.findAll("a[href]")).toHaveLength(0);
  });
});
