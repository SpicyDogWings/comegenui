// Comportamiento de Alert según su ficha (docs/componentes/vue/alert.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Alert from "./Alert.vue";
import AlertCe from "../customElements/information/Alert.ce.vue";
import { defineComegenElement } from "@/utils/comegen-element";

const CE_TAG = "cu-alert-audit";
customElements.get(CE_TAG) ?? defineComegenElement(CE_TAG, AlertCe);

type AlertVm = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as AlertVm;
const root = (w: ReturnType<typeof mount>) => w.find(".cu-alert");

describe("Alert — visibilidad (show / programática)", () => {
  it("arranca visible por default (show = true)", () => {
    const w = mount(Alert);
    expect(vm(w).isOpen()).toBe(true);
    expect(root(w).attributes("style") ?? "").not.toContain("display: none");
  });

  it("`show: false` la oculta", async () => {
    const w = mount(Alert, { props: { show: false } });
    await flushPromises();
    expect(root(w).attributes("style")).toContain("display: none");
  });

  it("`close()` la oculta y emite `close`", async () => {
    const w = mount(Alert);
    vm(w).close();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(root(w).attributes("style")).toContain("display: none");
    expect(w.emitted("close")).toHaveLength(1);
  });

  it("`open()` la vuelve a mostrar y emite `open`", async () => {
    const w = mount(Alert, { props: { show: false } });
    await flushPromises();
    vm(w).open();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
    expect(w.emitted("open")).toHaveLength(1);
  });

  it("`toggle()` alterna y emite open/close", async () => {
    const w = mount(Alert);
    vm(w).toggle();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("close")).toHaveLength(1);

    vm(w).toggle();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
    expect(w.emitted("open")).toHaveLength(1);
  });

  it("emitir `update:show` cuando cambia el estado interno", async () => {
    const w = mount(Alert);
    vm(w).close();
    await flushPromises();
    expect(w.emitted("update:show")?.at(-1)).toEqual([false]);
  });
});

describe("Alert — botón de cerrar", () => {
  it("el botón solo aparece con `close`", () => {
    expect(mount(Alert).find(".cu-alert-close").exists()).toBe(false);
    expect(mount(Alert, { props: { close: true } }).find(".cu-alert-close").exists()).toBe(true);
  });

  it("click en el botón oculta la alerta", async () => {
    const w = mount(Alert, { props: { close: true } });
    await w.find(".cu-alert-close").trigger("click");
    await flushPromises();

    expect(vm(w).isOpen()).toBe(false);
    expect(root(w).attributes("style")).toContain("display: none");
  });

  it("sin título ni ícono, el close acompaña al cuerpo (sin cabecera propia)", () => {
    const w = mount(Alert, { props: { close: true }, slots: { default: "Contenido" } });
    expect(w.find(".cu-alert-header").isVisible()).toBe(false);
    const btn = w.find(".cu-alert-close");
    expect(btn.exists()).toBe(true);
    expect(btn.classes()).toContain("cu-alert-close--floating");
  });

  it("con título, el close queda en la cabecera (no flota)", () => {
    const w = mount(Alert, { props: { close: true, title: "Atención" } });
    expect(w.find(".cu-alert-header .cu-alert-close").exists()).toBe(true);
    expect(w.find(".cu-alert-close--floating").exists()).toBe(false);
  });
});

describe("Alert — contenido", () => {
  it("renderiza el título y el contenido del slot default", () => {
    const w = mount(Alert, { props: { title: "Atención" }, slots: { default: "Cuidado" } });
    expect(w.find(".cu-alert-title-text").text()).toBe("Atención");
    expect(w.find(".cu-alert-content").text()).toContain("Cuidado");
  });

  it("aplica la clase de variante al contenedor", () => {
    const w = mount(Alert, { props: { variant: "solid" } });
    expect(root(w).classes()).toContain("cu-alert--solid");
  });

  it("solid usa -solid de fondo con el texto del tema; los tintes usan -text", () => {
    const solid = mount(Alert, { props: { color: "warning", variant: "solid" } });
    const style = root(solid).attributes("style") ?? "";
    expect(style).toContain("--alert-solid: var(--cu-color-warning-solid)");
    expect(style).toContain("--alert-solid-text: var(--cu-color-surface)");
    expect(style).not.toContain("--alert-on");

    const soft = mount(Alert, { props: { color: "warning", variant: "soft" } });
    expect(root(soft).attributes("style")).toContain("--alert-text: var(--cu-color-warning-text)");

    const outlined = mount(Alert, { props: { color: "warning", variant: "outlined" } });
    expect(root(outlined).attributes("style")).toContain("--alert-border: var(--cu-color-warning-border)");
  });
});

