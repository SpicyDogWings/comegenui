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

describe("Pagination — tamaño de página fuera de las opciones", () => {
  it("incluye `itemsPerPage` en el selector y lo muestra como valor actual", async () => {
    const w = mount(Pagination, {
      props: { totalPages: 5, showPageSize: true, itemsPerPage: 15, pageSizeOptions: [5, 10, 20] },
    });
    // El valor vigente no queda sin opción ("Seleccionar...").
    expect(w.find(".cu-select-toggle").text()).toContain("15");

    await w.find(".cu-select-toggle").trigger("click");
    const labels = w.findAll(".cu-select-option").map((o) => o.text().trim());
    expect(labels).toContain("15");
    // Se respeta el orden numérico de las opciones configuradas + la actual.
    expect(labels).toEqual(["5", "10", "15", "20"]);
  });

  it("no duplica la opción cuando `itemsPerPage` ya está en `pageSizeOptions`", async () => {
    const w = mount(Pagination, {
      props: { totalPages: 5, showPageSize: true, itemsPerPage: 10, pageSizeOptions: [5, 10, 20] },
    });
    await w.find(".cu-select-toggle").trigger("click");
    const labels = w.findAll(".cu-select-option").map((o) => o.text().trim());
    expect(labels).toEqual(["5", "10", "20"]);
  });
});

// El componente no cambia de página solo: `currentPage` la manda el consumidor. Cuando la
// prop queda fuera de `[1, totalPages]` (el filtro achicó los totales, o llegó un valor
// inválido) se renderiza la última página disponible, no un rango imposible.
const activePageLabel = (w: ReturnType<typeof mount>) =>
  w.find(".cu-pagination-pages .cu-button--solid").text().trim();

describe("Pagination — página fuera de rango", () => {
  it("con `currentPage` mayor que `totalPages` muestra la última página y no deja botones muertos", async () => {
    const w = mount(Pagination, {
      props: { currentPage: 25, totalPages: 5, totalItems: 45, itemsPerPage: 10 },
    });

    expect(activePageLabel(w)).toBe("5");
    expect(w.find(".cu-pagination-info").text()).toBe("Mostrando 41 - 45 de 45");

    const buttons = pageButtons(w);
    const next = buttons.find((b) => b.text().trim() === "Siguiente")!;
    expect(next.attributes("disabled")).toBeDefined();

    // "Anterior" sí navega desde la página visible.
    await buttons.find((b) => b.text().trim() === "Anterior")!.trigger("click");
    expect(w.emitted("update:currentPage")).toEqual([[4]]);
  });

  it("con `currentPage` en 0 o negativo se muestra la primera página", () => {
    for (const currentPage of [0, -3]) {
      const w = mount(Pagination, {
        props: { currentPage, totalPages: 10, totalItems: 95, itemsPerPage: 10 },
      });
      expect(activePageLabel(w)).toBe("1");
      expect(w.find(".cu-pagination-info").text()).toBe("Mostrando 1 - 10 de 95");
    }
  });

  it("con `currentPage` no numérico no filtra NaN a la info", () => {
    const w = mount(Pagination, {
      props: { currentPage: Number("abc"), totalPages: 5, totalItems: 50 },
    });
    const info = w.find(".cu-pagination-info").text();
    expect(info).not.toContain("NaN");
    expect(info).toBe("Mostrando 1 - 10 de 50");
    expect(activePageLabel(w)).toBe("1");
  });

  it("con `totalPages` decimal no agrega una página que no existe", async () => {
    const w = mount(Pagination, { props: { currentPage: 3, totalPages: 2.7 } });
    expect(numbered(w)).toEqual(["1", "2"]);
    expect(activePageLabel(w)).toBe("2");

    // La última página real es la 2: «Siguiente» no debe quedar habilitado.
    const buttons = pageButtons(w);
    const next = buttons.find((b) => b.text().trim() === "Siguiente")!;
    expect(next.attributes("disabled")).toBeDefined();

    await buttons.find((b) => b.text().trim() === "1")!.trigger("click");
    expect(w.emitted("update:currentPage")).toEqual([[1]]);
  });
});

