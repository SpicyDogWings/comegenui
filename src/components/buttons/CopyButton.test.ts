// Comportamiento de CopyButton según su ficha (docs/componentes/vue/copy-button.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import CopyButton from "./CopyButton.vue";

const writeText = vi.fn(async () => undefined);

beforeEach(() => {
  writeText.mockClear();
  Object.assign(navigator, { clipboard: { writeText } });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CopyButton — copiar al portapapeles", () => {
  it("al hacer click copia el texto de la prop al clipboard", async () => {
    const w = mount(CopyButton, { props: { text: "contenido copiable" } });
    await w.find("button").trigger("click");
    await flushPromises();
    expect(writeText).toHaveBeenCalledWith("contenido copiable");
  });

  it("muestra el `copiedLabel` (default 'Copiado') tras copiar", async () => {
    const w = mount(CopyButton, { props: { text: "x", label: "Copiar" } });
    expect(w.text()).toContain("Copiar");

    await w.find("button").trigger("click");
    await flushPromises();

    expect(w.text()).toContain("Copiado");
    expect(w.text()).not.toContain("Copiar");
  });

  it("respeta un `copiedLabel` personalizado", async () => {
    const w = mount(CopyButton, { props: { text: "x", label: "Copiar", copiedLabel: "¡Listo!" } });
    await w.find("button").trigger("click");
    await flushPromises();
    expect(w.text()).toContain("¡Listo!");
  });

  it("sin `label` no muestra texto, pero tras copiar aparece el copiedLabel", async () => {
    const w = mount(CopyButton, { props: { text: "x" } });
    expect(w.find(".cu-copy-button-text").exists()).toBe(false);

    await w.find("button").trigger("click");
    await flushPromises();

    expect(w.find(".cu-copy-button-text").text()).toBe("Copiado");
  });

  it("el aria-label describe la acción y cambia durante la confirmación", async () => {
    const w = mount(CopyButton, { props: { text: "x", label: "Copiar código" } });
    expect(w.find("button").attributes("aria-label")).toBe("Copiar código");

    await w.find("button").trigger("click");
    await flushPromises();

    expect(w.find("button").attributes("aria-label")).toBe("Copiado");
  });

  it("usa 'Copiar' como aria-label por defecto cuando no hay label", () => {
    const w = mount(CopyButton, { props: { text: "x" } });
    expect(w.find("button").attributes("aria-label")).toBe("Copiar");
  });
});