describe("Alert — ícono", () => {
  it("renderiza el ícono del slot una sola vez, dentro de la cabecera", () => {
    const w = mount(Alert, {
      props: { title: "Aviso" },
      slots: { icon: '<svg class="mi-icono"></svg>' },
    });
    expect(w.findAll(".mi-icono")).toHaveLength(1);
    expect(w.find(".cu-alert-header .mi-icono").exists()).toBe(true);
  });

  it("en el custom element el ícono se asigna al slot visible de la cabecera", async () => {
    const el = document.createElement(CE_TAG);
    el.setAttribute("title", "Con ícono");
    el.innerHTML = '<span slot="icon" class="mi-icono-ce"><svg></svg></span>cuerpo';
    document.body.appendChild(el);
    await flushPromises();

    const header = el.shadowRoot!.querySelector(".cu-alert-header") as HTMLElement;
    const slots = el.shadowRoot!.querySelectorAll('slot[name="icon"]');
    expect(slots).toHaveLength(1);
    expect(header.contains(slots[0]!)).toBe(true);
    expect((slots[0] as HTMLSlotElement).assignedNodes()).toHaveLength(1);
    expect(el.querySelector(".mi-icono-ce")).toBe((slots[0] as HTMLSlotElement).assignedNodes()[0]);
    expect(header.style.display).not.toBe("none");
    el.remove();
  });

  it("un ícono sin título arma la cabecera aunque el HTML llegue después del mount", async () => {
    const el = document.createElement(CE_TAG);
    document.body.appendChild(el);
    await flushPromises();
    const header = () => el.shadowRoot!.querySelector(".cu-alert-header") as HTMLElement;
    expect(header().style.display).toBe("none");

    el.innerHTML = '<span slot="icon" class="mi-icono-ce"><svg></svg></span>solo ícono';
    await flushPromises();

    expect(header().style.display).not.toBe("none");
    el.remove();
  });
});

describe("Alert — color y formularios", () => {
  it("un color inválido cae al color seguro (la variante solid no queda invisible)", () => {
    const w = mount(Alert, { props: { color: "sucess" as never, variant: "solid" } });
    const style = root(w).attributes("style") ?? "";
    expect(style).toContain("--alert-solid: var(--cu-color-neutral-solid)");
    expect(style).not.toContain("sucess");
  });

  it("el botón de cerrar no envía el formulario que lo contiene", async () => {
    const form = document.createElement("form");
    document.body.appendChild(form);
    let submits = 0;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submits++;
    });

    for (const title of [undefined, "Aviso"]) {
      const w = mount(Alert, { props: { close: true, title }, attachTo: form });
      await flushPromises();
      await w.find(".cu-alert-close").trigger("click");
      expect(submits, `con title=${title}`).toBe(0);
      w.unmount();
    }
    form.remove();
  });

  it("dos instancias manejan su visibilidad de forma independiente", async () => {
    const a = mount(Alert, { props: { close: true } });
    const b = mount(Alert, { props: { close: true } });
    await a.find(".cu-alert-close").trigger("click");
    expect(vm(a).isOpen()).toBe(false);
    expect(vm(b).isOpen()).toBe(true);
  });
});

describe("Alert — rol ARIA según urgencia", () => {
  it("warning/danger usan role=alert (assertive); el resto role=status (polite)", () => {
    for (const color of ["warning", "danger"] as const) {
      const w = mount(Alert, { props: { color } });
      expect(root(w).attributes("role"), color).toBe("alert");
      expect(root(w).attributes("aria-live"), color).toBe("assertive");
    }
    for (const color of ["primary", "secondary", "neutral", "success"] as const) {
      const w = mount(Alert, { props: { color } });
      expect(root(w).attributes("role"), color).toBe("status");
      expect(root(w).attributes("aria-live"), color).toBe("polite");
    }
  });

  it("un color inválido cae a status (neutral)", () => {
    const w = mount(Alert, { props: { color: "sucess" as never } });
    expect(root(w).attributes("role")).toBe("status");
  });

  it("el custom element refleja el rol del color en el árbol interno", async () => {
    const el = document.createElement(CE_TAG);
    el.setAttribute("color", "danger");
    el.textContent = "Peligro";
    document.body.appendChild(el);
    await flushPromises();
    const inner = el.shadowRoot!.querySelector(".cu-alert")!;
    expect(inner.getAttribute("role")).toBe("alert");
    expect(inner.getAttribute("aria-live")).toBe("assertive");
    el.setAttribute("color", "success");
    await flushPromises();
    expect(inner.getAttribute("role")).toBe("status");
    expect(inner.getAttribute("aria-live")).toBe("polite");
    el.remove();
  });
});
