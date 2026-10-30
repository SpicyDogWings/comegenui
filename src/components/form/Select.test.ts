// Comportamiento de Select según su ficha (docs/componentes/vue/select.md).
//
// Aserciones escritas a mano desde la prosa: fallan por bugs reales.
import { describe, it, expect, vi, beforeAll } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Select from "./Select.vue";
import Dropdown from "../overlay/Dropdown.vue";
import Loader from "../information/Loader.vue";

interface Opt {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string;
  variant?: string;
}

type SelectVm = {
  get: () => string;
  set: (v: string) => void;
  reset: () => void;
  focus: () => void;
  isOpen: () => boolean;
  selectedItem: () => Opt | null;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as SelectVm;

const OPTIONS: Opt[] = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C", disabled: true },
];

const toggle = (w: ReturnType<typeof mount>) => w.find(".cu-select-toggle");

// jsdom no implementa `scrollIntoView` y `searchEnabled` lo usa al matchear una opción.
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe("Select — estado y v-model", () => {
  it("arranca con el valor del modelValue y muestra el label de la opción", async () => {
    const w = mount(Select, { props: { options: OPTIONS, modelValue: "b" } });
    await flushPromises();
    expect(vm(w).get()).toBe("b");
    expect(w.find(".cu-select-label").text()).toBe("B");
  });

  it("sin valor muestra el placeholder o 'Seleccionar...'", () => {
    expect(
      mount(Select, { props: { options: OPTIONS, placeholder: "Elegí" } })
        .find(".cu-select-label")
        .text(),
    ).toBe("Elegí");
    expect(mount(Select, { props: { options: OPTIONS } }).find(".cu-select-label").text()).toBe(
      "Seleccionar...",
    );
  });

  it("seleccionar una opción emite update:modelValue + select + change y cierra el panel", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    await toggle(w).trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);

    const options = w.findAll(".cu-select-option");
    await options[1]!.trigger("click"); // opción B
    await flushPromises();

    expect(vm(w).get()).toBe("b");
    expect(vm(w).selectedItem()).toMatchObject({ value: "b", label: "B" });
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["b"]);
    expect(w.emitted("select")?.[0]?.[0]).toMatchObject({ value: "b", label: "B" });
    expect(w.emitted("change")?.at(-1)).toEqual(["b"]);
    expect(vm(w).isOpen()).toBe(false);
  });

  it("una opción disabled no se selecciona al click", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    await toggle(w).trigger("click");
    await flushPromises();

    const disabled = w.findAll(".cu-select-option")[2]!; // opción C (disabled)
    await disabled.trigger("click");
    await flushPromises();

    expect(vm(w).get()).toBe("");
    expect(w.emitted("select")).toBeUndefined();
  });

  it("get()/set()/reset() controlan la selección programáticamente", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    vm(w).set("a");
    await flushPromises();
    expect(vm(w).get()).toBe("a");
    expect(w.find(".cu-select-label").text()).toBe("A");

    vm(w).reset();
    await flushPromises();
    expect(vm(w).get()).toBe("");
    expect(vm(w).selectedItem()).toBeNull();
  });

  it("set()/reset() emiten change con el valor nuevo", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    vm(w).set("a");
    await flushPromises();
    expect(w.emitted("change")?.at(-1)).toEqual(["a"]);

    vm(w).reset();
    await flushPromises();
    expect(w.emitted("change")?.at(-1)).toEqual([""]);
  });

  it("isOpen() refleja el estado del panel con click en el toggle", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    expect(vm(w).isOpen()).toBe(false);
    await toggle(w).trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
    await toggle(w).trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
  });
});

describe("Select — contenido y clases", () => {
  it("sin opciones muestra 'Sin opciones'", async () => {
    const w = mount(Select);
    await toggle(w).trigger("click");
    await flushPromises();
    expect(w.find(".cu-select-empty").text()).toBe("Sin opciones");
  });

  it("aplica la clase disabled a las opciones deshabilitadas", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    await toggle(w).trigger("click");
    await flushPromises();
    expect(w.findAll(".cu-select-option")[2]!.classes()).toContain("cu-select-option--disabled");
  });
});

