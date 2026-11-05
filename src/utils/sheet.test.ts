// Comportamiento del core de archivos (src/utils/sheet.ts): es la única
// implementación de exportación que usan AdvancedTable, ExportButton y CellsImporter.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as XLSX from "xlsx";
import {
  buildCSV,
  buildSheetRows,
  buildXLSX,
  defaultSheetFilename,
  downloadSheet,
  getSheetPayload,
  isSheetFormat,
  triggerDownload,
  type SheetColumn,
} from "./sheet";

const COLUMNS: SheetColumn[] = [
  { key: "name", label: "Nombre", width: 20 },
  { key: "age", label: "Edad", type: "integer", format: "0" },
  { key: "secret", label: "Secreto", exportable: false },
];

const ROWS = [
  { name: "Ana", age: 30, secret: "x", __actions__: "ignored" },
  { name: "Beto", age: 41, secret: "y" },
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

const anchor = () => {
  expect(clicks).toHaveLength(1);
  return clicks[0]!;
};

describe("sheet — nombre y formato", () => {
  it("el nombre por defecto es export-YYYY-MM-DD con dos dígitos", () => {
    expect(defaultSheetFilename(new Date(2024, 1, 5))).toBe("export-2024-02-05");
  });

  it("reconoce sólo xlsx y csv", () => {
    expect(isSheetFormat("xlsx")).toBe(true);
    expect(isSheetFormat("csv")).toBe(true);
    expect(isSheetFormat("pdf")).toBe(false);
    expect(isSheetFormat(undefined)).toBe(false);
  });
});

describe("sheet — filas y columnas", () => {
  it("deja fuera las columnas con exportable:false y no copia keys ajenas", () => {
    const result = buildSheetRows(ROWS, COLUMNS);
    expect(result.columns.map((c) => c.key)).toEqual(["name", "age"]);
    expect(result.rows).toEqual([
      { name: "Ana", age: 30 },
      { name: "Beto", age: 41 },
    ]);
  });
});

describe("sheet — CSV", () => {
  it("usa las etiquetas como encabezado y una fila por registro", () => {
    const csv = buildCSV(buildSheetRows(ROWS, COLUMNS).rows, buildSheetRows(ROWS, COLUMNS).columns);
    expect(csv).toBe("Nombre,Edad\nAna,30\nBeto,41\n");
  });

  it("escapa comillas, saltos y el separador", () => {
    const csv = buildCSV(
      [{ text: 'dice "hola"', multi: "a\nb", semi: "x;y" }],
      [
        { key: "text", label: "Texto" },
        { key: "multi", label: "Multi" },
        { key: "semi", label: "Semi" },
      ],
      ";",
    );
    expect(csv).toBe('Texto;Multi;Semi\n"dice ""hola""";"a\nb";"x;y"\n');
  });

  it("resuelve null/undefined/fechas", () => {
    const csv = buildCSV(
      [{ a: null, b: undefined, c: new Date("2024-01-02T03:04:05.000Z") }],
      [
        { key: "a", label: "A" },
        { key: "b", label: "B" },
        { key: "c", label: "C" },
      ],
    );
    expect(csv).toBe("A,B,C\n,,2024-01-02T03:04:05.000Z\n");
  });
});

describe("sheet — XLSX", () => {
  it("genera un libro legible con encabezado, filas y formato de celda", () => {
    const { columns, rows } = buildSheetRows(ROWS, COLUMNS);
    const bytes = buildXLSX(rows, columns, { sheetName: "Personas" });
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.byteLength).toBeGreaterThan(0);

    const wb = XLSX.read(bytes, { type: "array", cellStyles: true });
    expect(wb.SheetNames).toEqual(["Personas"]);
    const sheet = wb.Sheets.Personas!;
    expect(sheet["A1"]!.v).toBe("Nombre");
    expect(sheet["B2"]!.v).toBe(30);
    expect(sheet["!autofilter"]!.ref).toBe("A1:B3");
    expect(sheet["B2"]!.z).toBe("0");
    // el encabezado queda con el formato general, sin heredar el de la columna
    expect(sheet["B1"]!.z).toBe("General");
  });

  it("sin columnas no rompe y no inventa rangos", () => {
    const bytes = buildXLSX([], []);
    const wb = XLSX.read(bytes, { type: "array", cellStyles: true });
    expect(wb.SheetNames).toEqual(["Datos"]);
  });
});

