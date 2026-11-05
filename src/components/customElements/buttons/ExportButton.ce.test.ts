// Comportamiento del custom element `cu-export-button`: mismas props/métodos/eventos
// que el ExportButton Vue, con el payload en `e.detail`.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineCustomElement, nextTick } from "vue";
import ExportButtonCe from "@/components/customElements/buttons/ExportButton.ce.vue";

const TAG = "cu-export-button-test";
if (!customElements.get(TAG)) {
  customElements.define(TAG, defineCustomElement(ExportButtonCe));
}

type Payload = {
  format: "xlsx" | "csv";
  fileName: string;
  rowCount: number;
  columnCount: number;
  cellCount: number;
  heavy: boolean;
};

interface ExportButtonElement extends HTMLElement {
  data: Record<string, unknown>[];
  columns: { key: string; label: string }[];
  format: "xlsx" | "csv";
  manual: boolean;
  disabled: boolean;
  label: string;
  setData: (rows: Record<string, unknown>[], columns?: { key: string; label: string }[]) => void;
  setOptions: (options: Record<string, unknown>) => void;
  download: () => Payload | null;
  getPayload: () => Payload;
}

const COLUMNS = [
  { key: "name", label: "Nombre" },
  { key: "age", label: "Edad" },
];
const ROWS = [
  { name: "Ana", age: 30 },
  { name: "Beto", age: 41 },
];

let downloads: HTMLAnchorElement[];

beforeEach(() => {
  downloads = [];
  URL.createObjectURL = vi.fn(() => "blob:mock") as unknown as typeof URL.createObjectURL;
  URL.revokeObjectURL = vi.fn() as unknown as typeof URL.revokeObjectURL;
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    downloads.push(this);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

async function mountCe(configure: (el: ExportButtonElement) => void = () => {}) {
  const el = document.createElement(TAG) as ExportButtonElement;
  el.data = ROWS;
  el.columns = COLUMNS;
  configure(el);
  document.body.appendChild(el);
  await nextTick();
  return el;
}

const button = (el: HTMLElement) => el.shadowRoot!.querySelector("button")!;

describe("cu-export-button — render y descarga", () => {
  it("rinde el botón con el label por defecto y descarga al click", async () => {
    const el = await mountCe();
    expect(button(el).textContent).toContain("Descargar Excel");

    button(el).click();
    await nextTick();

    expect(downloads).toHaveLength(1);
    expect(downloads[0]!.download).toMatch(/^export-\d{4}-\d{2}-\d{2}\.xlsx$/);
  });

  it("formato csv cambia label y extensión", async () => {
    const el = await mountCe((node) => {
      node.format = "csv";
      node.label = "Bajar CSV";
    });
    expect(button(el).textContent).toContain("Bajar CSV");

    button(el).click();
    await nextTick();
    expect(downloads[0]!.download).toMatch(/\.csv$/);
  });

  it("deshabilitado no descarga ni emite eventos", async () => {
    const el = await mountCe((node) => {
      node.disabled = true;
    });
    const events: string[] = [];
    for (const name of ["trigger", "download", "before-download", "heavy", "error"]) {
      el.addEventListener(name, () => events.push(name));
    }
    button(el).click();
    await nextTick();

    expect(downloads).toHaveLength(0);
    expect(events).toEqual([]);
  });
});

describe("cu-export-button — eventos en el host", () => {
  it("`manual` emite `trigger` con el resumen y no descarga", async () => {
    const el = await mountCe((node) => {
      node.manual = true;
    });
    const triggers: Payload[] = [];
    el.addEventListener("trigger", (event) => triggers.push((event as CustomEvent).detail));

    button(el).click();
    await nextTick();

    expect(downloads).toHaveLength(0);
    expect(triggers).toHaveLength(1);
    expect(triggers[0]).toMatchObject({ rowCount: 2, columnCount: 2, cellCount: 4 });
  });

  it("`before-download` llega al host y `cancel()` evita la descarga", async () => {
    const el = await mountCe((node) => {
      node.label = "";
    });
    const details: unknown[] = [];
    el.addEventListener("before-download", (event) => {
      const detail = (event as CustomEvent).detail;
      details.push(detail);
      detail.cancel();
    });

    button(el).click();
    await nextTick();

    expect(details).toHaveLength(1);
    expect(downloads).toHaveLength(0);
  });

  it("`download` y `heavy` salen con el payload", async () => {
    const el = await mountCe((node) => {
      node.columns = [{ key: "name", label: "Nombre" }];
      node.data = Array.from({ length: 10_050 }, (_, index) => ({ name: `n${index}` }));
    });
    const downloadsEvents: Payload[] = [];
    const heavies: Payload[] = [];
    el.addEventListener("download", (event) => downloadsEvents.push((event as CustomEvent).detail));
    el.addEventListener("heavy", (event) => heavies.push((event as CustomEvent).detail));

    button(el).click();
    await nextTick();

    expect(heavies).toHaveLength(1);
    expect(heavies[0]).toMatchObject({ heavy: true, rowCount: 10_050 });
    expect(downloadsEvents).toHaveLength(1);
    expect(downloads[0]!.download).toBe(downloadsEvents[0]!.fileName);
  });
});

describe("cu-export-button — API programática", () => {
  it("expone setData/setOptions/getPayload/download", async () => {
    const el = await mountCe();
    expect(typeof el.setData).toBe("function");
    expect(typeof el.setOptions).toBe("function");
    expect(typeof el.getPayload).toBe("function");
    expect(typeof el.download).toBe("function");

    expect(el.getPayload()).toMatchObject({ rowCount: 2, columnCount: 2 });
    el.setData([{ name: "Solo", age: 1 }], [{ key: "name", label: "Nombre" }]);
    expect(el.getPayload()).toMatchObject({ rowCount: 1, columnCount: 1 });

    el.setOptions({ filename: "vanilla", format: "csv" });
    expect(el.getPayload()).toMatchObject({ fileName: "vanilla.csv" });

    const payload = el.download();
    expect(payload?.fileName).toBe("vanilla.csv");
    expect(downloads[0]!.download).toBe("vanilla.csv");
  });
});