describe("Select — readOnly", () => {
  it("no abre el dropdown al click", async () => {
    const w = mount(Select, { props: { options: OPTIONS, readOnly: true } });
    await toggle(w).trigger("click");
    await flushPromises();

    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("select")).toBeUndefined();
    expect(w.emitted("change")).toBeUndefined();
  });

  it("marca aria-readonly y sigue enfocable", async () => {
    const w = mount(Select, {
      props: { options: OPTIONS, readOnly: true },
      attachTo: document.body,
    });

    expect(toggle(w).attributes("aria-readonly")).toBe("true");
    vm(w).focus();
    expect(document.activeElement).toBe(toggle(w).element);

    w.unmount();
  });

  it("al pasar a readOnly cierra el panel abierto", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    await toggle(w).trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);

    await w.setProps({ readOnly: true });
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
  });

  it("set() sigue funcionando en readOnly (API programática)", async () => {
    const w = mount(Select, { props: { options: OPTIONS, readOnly: true } });
    vm(w).set("a");
    await flushPromises();

    expect(vm(w).get()).toBe("a");
    expect(w.find(".cu-select-label").text()).toBe("A");
  });
});

describe("Select — alineación del texto (trigger + opciones)", () => {
  // Alcance: el label del trigger (placeholder o selección) y las opciones del panel.
  // Las opciones son `Button` (flex), así que la alineación real es `justify-content`.
  async function align(textAlign?: "left" | "center" | "right") {
    const w = mount(Select, {
      props: textAlign ? { options: OPTIONS, textAlign } : { options: OPTIONS },
    });
    await toggle(w).trigger("click");
    await flushPromises();
    return {
      label: w.find(".cu-select-label").element as HTMLElement,
      options: w.findAll(".cu-select-option").map((o) => o.element as HTMLElement),
    };
  }

  it("por defecto alinea a la izquierda (label left, opciones flex-start)", async () => {
    const { label, options } = await align();
    expect(label.style.textAlign).toBe("left");
    expect(options[0]!.style.justifyContent).toBe("flex-start");
  });

  it("center centra el label del trigger y las opciones", async () => {
    const { label, options } = await align("center");
    expect(label.style.textAlign).toBe("center");
    for (const option of options) expect(option.style.justifyContent).toBe("center");
  });

  it("right alinea a la derecha el label del trigger y las opciones", async () => {
    const { label, options } = await align("right");
    expect(label.style.textAlign).toBe("right");
    for (const option of options) expect(option.style.justifyContent).toBe("flex-end");
  });
});

describe("Select — opción seleccionada (check)", () => {
  it("el modelValue inicial marca con check la opción correspondiente", async () => {
    const w = mount(Select, { props: { options: OPTIONS, modelValue: "b" } });
    await toggle(w).trigger("click");
    await flushPromises();

    const options = w.findAll(".cu-select-option");
    expect(options[0]!.find(".cu-menu-option-check").exists()).toBe(false);
    expect(options[1]!.find(".cu-menu-option-check").exists()).toBe(true);
    expect(options[2]!.find(".cu-menu-option-check").exists()).toBe(false);
  });

  it("sin selección ninguna opción dibuja el check", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    await toggle(w).trigger("click");
    await flushPromises();

    expect(w.findAll(".cu-menu-option-check")).toHaveLength(0);
  });

  it("set() mueve el check y reset() lo quita", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    await toggle(w).trigger("click");
    await flushPromises();

    vm(w).set("a");
    await flushPromises();
    const options = w.findAll(".cu-select-option");
    expect(options[0]!.find(".cu-menu-option-check").exists()).toBe(true);
    expect(options[1]!.find(".cu-menu-option-check").exists()).toBe(false);

    vm(w).reset();
    await flushPromises();
    expect(w.findAll(".cu-menu-option-check")).toHaveLength(0);
  });

  it("un modelValue externo nuevo mueve el check", async () => {
    const w = mount(Select, { props: { options: OPTIONS, modelValue: "a" } });
    await toggle(w).trigger("click");
    await flushPromises();

    await w.setProps({ modelValue: "b" });
    await flushPromises();

    const options = w.findAll(".cu-select-option");
    expect(options[0]!.find(".cu-menu-option-check").exists()).toBe(false);
    expect(options[1]!.find(".cu-menu-option-check").exists()).toBe(true);
  });

  it("elegir una opción deja el check en ella y el panel sigue cerrándose", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    await toggle(w).trigger("click");
    await flushPromises();

    await w.findAll(".cu-select-option")[1]!.trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(vm(w).selectedItem()).toMatchObject({ value: "b" });

    await toggle(w).trigger("click");
    await flushPromises();
    expect(w.findAll(".cu-select-option")[1]!.find(".cu-menu-option-check").exists()).toBe(true);
  });
});

describe("Select — el foco vuelve al trigger al cerrar", () => {
  it("Escape con el foco en una opción lo devuelve al toggle", async () => {
    const w = mount(Select, {
      attachTo: document.body,
      props: { options: [{ label: "A", value: "a" }, { label: "B", value: "b" }] },
    })
    const trigger = toggle(w).element as HTMLElement
    trigger.focus()
    await toggle(w).trigger("click")
    await flushPromises()
    const option = w.findAll(".cu-select-option")[0]!.element as HTMLElement
    option.focus()

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    await flushPromises()
    expect(document.activeElement).toBe(trigger)
    w.unmount()
  })
})

