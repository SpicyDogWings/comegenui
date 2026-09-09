import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import CellsImporter from "./CellsImporter.vue";
import { parseCSV, parseFile, validateRows, validateValue, buildTemplateCSV } from "@/utils/cellsImporter";
import type { CellColumn } from "@/utils/cellsImporter";

const columns: CellColumn[] = [
  { key: "name", label: "Nombre", required: true },
  { key: "age", label: "Edad", type: "integer", min: 0, max: 120 },
  { key: "email", label: "Email", type: "email" },
];

describe("parseCSV", () => {
  it("respeta comillas y delimitadores dentro de campos", () => {
    const grid = parseCSV('a,"hola, mundo","x ""y"""\n1,2,3');
    expect(grid).toEqual([["a", "hola, mundo", 'x "y"'], ["1", "2", "3"]]);
  });

  it("soporta delimiter custom", () => {
    const grid = parseCSV("a;b\n1;2", ";");
    expect(grid).toEqual([["a", "b"], ["1", "2"]]);
  });
});

describe("validateValue", () => {
  it("requerido", () => {
    expect(validateValue({ key: "a", label: "A", required: true }, "", {})).toBe("Campo obligatorio");
    expect(validateValue({ key: "a", label: "A", required: true }, "x", {})).toBeNull();
  });

  it("tipo integer con rango", () => {
    expect(validateValue({ key: "a", label: "A", type: "integer", min: 0, max: 120 }, "200", {})).toMatch(/menor o igual/);
    expect(validateValue({ key: "a", label: "A", type: "integer", min: 0 }, "-1", {})).toMatch(/mayor o igual/);
    expect(validateValue({ key: "a", label: "A", type: "integer" }, "abc", {})).toMatch(/entero/);
    expect(validateValue({ key: "a", label: "A", type: "integer" }, "42", {})).toBeNull();
  });

  it("tipo email", () => {
    expect(validateValue({ key: "a", label: "A", type: "email" }, "malo", {})).toMatch(/email/);
    expect(validateValue({ key: "a", label: "A", type: "email" }, "a@b.com", {})).toBeNull();
  });

  it("enum y unique", () => {
    expect(validateValue({ key: "a", label: "A", enum: ["x", "y"] }, "z", {})).toMatch(/uno de/);
    expect(validateValue({ key: "a", label: "A", enum: ["x", "y"] }, "x", {})).toBeNull();
  });
});

describe("parseFile + validateRows", () => {
  it("mapea columnas por label ignorando el orden (strict=false)", async () => {
    const file = new File(["Email,Edad,Nombre\nx@y.com,30,Juan"], "d.csv", { type: "text/csv" });
    const { rows } = await parseFile(file, columns, { hasHeader: true, strict: false });
    expect(rows[0]).toMatchObject({ name: "Juan", age: 30, email: "x@y.com" });
    const errors = validateRows(rows, columns);
    expect(errors).toEqual([]);
  });

  it("strict=false ignora columnas sobrantes", async () => {
    const file = new File(["Nombre,Edad,Extra\nAna,25,zzz"], "d.csv", { type: "text/csv" });
    const { rows } = await parseFile(file, columns, { hasHeader: true, strict: false });
    expect(rows[0]).toMatchObject({ name: "Ana", age: 25 });
    expect(rows[0]).not.toHaveProperty("Extra");
  });

  it("strict=true respeta el orden del schema y emite warning si no calza", async () => {
    const file = new File(["Email,Edad,Nombre\nx@y.com,30,Juan"], "d.csv", { type: "text/csv" });
    const { rows, warnings } = await parseFile(file, columns, { hasHeader: true, strict: true });
    expect(rows[0]).not.toHaveProperty("name");
    expect(warnings.some((w) => w.includes("Nombre"))).toBe(true);
  });

  it("detecta errores por fila (email inválido y edad fuera de rango)", async () => {
    const file = new File(["Nombre,Edad,Email\nAna,300,correo"], "d.csv", { type: "text/csv" });
    const { rows } = await parseFile(file, columns, { hasHeader: true, strict: false });
    const errors = validateRows(rows, columns);
    expect(errors.some((e) => e.columnKey === "email")).toBe(true);
    expect(errors.some((e) => e.columnKey === "age")).toBe(true);
  });

  it("sin header usa el orden posicional del schema", async () => {
    const file = new File(["Juan,30,x@y.com"], "d.csv", { type: "text/csv" });
    const { rows } = await parseFile(file, columns, { hasHeader: false, strict: false });
    expect(rows[0]).toMatchObject({ name: "Juan", age: 30, email: "x@y.com" });
  });
});

describe("buildTemplateCSV", () => {
  it("genera una fila de headers escapando comas", () => {
    const csv = buildTemplateCSV([{ key: "a", label: "A, B" }, { key: "b", label: "C" }]);
    expect(csv).toBe('"A, B",C\n');
  });
});

describe("CellsImporter (mount)", () => {
  it("renderiza el FileInput y expone métodos", () => {
    const w = mount(CellsImporter, { props: { columns } });
    expect(w.find(".cu-file-input").exists()).toBe(true);
    expect(w.find(".cu-cells-importer").exists()).toBe(true);
    const vm = w.vm as any;
    expect(typeof vm.getRows).toBe("function");
    expect(typeof vm.validate).toBe("function");
    expect(vm.getRows()).toEqual([]);
  });

  it("inputType='zone' renderiza el FileInputZone en lugar del FileInput", () => {
    const w = mount(CellsImporter, { props: { columns, inputType: "zone" } });
    expect(w.find(".cu-file-zone").exists()).toBe(true);
    expect(w.find(".cu-file-input").exists()).toBe(false);
  });

  it("inputType default es 'input'", () => {
    const w = mount(CellsImporter, { props: { columns } });
    expect(w.find(".cu-file-input").exists()).toBe(true);
    expect(w.find(".cu-file-zone").exists()).toBe(false);
  });
});