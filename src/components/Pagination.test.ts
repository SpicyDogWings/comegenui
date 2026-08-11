import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Pagination from "./Pagination.vue";

// Stub de Select: evita montar el componente real (dropdown/teleport interno).
const SelectStub = {
  name: "SelectStub",
  props: ["modelValue", "options"],
  emits: ["select"],
  template: `<select :value="modelValue" @change="$emit('select', { value: $event.target.value })"><option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option></select>`,
};

function factory(props: Record<string, unknown> = {}, stubSelect = false) {
  return mount(Pagination, {
    props: { totalPages: 5, currentPage: 3, totalItems: 50, itemsPerPage: 10, ...props },
    global: stubSelect ? { stubs: { Select: SelectStub } } : {},
  });
}

function buttonByText(w: ReturnType<typeof factory>, text: string) {
  return w.findAll("button").find((b) => b.text().includes(text));
}

describe("Pagination — navegación de páginas", () => {
  it("render smoke: info + botones Anterior/Siguiente/páginas", () => {
    const w = factory();
    expect(w.find(".cu-pagination").exists()).toBe(true);
    expect(w.find(".cu-pagination-info").text()).toBe("Mostrando 21 - 30 de 50");
    expect(buttonByText(w, "Anterior")).toBeDefined();
    expect(buttonByText(w, "Siguiente")).toBeDefined();
    expect(buttonByText(w, "3")).toBeDefined();
  });

  it("click en Siguiente emite update:currentPage con currentPage + 1", async () => {
    const w = factory();
    await buttonByText(w, "Siguiente")!.trigger("click");
    const em = w.emitted("update:currentPage");
    expect(em).toBeTruthy();
    expect((em as unknown[][])[0]![0] as number).toBe(4);
  });

  it("click en Anterior emite update:currentPage con currentPage - 1", async () => {
    const w = factory();
    await buttonByText(w, "Anterior")!.trigger("click");
    const em = w.emitted("update:currentPage");
    expect(em).toBeTruthy();
    expect((em as unknown[][])[0]![0] as number).toBe(2);
  });

  it("click en una página concreta emite esa página", async () => {
    const w = factory();
    await buttonByText(w, "3")!.trigger("click");
    const em = w.emitted("update:currentPage");
    expect(em).toBeTruthy();
    expect((em as unknown[][])[0]![0] as number).toBe(3);
  });

  it("Anterior deshabilitado en la primera página y no emite", async () => {
    const w = factory({ currentPage: 1 });
    const prev = buttonByText(w, "Anterior")!;
    expect((prev.element as HTMLButtonElement).disabled).toBe(true);
    await prev.trigger("click");
    expect(w.emitted("update:currentPage")).toBeUndefined();
  });

  it("Siguiente deshabilitado en la última página y no emite", async () => {
    const w = factory({ currentPage: 5 });
    const next = buttonByText(w, "Siguiente")!;
    expect((next.element as HTMLButtonElement).disabled).toBe(true);
    await next.trigger("click");
    expect(w.emitted("update:currentPage")).toBeUndefined();
  });

  it("totalPages 1 sin showPageSize: no renderiza nada", () => {
    const w = factory({ totalPages: 1, currentPage: 1, totalItems: 5 });
    expect(w.find(".cu-pagination").exists()).toBe(false);
  });

  it("showPageSize: cambio de tamaño emite update:itemsPerPage y resetea a página 1", async () => {
    const w = factory({ showPageSize: true, currentPage: 3 }, true);
    expect(w.find(".cu-pagination-page-size").exists()).toBe(true);
    const select = w.find("select");
    expect(select.exists()).toBe(true);
    await select.setValue("20");
    const em = w.emitted("update:itemsPerPage");
    expect(em).toBeTruthy();
    expect((em as unknown[][])[0]![0] as number).toBe(20);
    const pageEm = w.emitted("update:currentPage");
    expect(pageEm).toBeTruthy();
    expect((pageEm as unknown[][])[0]![0] as number).toBe(1);
  });
});