describe("Select — el panel no queda abierto al salir del control", () => {
  it("el foco que sale del control (Tab) cierra el panel", async () => {
    const w = mount(Select, { props: { options: OPTIONS }, attachTo: document.body });
    const outside = document.createElement("button");
    document.body.appendChild(outside);

    await toggle(w).trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);

    await toggle(w).trigger("focusout", { relatedTarget: outside });
    // El cierre se difiere una tarea para que el foco termine de moverse antes de cerrar.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await flushPromises();

    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("blur")).toHaveLength(1);
    outside.remove();
    w.unmount();
  });

  it("el foco que pasa a una opción del panel NO cierra el panel", async () => {
    const w = mount(Select, { props: { options: OPTIONS }, attachTo: document.body });
    await toggle(w).trigger("click");
    await flushPromises();

    const option = w.findAll(".cu-select-option")[0]!.element as HTMLElement;
    await toggle(w).trigger("focusout", { relatedTarget: option });
    await flushPromises();

    expect(vm(w).isOpen()).toBe(true);
    expect(w.emitted("blur")).toBeUndefined();
    w.unmount();
  });
});

describe("Select — búsqueda por teclado y cooldown", () => {
  const searchOptions: Opt[] = [
    { value: "ar", label: "Argentina" },
    { value: "br", label: "Brasil" },
    { value: "cl", label: "Chile" },
  ];

  it("cerrar el panel corta el cooldown: al reabrir no hay barra corriendo", async () => {
    const w = mount(Select, { props: { options: searchOptions, searchEnabled: true } });
    await toggle(w).trigger("click");
    await flushPromises();

    await toggle(w).trigger("keydown", { key: "c" });
    await flushPromises();
    expect(w.findComponent(Dropdown).props("cooldown")).toBe(true);

    // Escape cierra el panel.
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(w.findComponent(Dropdown).props("cooldown")).toBe(false);

    await toggle(w).trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
    expect(w.findComponent(Dropdown).props("cooldown")).toBe(false);
    w.unmount();
  });

  it("el texto acumulado se resetea al cerrar: reabrir y escribir busca desde cero", async () => {
    const w = mount(Select, { props: { options: searchOptions, searchEnabled: true } });
    await toggle(w).trigger("click");
    await flushPromises();

    const scrolled: HTMLElement[] = [];
    Element.prototype.scrollIntoView = function (this: HTMLElement) {
      scrolled.push(this);
    };

    await toggle(w).trigger("keydown", { key: "b" });
    await flushPromises();
    expect(scrolled.at(-1)?.textContent).toContain("Brasil");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    await toggle(w).trigger("click");
    await flushPromises();

    // "c" solo: Chile. Con el texto viejo ("bc") no habría match y no scrollearía.
    await toggle(w).trigger("keydown", { key: "c" });
    await flushPromises();

    expect(scrolled.at(-1)?.textContent).toContain("Chile");
    w.unmount();
  });
});

describe("Select — opción deshabilitada", () => {
  it("se ve atenuada (color muted inline, sin opacidad apilada)", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    await toggle(w).trigger("click");
    await flushPromises();

    const rows = w.findAll(".cu-select-option");
    const habilitada = rows[0]!.element as HTMLElement;
    const deshabilitada = rows[2]!.element as HTMLElement;

    expect(deshabilitada.style.color).toBe("var(--cu-color-neutral-text-muted)");
    expect(deshabilitada.style.opacity).toBe("1");
    expect(habilitada.style.color).toBe("");
  });
});

describe("Select — options inválidas", () => {
  it("options null no rompe el control (lista vacía)", async () => {
    const w = mount(Select, { props: { options: null as unknown as Opt[] } });
    await toggle(w).trigger("click");
    await flushPromises();

    expect(w.find(".cu-select-empty").exists()).toBe(true);
    expect(vm(w).selectedItem()).toBeNull();
  });
});

