import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import EditableTableCell from "./EditableTableCell.vue";

const row = { id: 1, name: "Alice Johnson", status: "Active" };

function factory(column: Record<string, any>, value: string | number = "Alice Johnson", inlineEdit = false) {
  return mount(EditableTableCell, {
    props: {
      value,
      row,
      column: { key: "name", label: "Name", editable: true, ...column },
      index: 0,
      validation: { success: false, error: null },
      inlineEdit,
    },
  });
}

describe("EditableTableCell — modo lápiz (default) y estado inline", () => {
  it("default: muestra el lápiz y NO el input", () => {
    const w = factory({});
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(true);
    expect(w.find("input").exists()).toBe(false);
  });

  it("default: click sobre la celda abre el editor", async () => {
    const w = factory({});
    await w.trigger("click");
    await flushPromises();
    expect(w.find("input").exists()).toBe(true);
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
  });

  it("default: Escape cierra y vuelve al lápiz", async () => {
    const w = factory({});
    await w.trigger("click");
    await flushPromises();
    await w.find("input").trigger("keydown", { key: "Escape" });
    await flushPromises();
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(true);
    expect(w.find("input").exists()).toBe(false);
  });

  it("default: Enter guarda (edit-save) y vuelve al lápiz", async () => {
    const w = factory({});
    await w.trigger("click");
    await flushPromises();
    await w.find("input").setValue("Bob Smith");
    await w.find("input").trigger("keydown", { key: "Enter" });
    await flushPromises();
    const saves = w.emitted("edit-save");
    expect(saves).toBeTruthy();
    const payload = (saves as unknown[][])[0]![0] as { value: string };
    expect(payload.value).toBe("Bob Smith");
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(true);
  });

  it("inlineEdit: renderiza el editor directo, sin lápiz", () => {
    const w = factory({}, "Alice Johnson", true);
    expect(w.find("input").exists()).toBe(true);
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
  });

  it("inlineEdit: Enter guarda y SIGUE mostrando el editor", async () => {
    const w = factory({}, "Alice Johnson", true);
    await w.find("input").setValue("Bob Smith");
    await w.find("input").trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(w.emitted("edit-save")).toBeTruthy();
    expect(w.find("input").exists()).toBe(true);
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
  });

  it("inlineEdit: Escape revierte y sigue mostrando el editor", async () => {
    const w = factory({}, "Alice Johnson", true);
    await w.find("input").setValue("Changed");
    await w.find("input").trigger("keydown", { key: "Escape" });
    await flushPromises();
    expect(w.find("input").exists()).toBe(true);
    const inputEl = w.find("input").element as HTMLInputElement | undefined;
    expect(inputEl?.value).toBe("Alice Johnson");
  });

  it("inlineEdit es un estado: al apagarlo vuelve al lápiz", async () => {
    const w = factory({}, "Alice Johnson", true);
    expect(w.find("input").exists()).toBe(true);
    await w.setProps({ inlineEdit: false });
    await flushPromises();
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(true);
    expect(w.find("input").exists()).toBe(false);
  });

  it("column.inlineEdit: renderiza el editor directo, sin lápiz", () => {
    const w = factory({ inlineEdit: true });
    expect(w.find("input").exists()).toBe(true);
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
  });

  it("column.inlineEdit tiene prioridad sobre el inlineEdit de la tabla", () => {
    const w = factory({ inlineEdit: true }, "Alice Johnson", false);
    expect(w.find("input").exists()).toBe(true);
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
  });
});
