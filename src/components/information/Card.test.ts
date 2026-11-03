// Comportamiento de Card según su ficha (docs/componentes/vue/card.md).
//
// La ficha describe una tarjeta de presentación (media, header, contenido y
// footer) que no emite eventos ni expone métodos. Las aserciones se escriben a
// mano desde esa prosa, no se derivan del código.
import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import Card from "./Card.vue";
import CardCe from "../customElements/information/Card.ce.vue";
import { defineComegenElement } from "@/utils/comegen-element";

const CE_TAG = "cu-card-audit";
customElements.get(CE_TAG) ?? defineComegenElement(CE_TAG, CardCe);

const root = (w: ReturnType<typeof mount>) => w.find(".cu-card");

describe("Card — variantes y color", () => {
  it("default es variant=ghost y layout=vertical", () => {
    const w = mount(Card);
    expect(root(w).classes()).toContain("cu-card--ghost");
    expect(root(w).classes()).toContain("cu-card--vertical");
  });

  it("aplica la clase de variante elegida", () => {
    const w = mount(Card, { props: { variant: "outlined" } });
    expect(root(w).classes()).toContain("cu-card--outlined");
  });

  it("expone el color semántico en las CSS custom properties", () => {
    const w = mount(Card, { props: { color: "success" } });
    const style = root(w).attributes("style") ?? "";
    expect(style).toContain("--card-solid: var(--cu-color-success-solid)");
  });
});

describe("Card — header, contenido y media", () => {
  it("renderiza title y subtitle en el header", () => {
    const w = mount(Card, { props: { title: "Resumen", subtitle: "Último corte" } });
    expect(w.find(".cu-card-title").text()).toBe("Resumen");
    expect(w.find(".cu-card-subtitle").text()).toBe("Último corte");
  });

  it("sin title/subtitle ni header mantiene el header oculto", () => {
    const w = mount(Card);
    expect(w.find(".cu-card-header").exists()).toBe(true);
    expect(w.find(".cu-card-header").isVisible()).toBe(false);
  });

  it("la prop image arma la media con un <img>", () => {
    const w = mount(Card, { props: { image: "https://example.com/cover.jpg" } });
    const img = w.find(".cu-card-image");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("https://example.com/cover.jpg");
  });

  it("sin image ni slot media mantiene el contenedor de media oculto", () => {
    const w = mount(Card);
    expect(w.find(".cu-card-media").exists()).toBe(true);
    expect(w.find(".cu-card-media").isVisible()).toBe(false);
  });

  it("muestra la media cuando hay slot media y en layout horizontal", async () => {
    const w = mount(Card, {
      props: { layout: "horizontal" },
      slots: { media: '<span class="mi-media">banner</span>' },
    });
    await nextTick();
    expect(w.find(".cu-card-media").isVisible()).toBe(true);
    expect(w.find(".mi-media").exists()).toBe(true);
  });

  it("renderiza el slot default como contenido", () => {
    const w = mount(Card, { slots: { default: "Contenido principal" } });
    expect(w.find(".cu-card-content").text()).toContain("Contenido principal");
  });

  it("el slot header tiene prioridad sobre title/subtitle", async () => {
    const w = mount(Card, {
      props: { title: "Resumen", subtitle: "Último corte" },
      slots: { header: '<span class="mi-header">A medida</span>' },
    });
    await nextTick();
    expect(w.find(".mi-header").exists()).toBe(true);
    expect(w.find(".cu-card-title").exists()).toBe(false);
    expect(w.find(".cu-card-subtitle").exists()).toBe(false);
  });
});

describe("Card — footer y layout", () => {
  it("renderiza el slot footer", async () => {
    const w = mount(Card, { slots: { footer: '<span class="mi-footer">Ver más</span>' } });
    await nextTick();
    expect(w.find(".cu-card-footer").exists()).toBe(true);
    expect(w.find(".cu-card-footer").isVisible()).toBe(true);
    expect(w.find(".mi-footer").text()).toBe("Ver más");
  });

  it("sin slot footer mantiene el footer oculto", () => {
    const w = mount(Card);
    expect(w.find(".cu-card-footer").exists()).toBe(true);
    expect(w.find(".cu-card-footer").isVisible()).toBe(false);
  });

  it("layout=horizontal cambia la clase del contenedor", () => {
    const w = mount(Card, { props: { layout: "horizontal" } });
    expect(root(w).classes()).toContain("cu-card--horizontal");
  });

  it("el slot media tiene prioridad sobre la prop image", async () => {
    const w = mount(Card, {
      props: { image: "https://example.com/cover.jpg" },
      slots: { media: '<span class="mi-media">banner</span>' },
    });
    await nextTick();
    expect(w.find(".mi-media").exists()).toBe(true);
    expect(w.find(".cu-card-image").exists()).toBe(false);
  });
});

describe("Card — color inválido", () => {
  it("un color fuera del set cae al color seguro (la variante solid no queda invisible)", () => {
    const w = mount(Card, { props: { color: "sucess" as never, variant: "solid" } });
    const style = root(w).attributes("style") ?? "";
    expect(style).toContain("--card-solid: var(--cu-color-neutral-solid)");
    expect(style).not.toContain("sucess");
  });
});

describe("Card — subtítulo atenuado", () => {
  it("usa el token atenuado con contraste garantizado, no `opacity`", () => {
    const w = mount(Card, { props: { subtitle: "Último corte" } });
    expect(root(w).attributes("style") ?? "").toContain(
      "--card-text-muted: var(--cu-color-neutral-text-muted)",
    );

    const colored = mount(Card, { props: { subtitle: "Último corte", color: "primary", variant: "soft" } });
    expect(root(colored).attributes("style") ?? "").toContain(
      "--card-text-muted: var(--cu-color-primary-text-muted)",
    );
  });
});

describe("Card — custom element", () => {
  it("los slots media/header/footer del light DOM se proyectan y muestran", async () => {
    const el = document.createElement(CE_TAG);
    el.setAttribute("title", "Título");
    el.innerHTML = `
      <span slot="media" class="media-ce">media</span>
      <span slot="header" class="header-ce">header</span>
      <span slot="footer" class="footer-ce">footer</span>
      cuerpo
    `;
    document.body.appendChild(el);
    await flushPromises();

    expect((el.shadowRoot!.querySelector(".cu-card-media") as HTMLElement).style.display).not.toBe("none");
    expect((el.shadowRoot!.querySelector(".cu-card-footer") as HTMLElement).style.display).not.toBe("none");
    expect(el.shadowRoot!.querySelector(".cu-card-title")).toBeNull();
    const headerSlot = el.shadowRoot!.querySelector(".cu-card-header slot") as HTMLSlotElement;
    expect(headerSlot.assignedNodes().some((node) => (node as Element).classList?.contains("header-ce"))).toBe(true);
    el.remove();
  });
});

describe("Card — click del custom element", () => {
  it("un click en el contenido llega al host una sola vez (evento nativo)", async () => {
    const el = document.createElement(CE_TAG);
    el.innerHTML = "<p class='contenido'>hola</p>";
    document.body.appendChild(el);
    await flushPromises();

    const seen: Event[] = [];
    el.addEventListener("click", (event) => seen.push(event));
    (el.shadowRoot!.querySelector("article") as HTMLElement).click();

    expect(seen).toHaveLength(1);
    expect(seen[0]).toBeInstanceOf(MouseEvent);
    el.remove();
  });
});