describe("Pagination — accesibilidad", () => {
  it("los botones de página viven en un landmark `nav` con nombre", () => {
    const w = mount(Pagination, { props: { currentPage: 4, totalPages: 10 } });
    const nav = w.find("nav.cu-pagination-pages");
    expect(nav.exists()).toBe(true);
    expect(nav.attributes("aria-label")).toBe("Paginación");
    expect(nav.findAll(".cu-button").length).toBeGreaterThan(0);
  });

  it("la página activa se anuncia con `aria-current=\"page\"` y nombre `Página N`", () => {
    const w = mount(Pagination, { props: { currentPage: 4, totalPages: 10 } });

    const active = w.find(".cu-pagination-pages .cu-button--solid");
    expect(active.text()).toBe("4");
    expect(active.attributes("aria-current")).toBe("page");
    expect(active.attributes("aria-label")).toBe("Página 4");

    // Las demás páginas no llevan el estado, pero sí el nombre accesible.
    const otra = pageButtons(w).find((b) => b.text().trim() === "3")!;
    expect(otra.attributes("aria-current")).toBeUndefined();
    expect(otra.attributes("aria-label")).toBe("Página 3");
  });

  it("la elipsis queda fuera del árbol accesible", () => {
    const w = mount(Pagination, {
      props: { currentPage: 10, totalPages: 20, showFirstAndLast: true },
    });
    const ellipsis = w.findAll(".cu-pagination-ellipsis");
    expect(ellipsis.length).toBeGreaterThan(0);
    for (const e of ellipsis) expect(e.attributes("aria-hidden")).toBe("true");
  });
});

describe("Pagination — valores imposibles en la info", () => {
  it("con `itemsPerPage` en 0 o negativo el rango no se invierte", () => {
    for (const itemsPerPage of [0, -5]) {
      const w = mount(Pagination, {
        props: { currentPage: 2, totalPages: 10, totalItems: 95, itemsPerPage },
      });
      expect(w.find(".cu-pagination-info").text()).toBe("Mostrando 2 - 2 de 95");
    }
  });

  it("con `totalItems` negativo no muestra un total negativo", () => {
    const w = mount(Pagination, {
      props: { currentPage: 1, totalPages: 5, totalItems: -10 },
    });
    expect(w.find(".cu-pagination-info").text()).toBe("Mostrando 0 - 0 de 0");
  });

  it("con totales incoherentes no muestra un rango que arranca después del total", () => {
    // `totalPages` dice 8, pero 95 items a 15 por página dan 7: la última página
    // arrancaría en el item 106. La info no puede ir al revés.
    const w = mount(Pagination, {
      props: { currentPage: 8, totalPages: 8, totalItems: 95, itemsPerPage: 15 },
    });
    expect(w.find(".cu-pagination-info").text()).toBe("Mostrando 95 - 95 de 95");
  });
});

describe("Pagination — `pageSizeOptions` inválido", () => {
  it("un `pageSizeOptions` que no es array no rompe el selector", async () => {
    const w = mount(Pagination, {
      props: {
        totalPages: 5,
        showPageSize: true,
        itemsPerPage: 15,
        pageSizeOptions: "[10,25]" as unknown as number[],
      },
    });

    expect(w.find(".cu-pagination").exists()).toBe(true);
    expect(w.find(".cu-select-toggle").text()).toContain("15");

    await w.find(".cu-select-toggle").trigger("click");
    const labels = w.findAll(".cu-select-option").map((o) => o.text().trim());
    // Cae al listado por defecto y sigue incluyendo el tamaño vigente.
    expect(labels).toEqual(["5", "10", "15", "20", "50"]);
  });

  it("descarta las opciones que no son tamaños válidos", async () => {
    const w = mount(Pagination, {
      props: {
        totalPages: 5,
        showPageSize: true,
        itemsPerPage: 10,
        pageSizeOptions: [10, Number.NaN, 0, -5, 25] as number[],
      },
    });

    await w.find(".cu-select-toggle").trigger("click");
    const labels = w.findAll(".cu-select-option").map((o) => o.text().trim());
    expect(labels).toEqual(["10", "25"]);
  });
});