describe("sheet — payload", () => {
  it("cuenta sobre las columnas exportables y calcula el nombre con extensión", () => {
    expect(getSheetPayload(ROWS, COLUMNS, { filename: "personas" })).toEqual({
      format: "xlsx",
      fileName: "personas.xlsx",
      rowCount: 2,
      columnCount: 2,
      cellCount: 4,
      heavy: false,
    });
  });

  it("no duplica la extensión y respeta el formato csv", () => {
    expect(getSheetPayload(ROWS, COLUMNS, { filename: "personas.csv", format: "csv" }).fileName).toBe(
      "personas.csv",
    );
    expect(getSheetPayload(ROWS, COLUMNS, { filename: "personas" , format: "csv" }).fileName).toBe(
      "personas.csv",
    );
  });

  it("marca heavy con el umbral por defecto y con uno explícito", () => {
    const many = Array.from({ length: 5_001 }, (_, index) => ({ name: `n${index}`, age: index }));
    expect(getSheetPayload(many, COLUMNS).heavy).toBe(true);
    expect(getSheetPayload(ROWS, COLUMNS, { heavyThreshold: 1 }).heavy).toBe(true);
    expect(getSheetPayload(ROWS, COLUMNS, { heavyThreshold: 100 }).heavy).toBe(false);
  });
});

describe("sheet — descarga", () => {
  it("xlsx: dispara la descarga con el nombre y el MIME correctos", () => {
    const payload = downloadSheet(ROWS, COLUMNS, { filename: "personas" });
    expect(payload?.fileName).toBe("personas.xlsx");
    expect(anchor().download).toBe("personas.xlsx");
    expect(blobs[0]!.type).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  });

  it("csv: antepone BOM y usa el separador indicado", async () => {
    downloadSheet(ROWS, COLUMNS, { format: "csv", delimiter: ";", filename: "personas" });
    expect(anchor().download).toBe("personas.csv");
    expect(blobs[0]!.type).toBe("text/csv;charset=utf-8");
    const bytes = new Uint8Array(await blobs[0]!.arrayBuffer());
    // BOM UTF-8 explícito: sin él, Excel rompe los acentos del CSV.
    expect([...bytes.slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
    const text = new TextDecoder().decode(bytes);
    expect(text).toContain("Nombre;Edad");
  });

  it("sin descarga si `beforeDownload` devuelve false", () => {
    const seen: unknown[] = [];
    const result = downloadSheet(ROWS, COLUMNS, {}, (payload) => {
      seen.push(payload);
      return false;
    });
    expect(result).toBeNull();
    expect(seen).toHaveLength(1);
    expect(clicks).toHaveLength(0);
    expect(blobs).toHaveLength(0);
  });

  it("`beforeDownload` recibe el resumen final y puede dejar pasar", () => {
    const payload = downloadSheet(ROWS, COLUMNS, { format: "csv" }, (summary) => {
      expect(summary).toEqual({
        format: "csv",
        fileName: expect.stringMatching(/^export-\d{4}-\d{2}-\d{2}\.csv$/),
        rowCount: 2,
        columnCount: 2,
        cellCount: 4,
        heavy: false,
      });
    });
    expect(payload?.format).toBe("csv");
    expect(clicks).toHaveLength(1);
  });

  it("triggerDownload revoca la URL después", () => {
    vi.useFakeTimers();
    triggerDownload(new Blob(["x"]), "x.txt");
    expect(anchor().download).toBe("x.txt");
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock");
    vi.useRealTimers();
  });
});
