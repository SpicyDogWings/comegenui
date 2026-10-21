// Comportamiento de Skeleton según su ficha (docs/versiones/5.2.0/componentes/vue/skeleton.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect } from "vitest";
import { defineCustomElement, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import Skeleton from "./Skeleton.vue";
import SkeletonCe from "../customElements/information/Skeleton.ce.vue";

const root = (w: ReturnType<typeof mount>) => w.find(".cu-skeleton");
const styleVar = (w: ReturnType<typeof mount>, name: string) =>
  (root(w).element as HTMLElement).style.getPropertyValue(name);

describe("Skeleton — forma y tamaño", () => {
  it("por defecto es un bloque rect (un solo bar) y decorativo", () => {
    const w = mount(Skeleton);
    expect(root(w).classes()).toContain("cu-skeleton--rect");
    expect(w.findAll(".cu-skeleton-bar")).toHaveLength(1);
    expect(root(w).attributes("aria-hidden")).toBe("true");
  });

  it("rect usa 100 % de ancho y 1rem de alto", () => {
    const w = mount(Skeleton);
    expect(styleVar(w, "--cu-skeleton-width")).toBe("100%");
    expect(styleVar(w, "--cu-skeleton-height")).toBe("1rem");
  });

  it("circle mide 40px por 40px y es full por defecto", () => {
    const w = mount(Skeleton, { props: { shape: "circle" } });
    expect(root(w).classes()).toContain("cu-skeleton--circle");
    expect(styleVar(w, "--cu-skeleton-width")).toBe("40px");
    expect(styleVar(w, "--cu-skeleton-height")).toBe("40px");
    expect(styleVar(w, "--cu-skeleton-radius")).toBe("var(--cu-radius-full)");
    expect(w.findAll(".cu-skeleton-bar")).toHaveLength(1);
  });

  it("text usa 0.875em de alto por línea y sm por defecto", () => {
    const w = mount(Skeleton, { props: { shape: "text" } });
    expect(root(w).classes()).toContain("cu-skeleton--text");
    expect(styleVar(w, "--cu-skeleton-width")).toBe("100%");
    expect(styleVar(w, "--cu-skeleton-height")).toBe("0.875em");
    expect(styleVar(w, "--cu-skeleton-radius")).toBe("var(--cu-radius-sm)");
  });

  it("width y height pisan el default del shape, tal cual el CSS recibido", () => {
    const w = mount(Skeleton, {
      props: { shape: "circle", width: "48px", height: "3rem" },
    });
    expect(styleVar(w, "--cu-skeleton-width")).toBe("48px");
    expect(styleVar(w, "--cu-skeleton-height")).toBe("3rem");
  });

  it("el radius explícito gana sobre el default del shape", () => {
    const w = mount(Skeleton, { props: { shape: "text", radius: "lg" } });
    expect(root(w).classes()).toContain("cu-skeleton--radius-lg");
    expect(styleVar(w, "--cu-skeleton-radius")).toBe("var(--cu-radius-lg)");
  });
});

describe("Skeleton — líneas de texto", () => {
  it("renderiza N barras y la última es más corta", () => {
    const w = mount(Skeleton, { props: { shape: "text", lines: 3 } });
    const bars = w.findAll(".cu-skeleton-bar");
    expect(bars).toHaveLength(3);
    expect(bars[0]!.classes()).not.toContain("cu-skeleton-bar--short");
    expect(bars[1]!.classes()).not.toContain("cu-skeleton-bar--short");
    expect(bars[2]!.classes()).toContain("cu-skeleton-bar--short");
  });

  it("una sola línea ocupa todo el ancho (no se acorta)", () => {
    const w = mount(Skeleton, { props: { shape: "text", lines: 1 } });
    expect(w.findAll(".cu-skeleton-bar")).toHaveLength(1);
    expect(w.find(".cu-skeleton-bar").classes()).not.toContain("cu-skeleton-bar--short");
  });

  it("en rect y circle `lines` se ignora", () => {
    for (const shape of ["rect", "circle"] as const) {
      const w = mount(Skeleton, { props: { shape, lines: 4 } });
      expect(w.findAll(".cu-skeleton-bar")).toHaveLength(1);
    }
  });
});

describe("Skeleton — animación y color", () => {
  it("cada animación aplica su clase (pulse es la default)", () => {
    expect(root(mount(Skeleton)).classes()).toContain("cu-skeleton--pulse");
    for (const animation of ["pulse", "wave", "none"] as const) {
      const w = mount(Skeleton, { props: { animation } });
      expect(root(w).classes()).toContain(`cu-skeleton--${animation}`);
    }
  });

  it("el color se resuelve con tokens del tema, nunca con un hex", () => {
    const w = mount(Skeleton, { props: { color: "primary" } });
    expect(styleVar(w, "--cu-skeleton-bg")).toBe("var(--cu-color-primary-soft)");
    expect(styleVar(w, "--cu-skeleton-highlight")).toBe("var(--cu-color-primary-subtle)");
    expect(root(w).attributes("style") ?? "").not.toMatch(/#[0-9a-f]{3,8}/i);
  });

  it("cada color semántico apunta a sus tokens soft/subtle", () => {
    for (const color of ["primary", "secondary", "neutral", "success", "warning", "danger"] as const) {
      const w = mount(Skeleton, { props: { color } });
      expect(styleVar(w, "--cu-skeleton-bg")).toBe(`var(--cu-color-${color}-soft)`);
      expect(styleVar(w, "--cu-skeleton-highlight")).toBe(`var(--cu-color-${color}-subtle)`);
    }
  });
});

describe("Skeleton — custom element", () => {
  const CuSkeletonTest = defineCustomElement(SkeletonCe);
  if (!customElements.get("cu-skeleton-test")) {
    customElements.define("cu-skeleton-test", CuSkeletonTest);
  }

  async function mountCe(html: string) {
    document.body.innerHTML = html;
    const host = document.body.firstElementChild as HTMLElement;
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const inner = [...(host.shadowRoot?.children ?? [])].find(
      (node) => node.tagName !== "STYLE",
    ) as HTMLElement;
    return { host, inner };
  }

  it("mapea los atributos a la API del componente", async () => {
    const { inner } = await mountCe(
      '<cu-skeleton-test shape="circle" width="64px" height="64px" animation="wave" color="primary" radius="sm"></cu-skeleton-test>',
    );
    expect(inner.classList.contains("cu-skeleton--circle")).toBe(true);
    expect(inner.classList.contains("cu-skeleton--wave")).toBe(true);
    expect(inner.classList.contains("cu-skeleton--radius-sm")).toBe(true);
    expect(inner.style.getPropertyValue("--cu-skeleton-width")).toBe("64px");
    expect(inner.style.getPropertyValue("--cu-skeleton-height")).toBe("64px");
    expect(inner.style.getPropertyValue("--cu-skeleton-bg")).toBe("var(--cu-color-primary-soft)");
    expect(inner.getAttribute("aria-hidden")).toBe("true");
  });

  it("`lines` llega como número y renderiza N barras", async () => {
    const { inner } = await mountCe('<cu-skeleton-test shape="text" lines="3"></cu-skeleton-test>');
    const bars = inner.querySelectorAll(".cu-skeleton-bar");
    expect(bars).toHaveLength(3);
    expect(bars[2]!.classList.contains("cu-skeleton-bar--short")).toBe(true);
  });
});
