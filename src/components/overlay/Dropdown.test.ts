import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Dropdown from "./Dropdown.vue";

type DropdownVm = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  get: () => string;
  set: (v: string) => void;
  isOpen: () => boolean;
};

function factory(props: any = {}, slots: any = {}) {
  return mount(Dropdown, { props, slots });
}

function vmOf(w: ReturnType<typeof factory>) {
  return w.vm as unknown as DropdownVm;
}

describe("Dropdown — motor genérico toggle + panel", () => {
  it("render smoke: botón toggle por defecto y panel cerrado", () => {
    const w = factory();
    expect(w.find(".cu-dropdown").exists()).toBe(true);
    const btn = w.find("button");
    expect(btn.exists()).toBe(true);
    expect(btn.text()).toContain("Dropdown");
    expect(w.find(".cu-dropdown-panel").exists()).toBe(false);
    expect(w.find('[role="menu"]').exists()).toBe(false);
    expect(vmOf(w).isOpen()).toBe(false);
  });

  it("click en el toggle abre el panel y emite open", async () => {
    const w = factory();
    await w.find("button").trigger("click");
    expect(w.find(".cu-dropdown-panel").exists()).toBe(true);
    expect(w.find('[role="menu"]').exists()).toBe(true);
    expect(vmOf(w).isOpen()).toBe(true);
    expect(w.emitted("open")).toBeTruthy();
    w.unmount();
  });

  it("segundo click cierra el panel y emite close", async () => {
    const w = factory();
    await w.find("button").trigger("click");
    await w.find("button").trigger("click");
    expect(w.find(".cu-dropdown-panel").exists()).toBe(false);
    expect(vmOf(w).isOpen()).toBe(false);
    expect(w.emitted("close")).toBeTruthy();
    w.unmount();
  });

  it("Escape cierra el panel abierto y emite close", async () => {
    const w = factory();
    await w.find("button").trigger("click");
    expect(vmOf(w).isOpen()).toBe(true);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(vmOf(w).isOpen()).toBe(false);
    await nextTick();
    expect(w.find(".cu-dropdown-panel").exists()).toBe(false);
    expect(w.emitted("close")).toBeTruthy();
    w.unmount();
  });

  it("click-outside + toggle() externo en el MISMO click: el toggle no reabre", async () => {
    const w = factory();
    await w.find("button").trigger("click");
    expect(vmOf(w).isOpen()).toBe(true);

    const external = document.createElement("button");
    external.addEventListener("click", () => vmOf(w).toggle());
    document.body.appendChild(external);

    external.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await nextTick();

    expect(vmOf(w).isOpen()).toBe(false);
    expect(w.find(".cu-dropdown-panel").exists()).toBe(false);
    external.remove();
    w.unmount();
  });

  it("toggle() externo con panel cerrado SÍ abre (el flag no filtra entre clicks)", async () => {
    const w = factory();
    const external = document.createElement("button");
    external.addEventListener("click", () => vmOf(w).toggle());
    document.body.appendChild(external);

    external.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await nextTick();
    expect(vmOf(w).isOpen()).toBe(true);
    expect(w.find(".cu-dropdown-panel").exists()).toBe(true);
    external.remove();
    w.unmount();
  });

  it("click dentro del panel no lo cierra y los items del slot se renderizan", async () => {
    const w = factory({}, { default: `<button class="item">Opción</button>` });
    await w.find("button").trigger("click");
    const item = w.find(".item");
    expect(item.exists()).toBe(true);
    await item.trigger("click");
    expect(vmOf(w).isOpen()).toBe(true);
    w.unmount();
  });

  it("prop label: muestra el texto del label en el toggle", () => {
    const w = factory({ label: "Acciones" });
    expect(w.find("button").text()).toContain("Acciones");
  });

  it("disabled: el click no abre el panel ni emite open", async () => {
    const w = factory({ disabled: true });
    await w.find("button").trigger("click");
    expect(vmOf(w).isOpen()).toBe(false);
    expect(w.find(".cu-dropdown-panel").exists()).toBe(false);
    expect(w.emitted("open")).toBeUndefined();
  });

  it("v-model: get/set sobre selectedValue emite update:modelValue", () => {
    const w = factory({ modelValue: "inicial" });
    expect(vmOf(w).get()).toBe("inicial");
    vmOf(w).set("nuevo");
    const em = w.emitted("update:modelValue");
    expect(em).toBeTruthy();
    expect((em as unknown[][])[0]![0] as string).toBe("nuevo");
  });

  it("slot toggle personalizado recibe la fn toggle y controla el panel", async () => {
    const w = factory({}, { toggle: `<button id="custom" @click="toggle">Custom</button>` });
    await w.find("#custom").trigger("click");
    expect(w.find(".cu-dropdown-panel").exists()).toBe(true);
    w.unmount();
  });

  it("fixed + position top: el panel se ancla por debajo del trigger (bottom) y NO lo tapa", async () => {
    const w = factory({ fixed: true, position: "top", align: "center", panelWidth: "280px" });
    const trigger = w.find(".cu-dropdown");
    trigger.element.getBoundingClientRect = () =>
      ({ left: 400, width: 40, top: 200, height: 20, right: 440, bottom: 220 }) as DOMRect;
    await trigger.find("button").trigger("click");
    const style = w.find(".cu-dropdown-panel").attributes("style") || "";
    // Espeja el modo absolute: bottom: 100% → el borde inferior del panel queda en el top del trigger.
    // vh (jsdom 768) - r.top (200) + offset (4) = 572px. Antes usaba top: 196px y tapaba el trigger.
    expect(style).toContain("bottom: 572px");
    expect(style).not.toContain("top: 196px");
    // Centrado horizontal sin estimar el ancho: centro del trigger (420px) + translateX(-50%)
    expect(style).toContain("left: 420px");
    expect(style).toContain("translateX(-50%)");
    w.unmount();
  });

  it("fixed + position left: el panel se ancla por la derecha (right) y centra vertical", async () => {
    const w = factory({ fixed: true, position: "left", align: "center" });
    const trigger = w.find(".cu-dropdown");
    trigger.element.getBoundingClientRect = () =>
      ({ left: 400, width: 40, top: 200, height: 20, right: 440, bottom: 220 }) as DOMRect;
    await trigger.find("button").trigger("click");
    const style = w.find(".cu-dropdown-panel").attributes("style") || "";
    // vw (jsdom 1024) - r.left (400) + offset (4) = 628px → el panel queda a la izquierda del trigger
    expect(style).toContain("right: 628px");
    expect(style).not.toContain("left: 396px");
    // Centro vertical: centro del trigger (210px) + translateY(-50%)
    expect(style).toContain("top: 210px");
    expect(style).toContain("translateY(-50%)");
    w.unmount();
  });

  it("fixed + position bottom align start: panel debajo del trigger, alineado a la izquierda", async () => {
    const w = factory({ fixed: true, position: "bottom", align: "start" });
    const trigger = w.find(".cu-dropdown");
    trigger.element.getBoundingClientRect = () =>
      ({ left: 400, width: 40, top: 200, height: 20, right: 440, bottom: 220 }) as DOMRect;
    await trigger.find("button").trigger("click");
    const style = w.find(".cu-dropdown-panel").attributes("style") || "";
    expect(style).toContain("top: 224px"); // r.bottom (220) + offset (4)
    expect(style).toContain("left: 400px");
    w.unmount();
  });

  it("fixed: al scrollear re-posiciona el panel (sigue al trigger)", async () => {
    const w = factory({ fixed: true, position: "bottom", align: "start" });
    const trigger = w.find(".cu-dropdown");
    let rect = { left: 400, width: 40, top: 200, height: 20, right: 440, bottom: 220 } as DOMRect;
    trigger.element.getBoundingClientRect = () => rect;
    await trigger.find("button").trigger("click");
    expect(w.find(".cu-dropdown-panel").attributes("style") || "").toContain("top: 224px");

    // Simula scroll (página o contenedor interno): el trigger se mueve 50px hacia arriba
    rect = { left: 400, width: 40, top: 150, height: 20, right: 440, bottom: 170 } as DOMRect;
    document.dispatchEvent(new Event("scroll"));
    await nextTick();
    const style = w.find(".cu-dropdown-panel").attributes("style") || "";
    expect(style).toContain("top: 174px"); // r.bottom (170) + offset (4) → siguió al trigger
    w.unmount();
  });

  it("hover: abrir un dropdown hermano cierra el anterior AL INSTANTE (sin esperar el delay)", async () => {
    const w = mount({
      components: { Dropdown },
      template: `
        <div>
          <Dropdown trigger="hover" label="A" />
          <Dropdown trigger="hover" label="B" />
        </div>
      `,
    });
    const roots = w.findAll(".cu-dropdown");
    const a = roots[0];
    const b = roots[1];

    await a.trigger("mouseenter");
    await nextTick();
    expect(a.find(".cu-dropdown-panel").exists()).toBe(true);
    expect(b.find(".cu-dropdown-panel").exists()).toBe(false);

    await b.trigger("mouseenter");
    await nextTick();
    // B se abrió y A se cerró en el mismo flush: no deben convivir dos paneles
    expect(b.find(".cu-dropdown-panel").exists()).toBe(true);
    expect(a.find(".cu-dropdown-panel").exists()).toBe(false);
    expect(w.findAll(".cu-dropdown-panel").length).toBe(1);
    w.unmount();
  });

  it("hover: abrir un dropdown ANIDADO (descendiente) NO cierra al ancestro", async () => {
    const w = mount({
      components: { Dropdown },
      template: `
        <Dropdown trigger="hover" label="Padre">
          <Dropdown trigger="hover" label="Hijo" />
        </Dropdown>
      `,
    });
    const parent = w.find(".cu-dropdown");
    await parent.trigger("mouseenter");
    await nextTick();
    expect(parent.find(".cu-dropdown-panel").exists()).toBe(true);

    const child = w.find(".cu-dropdown .cu-dropdown");
    expect(child.exists()).toBe(true);
    await child.trigger("mouseenter");
    await nextTick();
    // El ancestro se preserva: padre y hijo abiertos, dos paneles
    expect(child.find(".cu-dropdown-panel").exists()).toBe(true);
    expect(parent.find(".cu-dropdown-panel").exists()).toBe(true);
    expect(w.findAll(".cu-dropdown-panel").length).toBe(2);
    w.unmount();
  });
});
