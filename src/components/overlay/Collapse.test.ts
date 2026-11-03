// Comportamiento de Collapse según su ficha (docs/componentes/vue/collapse.md).
//
// Sección colapsable con trigger (botón + chevron). Contenido oculto por
// defecto; `default-open` lo muestra al inicio. Emite `toggle` con boolean y
// expone open/close/toggle/isOpen. Aserciones escritas a mano desde la prosa.
import { describe, it, expect, vi } from "vitest";
import { h, nextTick } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import Collapse from "./Collapse.vue";

type CollapseVm = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as CollapseVm;
const content = (w: ReturnType<typeof mount>) => w.find(".cu-collapse-content");

describe("Collapse — estado y visibilidad", () => {
  it("arranca cerrado y oculta el contenido", () => {
    const w = mount(Collapse, { props: { label: "Más información" } });
    expect(vm(w).isOpen()).toBe(false);
    expect(content(w).attributes("style")).toContain("display: none");
  });

  it("defaultOpen arranca abierto y muestra el contenido", () => {
    const w = mount(Collapse, { props: { label: "Opciones", defaultOpen: true } });
    expect(vm(w).isOpen()).toBe(true);
    expect(content(w).attributes("style") ?? "").not.toContain("display: none");
  });

  it("renderiza el label en el trigger", () => {
    const w = mount(Collapse, { props: { label: "Mi collapse" } });
    expect(w.find(".cu-collapse-label").text()).toBe("Mi collapse");
  });

  it("renderiza el slot default como contenido", () => {
    const w = mount(Collapse, { props: { label: "L" }, slots: { default: "<p>Contenido oculto</p>" } });
    expect(content(w).text()).toContain("Contenido oculto");
  });
});

describe("Collapse — descripción del trigger", () => {
  it("renderiza la descripción como <p> bajo el label", () => {
    const w = mount(Collapse, { props: { label: "L", description: "Texto de ayuda" } });
    const desc = w.find(".cu-collapse-description");
    expect(desc.exists()).toBe(true);
    expect(desc.element.tagName).toBe("P");
    expect(desc.text()).toBe("Texto de ayuda");
  });

  it("no renderiza descripción si no se pasa", () => {
    const w = mount(Collapse, { props: { label: "L" } });
    expect(w.find(".cu-collapse-description").exists()).toBe(false);
  });
});

describe("Collapse — control programático", () => {
  it("open()/close()/toggle() controlan isOpen()", async () => {
    const w = mount(Collapse, { props: { label: "L" } });

    vm(w).open();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
    expect(content(w).attributes("style") ?? "").not.toContain("display: none");

    vm(w).close();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(content(w).attributes("style")).toContain("display: none");

    vm(w).toggle();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
  });
});

describe("Collapse — evento toggle", () => {
  it("click en el trigger alterna y emite toggle con el nuevo estado", async () => {
    const w = mount(Collapse, { props: { label: "L" } });
    await w.find(".cu-collapse-trigger").trigger("click");
    await flushPromises();

    expect(vm(w).isOpen()).toBe(true);
    expect(w.emitted("toggle")).toEqual([[true]]);

    await w.find(".cu-collapse-trigger").trigger("click");
    await flushPromises();
    expect(w.emitted("toggle")).toEqual([[true], [false]]);
  });

  it("no emite toggle si el estado no cambia (open() sobre abierto)", async () => {
    const w = mount(Collapse, { props: { label: "L", defaultOpen: true } });
    vm(w).open();
    await flushPromises();
    expect(w.emitted("toggle")).toBeUndefined();
  });

  it("marca el chevron como is-open cuando está abierto", async () => {
    const w = mount(Collapse, { props: { label: "L" } });
    expect(w.find(".cu-collapse-chevron").classes()).not.toContain("is-open");

    vm(w).open();
    await flushPromises();
    expect(w.find(".cu-collapse-chevron").classes()).toContain("is-open");
  });
});

describe("Collapse — disabled", () => {
  it("deshabilita el botón del trigger", () => {
    const w = mount(Collapse, { props: { label: "L", disabled: true } });
    expect(w.find(".cu-collapse-trigger").attributes("disabled")).toBeDefined();
  });

  it("no alterna al clickear el trigger y no emite toggle", async () => {
    const w = mount(Collapse, { props: { label: "L", disabled: true } });
    await w.find(".cu-collapse-trigger").trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("toggle")).toBeUndefined();
  });

  it("toggle() es no-op con disabled y no emite toggle", async () => {
    const w = mount(Collapse, { props: { label: "L", disabled: true } });
    vm(w).toggle();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("toggle")).toBeUndefined();
  });

  it("open() es no-op con disabled", async () => {
    const w = mount(Collapse, { props: { label: "L", disabled: true } });
    vm(w).open();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
  });
});