describe("Select — patrón combobox + listbox (ARIA y teclado)", () => {
  it("el trigger es un combobox que referencia el listbox del panel", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    const trigger = toggle(w);
    expect(trigger.attributes("role")).toBe("combobox");
    expect(trigger.attributes("aria-haspopup")).toBe("listbox");
    expect(trigger.attributes("aria-expanded")).toBe("false");

    await trigger.trigger("click");
    await flushPromises();

    const panel = w.find(".cu-popover-panel");
    expect(panel.attributes("role")).toBe("listbox");
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(trigger.attributes("aria-controls")).toBe(panel.attributes("id"));
    expect(panel.attributes("id")).toBeTruthy();
  });

  it("cada opción es un `option` con id, aria-selected y fuera del orden de tabulación", async () => {
    const w = mount(Select, { props: { options: OPTIONS, modelValue: "b" } });
    await toggle(w).trigger("click");
    await flushPromises();

    const rows = w.findAll(".cu-select-option");
    for (const row of rows) {
      expect(row.attributes("role")).toBe("option");
      expect(row.attributes("id")).toMatch(/-option-\d+$/);
      expect(row.attributes("tabindex")).toBe("-1");
    }
    expect(rows[1]!.attributes("aria-selected")).toBe("true");
    expect(rows[0]!.attributes("aria-selected")).toBe("false");
    expect(new Set(rows.map((r) => r.attributes("id"))).size).toBe(rows.length);
  });

  it("flechas abren el panel, mueven el activo y Enter selecciona", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    await toggle(w).trigger("keydown", { key: "ArrowDown" });
    await flushPromises();

    expect(vm(w).isOpen()).toBe(true);
    const first = w.findAll(".cu-select-option")[0]!;
    expect(toggle(w).attributes("aria-activedescendant")).toBe(first.attributes("id"));

    await toggle(w).trigger("keydown", { key: "ArrowDown" });
    await flushPromises();
    const second = w.findAll(".cu-select-option")[1]!;
    expect(toggle(w).attributes("aria-activedescendant")).toBe(second.attributes("id"));

    await toggle(w).trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(vm(w).get()).toBe("b");
    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("select")).toHaveLength(1);
  });

  it("las flechas saltean las opciones deshabilitadas y Home/End van a los extremos", async () => {
    const w = mount(Select, { props: { options: OPTIONS } }); // la 3ª ("C") está deshabilitada
    await toggle(w).trigger("keydown", { key: "ArrowUp" });
    await flushPromises();
    // Abre desde el final y saltea la deshabilitada: "B".
    expect(toggle(w).attributes("aria-activedescendant")).toBe(
      w.findAll(".cu-select-option")[1]!.attributes("id"),
    );

    await toggle(w).trigger("keydown", { key: "ArrowDown" });
    await flushPromises();
    // Última habilitada ("B") → wrap a la primera.
    expect(toggle(w).attributes("aria-activedescendant")).toBe(
      w.findAll(".cu-select-option")[0]!.attributes("id"),
    );

    await toggle(w).trigger("keydown", { key: "End" });
    await flushPromises();
    expect(toggle(w).attributes("aria-activedescendant")).toBe(
      w.findAll(".cu-select-option")[1]!.attributes("id"),
    );

    await toggle(w).trigger("keydown", { key: "Home" });
    await flushPromises();
    expect(toggle(w).attributes("aria-activedescendant")).toBe(
      w.findAll(".cu-select-option")[0]!.attributes("id"),
    );
  });

  it("Escape cierra el panel y deja de anunciar un activo", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    await toggle(w).trigger("keydown", { key: "ArrowDown" });
    await flushPromises();
    expect(toggle(w).attributes("aria-activedescendant")).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();

    expect(vm(w).isOpen()).toBe(false);
    expect(toggle(w).attributes("aria-activedescendant")).toBeUndefined();
    expect(toggle(w).attributes("aria-expanded")).toBe("false");
  });

  it("dos instancias no comparten ids", async () => {
    const a = mount(Select, { props: { options: OPTIONS } });
    const b = mount(Select, { props: { options: OPTIONS } }, );
    await toggle(a).trigger("click");
    await toggle(b).trigger("click");
    await flushPromises();

    const idA = a.find(".cu-popover-panel").attributes("id")!;
    const idB = b.find(".cu-popover-panel").attributes("id")!;
    expect(idA).not.toBe(idB);

    const optA = a.findAll(".cu-select-option")[0]!.attributes("id");
    const optB = b.findAll(".cu-select-option")[0]!.attributes("id");
    expect(optA).not.toBe(optB);
  });

  it("la barra de cooldown respeta `cooldownVariant` (ghost suave / solid lleno)", async () => {
    const soft = mount(Select, { props: { options: OPTIONS, searchEnabled: true } });
    await toggle(soft).trigger("click");
    await flushPromises();
    await toggle(soft).trigger("keydown", { key: "b" });
    await flushPromises();
    expect(soft.findComponent(Loader).props("color")).toBe("neutral-ghost-hover");

    const full = mount(Select, {
      props: { options: OPTIONS, searchEnabled: true, cooldownVariant: "solid" },
    });
    await toggle(full).trigger("click");
    await flushPromises();
    await toggle(full).trigger("keydown", { key: "b" });
    await flushPromises();
    expect(full.findComponent(Loader).props("color")).toBe("neutral");
  });
});
