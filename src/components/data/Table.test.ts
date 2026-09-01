import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import Table from "./Table.vue";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nombre" },
  { key: "status", label: "Estado" },
];

const data = [
  { id: 1, name: "Alice Johnson", status: "Active" },
  { id: 2, name: "Bob Smith", status: "Inactive" },
];

function factory(props: Record<string, any> = {}, slots: Record<string, any> = {}) {
  return mount(Table, {
    props: { columns, data, ...props },
    slots,
  });
}

describe("Table", () => {
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

  it("deriva columnas de la data cuando columns está vacío", () => {
    const w = factory({ columns: [] });
    const headers = w.findAll("th").map((th) => th.text().trim());
    expect(headers).toEqual(["id", "name", "status"]);
    expect(w.find("td").text().trim()).toBe("1");
  });

  it("muestra el mensaje empty cuando no hay data", () => {
    const w = factory({ data: [], empty: "Sin registros" });
    expect(w.find(".cu-table-empty").text()).toBe("Sin registros");
    expect(w.find(".cu-table-empty").attributes("colspan")).toBe("3");
  });

  it("slot header-{key} reemplaza el contenido del header", () => {
    const w = factory({}, { "header-id": "<span class='custom-header'>Custom ID</span>" });
    expect(w.find(".custom-header").exists()).toBe(true);
    expect(w.find(".custom-header").text()).toBe("Custom ID");
  });

  it("slot cell-{key} recibe value y row", () => {
    const w = factory({}, {
      "cell-name": ({ value, row }: { value: string; row: Record<string, any> }) =>
        h("span", { class: "custom-cell" }, `[${value}] (id:${row.id})`),
    });
    expect(w.find(".custom-cell").exists()).toBe(true);
    expect(w.find("td .custom-cell").text()).toBe("[Alice Johnson] (id:1)");
  });

  it("muestra el loader cuando loading=true", () => {
    const w = factory({ loading: true });
    expect(w.find(".cu-loader").exists()).toBe(true);
    expect(w.find(".cu-loader-bar--loading").exists()).toBe(true);
    expect(w.find("tbody").classes()).toContain("cu-table-loading");
  });

  it("respeta align por columna", () => {
    const w = factory({
      columns: [
        { key: "id", label: "ID", align: "right" },
        { key: "name", label: "Nombre", align: "center" },
      ],
    });
    const tds = w.findAll("td");
    expect(tds[0]!.classes()).toContain("cu-table-td--right");
    expect(tds[1]!.classes()).toContain("cu-table-td--center");
  });

  it("es un componente presentacional: no emite eventos", () => {
    const w = factory();
    expect(w.emitted()).toEqual({});
  });

  it("muestra slot footer cuando está presente", () => {
    const w = factory({
      columns: [{ key: "nombre", label: "Nombre" }, { key: "precio", label: "Precio" }],
      data: [{ nombre: "Juan", precio: 100 }],
    }, {
      footer: ({ columns }: { columns: any[] }) =>
        h("tr", {}, [
          h("td", { colspan: columns.length }, `Total: ${columns.length} columnas`),
        ]),
    });
    expect(w.find("tfoot").exists()).toBe(true);
    expect(w.find("tfoot td").text()).toBe("Total: 2 columnas");
  });

  it("no muestra tfoot si no hay slot footer", () => {
    const w = factory({
      columns: [{ key: "nombre", label: "Nombre" }],
      data: [{ nombre: "Juan" }],
    });
    expect(w.find("tfoot").exists()).toBe(false);
  });
});
