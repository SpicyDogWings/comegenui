// Comportamiento de Button según su ficha (docs/versiones/<id>/componentes/cu-button.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { defineCustomElement, nextTick } from "vue";
import Button from "./Button.vue";

afterEach(() => {
  document.body.innerHTML = "";
});

function clickTarget(el: Element) {
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

describe("Button — render y defaults", () => {
  it("sin `to` renderiza un <button> ghost/md/neutral y type=button", () => {
    const w = mount(Button);
    expect(w.find("button").exists()).toBe(true);
    expect(w.find("a").exists()).toBe(false);
    expect(w.find("button").classes()).toContain("cu-button--ghost");
    expect(w.find("button").classes()).toContain("cu-button--md");
    expect(w.find("button").attributes("style")).toContain("--btn-solid: var(--cu-color-neutral-solid)");
    expect(w.find("button").attributes("type")).toBe("button");
  });

  it("un color inválido cae a neutral en vez de quedar sin tokens", () => {
    const w = mount(Button, { props: { color: "banana" as never, variant: "solid" } });
    expect(w.find("button").attributes("style")).toContain("--btn-solid: var(--cu-color-neutral-solid)");
  });

  it("un type inválido cae a button (el valor inválido de HTML es submit)", () => {
    const w = mount(Button, { props: { type: "foo" as never } });
    expect(w.find("button").attributes("type")).toBe("button");
  });

  it("iconOnly aplica el padding cuadrado sin cambiar el modo botón", () => {
    const w = mount(Button, { props: { iconOnly: true } });
    expect(w.find("button").classes()).toContain("cu-button--icon-only");
  });

  it("solid/none usan la variante -solid de fondo y el texto del tema", () => {
    const solid = mount(Button, { props: { color: "primary", variant: "solid" } });
    const style = solid.find("button").attributes("style") ?? "";
    expect(style).toContain("--btn-solid: var(--cu-color-primary-solid)");
    expect(style).toContain("--btn-solid-hover: var(--cu-color-primary-solid-hover)");
    expect(style).toContain("--btn-solid-active: var(--cu-color-primary-solid-active)");
    expect(style).toContain("--btn-solid-text: var(--cu-color-surface)");
    expect(style).not.toContain("--btn-on");

    const ghost = mount(Button, { props: { color: "warning", variant: "ghost" } });
    expect(ghost.find("button").attributes("style")).toContain("--btn-text: var(--cu-color-warning-text)");

    const outlined = mount(Button, { props: { color: "warning", variant: "outlined" } });
    expect(outlined.find("button").attributes("style")).toContain("--btn-border: var(--cu-color-warning-border)");
  });
});

describe("Button — modo link", () => {
  it("con `to` renderiza un único <a> con href (sin <button> anidado)", () => {
    const w = mount(Button, { props: { to: "/destino" } });
    const a = w.find("a");
    expect(a.attributes("href")).toBe("/destino");
    expect(a.find("button").exists()).toBe(false);
    expect(w.find("button").exists()).toBe(false);
  });

  it("el <a> conserva las clases y estilos de variante/tamaño (un solo nodo interactivo)", () => {
    const w = mount(Button, {
      props: { to: "/destino", color: "primary", variant: "solid", size: "lg" },
    });
    const a = w.find("a");
    expect(a.classes()).toContain("cu-button");
    expect(a.classes()).toContain("cu-button--solid");
    expect(a.classes()).toContain("cu-button--lg");
    expect(a.classes()).toContain("cu-button-link");
    expect(a.attributes("style")).toContain("--btn-solid: var(--cu-color-primary-solid)");
    expect(a.attributes("style")).toContain("--btn-solid-text: var(--cu-color-surface)");
  });

  it("iconOnly también aplica en modo link", () => {
    const w = mount(Button, { props: { to: "/destino", iconOnly: true } });
    expect(w.find("a").classes()).toContain("cu-button--icon-only");
  });

  it("loading en modo link marca aria-busy y muestra el spinner oculto", () => {
    const w = mount(Button, { props: { to: "/destino", loading: true } });
    const a = w.find("a");
    expect(a.attributes("aria-busy")).toBe("true");
    expect(a.find(".cu-button-spinner").attributes("aria-hidden")).toBe("true");
  });

  it("`_blank` agrega rel noopener noreferrer", () => {
    const w = mount(Button, { props: { to: "https://example.com", target: "_blank" } });
    expect(w.find("a").attributes("rel")).toBe("noopener noreferrer");
  });

  it("no agrega rel para el target por defecto", () => {
    const w = mount(Button, { props: { to: "/destino" } });
    expect(w.find("a").attributes("rel")).toBeUndefined();
  });

  it("un `to` con esquema ejecutable se renderiza como botón, no como link", () => {
    for (const to of ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "java\tscript:alert(1)", "data:text/html,<script>alert(1)</script>", "vbscript:msgbox(1)"]) {
      const w = mount(Button, { props: { to } });
      expect(w.find("a").exists(), to).toBe(false);
      expect(w.find("button").exists(), to).toBe(true);
    }
  });

  it("los destinos normales siguen siendo links", () => {
    for (const to of ["/x", "#ancla", "https://example.com/a?b=1", "mailto:hola@example.com"]) {
      const w = mount(Button, { props: { to } });
      expect(w.find("a").attributes("href"), to).toBe(to);
    }
  });
});

