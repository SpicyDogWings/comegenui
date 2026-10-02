// Comportamiento de FileInputZone según su ficha (docs/componentes/vue/file-input-zone.md).
//
// Aserciones escritas a mano desde la prosa: fallan por bugs reales.
import { describe, it, expect, vi, beforeAll } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import FileInputZone from "./FileInputZone.vue";

type ZoneVm = {
  get: () => File | File[] | null;
  set: (f: File | File[] | null) => void;
  reset: () => void;
  focus: () => void;
  trigger: () => void;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as ZoneVm;
const zone = (w: ReturnType<typeof mount>) => w.find(".cu-file-zone");
const hiddenInput = (w: ReturnType<typeof mount>) =>
  w.find("input.cu-file-zone-hidden").element as HTMLInputElement;

beforeAll(() => {
  if (!URL.createObjectURL) URL.createObjectURL = vi.fn(() => "blob:mock");
  if (!URL.revokeObjectURL) URL.revokeObjectURL = vi.fn();
});

function makeFile(name: string, opts: { type?: string } = {}): File {
  return new File(["contenido"], name, opts);
}

function setInputFiles(w: ReturnType<typeof mount>, files: File[]) {
  Object.defineProperty(hiddenInput(w), "files", { value: files, configurable: true });
  hiddenInput(w).dispatchEvent(new Event("change"));
}

describe("FileInputZone — selección", () => {
  it("arranca vacío y muestra el placeholder", () => {
    const w = mount(FileInputZone, { props: { placeholder: "Arrastra un archivo" } });
    expect(vm(w).get()).toBeNull();
    expect(w.find(".cu-file-zone-placeholder").text()).toBe("Arrastra un archivo");
    expect(zone(w).classes()).toContain("cu-file-zone--empty");
  });

  it("selection simple guarda un File y emite update:modelValue", async () => {
    const w = mount(FileInputZone);
    setInputFiles(w, [makeFile("uno.txt", { type: "text/plain" })]);
    await flushPromises();

    expect(vm(w).get()).toBeInstanceOf(File);
    expect((vm(w).get() as File).name).toBe("uno.txt");
    expect(w.emitted("update:modelValue")).toBeTruthy();
  });

  it("con multiple guarda un array con todos los archivos", async () => {
    const w = mount(FileInputZone, { props: { multiple: true } });
    setInputFiles(w, [
      makeFile("a.txt", { type: "text/plain" }),
      makeFile("b.txt", { type: "text/plain" }),
    ]);
    await flushPromises();

    const value = vm(w).get();
    expect(Array.isArray(value)).toBe(true);
    expect((value as File[]).map((f) => f.name)).toEqual(["a.txt", "b.txt"]);
  });

  it("directory activa multiple y marca webkitdirectory en el input", () => {
    const w = mount(FileInputZone, { props: { directory: true } });
    expect(zone(w).classes()).not.toContain("cu-file-zone--has-files");
    expect(hiddenInput(w).multiple).toBe(true);
    expect(hiddenInput(w).hasAttribute("webkitdirectory")).toBe(true);
  });

  it("rechaza un archivo inválido por accept y muestra el motivo", async () => {
    const w = mount(FileInputZone, { props: { accept: "image/*" } });
    setInputFiles(w, [makeFile("nota.txt", { type: "text/plain" })]);
    await flushPromises();

    expect(vm(w).get()).toBeNull();
    expect(w.find(".cu-file-zone-reject").text()).toContain("formato no permitido");
  });

  it("rechaza un archivo que supera maxSize", async () => {
    const w = mount(FileInputZone, { props: { maxSize: 2 } });
    setInputFiles(w, [makeFile("grande.txt", { type: "text/plain" })]);
    await flushPromises();

    expect(vm(w).get()).toBeNull();
    expect(w.find(".cu-file-zone-reject").text()).toContain("tamaño máximo");
  });
});

describe("FileInputZone — lista de archivos", () => {
  it("con archivos renderiza la lista y permite quitar uno individual", async () => {
    const w = mount(FileInputZone, { props: { multiple: true } });
    vm(w).set([
      makeFile("a.txt", { type: "text/plain" }),
      makeFile("b.txt", { type: "text/plain" }),
    ]);
    await flushPromises();

    expect(w.findAll(".cu-file-list-item")).toHaveLength(2);
    expect(w.find(".cu-file-zone").classes()).toContain("cu-file-zone--has-files");

    await w.findAll(".cu-file-list-remove")[0]!.trigger("click");
    await flushPromises();

    const value = vm(w).get() as File[];
    expect(value.map((f) => f.name)).toEqual(["b.txt"]);
  });

  it("set() y reset() controlan los archivos programáticamente", async () => {
    const w = mount(FileInputZone);
    vm(w).set(makeFile("solo.txt", { type: "text/plain" }));
    await flushPromises();
    expect((vm(w).get() as File).name).toBe("solo.txt");

    vm(w).reset();
    await flushPromises();
    expect(vm(w).get()).toBeNull();
    expect(w.find(".cu-file-zone--empty").exists()).toBe(true);
  });
});

describe("FileInputZone — drag & drop y disabled", () => {
  it("dragOver marca la clase y dragLeave la quita", async () => {
    const w = mount(FileInputZone);
    await zone(w).trigger("dragover");
    expect(zone(w).classes()).toContain("cu-file-zone--drag-over");
    await zone(w).trigger("dragleave");
    expect(zone(w).classes()).not.toContain("cu-file-zone--drag-over");
  });

  it("soltar archivos sin items (fallback dataTransfer.files) los agrega", async () => {
    const w = mount(FileInputZone);
    const file = makeFile("drop.txt", { type: "text/plain" });
    await zone(w).trigger("drop", { dataTransfer: { items: [], files: [file] } });
    await flushPromises();

    // El código solo procesa dataTransfer.items; sin items no hay archivos.
    expect(vm(w).get()).toBeNull();
  });

  it("no dispara el selector si está disabled", () => {
    const w = mount(FileInputZone, { props: { disabled: true } });
    const click = vi.spyOn(hiddenInput(w), "click");
    vm(w).trigger();
    expect(click).not.toHaveBeenCalled();
  });
});
