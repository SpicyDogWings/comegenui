// Comportamiento de Tabs según su ficha (docs/componentes/vue/tabs.md).
//
// Aserciones escritas a MANO desde la prosa de la ficha (variantes, iconos,
// tabs deshabilitadas individuales y control programático).
import { afterEach, describe, it, expect, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import Tabs from "./Tabs.vue";
import TabsCe from "./customElements/Tabs.ce.vue";
import { defineComegenElement } from "@/utils/comegen-element";

type TabsVm = {
  getActive: () => string;
  setActive: (key: string) => void;
  next: () => void;
  prev: () => void;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as TabsVm;
const tabEls = (w: ReturnType<typeof mount>) => w.findAll(".cu-tabs-tab");
const tab = (w: ReturnType<typeof mount>, label: string) =>
  tabEls(w).find((t) => t.text().trim() === label)!;
const panelByLabel = (w: ReturnType<typeof mount>, label: string) =>
  w.findAll("[role=tabpanel]").find((p) => p.attributes("aria-labelledby") === tab(w, label).attributes("id"))!;

const tabs = [
  { key: "first", label: "First" },
  { key: "second", label: "Second" },
  { key: "third", label: "Third" },
];

describe("Tabs — estado activo", () => {
  it("sin v-model arranca en la primera tab habilitada", () => {
    const w = mount(Tabs, { props: { tabs } });
    expect(vm(w).getActive()).toBe("first");
    expect(tab(w, "First").classes()).toContain("cu-tabs-tab--active");
  });

  it("click en otra tab actualiza el activo y emite change", async () => {
    const w = mount(Tabs, { props: { tabs } });
    await tab(w, "Second").trigger("click");
    expect(vm(w).getActive()).toBe("second");
    expect(w.emitted("change")).toEqual([["second"]]);
    expect(tab(w, "Second").classes()).toContain("cu-tabs-tab--active");
  });

  it("v-model (modelValue) controla el tab activo", async () => {
    const w = mount(Tabs, { props: { tabs, modelValue: "third" } });
    await flushPromises();
    expect(vm(w).getActive()).toBe("third");
    expect(tab(w, "Third").classes()).toContain("cu-tabs-tab--active");
    // Al clickear emite update:modelValue con la nueva clave.
    await tab(w, "First").trigger("click");
    expect(w.emitted("update:modelValue")).toEqual([["first"]]);
  });

  it("un modelValue inválido cae a la primera tab habilitada", () => {
    const w = mount(Tabs, { props: { tabs, modelValue: "no-existe" } });
    expect(vm(w).getActive()).toBe("first");
  });
});

describe("Tabs — control programático (expose)", () => {
  it("`setActive()` activa la tab con esa clave", async () => {
    const w = mount(Tabs, { props: { tabs } });
    vm(w).setActive("second");
    await flushPromises();
    expect(vm(w).getActive()).toBe("second");
  });

  it("`next()`/`prev()` avanzan y retroceden entre tabs", async () => {
    const w = mount(Tabs, { props: { tabs } });
    vm(w).next();
    await flushPromises();
    expect(vm(w).getActive()).toBe("second");

    vm(w).prev();
    await flushPromises();
    expect(vm(w).getActive()).toBe("first");
  });

  it("`next()` desde la última vuelve a la primera (cicla)", async () => {
    const w = mount(Tabs, { props: { tabs, modelValue: "third" } });
    await flushPromises();
    vm(w).next();
    await flushPromises();
    expect(vm(w).getActive()).toBe("first");
  });
});

describe("Tabs — tabs deshabilitadas", () => {
  const withDisabled = [
    { key: "a", label: "A" },
    { key: "b", label: "B", disabled: true },
    { key: "c", label: "C" },
  ];

  it("una tab con `disabled` tiene el atributo disabled y no se activa al clickear", async () => {
    const w = mount(Tabs, { props: { tabs: withDisabled } });
    const disabledTab = tab(w, "B");
    expect(disabledTab.attributes("disabled")).toBeDefined();

    // `trigger("click")` sobre un botón disabled es un no-op del navegador; un
    // evento sintético sí llega al handler, así que probamos también ese camino.
    await disabledTab.trigger("click");
    disabledTab.element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(vm(w).getActive()).toBe("a");
    expect(w.emitted("change")).toBeUndefined();
  });

  it("`setActive()` a una tab deshabilitada no la activa ni emite change", async () => {
    const w = mount(Tabs, { props: { tabs: withDisabled } });
    vm(w).setActive("b");
    await flushPromises();
    expect(vm(w).getActive()).toBe("a");
    expect(w.emitted("change")).toBeUndefined();
    expect(w.emitted("update:modelValue")).toBeUndefined();
  });

  it("la navegación saltea las tabs deshabilitadas", async () => {
    const w = mount(Tabs, { props: { tabs: withDisabled } });
    vm(w).next();
    await flushPromises();
    expect(vm(w).getActive()).toBe("c");

    vm(w).prev();
    await flushPromises();
    expect(vm(w).getActive()).toBe("a");
  });

  it("con `disabled` global no se activa ninguna otra tab", async () => {
    const w = mount(Tabs, { props: { tabs, disabled: true } });
    await tab(w, "Second").trigger("click");
    expect(vm(w).getActive()).toBe("first");
  });
});

describe("Tabs — teclado y accesibilidad", () => {
  it("ArrowRight/ArrowLeft cambian de tab", async () => {
    const w = mount(Tabs, { props: { tabs } });
    await w.find(".cu-tabs-header").trigger("keydown", { key: "ArrowRight" });
    expect(vm(w).getActive()).toBe("second");

    await w.find(".cu-tabs-header").trigger("keydown", { key: "ArrowLeft" });
    expect(vm(w).getActive()).toBe("first");
  });

  it("Home y End van al primero y al último habilitado", async () => {
    const w = mount(Tabs, { props: { tabs } });
    await w.find(".cu-tabs-header").trigger("keydown", { key: "End" });
    expect(vm(w).getActive()).toBe("third");

    await w.find(".cu-tabs-header").trigger("keydown", { key: "Home" });
    expect(vm(w).getActive()).toBe("first");
  });

  it("marca roles ARIA: tablist, tab, tabpanel y aria-selected", () => {
    const w = mount(Tabs, { props: { tabs } });
    expect(w.find('[role="tablist"]').exists()).toBe(true);
    expect(tabEls(w)).toHaveLength(3);
    expect(tab(w, "First").attributes("aria-selected")).toBe("true");
    expect(tab(w, "Second").attributes("aria-selected")).toBe("false");
    expect(w.find('[role="tabpanel"]').exists()).toBe(true);
  });
});

describe("Tabs — paneles y variantes", () => {
  it("solo el panel activo se renderiza (v-if) y usa el slot de su key", async () => {
    const w = mount(Tabs, {
      props: { tabs },
      slots: {
        first: '<span class="panel-first">Uno</span>',
        second: '<span class="panel-second">Dos</span>',
      },
    });
    expect(w.find(".panel-first").exists()).toBe(true);
    expect(w.find(".panel-second").exists()).toBe(false);

    await tab(w, "Second").trigger("click");
    expect(w.find(".panel-second").exists()).toBe(true);
    expect(w.find(".panel-first").exists()).toBe(false);
  });

  it("una tab con `keepAlive` se mantiene montada y se oculta con v-show", async () => {
    const w = mount(Tabs, {
      props: {
        tabs: [
          { key: "a", label: "A" },
          { key: "b", label: "B", keepAlive: true },
        ],
      },
      slots: { b: '<span class="panel-b">B</span>' },
    });
    // El panel keepAlive está montado aunque no esté activo, pero oculto.
    expect(w.find(".panel-b").exists()).toBe(true);
    expect(panelByLabel(w, "B").attributes("style")).toContain("display: none");
  });

  it("aplica las clases de variante y tamaño", () => {
    const w = mount(Tabs, { props: { tabs, variant: "boxed", size: "lg" } });
    const root = w.find(".cu-tabs");
    expect(root.classes()).toContain("cu-tabs--boxed");
    expect(root.classes()).toContain("cu-tabs--lg");
  });
});

describe("Tabs — roving tabindex (un solo tab stop)", () => {
  it("sólo la tab activa tiene tabindex 0 y el resto -1", () => {
    const w = mount(Tabs, { props: { tabs } });
    expect(tabEls(w).map((t) => t.attributes("tabindex"))).toEqual(["0", "-1", "-1"]);
  });

  it("una tab deshabilitada nunca queda activa aunque el v-model la apunte", () => {
    // Ficha: `tabs[].disabled` "se saltea en la navegación y en setActive".
    // Si quedara activa sería la única con tabindex 0 y, al estar disabled, el
    // tablist se quedaría sin parada de teclado.
    const w = mount(Tabs, {
      props: {
        tabs: [
          { key: "a", label: "A" },
          { key: "b", label: "B", disabled: true },
        ],
        modelValue: "b",
      },
    });
    expect(vm(w).getActive()).toBe("a");
    expect(tab(w, "B").attributes("aria-selected")).toBe("false");
    expect(tabEls(w).map((t) => t.attributes("tabindex"))).toEqual(["0", "-1"]);
  });

  it("si todas las tabs están deshabilitadas no hay tab activa ni tab stop", () => {
    const w = mount(Tabs, {
      props: {
        tabs: [
          { key: "a", label: "A", disabled: true },
          { key: "b", label: "B", disabled: true },
        ],
      },
    });
    expect(vm(w).getActive()).toBe("");
    expect(tabEls(w).every((t) => t.attributes("tabindex") === "-1")).toBe(true);
  });

  it("el foco sigue a la tab que activan las flechas", async () => {
    const w = mount(Tabs, { props: { tabs }, attachTo: document.body });
    await w.find(".cu-tabs-header").trigger("keydown", { key: "ArrowRight" });
    expect(vm(w).getActive()).toBe("second");
    expect(document.activeElement).toBe(tabEls(w)[1]!.element);
    w.unmount();
  });
});

describe("Tabs — ids ARIA resueltos", () => {
  it("el aria-controls de la tab activa apunta al panel montado", () => {
    const w = mount(Tabs, { props: { tabs } });
    const panels = w.findAll("[role=tabpanel]");
    expect(panels).toHaveLength(1);
    expect(tab(w, "First").attributes("aria-controls")).toBe(panels[0]!.element.id);
  });

  it("todo aria-controls declarado resuelve a un elemento existente", () => {
    // Un `aria-controls` que apunta a un panel no montado (v-if) es un IDREF
    // inválido: sólo se declara cuando el panel existe.
    const w = mount(Tabs, { props: { tabs }, attachTo: document.body });
    for (const t of tabEls(w)) {
      const controls = t.attributes("aria-controls");
      if (controls === undefined) continue;
      expect(document.getElementById(controls)).not.toBeNull();
    }
    w.unmount();
  });

  it("el aria-labelledby del panel apunta a su tab", () => {
    const w = mount(Tabs, { props: { tabs } });
    const panel = w.find("[role=tabpanel]");
    expect(panel.attributes("aria-labelledby")).toBe(tab(w, "First").attributes("id"));
  });

  it("una tab con keepAlive tiene su panel (oculto) y su aria-controls resuelve", () => {
    const w = mount(Tabs, {
      props: { tabs: [{ key: "a", label: "A" }, { key: "b", label: "B", keepAlive: true }] },
      attachTo: document.body,
    });
    const controls = tab(w, "B").attributes("aria-controls");
    expect(controls).toBeDefined();
    expect(document.getElementById(controls!)).not.toBeNull();
    w.unmount();
  });
});

describe("Tabs — color inválido", () => {
  it("un color fuera del set cae en primary (el tab activo no queda invisible)", () => {
    // Sin fallback, `var(--cu-color-magenta-solid)` no existe: el tab activo
    // quedaba con fondo transparente y el texto del tema encima.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = mount(Tabs, { props: { tabs, color: "magenta" as never } });
    const style = w.find(".cu-tabs").attributes("style") ?? "";
    expect(style).toContain("--cu-color-primary-solid");
    expect(style).not.toContain("magenta");
    warn.mockRestore();
  });
});

describe("Tabs — change sólo en cambios reales", () => {
  it("click en la tab ya activa no emite `change` ni `update:modelValue`", async () => {
    const w = mount(Tabs, { props: { tabs } });
    await tab(w, "First").trigger("click");
    expect(w.emitted("change")).toBeUndefined();
    expect(w.emitted("update:modelValue")).toBeUndefined();
  });

  it("cambiar de tab emite `change` con la key", async () => {
    const w = mount(Tabs, { props: { tabs } });
    await tab(w, "Third").trigger("click");
    expect(w.emitted("change")).toEqual([["third"]]);
    expect(w.emitted("update:modelValue")).toEqual([["third"]]);
  });
});

describe("Tabs — contenido de paneles y slots", () => {
  it("keepAlive conserva el estado de los inputs al ir y volver", async () => {
    const w = mount(Tabs, {
      props: {
        tabs: [
          { key: "a", label: "A" },
          { key: "b", label: "B", keepAlive: true },
        ],
      },
      slots: { a: '<span class="panel-a">A</span>', b: '<input class="ka-input">' },
    });
    await tab(w, "B").trigger("click");
    const input = w.find(".ka-input");
    expect(input.exists()).toBe(true);
    (input.element as HTMLInputElement).value = "hola";

    await tab(w, "A").trigger("click");
    await flushPromises();
    // Sigue montado, pero oculto.
    expect(w.find(".ka-input").exists()).toBe(true);
    expect(panelByLabel(w, "B").attributes("style")).toContain("display: none");
    expect((w.find(".ka-input").element as HTMLInputElement).value).toBe("hola");
  });

  it("un panel sin keepAlive se desmonta al cambiar de tab", async () => {
    const w = mount(Tabs, {
      props: { tabs },
      slots: { first: '<span class="panel-first">A</span>' },
    });
    expect(w.find(".panel-first").exists()).toBe(true);
    await tab(w, "Second").trigger("click");
    expect(w.find(".panel-first").exists()).toBe(false);
  });

  it("el contenido del slot se proyecta en el panel de su key", async () => {
    const w = mount(Tabs, {
      props: { tabs },
      slots: { second: '<span class="panel-second">Dos</span>' },
    });
    await tab(w, "Second").trigger("click");
    expect(w.find("[role=tabpanel]").find(".panel-second").exists()).toBe(true);
  });
});

describe("Tabs — atacante", () => {
  it("la label se muestra como texto, no se interpreta como HTML", () => {
    const evil = '<img src=x onerror="window.__pwned=1">';
    const w = mount(Tabs, { props: { tabs: [{ key: "a", label: evil }] } });
    expect(w.find(".cu-tabs-tab").text()).toBe(evil);
    expect(w.find(".cu-tabs-tab img").exists()).toBe(false);
  });

  it("el campo `icon` se renderiza como marcado dentro del tab (feature documentada)", () => {
    const w = mount(Tabs, {
      props: {
        tabs: [
          {
            key: "a",
            label: "A",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>',
          },
        ],
      },
    });
    expect(w.find(".cu-tabs-tab-icon svg").exists()).toBe(true);
  });

  it("con el grupo `disabled` ninguna tab es clickeable ni cambia el activo", async () => {
    const w = mount(Tabs, { props: { tabs, disabled: true } });
    expect(tabEls(w).every((t) => t.attributes("disabled") !== undefined)).toBe(true);
    await tab(w, "Second").trigger("click");
    expect(vm(w).getActive()).toBe("first");
    expect(w.emitted("change")).toBeUndefined();
  });
});

describe("Tabs — normalización de `tabs`", () => {
  it("`tabs = null` no rompe el render ni la API", async () => {
    // El custom element permite `el.tabs = null`: antes del fix el render
    // lanzaba `Cannot read properties of null (reading 'find')`.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = mount(Tabs, { props: { tabs: null as never } });
    expect(tabEls(w)).toHaveLength(0);
    expect(w.find("[role=tablist]").exists()).toBe(true);
    expect(vm(w).getActive()).toBe("");
    vm(w).next();
    await flushPromises();
    expect(vm(w).getActive()).toBe("");
    warn.mockRestore();
  });

  it("descarta items inválidos o sin key conservando el orden de los válidos", () => {
    const w = mount(Tabs, {
      props: {
        tabs: [
          { key: "a", label: "A" },
          null,
          { label: "sin key" },
          { key: "", label: "key vacía" },
          undefined,
          { key: "b", label: "B" },
        ] as never,
      },
    });
    expect(tabEls(w).map((t) => t.text())).toEqual(["A", "B"]);
    expect(vm(w).getActive()).toBe("a");
  });
});

describe("Tabs — ids únicos entre instancias", () => {
  it("dos `<Tabs>` con las mismas keys generan ids distintos y ARIA apunta a su propia instancia", () => {
    const Pair = defineComponent({
      components: { Tabs },
      setup: () => ({ tabs }),
      template: '<div><Tabs :tabs="tabs" /><Tabs :tabs="tabs" /></div>',
    });
    const w = mount(Pair, { attachTo: document.body });
    const [first, second] = w.findAll(".cu-tabs");

    const idsFirst = first!.findAll(".cu-tabs-tab").map((t) => t.attributes("id")!);
    const idsSecond = second!.findAll(".cu-tabs-tab").map((t) => t.attributes("id")!);
    expect(new Set([...idsFirst, ...idsSecond]).size).toBe(6);
    expect(idsFirst.some((id) => idsSecond.includes(id))).toBe(false);

    // El panel de la instancia B se etiqueta con la tab B, no con la A.
    const panelB = second!.find("[role=tabpanel]");
    expect(panelB.attributes("aria-labelledby")).toBe(idsSecond[0]);
    expect(document.getElementById(idsSecond[0]!)!.textContent!.trim()).toBe("First");
    w.unmount();
  });
});

describe("Tabs — icono sanitizado", () => {
  it("un SVG válido con `path` se renderiza", () => {
    const w = mount(Tabs, {
      props: {
        tabs: [
          {
            key: "a",
            label: "A",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg>',
          },
        ],
      },
    });
    expect(w.find(".cu-tabs-tab-icon svg path").exists()).toBe(true);
  });

  it("`<script>` y handlers `on*` se eliminan antes del v-html", () => {
    // Sonda de ejecución: el navegador/jsdom la setearía si el handler sobrevive.
    type XssWindow = Window & { __xss?: number };
    const probe = window as XssWindow;
    delete probe.__xss;
    const w = mount(Tabs, {
      props: {
        tabs: [
          {
            key: "a",
            label: "A",
            icon: '<img src=x onerror="window.__xss=1"><script>window.__xss=2</script>',
          },
        ],
      },
    });
    const icon = w.find(".cu-tabs-tab-icon");
    expect(icon.find("script").exists()).toBe(false);
    expect(icon.find("img").attributes("onerror")).toBeUndefined();
    expect(probe.__xss).toBeUndefined();
  });
});

describe("Tabs — foco al eliminar la tab activa", () => {
  it("si la tab enfocada desaparece, el foco pasa a la nueva tab activa", async () => {
    const w = mount(Tabs, { props: { tabs }, attachTo: document.body });
    const second = tabEls(w)[1]!.element as HTMLElement;
    second.focus();
    await tab(w, "Second").trigger("click");
    expect(vm(w).getActive()).toBe("second");
    expect(document.activeElement).toBe(second);

    // El consumidor saca la tab activa (y enfocada) del array.
    await w.setProps({ tabs: [tabs[0]!, tabs[2]!] });
    await flushPromises();

    expect(vm(w).getActive()).toBe("first");
    expect(document.activeElement).toBe(tabEls(w)[0]!.element);
    w.unmount();
  });
});

describe("Tabs — custom element", () => {
  const CE_TAG = "cu-tabs-audit";
  customElements.get(CE_TAG) ?? defineComegenElement(CE_TAG, TabsCe);

  type CeEl = HTMLElement & {
    tabs: { key: string; label: string; disabled?: boolean }[];
    getActive: () => string;
    setActive: (key: string) => void;
    next: () => void;
    prev: () => void;
  };

  const make = (attrs: Record<string, string> = {}) => {
    const el = document.createElement(CE_TAG) as CeEl;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.body.appendChild(el);
    el.tabs = [
      { key: "a", label: "A" },
      { key: "b", label: "B" },
      { key: "c", label: "C", disabled: true },
    ];
    return el;
  };

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renderiza el tablist en el shadow root y responde al click con `change` compuesto", async () => {
    const el = make();
    await flushPromises();
    const buttons = el.shadowRoot!.querySelectorAll<HTMLButtonElement>("[role=tab]");
    expect(buttons).toHaveLength(3);

    let detail: unknown;
    el.addEventListener("change", (e) => { detail = (e as CustomEvent).detail; });
    buttons[1]!.click();
    await flushPromises();

    expect(el.getActive()).toBe("b");
    expect(detail).toBe("b");
  });

  it("`model-value` controla el tab activo y `setActive` lo refleja", async () => {
    const el = make({ "model-value": "b" });
    await flushPromises();
    expect(el.getActive()).toBe("b");

    el.setActive("a");
    await flushPromises();
    expect(el.getActive()).toBe("a");
    expect(el.shadowRoot!.querySelector('[aria-selected="true"]')!.textContent!.trim()).toBe("A");
  });
});