describe("Collapse — ícono saneado", () => {
  const EVIL = '<img src=x onerror="window.__xss=1"><script>window.__xss=2</script>';

  it("conserva un SVG válido en el trigger", () => {
    const w = mount(Collapse, {
      props: { label: "L", icon: '<svg class="mi-icono" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h4v4H0z"/></svg>' },
    });
    expect(w.find(".cu-collapse-icon svg.mi-icono path").exists()).toBe(true);
  });

  it("elimina `<script>` y handlers `on*` del ícono", () => {
    type XssWindow = Window & { __xss?: number };
    const probe = window as XssWindow;
    delete probe.__xss;

    const w = mount(Collapse, { props: { label: "L", icon: EVIL } });
    expect(w.html()).not.toContain("onerror");
    expect(w.html()).not.toContain("<script");
    expect(probe.__xss).toBeUndefined();
  });
});

describe("Collapse — accesibilidad del disclosure", () => {
  it("expone aria-expanded en el trigger y refleja el estado", async () => {
    const w = mount(Collapse, { props: { label: "L" } });

    expect(w.find(".cu-collapse-trigger").attributes("aria-expanded")).toBe("false");

    vm(w).open();
    await flushPromises();
    expect(w.find(".cu-collapse-trigger").attributes("aria-expanded")).toBe("true");

    vm(w).close();
    await flushPromises();
    expect(w.find(".cu-collapse-trigger").attributes("aria-expanded")).toBe("false");
  });

  it("aria-controls apunta al id del contenido", () => {
    const w = mount(Collapse, { props: { label: "L" } });
    const id = content(w).attributes("id");

    expect(id).toBeTruthy();
    expect(w.find(".cu-collapse-trigger").attributes("aria-controls")).toBe(id);
  });

  it("dos instancias no comparten el id del contenido", () => {
    const w = mount({
      render: () => h("div", [h(Collapse, { label: "A" }), h(Collapse, { label: "B" })]),
    });
    const ids = w.findAll(".cu-collapse-content").map((c) => c.attributes("id"));
    const triggers = w.findAll(".cu-collapse-trigger");

    expect(ids[0]).toBeTruthy();
    expect(ids[1]).toBeTruthy();
    expect(ids[0]).not.toBe(ids[1]);
    expect(triggers[0]?.attributes("aria-controls")).toBe(ids[0]);
    expect(triggers[1]?.attributes("aria-controls")).toBe(ids[1]);
  });

  it("el chevron es decorativo y no entra al árbol accesible", () => {
    const w = mount(Collapse, { props: { label: "L" } });
    const chevron = w.find(".cu-collapse-chevron");

    expect(chevron.attributes("aria-hidden")).toBe("true");
    expect(chevron.attributes("focusable")).toBe("false");
  });
});

describe("Collapse — prefers-reduced-motion", () => {
  const withReducedMotion = () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
    return () => {
      window.matchMedia = original;
    };
  };

  it("no manipula la altura inline (no anima) y muestra el contenido igual", async () => {
    const restore = withReducedMotion();
    vi.useFakeTimers();
    try {
      // `@vue/test-utils` stubea `Transition` por defecto; sin el stub corren los
      // hooks de altura, que son justo los que deben quedar inertes.
      const w = mount(Collapse, {
        props: { label: "L", defaultOpen: true },
        global: { stubs: { transition: false } },
      });
      const el = content(w).element as HTMLElement;

      vm(w).close();
      await nextTick();
      await vi.advanceTimersByTimeAsync(400);
      expect(el.getAttribute("style") ?? "").not.toContain("height");

      const styles: (string | null)[] = [];
      const observer = new MutationObserver((records) => {
        for (const record of records) styles.push(record.oldValue);
      });
      observer.observe(el, {
        attributes: true,
        attributeFilter: ["style"],
        attributeOldValue: true,
      });

      vm(w).open();
      await nextTick();
      await vi.advanceTimersByTimeAsync(400);
      for (const record of observer.takeRecords()) styles.push(record.oldValue);
      observer.disconnect();
      styles.push(el.getAttribute("style"));

      expect(vm(w).isOpen()).toBe(true);
      // La altura nunca pasa por un valor inline intermedio (height: 0): con la
      // transición CSS desactivada, el contenido aparece de una y puede crecer.
      expect(styles.some((style) => (style ?? "").includes("height"))).toBe(false);
      expect(el.getAttribute("style") ?? "").not.toContain("display: none");
    } finally {
      vi.useRealTimers();
      restore();
    }
  });
});
