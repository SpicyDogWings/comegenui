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

describe("Tooltip — teclado", () => {
  // La ficha: el tooltip aparece al hacer hover **y al enfocar** el elemento; es
  // puramente visual y nunca mueve el foco. Un tooltip sólo-mouse es inaccesible
  // por teclado (WCAG 2.1.1) y su texto no llega a quien tabula hasta el control.
  it("enfocar el trigger muestra el tooltip sin esperar el delay de hover", async () => {
    const w = mount(Tooltip, {
      props: { text: "Guardar cambios", delay: 1000 },
      slots: { default: '<button class="trigger">Guardar</button>' },
      attachTo: document.body,
    });
    (w.find(".trigger").element as HTMLElement).focus();
    await flushPromises();
    expect(panel(w).exists()).toBe(true);
    expect(panel(w).text()).toContain("Guardar cambios");
    w.unmount();
  });

  it("al salir el foco del trigger el tooltip se oculta", async () => {
    const w = mount(Tooltip, {
      props: { text: "Guardar", delay: 0 },
      slots: { default: '<button class="trigger">Guardar</button>' },
      attachTo: document.body,
    });
    (w.find(".trigger").element as HTMLElement).focus();
    await flushPromises();
    expect(panel(w).exists()).toBe(true);

    const fuera = document.createElement("button");
    document.body.appendChild(fuera);
    fuera.focus();
    await flushPromises();
    expect(panel(w).exists()).toBe(false);
    fuera.remove();
    w.unmount();
  });

  it("con disabled el foco no abre el tooltip", async () => {
    const w = mount(Tooltip, {
      props: { text: "Guardar", delay: 0, disabled: true },
      slots: { default: '<button class="trigger">Guardar</button>' },
      attachTo: document.body,
    });
    (w.find(".trigger").element as HTMLElement).focus();
    await flushPromises();
    expect(panel(w).exists()).toBe(false);
    w.unmount();
  });
});

describe("Tooltip — sin contenido", () => {
  // Sin `text` ni slot `content` no hay nada que mostrar: abrir dejaba un
  // rectángulo del color de fondo, vacío, encima del elemento.
  it("sin text ni slot content no abre nada al hacer hover", async () => {
    const w = mount(Tooltip, { props: { delay: 0 }, slots: { default: '<button>x</button>' } });
    await root(w).trigger("mouseenter");
    await flushPromises();
    expect(panel(w).exists()).toBe(false);
  });

  it("un text en blanco tampoco abre el pill vacío", async () => {
    const w = mount(Tooltip, { props: { text: "   ", delay: 0 } });
    await root(w).trigger("mouseenter");
    await flushPromises();
    expect(panel(w).exists()).toBe(false);
  });

  it("el slot content sin text sí abre y muestra su contenido", async () => {
    const w = mount(Tooltip, {
      props: { delay: 0 },
      slots: { content: "<strong>Rico</strong>" },
    });
    await root(w).trigger("mouseenter");
    await flushPromises();
    expect(panel(w).find("strong").text()).toBe("Rico");
  });
});

