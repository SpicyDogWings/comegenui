// Comportamiento de Loader según su ficha (docs/componentes/vue/loader.md).
//
// Barra de carga: no emite eventos ni expone métodos. `color` pinta la barra,
// `animation` elige loading (barrido infinito) o cooldown (se consume en delay ms).
// Aserciones escritas a mano desde la prosa de la ficha.
import { describe, it, expect } from "vitest";
import { defineCustomElement } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import Loader from "./Loader.vue";
import LoaderCe from "../customElements/information/Loader.ce.vue";

const bar = (w: ReturnType<typeof mount>) => w.find(".cu-loader-bar");

describe("Loader — estructura", () => {
  it("renderiza el contenedor y la barra", () => {
    const w = mount(Loader);
    expect(w.find(".cu-loader").exists()).toBe(true);
    expect(bar(w).exists()).toBe(true);
  });
});

describe("Loader — color", () => {
  it("default color es primary", () => {
    const w = mount(Loader);
    expect(bar(w).attributes("style") ?? "").toContain("--cu-loader-color: var(--cu-color-primary)");
  });

  it("aplica el color semántico elegido", () => {
    const w = mount(Loader, { props: { color: "danger" } });
    expect(bar(w).attributes("style") ?? "").toContain("var(--cu-color-danger)");
  });
});

describe("Loader — animación y delay", () => {
  it("default es animation=loading", () => {
    const w = mount(Loader);
    expect(bar(w).classes()).toContain("cu-loader-bar--loading");
  });

  it("animation=cooldown cambia la clase de la barra", () => {
    const w = mount(Loader, { props: { animation: "cooldown" } });
    expect(bar(w).classes()).toContain("cu-loader-bar--cooldown");
    expect(bar(w).classes()).not.toContain("cu-loader-bar--loading");
  });

  it("default delay es 2000ms", () => {
    const w = mount(Loader);
    expect(bar(w).attributes("style") ?? "").toContain("--cu-loader-delay: 2000ms");
  });

  it("propaga delay en ms a la CSS var", () => {
    const w = mount(Loader, { props: { delay: 500 } });
    expect(bar(w).attributes("style") ?? "").toContain("--cu-loader-delay: 500ms");
  });
});

describe("Loader — custom element", () => {
  const CuLoaderTest = defineCustomElement(LoaderCe);
  if (!customElements.get("cu-loader-test")) {
    customElements.define("cu-loader-test", CuLoaderTest);
  }

  async function mountCe(html: string) {
    document.body.innerHTML = html;
    const host = document.body.firstElementChild as HTMLElement;
    await flushPromises();
    const inner = [...(host.shadowRoot?.children ?? [])].find(
      (node) => node.tagName !== "STYLE",
    ) as HTMLElement;
    return { host, inner };
  }

  it("usa los defaults del componente cuando no hay atributos", async () => {
    const { inner } = await mountCe("<cu-loader-test></cu-loader-test>");
    const barEl = inner.querySelector(".cu-loader-bar") as HTMLElement;
    expect(barEl.classList.contains("cu-loader-bar--loading")).toBe(true);
    expect(barEl.style.getPropertyValue("--cu-loader-color")).toBe("var(--cu-color-primary)");
    expect(barEl.style.getPropertyValue("--cu-loader-delay")).toBe("2000ms");
  });

  it("mapea color, animation y delay del host a la API del componente", async () => {
    const { inner } = await mountCe(
      '<cu-loader-test color="danger" animation="cooldown" delay="750"></cu-loader-test>',
    );
    const barEl = inner.querySelector(".cu-loader-bar") as HTMLElement;
    expect(barEl.classList.contains("cu-loader-bar--cooldown")).toBe(true);
    expect(barEl.classList.contains("cu-loader-bar--loading")).toBe(false);
    expect(barEl.style.getPropertyValue("--cu-loader-color")).toBe("var(--cu-color-danger)");
    expect(barEl.style.getPropertyValue("--cu-loader-delay")).toBe("750ms");
  });
});
