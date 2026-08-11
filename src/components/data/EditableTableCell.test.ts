import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import EditableTableCell from "./EditableTableCell.vue";

const row = { id: 1, name: "Alice Johnson", status: "Active" };

function factory(column: Record<string, any>, value: string | number = "Alice Johnson") {
  return mount(EditableTableCell, {
    props: {
      value,
      row,
      column: { key: "name", label: "Name", editable: true, ...column },
      index: 0,
      validation: { success: false, error: null },
    },
  });
}

describe("EditableTableCell — modos de edición", () => {
  it("default: renderiza el input directo, sin lápiz", () => {
    const w = factory({});
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
    expect(w.find("input").exists()).toBe(true);
  });

  it("default: select se renderiza directo, sin lápiz", () => {
    const w = factory(
      { inputType: "select", select: { options: [{ value: "Active", label: "Active" }] } },
      "Active"
    );
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
    expect(w.find(".cu-editable-cell-input").exists()).toBe(true);
  });

  it("clickToEdit: muestra lápiz y NO el input hasta el click", async () => {
    const w = factory({ clickToEdit: true });
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(true);
    expect(w.find("input").exists()).toBe(false);

    await w.trigger("click");
    await flushPromises();
    expect(w.find("input").exists()).toBe(true);
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
  });

  it("clickToEdit: Escape cancela y vuelve al lápiz", async () => {
    const w = factory({ clickToEdit: true });
    await w.trigger("click");
    await flushPromises();
    await w.find("input").trigger("keydown", { key: "Escape" });
    await flushPromises();
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(true);
    expect(w.find("input").exists()).toBe(false);
  });

  it("clickToEdit: Enter guarda y emite edit-save", async () => {
    const w = factory({ clickToEdit: true });
    await w.trigger("click");
    await flushPromises();
    await w.find("input").setValue("Bob Smith");
    await w.find("input").trigger("keydown", { key: "Enter" });
    await flushPromises();
    const saves = w.emitted("edit-save");
    expect(saves).toBeTruthy();
    const payload = (saves as unknown[][])[0]![0] as { value: string };
    expect(payload.value).toBe("Bob Smith");
  });

  it("default: Enter guarda y SIGUE en modo edición (sin lápiz)", async () => {
    const w = factory({});
    await w.find("input").setValue("Bob Smith");
    await w.find("input").trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(w.emitted("edit-save")).toBeTruthy();
    expect(w.find("input").exists()).toBe(true);
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
  });

  it("default: Escape revierte el valor y sigue en modo edición", async () => {
    const w = factory({}, "Alice Johnson");
    await w.find("input").setValue("Changed");
    await w.find("input").trigger("keydown", { key: "Escape" });
    await flushPromises();
    expect(w.find("input").exists()).toBe(true);
    const inputEl = w.find("input").element as HTMLInputElement | undefined;
    expect(inputEl?.value).toBe("Alice Johnson");
  });
});
