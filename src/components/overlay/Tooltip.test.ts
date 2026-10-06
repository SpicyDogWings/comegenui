// Comportamiento de Tooltip según su ficha (docs/componentes/vue/tooltip.md).
//
// Aparece al hacer hover sobre el elemento contenido, con posición, alineación,
// offset y delay configurables. `text` es el contenido simple; el slot #content
// tiene prioridad. Aserciones escritas a mano desde la prosa de la ficha.
import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Tooltip from "./Tooltip.vue";

const root = (w: ReturnType<typeof mount>) => w.find(".cu-popover");
const panel = (w: ReturnType<typeof mount>) => w.find(".cu-popover-panel");

describe("Tooltip — visibilidad por hover", () => {
  it("arranca cerrado (no hay panel)", () => {
    const w = mount(Tooltip, { props: { text: "Guardar cambios" } });
    expect(panel(w).exists()).toBe(false);
  });

  it("mouseenter abre el tooltip (con delay=0)", async () => {
    const w = mount(Tooltip, { props: { text: "Guardar", delay: 0 } });
    await root(w).trigger("mouseenter");
    await flushPromises();
    expect(panel(w).exists()).toBe(true);
  });

  it("mouseleave cierra el tooltip", async () => {
    const w = mount(Tooltip, { props: { text: "Guardar", delay: 0 } });
    await root(w).trigger("mouseenter");
    await flushPromises();
    await root(w).trigger("mouseleave");
    await new Promise((r) => setTimeout(r, 150));
    await flushPromises();
    expect(panel(w).exists()).toBe(false);
  });

  it("disabled impide abrir el tooltip al hacer hover", async () => {
    const w = mount(Tooltip, { props: { text: "Guardar", delay: 0, disabled: true } });
    await root(w).trigger("mouseenter");
    await flushPromises();
    expect(panel(w).exists()).toBe(false);
  });
});

describe("Tooltip — contenido", () => {
  it("usa la prop text cuando no hay slot content", async () => {
    const w = mount(Tooltip, { props: { text: "Texto simple", delay: 0 } });
    await root(w).trigger("mouseenter");
    await flushPromises();
    expect(panel(w).text()).toContain("Texto simple");
  });

  it("el slot #content tiene prioridad sobre text", async () => {
    const w = mount(Tooltip, {
      props: { text: "Texto simple", delay: 0 },
      slots: { content: "<strong>Más contexto</strong>" },
    });
    await root(w).trigger("mouseenter");
    await flushPromises();
    expect(panel(w).find("strong").text()).toBe("Más contexto");
  });

  it("renderiza el slot default como trigger", () => {
    const w = mount(Tooltip, { props: { text: "t" }, slots: { default: '<span class="trigger">Guardar</span>' } });
    expect(w.find(".trigger").text()).toBe("Guardar");
  });
});

describe("Tooltip — apariencia", () => {
  it("expone el color semántico en el estilo", () => {
    const w = mount(Tooltip, { props: { text: "t", color: "primary" } });
    expect(w.attributes("style") ?? "").toContain("--cu-popover-bg: var(--cu-color-primary)");
  });

  it("usa role=tooltip en el panel", async () => {
    const w = mount(Tooltip, { props: { text: "t", delay: 0 } });
    await root(w).trigger("mouseenter");
    await flushPromises();
    expect(panel(w).attributes("role")).toBe("tooltip");
  });
});
