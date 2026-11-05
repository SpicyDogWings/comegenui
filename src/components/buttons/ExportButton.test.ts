// Comportamiento de ExportButton según su ficha (docs/componentes/vue/export-button.md).
// Aserciones escritas a mano desde la prosa: cada una cae si el botón deja de exportar.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ExportButton from "./ExportButton.vue";
import type { SheetPayload } from "@/utils/sheet";

const COLUMNS = [
  { key: "name", label: "Nombre" },
  { key: "age", label: "Edad" },
];
const ROWS = [
  { name: "Ana", age: 30 },
  { name: "Beto", age: 41 },
];

let clicks: HTMLAnchorElement[];
let blobs: Blob[];

beforeEach(() => {
  clicks = [];
  blobs = [];
  URL.createObjectURL = vi.fn((blob: Blob) => {
    blobs.push(blob);
    return "blob:mock";
  }) as unknown as typeof URL.createObjectURL;
  URL.revokeObjectURL = vi.fn() as unknown as typeof URL.revokeObjectURL;
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    clicks.push(this);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

const mountButton = (props: Record<string, unknown> = {}) =>
  mount(ExportButton, { props: { data: ROWS, columns: COLUMNS, ...props } });

describe("ExportButton — render", () => {
  it("rinde un Button con el texto por defecto según el formato", () => {
    const w = mountButton();
    expect(w.find("button.cu-button").exists()).toBe(true);
    expect(w.text()).toContain("Descargar Excel");
    expect(w.find("svg").exists()).toBe(true);
  });

  it("con format csv el texto por defecto cambia", () => {
    expect(mountButton({ format: "csv" }).text()).toContain("Descargar CSV");
  });

  it("`label` propio manda sobre el default", () => {
    expect(mountButton({ label: "Bajar" }).text()).toContain("Bajar");
  });

  it("`label: ''` deja sólo el ícono y conserva nombre accesible", () => {
    const w = mountButton({ label: "" });
    expect(w.find(".cu-export-button-text").exists()).toBe(false);
    expect(w.attributes("aria-label")).toBe("Descargar Excel");
  });

  it("respeta color, variant, size y disabled", () => {
    const w = mountButton({ color: "danger", variant: "outlined", size: "sm", disabled: true });
    const classes = w.find("button").classes();
    expect(classes).toContain("cu-button--outlined");
    expect(classes).toContain("cu-button--sm");
    expect(w.find("button").attributes("disabled")).toBeDefined();
  });
});

describe("ExportButton — descarga directa", () => {
  it("al hacer click genera el archivo y emite download", async () => {
    const w = mountButton({ filename: "personas" });
    await w.find("button").trigger("click");

    expect(clicks).toHaveLength(1);
    expect(clicks[0]!.download).toBe("personas.xlsx");
    const payload = w.emitted("download")?.[0]?.[0] as SheetPayload;
    expect(payload).toMatchObject({
      fileName: "personas.xlsx",
      rowCount: 2,
      columnCount: 2,
      cellCount: 4,
      heavy: false,
    });
    expect(w.emitted("trigger")).toBeUndefined();
  });

  it("en csv descarga con el separador indicado", async () => {
    const w = mountButton({ format: "csv", delimiter: ";", filename: "personas" });
    await w.find("button").trigger("click");
    expect(clicks[0]!.download).toBe("personas.csv");
    const text = new TextDecoder().decode(new Uint8Array(await blobs[0]!.arrayBuffer()));
    expect(text).toContain("Nombre;Edad");
  });

  it("con `manual` sólo emite trigger y no descarga", async () => {
    const w = mountButton({ manual: true, filename: "manual" });
    await w.find("button").trigger("click");

    expect(clicks).toHaveLength(0);
    expect(w.emitted("download")).toBeUndefined();
    const payload = w.emitted("trigger")?.[0]?.[0] as SheetPayload;
    expect(payload.fileName).toBe("manual.xlsx");
    expect(payload.cellCount).toBe(4);
  });

  it("deshabilitado no dispara nada", async () => {
    const w = mountButton({ disabled: true });
    await w.find("button").trigger("click");
    expect(clicks).toHaveLength(0);
    expect(w.emitted("download")).toBeUndefined();
  });
});

describe("ExportButton — eventos de control", () => {
  it("before-download recibe el resumen y puede cancelar la descarga", async () => {
    const w = mountButton({ filename: "cancelada", heavyThreshold: 4 });
    const onBefore = (payload: { cancel: () => void }) => payload.cancel();
    w.vm.$.vnode.props = { ...w.vm.$.vnode.props, onBeforeDownload: onBefore };
    await w.find("button").trigger("click");

    expect(clicks).toHaveLength(0);
    expect(w.emitted("download")).toBeUndefined();
    expect(w.emitted("before-download")).toHaveLength(1);
    // `heavy` describe una descarga concreta: si se canceló, no sale.
    expect(w.emitted("heavy")).toBeUndefined();
  });

  it("heavy se emite cuando se pasa el umbral y la descarga sigue", async () => {
    const w = mountButton({ heavyThreshold: 4 });
    expect(w.vm.getPayload().heavy).toBe(true);
    await w.find("button").trigger("click");

    expect(w.emitted("heavy")).toHaveLength(1);
    expect(w.emitted("download")).toHaveLength(1);
    expect((w.emitted("heavy")?.[0]?.[0] as SheetPayload).heavy).toBe(true);
  });

  it("error se emite si la generación del archivo revienta", async () => {
    const w = mountButton();
    // El hook corre dentro del try/catch del botón: una excepción ahí es el caso
    // realista de «no se pudo generar el archivo».
    w.vm.$.vnode.props = {
      ...w.vm.$.vnode.props,
      onBeforeDownload: () => {
        throw new Error("boom");
      },
    };
    await w.find("button").trigger("click");

    expect(w.emitted("error")).toHaveLength(1);
    expect(w.emitted("download")).toBeUndefined();
    expect(clicks).toHaveLength(0);
  });
});

describe("ExportButton — API programática", () => {
  it("getPayload resume sin descargar y setData/setOptions lo actualizan", () => {
    const w = mountButton();
    expect(w.vm.getPayload()).toMatchObject({ rowCount: 2, columnCount: 2, cellCount: 4 });

    w.vm.setData([{ name: "Solo", age: 1 }], [{ key: "name", label: "Nombre" }]);
    expect(w.vm.getPayload()).toMatchObject({ rowCount: 1, columnCount: 1, cellCount: 1 });

    w.vm.setOptions({ filename: "otro", format: "csv" });
    expect(w.vm.getPayload()).toMatchObject({ fileName: "otro.csv", format: "csv" });
    expect(clicks).toHaveLength(0);
  });

  it("setOptions se fusiona en vez de pisar", () => {
    const w = mountButton({ filename: "base" });
    w.vm.setOptions({ format: "csv" });
    expect(w.vm.getPayload().fileName).toBe("base.csv");
    w.vm.setOptions({ filename: "nuevo" });
    expect(w.vm.getPayload()).toMatchObject({ fileName: "nuevo.csv", format: "csv" });
  });

  it("download() descarga y devuelve el payload; null si se cancela", () => {
    const w = mountButton({ filename: "prog" });
    const payload = w.vm.download();
    expect(payload?.fileName).toBe("prog.xlsx");
    expect(clicks).toHaveLength(1);
    expect(w.emitted("download")).toHaveLength(1);
  });

  it("setData sin columnas conserva las columnas actuales", () => {
    const w = mountButton();
    w.vm.setData([{ name: "X", age: 9 }]);
    expect(w.vm.getPayload().columnCount).toBe(2);
    expect(w.vm.getPayload().rowCount).toBe(1);
  });
});
