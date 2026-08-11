import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import AdvancedTable from "./AdvancedTable.vue";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nombre" },
  { key: "status", label: "Estado" },
];

const data = [
  { id: 1, name: "Alice Johnson", status: "Active" },
  { id: 2, name: "Bob Smith", status: "Inactive" },
];

function factory(props: Record<string, any> = {}) {
  return mount(AdvancedTable, {
    props: { columns, data, ...props },
  });
}

describe("AdvancedTable", () => {
  it("renderiza headers y celdas desde columns+data", () => {
    const w = factory();
    const headers = w.findAll("th").map((th) => th.text().trim());
    expect(headers).toEqual(["ID", "Nombre", "Estado"]);

    const cells = w.findAll("td").map((td) => td.text().trim());
    expect(cells).toContain("Alice Johnson");
    expect(cells).toContain("Bob Smith");
    expect(cells).toContain("Active");
    expect(cells).toContain("Inactive");
  });

  it("muestra el mensaje empty cuando no hay data", () => {
    const w = factory({ data: [], empty: "Sin registros" });
    expect(w.find(".cu-table-empty").text()).toBe("Sin registros");
  });

  it("sortable: click en el header ordena asc y desc", async () => {
    const w = factory({
      columns: [{ key: "name", label: "Nombre", sortable: true }],
      data: [{ name: "beta" }, { name: "alpha" }],
    });

    const sortBtn = w.find("th .cu-button");
    expect(sortBtn.exists()).toBe(true);

    await sortBtn.trigger("click");
    await flushPromises();
    let cells = w.findAll("td").map((td) => td.text().trim());
    expect(cells[0]).toBe("alpha");
    expect(cells[1]).toBe("beta");

    await sortBtn.trigger("click");
    await flushPromises();
    cells = w.findAll("td").map((td) => td.text().trim());
    expect(cells[0]).toBe("beta");
    expect(cells[1]).toBe("alpha");
  });

  it("edit-save: columna editable en inlineEditing guarda y emite edit-save", async () => {
    const w = factory({
      columns: [{ key: "name", label: "Nombre", editable: true }],
      data: [{ id: 1, name: "Alice" }],
      inlineEditing: true,
    });

    const input = w.find("input");
    expect(input.exists()).toBe(true);
    await input.setValue("Bob Smith");
    await input.trigger("keydown", { key: "Enter" });
    await flushPromises();

    const saves = w.emitted("edit-save");
    expect(saves).toBeTruthy();
    const payload = (saves as unknown[][])[0]![0] as { value: string; index: number; column: { key: string } };
    expect(payload.value).toBe("Bob Smith");
    expect(payload.index).toBe(0);
    expect(payload.column.key).toBe("name");
  });

  it("search: escribe en el buscador y emite update:search", async () => {
    const w = factory({
      searchEnabled: true,
      searchFields: ["name"],
      searchPlaceholder: "Buscar...",
    });

    const input = w.find("input");
    expect(input.attributes("placeholder")).toBe("Buscar...");
    await input.setValue("alice");
    await flushPromises();

    const searches = w.emitted("update:search");
    expect(searches).toBeTruthy();
    expect((searches as unknown[][])[0]![0]).toBe("alice");
  });

  it("paginación: con >itemsPerPage filas muestra el control y emite update:currentPage", async () => {
    const manyRows = Array.from({ length: 15 }, (_, i) => ({ id: i + 1, name: `User ${i + 1}` }));
    const w = factory({
      columns: [{ key: "id", label: "ID" }, { key: "name", label: "Nombre" }],
      data: manyRows,
    });

    expect(w.find(".cu-advanced-table-pagination").exists()).toBe(true);
    const pageButtons = w.findAll(".cu-advanced-table-pagination button");
    const page2 = pageButtons.find((b) => b.text().trim() === "2");
    expect(page2).toBeTruthy();
    await page2!.trigger("click");
    await flushPromises();

    const pages = w.emitted("update:currentPage");
    expect(pages).toBeTruthy();
    expect((pages as unknown[][])[0]![0]).toBe(2);
  });
});
