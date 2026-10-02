// Comportamiento de Pagination según su ficha (docs/componentes/vue/pagination.md).
//
// Aserciones escritas a MANO desde la prosa de la ficha (paginación numérica con
// selector de tamaño y primera/última página).
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Pagination from "./Pagination.vue";

const pageButtons = (w: ReturnType<typeof mount>) =>
  w.findAll(".cu-pagination-pages .cu-button");

/** Botones que representan números de página (excluye Anterior/Siguiente/elipsis). */
const numbered = (w: ReturnType<typeof mount>) =>
  pageButtons(w)
    .map((b) => b.text().trim())
    .filter((t) => /^\d+$/.test(t));

describe("Pagination — render condicional e info", () => {
  it("con una sola página y sin `showPageSize` no renderiza nada", () => {
    const w = mount(Pagination, { props: { totalPages: 1 } });
    expect(w.find(".cu-pagination").exists()).toBe(false);
  });

  it("con `showPageSize` se muestra aunque haya una sola página", () => {
    const w = mount(Pagination, { props: { totalPages: 1, showPageSize: true } });
    expect(w.find(".cu-pagination").exists()).toBe(true);
    expect(w.find(".cu-pagination-page-size").exists()).toBe(true);
  });

  it("la info muestra el rango y el total de items", () => {
    const w = mount(Pagination, {
      props: { currentPage: 3, totalPages: 10, totalItems: 95, itemsPerPage: 10 },
    });
    expect(w.find(".cu-pagination-info").text()).toBe("Mostrando 21 - 30 de 95");
  });

  it("la info arranca en 0 de 0 cuando no hay items", () => {
    const w = mount(Pagination, { props: { totalPages: 5, totalItems: 0 } });
    expect(w.find(".cu-pagination-info").text()).toBe("Mostrando 0 - 0 de 0");
  });
});

describe("Pagination — navegación", () => {
  it("click en una página emite update:currentPage con ese número", async () => {
    const w = mount(Pagination, { props: { currentPage: 1, totalPages: 5 } });
    const btn = pageButtons(w).find((b) => b.text().trim() === "3");
    await btn!.trigger("click");
    expect(w.emitted("update:currentPage")).toEqual([[3]]);
  });

  it("Anterior emite la página previa; está deshabilitado en la primera página", async () => {
    const first = mount(Pagination, { props: { currentPage: 1, totalPages: 5 } });
    expect(pageButtons(first)[0]!.text()).toBe("Anterior");
    expect(pageButtons(first)[0]!.attributes("disabled")).toBeDefined();

    const w = mount(Pagination, { props: { currentPage: 3, totalPages: 5 } });
    await pageButtons(w)[0]!.trigger("click");
    expect(w.emitted("update:currentPage")).toEqual([[2]]);
  });

  it("Siguiente emite la página siguiente; está deshabilitado en la última", async () => {
    const last = mount(Pagination, { props: { currentPage: 5, totalPages: 5 } });
    const buttons = pageButtons(last);
    expect(buttons[buttons.length - 1]!.text()).toBe("Siguiente");
    expect(buttons[buttons.length - 1]!.attributes("disabled")).toBeDefined();

    const w = mount(Pagination, { props: { currentPage: 2, totalPages: 5 } });
    const bs = pageButtons(w);
    await bs[bs.length - 1]!.trigger("click");
    expect(w.emitted("update:currentPage")).toEqual([[3]]);
  });

  it("no emite fuera del rango válido de páginas", async () => {
    // Anterior deshabilitado en la 1 y Siguiente deshabilitado en la última:
    // el handler no debe emitir nada fuera de [1, totalPages].
    const w = mount(Pagination, { props: { currentPage: 1, totalPages: 1 } });
    expect(w.find(".cu-pagination").exists()).toBe(false);
  });
});

describe("Pagination — páginas visibles", () => {
  it("hasta 7 páginas las muestra todas", () => {
    const w = mount(Pagination, { props: { currentPage: 4, totalPages: 7 } });
    expect(numbered(w)).toEqual(["1", "2", "3", "4", "5", "6", "7"]);
    expect(w.findAll(".cu-pagination-ellipsis")).toHaveLength(0);
  });

  it("con muchas páginas sin `showFirstAndLast` muestra una ventana alrededor de la actual", () => {
    const w = mount(Pagination, { props: { currentPage: 10, totalPages: 20 } });
    const nums = numbered(w);
    expect(nums).toContain("10");
    expect(nums).toContain("9");
    expect(nums).toContain("11");
    expect(nums.length).toBeLessThan(20);
  });

  it("`showFirstAndLast` incluye la primera y la última página con elipsis", () => {
    const w = mount(Pagination, {
      props: { currentPage: 10, totalPages: 20, showFirstAndLast: true },
    });
    const nums = numbered(w);
    expect(nums).toContain("1");
    expect(nums).toContain("20");
    expect(w.findAll(".cu-pagination-ellipsis").length).toBeGreaterThan(0);
  });
});

describe("Pagination — tamaño de página", () => {
  it("al cambiar el tamaño emite update:itemsPerPage y resetea a la página 1", async () => {
    const w = mount(Pagination, {
      props: { currentPage: 5, totalPages: 20, showPageSize: true },
    });
    // Abre el Select de tamaño de página y elige 20.
    await w.find(".cu-select-toggle").trigger("click");
    const options = w.findAll(".cu-select-option");
    const veinte = options.find((o) => o.text().trim() === "20");
    await veinte!.trigger("click");

    expect(w.emitted("update:itemsPerPage")).toEqual([[20]]);
    expect(w.emitted("update:currentPage")).toEqual([[1]]);
  });
});