describe("Button — disabled y loading", () => {
  it("`disabled` deshabilita el <button>", () => {
    const w = mount(Button, { props: { disabled: true } });
    expect(w.find("button").attributes("disabled")).toBeDefined();
  });

  it("un link disabled no navega: sin href, aria-disabled, fuera del tab order", () => {
    const w = mount(Button, { props: { to: "/destino", disabled: true } });
    const a = w.find("a");
    expect(a.attributes("href")).toBeUndefined();
    expect(a.attributes("aria-disabled")).toBe("true");
    expect(a.attributes("tabindex")).toBe("-1");
    expect(a.classes()).toContain("cu-button--disabled");
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    a.element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("el click de un link disabled no llega a listeners externos", () => {
    const w = mount(Button, { props: { to: "/destino", disabled: true }, attachTo: document.body });
    const listener = vi.fn();
    document.addEventListener("click", listener);
    clickTarget(w.find("a").element);
    document.removeEventListener("click", listener);
    expect(listener).not.toHaveBeenCalled();
  });

  it("un link habilitado es un único tab stop (el <a>)", () => {
    const w = mount(Button, { props: { to: "/destino" } });
    const a = w.find("a");
    expect(a.attributes("tabindex")).toBeUndefined();
    expect(a.element.tabIndex).toBe(0);
    expect(a.element.tagName).toBe("A");
    expect(a.element.querySelectorAll("a, button").length).toBe(0);
  });

  it("un link loading se comporta como disabled", () => {
    const w = mount(Button, { props: { to: "/destino", loading: true } });
    const a = w.find("a");
    expect(a.attributes("href")).toBeUndefined();
    expect(a.attributes("aria-disabled")).toBe("true");
    expect(a.attributes("tabindex")).toBe("-1");
  });

  it("loading muestra spinner aria-hidden y marca aria-busy", () => {
    const w = mount(Button, { props: { loading: true } });
    expect(w.find("button").attributes("aria-busy")).toBe("true");
    const spinner = w.find(".cu-button-spinner");
    expect(spinner.exists()).toBe(true);
    expect(spinner.attributes("aria-hidden")).toBe("true");
  });

  it("un botón disabled no dispara click nativo", () => {
    const w = mount(Button, { props: { disabled: true }, attachTo: document.body });
    const listener = vi.fn();
    w.find("button").element.addEventListener("click", listener);
    (w.find("button").element as HTMLButtonElement).click();
    expect(listener).not.toHaveBeenCalled();
  });
});

// El custom element vive en shadow DOM: el <button> de adentro no es
// form-associated y su default no envía/resetea el <form> del host.
describe("Button — formulario en custom element", () => {
  const TAG = "cue-button-test";
  beforeAll(() => {
    if (!customElements.get(TAG)) customElements.define(TAG, defineCustomElement(Button as never));
  });

  function setup(type: string) {
    const form = document.createElement("form");
    form.requestSubmit = vi.fn();
    form.submit = vi.fn();
    form.reset = vi.fn();
    document.body.appendChild(form);
    const host = document.createElement(TAG) as HTMLElement;
    host.setAttribute("type", type);
    host.textContent = type;
    form.appendChild(host);
    return { form, host, btn: host.shadowRoot!.querySelector("button")! };
  }

  it("type=submit envía el form del host", async () => {
    const { form, btn } = setup("submit");
    await nextTick();
    btn.click();
    expect(form.requestSubmit).toHaveBeenCalledTimes(1);
  });

  it("type=reset resetea el form del host", async () => {
    const { form, btn } = setup("reset");
    await nextTick();
    btn.click();
    expect(form.reset).toHaveBeenCalledTimes(1);
    expect(form.requestSubmit).not.toHaveBeenCalled();
  });

  it("respeta formnovalidate del host", async () => {
    const { form, host, btn } = setup("submit");
    host.setAttribute("formnovalidate", "");
    await nextTick();
    let noValidateDuringSubmit: boolean | undefined;
    (form.requestSubmit as ReturnType<typeof vi.fn>).mockImplementation(() => {
      noValidateDuringSubmit = form.noValidate;
    });
    btn.click();
    expect(noValidateDuringSubmit).toBe(true);
    expect(form.noValidate).toBe(false);
  });

  it("usa el form apuntado por el atributo form cuando el host está afuera", async () => {
    const form = document.createElement("form");
    form.id = "form-externo";
    form.requestSubmit = vi.fn();
    document.body.appendChild(form);
    const host = document.createElement(TAG) as HTMLElement;
    host.setAttribute("type", "submit");
    host.setAttribute("form", "form-externo");
    document.body.appendChild(host);
    await nextTick();
    host.shadowRoot!.querySelector("button")!.click();
    expect(form.requestSubmit).toHaveBeenCalledTimes(1);
  });

  it("en Vue (light DOM) no duplica el submit nativo", () => {
    const form = document.createElement("form");
    form.requestSubmit = vi.fn();
    document.body.appendChild(form);
    const w = mount(Button, { props: { type: "submit" }, attachTo: form });
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true });
    w.find("button").element.dispatchEvent(ev);
    expect(form.requestSubmit).not.toHaveBeenCalled();
    expect(ev.defaultPrevented).toBe(false);
  });
});

describe("Button — loading-change", () => {
  it("emite el estado nuevo al prender y apagar loading", async () => {
    const w = mount(Button, { props: { loading: false } });
    await w.setProps({ loading: true });
    await w.setProps({ loading: false });
    expect(w.emitted("loading-change")).toEqual([[true], [false]]);
  });
});
