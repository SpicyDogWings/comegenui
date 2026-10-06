// Comportamiento de CellsImporter según su ficha (docs/componentes/vue/cells-importer.md).
//
// Aserciones escritas a mano desde la prosa: fallan por bugs reales.
import { describe, it, expect, vi, beforeAll } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import CellsImporter from "./CellsImporter.vue";

type Row = Record<string, unknown>;
type Error = { row: number; columnKey: string; columnLabel: string; message: string };

type CellsImporterVm = {
  getRows: () => Row[];
  getHeaders: () => string[];
  getErrors: () => Error[];
  getFile: () => File | null;
  validate: () => Error[];
  reset: () => void;
  set: (f: File | null) => void;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as CellsImporterVm;

const COLUMNS = [
  { key: "name", label: "Nombre", required: true },
  { key: "dni", label: "DNI", type: "integer" as const },
  { key: "email", label: "Email", type: "email" as const },
];

function makeCsvFile(content: string, name = "demo.csv"): File {
  return new File([content], name, { type: "text/csv" });
}

const HEADER = "Nombre,DNI,Email\n";

beforeAll(() => {
  if (!URL.createObjectURL) URL.createObjectURL = vi.fn(() => "blob:mock");
  if (!URL.revokeObjectURL) URL.revokeObjectURL = vi.fn();
});

async function loadCsv(w: ReturnType<typeof mount>, content: string) {
  vm(w).set(makeCsvFile(content));
  await vi.waitFor(() => {
    if (vm(w).getHeaders().length === 0) throw new Error("parseando");
  });
  await flushPromises();
}

describe("CellsImporter — parseo", () => {
  it("parsea un CSV válido: filas, headers y emite parse", async () => {
    const w = mount(CellsImporter, { props: { columns: COLUMNS } });
    await loadCsv(w, HEADER + "Juan,30500000,juan@x.com\nAna,31000000,ana@x.com\n");

    expect(vm(w).getHeaders()).toEqual(["Nombre", "DNI", "Email"]);
    expect(vm(w).getRows()).toHaveLength(2);
    expect(vm(w).getRows()[0]).toMatchObject({ name: "Juan", dni: 30500000, email: "juan@x.com" });
    expect(w.emitted("parse")).toBeTruthy();
    expect(w.emitted("parse")?.[0]?.[0]).toMatchObject({ fileName: "demo.csv" });
  });

  it("valida los datos y emite error con los problemas encontrados", async () => {
    const w = mount(CellsImporter, { props: { columns: COLUMNS } });
    // email inválido + required vacío en la segunda fila
    await loadCsv(w, HEADER + "Juan,30500000,no-es-email\n,31000000,ana@x.com\n");

    const errors = vm(w).getErrors();
    expect(errors.length).toBeGreaterThanOrEqual(2);
    expect(errors.some((e) => e.columnKey === "email")).toBe(true);
    expect(errors.some((e) => e.columnKey === "name")).toBe(true);
    expect(w.emitted("error")).toBeTruthy();
  });

  it("matchea columnas por label sin importar el orden del archivo (strict=false)", async () => {
    const w = mount(CellsImporter, { props: { columns: COLUMNS } });
    await loadCsv(w, "Email,Nombre,DNI\nana@x.com,Ana,31000000\n");

    expect(vm(w).getRows()[0]).toMatchObject({ name: "Ana", dni: 31000000, email: "ana@x.com" });
  });

  it("coacciona el tipo de las celdas (integer)", async () => {
    const w = mount(CellsImporter, { props: { columns: COLUMNS } });
    await loadCsv(w, HEADER + "Juan,30500000,juan@x.com\n");

    expect(vm(w).getRows()[0]!.dni).toBe(30500000);
    expect(typeof vm(w).getRows()[0]!.dni).toBe("number");
  });
});

describe("CellsImporter — exposición y resumen", () => {
  it("getFile() devuelve el archivo cargado y getErrors/getRows arrancan vacíos", () => {
    const w = mount(CellsImporter, { props: { columns: COLUMNS } });
    expect(vm(w).getFile()).toBeNull();
    expect(vm(w).getRows()).toEqual([]);
    expect(vm(w).getErrors()).toEqual([]);
  });

  it("muestra el resumen de filas OK y con errores", async () => {
    const w = mount(CellsImporter, { props: { columns: COLUMNS } });
    await loadCsv(w, HEADER + "Juan,1,juan@x.com\n,2,mal\n");

    expect(w.find(".cu-cells-importer-summary-ok").text()).toContain("filas OK");
    expect(w.find(".cu-cells-importer-summary-bad").text()).toContain("con errores");
  });

  it("reset() limpia archivo y resultados", async () => {
    const w = mount(CellsImporter, { props: { columns: COLUMNS } });
    await loadCsv(w, HEADER + "Juan,1,juan@x.com\n");
    expect(vm(w).getRows().length).toBeGreaterThan(0);

    vm(w).reset();
    await flushPromises();

    expect(vm(w).getFile()).toBeNull();
    expect(vm(w).getRows()).toEqual([]);
    expect(vm(w).getHeaders()).toEqual([]);
  });
});

describe("CellsImporter — plantilla", () => {
  it("el botón Descargar plantilla solo aparece con enabled y columnas", () => {
    const sin = mount(CellsImporter, { props: { columns: COLUMNS } });
    expect(sin.find(".cu-cells-importer-toolbar button").exists()).toBe(false);

    const con = mount(CellsImporter, {
      props: { columns: COLUMNS, template: { enabled: true, type: "csv" } },
    });
    expect(con.find(".cu-cells-importer-toolbar button").text()).toContain("Descargar plantilla");
  });

  it("downloadTemplate() no hace nada si no hay columnas", () => {
    const w = mount(CellsImporter, { props: { columns: [] } });
    const spy = vi.spyOn(document, "createElement");
    (w.vm as unknown as { downloadTemplate: () => void }).downloadTemplate();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