describe("Tooltip — descripción accesible", () => {
  // El panel es `role="tooltip"`, pero un `aria-describedby` no cruza el shadow
  // boundary del CE: el trigger vive en la luz del host y el panel en el shadow.
  // Por eso el texto se expone con `aria-description` en el trigger mientras el
  // panel está abierto, y se restaura al cerrar.
  it("describe el trigger con el texto del tooltip y lo limpia al cerrar", async () => {
    const w = mount(Tooltip, {
      props: { text: "Guardar cambios", delay: 0 },
      slots: { default: '<button class="trigger">Guardar</button>' },
    });
    await root(w).trigger("mouseenter");
    await flushPromises();
    expect(w.find(".trigger").attributes("aria-description")).toBe("Guardar cambios");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(w.find(".trigger").attributes("aria-description")).toBeUndefined();
  });

  it("respeta y restaura el aria-description que puso el autor", async () => {
    const w = mount(Tooltip, {
      props: { text: "Guardar cambios", delay: 0 },
      slots: { default: '<button class="trigger" aria-description="propia">Guardar</button>' },
    });
    await root(w).trigger("mouseenter");
    await flushPromises();
    expect(w.find(".trigger").attributes("aria-description")).toBe("Guardar cambios");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(w.find(".trigger").attributes("aria-description")).toBe("propia");
  });

  it("con slot content aplana el texto visible del panel", async () => {
    const w = mount(Tooltip, {
      props: { delay: 0 },
      slots: {
        default: '<button class="trigger">Guardar</button>',
        content: "<strong>Más</strong> contexto",
      },
    });
    await root(w).trigger("mouseenter");
    await flushPromises();
    expect(w.find(".trigger").attributes("aria-description")).toBe("Más contexto");
  });

  it("un slot content sin texto no escribe la descripción", async () => {
    const w = mount(Tooltip, {
      props: { delay: 0 },
      slots: { default: '<button class="trigger">Guardar</button>', content: "<span>   </span>" },
    });
    await root(w).trigger("mouseenter");
    await flushPromises();
    expect(w.find(".trigger").attributes("aria-description")).toBeUndefined();
  });
});

describe("Tooltip — cambios dinámicos", () => {
  // La ficha dice que `disabled` lo apaga: también cuando el panel ya está abierto.
  it("pasar `disabled` con el panel abierto lo cierra", async () => {
    const w = mount(Tooltip, { props: { text: "Guardar", delay: 0 } });
    await root(w).trigger("mouseenter");
    await flushPromises();
    expect(panel(w).exists()).toBe(true);

    await w.setProps({ disabled: true });
    await flushPromises();
    expect(panel(w).exists()).toBe(false);
  });

  it("cambiar el texto con el panel abierto actualiza la descripción", async () => {
    const w = mount(Tooltip, {
      props: { text: "uno", delay: 0 },
      slots: { default: '<button class="trigger">Guardar</button>' },
    });
    await root(w).trigger("mouseenter");
    await flushPromises();
    expect(w.find(".trigger").attributes("aria-description")).toBe("uno");

    await w.setProps({ text: "dos" });
    await flushPromises();
    expect(panel(w).text()).toContain("dos");
    expect(w.find(".trigger").attributes("aria-description")).toBe("dos");
  });
});

describe("Tooltip — apariencia", () => {
  it("expone el color semántico en el estilo", () => {
    const w = mount(Tooltip, { props: { text: "t", color: "primary" } });
    expect(w.attributes("style") ?? "").toContain("--cu-popover-bg: var(--cu-color-primary-solid)");
  });

  it("un color fuera del set cae a neutral en vez de dejar el panel sin fondo", () => {
    const w = mount(Tooltip, { props: { text: "t", color: "magenta" as never } });
    expect(w.attributes("style") ?? "").toContain("--cu-popover-bg: var(--cu-color-neutral-solid)");
  });

  it("usa role=tooltip en el panel", async () => {
    const w = mount(Tooltip, { props: { text: "t", delay: 0 } });
    await root(w).trigger("mouseenter");
    await flushPromises();
    expect(panel(w).attributes("role")).toBe("tooltip");
  });
});

describe("Tooltip — no roba el foco", () => {
  it("cerrar por hover-out no mueve el foco a ningún lado", async () => {
    const w = mount(Tooltip, { props: { text: "Guardar", delay: 0 }, attachTo: document.body });
    await root(w).trigger("mouseenter");
    await flushPromises();
    const fuera = document.createElement("button");
    document.body.appendChild(fuera);
    fuera.focus();
    await root(w).trigger("mouseleave");
    await new Promise((r) => setTimeout(r, 150));
    await flushPromises();
    expect(panel(w).exists()).toBe(false);
    expect(document.activeElement).toBe(fuera);
    w.unmount();
    fuera.remove();
  });
});
