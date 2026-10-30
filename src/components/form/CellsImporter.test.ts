// Comportamiento de CellsImporter según su ficha (docs/componentes/vue/cells-importer.md).
//
// Aserciones escritas a mano desde la prosa: fallan por bugs reales.
import { describe, it, expect, vi, beforeAll } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import * as XLSX from "xlsx";
import CellsImporter from "./CellsImporter.vue";
import { parseCSV, parseFile, type CellParseResult } from "../../utils/cellsImporter";

// `parseFile` queda espiable para poder retener un parseo y resolverlo tarde.
vi.mock("../../utils/cellsImporter", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../utils/cellsImporter")>();
  return { ...actual, parseFile: vi.fn(actual.parseFile) };
});

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
  downloadTemplate: () => void;
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

/** Parseo retenido: el test decide cuándo termina. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

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

  it("con readOnly o disabled no se ofrece quitar el archivo", async () => {
    const readOnly = mount(CellsImporter, { props: { columns: COLUMNS, readOnly: true } });
    await loadCsv(readOnly, HEADER + "Ana,1,ana@x.com\n");
    expect(readOnly.find(".cu-cells-importer-summary").exists()).toBe(true);
    expect(readOnly.find(".cu-cells-importer-summary button").exists()).toBe(false);

    const disabled = mount(CellsImporter, { props: { columns: COLUMNS, disabled: true } });
    await loadCsv(disabled, HEADER + "Ana,1,ana@x.com\n");
    expect(disabled.find(".cu-cells-importer-summary button").exists()).toBe(false);
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

describe("CellsImporter — CSV: BOM, comillas y separador", () => {
  it("el BOM de la plantilla no contamina el primer encabezado", () => {
    expect(parseCSV("\uFEFFNombre,DNI\nAna,30\n")[0]).toEqual(["Nombre", "DNI"]);
  });

  it("sin encabezado, el BOM no contamina la primera celda", () => {
    expect(parseCSV("\uFEFFAna;30\n", ";")[0]).toEqual(["Ana", "30"]);
  });

  it("respeta comillas, comas y saltos de línea internos con separador `;`", () => {
    const rows = parseCSV('Nombre;DNI\n"Apellido, Nombre";30\n"Multi\nlínea";40\n', ";");
    expect(rows).toEqual([
      ["Nombre", "DNI"],
      ["Apellido, Nombre", "30"],
      ["Multi\nlínea", "40"],
    ]);
  });

  it("lee un CSV con separador `;` desde el importer", async () => {
    const w = mount(CellsImporter, { props: { columns: COLUMNS, delimiter: ";" } });
    vm(w).set(makeCsvFile("Nombre;DNI;Email\nAna;30;ana@x.com\n"));
    await vi.waitFor(() => {
      if (vm(w).getHeaders().length === 0) throw new Error("parseando");
    });

    expect(vm(w).getRows()[0]).toMatchObject({ name: "Ana", dni: 30, email: "ana@x.com" });
  });
});

describe("CellsImporter — xlsx", () => {
  it("lee una celda con formato de fecha como Date (no como número de serie)", async () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Nombre", "Fecha"],
      ["Ana", new Date(2020, 11, 30)],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hoja1");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const columns = [
      { key: "name", label: "Nombre" },
      { key: "fecha", label: "Fecha", type: "date" as const },
    ];
    const w = mount(CellsImporter, { props: { columns } });

    vm(w).set(new File([buf], "datos.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
    await vi.waitFor(() => {
      if (vm(w).getHeaders().length === 0) throw new Error("parseando");
    });

    const fecha = vm(w).getRows()[0]!.fecha;
    expect(fecha).toBeInstanceOf(Date);
    expect((fecha as Date).getFullYear()).toBe(2020);
    expect(vm(w).getErrors()).toEqual([]);
  });
});

describe("CellsImporter — parseo asíncrono y eventos", () => {
  it("un parseo que termina tarde no pisa el archivo actual", async () => {
    const lento = deferred<CellParseResult>();
    vi.mocked(parseFile).mockImplementationOnce(() => lento.promise);
    const w = mount(CellsImporter, { props: { columns: COLUMNS } });

    vm(w).set(makeCsvFile(HEADER + "Ana,1,ana@x.com\n", "a.csv"));
    await flushPromises();
    vm(w).set(makeCsvFile(HEADER + "Beto,2,beto@x.com\n", "b.csv"));
    await vi.waitFor(() => {
      if (vm(w).getRows()[0]?.name !== "Beto") throw new Error("parseando b");
    });

    lento.resolve({ rows: [{ name: "Ana" }], headers: ["Nombre", "DNI", "Email"], warnings: [] });
    await flushPromises();

    expect(vm(w).getRows()[0]).toMatchObject({ name: "Beto" });
  });

  it("quitar el archivo emite change(null) una sola vez", async () => {
    const w = mount(CellsImporter, { props: { columns: COLUMNS } });
    await loadCsv(w, HEADER + "Ana,1,ana@x.com\n");
    const antes = w.emitted("change")?.length ?? 0;

    vm(w).reset();
    await flushPromises();

    const posteriores = (w.emitted("change") ?? []).slice(antes);
    expect(posteriores.filter((args) => args[0] === null)).toHaveLength(1);
  });
});

describe("CellsImporter — plantilla con separador", () => {
  it("genera la plantilla con el separador con el que se importa", async () => {
    const blobs: Blob[] = [];
    const create = vi.spyOn(URL, "createObjectURL").mockImplementation((obj: Blob | MediaSource) => {
      blobs.push(obj as Blob);
      return "blob:plantilla";
    });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const w = mount(CellsImporter, {
      props: { columns: COLUMNS, delimiter: ";", template: { enabled: true, type: "csv" } },
    });

    vm(w).downloadTemplate();
    await flushPromises();

    const bytes = new Uint8Array(await blobs[0]!.arrayBuffer());
    expect([...bytes.slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
    // `Blob.text()` descarta el BOM al decodificar: se lee el contenido ya decodificado.
    const text = new TextDecoder("utf-8").decode(bytes);
    expect(text).toBe("Nombre;DNI;Email\n");
    expect(parseCSV(text, ";")[0]).toEqual(["Nombre", "DNI", "Email"]);
    create.mockRestore();
    click.mockRestore();
  });
});
