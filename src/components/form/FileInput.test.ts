// Comportamiento de FileInput según su ficha (docs/componentes/vue/file-input.md).
//
// Aserciones escritas a mano desde la prosa: fallan por bugs reales.
import { describe, it, expect, vi, beforeAll } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import FileInput from "./FileInput.vue";

type FileInputVm = {
  get: () => File | null;
  set: (f: File | null) => void;
  reset: () => void;
  focus: () => void;
  trigger: () => void;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as FileInputVm;
const container = (w: ReturnType<typeof mount>) => w.find(".cu-file-input");

beforeAll(() => {
  // jsdom no implementa createObjectURL.
  if (!URL.createObjectURL) URL.createObjectURL = vi.fn(() => "blob:mock");
  if (!URL.revokeObjectURL) URL.revokeObjectURL = vi.fn();
});

function makeFile(name = "doc.txt", opts: { type?: string } = {}): File {
  return new File(["contenido"], name, opts);
}

function selectFiles(w: ReturnType<typeof mount>, files: File[]) {
  const input = w.find("input.cu-file-input-hidden").element as HTMLInputElement;
  Object.defineProperty(input, "files", { value: files, configurable: true });
  return input;
}

describe("FileInput — selección y v-model", () => {
  it("arranca sin archivo y muestra el placeholder", () => {
    const w = mount(FileInput, { props: { placeholder: "Elige" } });
    expect(vm(w).get()).toBeNull();
    expect(w.find(".cu-file-input-placeholder").text()).toContain("Elige");
  });

  it("seleccionar un archivo válido actualiza get() y emite update:modelValue", async () => {
    const w = mount(FileInput);
    const input = selectFiles(w, [makeFile("informe.pdf", { type: "application/pdf" })]);
    input.dispatchEvent(new Event("change"));
    await flushPromises();

    expect(vm(w).get()?.name).toBe("informe.pdf");
    expect(w.emitted("update:modelValue")?.at(-1)?.[0]).toBe(vm(w).get());
    expect(w.find(".cu-file-input-name").text()).toContain("informe.pdf");
  });

  it("un archivo que falla accept se rechaza con un Alert", async () => {
    const w = mount(FileInput, { props: { accept: ".pdf" } });
    const input = selectFiles(w, [makeFile("foto.png", { type: "image/png" })]);
    input.dispatchEvent(new Event("change"));
    await flushPromises();

    expect(vm(w).get()).toBeNull();
    expect(w.find(".cu-file-input-reject").exists()).toBe(true);
    expect(w.find(".cu-file-input-reject").text()).toContain("Formato no permitido");
  });

  it("un archivo que supera maxSize se rechaza", async () => {
    const w = mount(FileInput, { props: { maxSize: 2 } });
    const input = selectFiles(w, [makeFile("grande.txt", { type: "text/plain" })]);
    input.dispatchEvent(new Event("change"));
    await flushPromises();

    expect(vm(w).get()).toBeNull();
    expect(w.find(".cu-file-input-reject").text()).toContain("tamaño máximo");
  });
});

describe("FileInput — quitar, set y reset", () => {
  it("set() asigna el archivo y reset() lo quita", async () => {
    const w = mount(FileInput);
    vm(w).set(makeFile("a.txt", { type: "text/plain" }));
    await flushPromises();
    expect(vm(w).get()?.name).toBe("a.txt");

    vm(w).reset();
    await flushPromises();
    expect(vm(w).get()).toBeNull();
    expect(w.find(".cu-file-input-placeholder").exists()).toBe(true);
  });

  it("el botón de quitar limpia el archivo seleccionado", async () => {
    const w = mount(FileInput, { props: { modelValue: makeFile("x.txt", { type: "text/plain" }) } });
    await flushPromises();
    expect(w.find(".cu-file-input-remove").exists()).toBe(true);

    await w.find(".cu-file-input-remove").trigger("click");
    await flushPromises();

    expect(vm(w).get()).toBeNull();
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([null]);
  });
});

describe("FileInput — drag & drop y disabled", () => {
  it("soltar un archivo válido lo selecciona", async () => {
    const w = mount(FileInput);
    const file = makeFile("drop.txt", { type: "text/plain" });
    await container(w).trigger("drop", { dataTransfer: { files: [file] } });
    await flushPromises();

    expect(vm(w).get()).toBe(file);
  });

  it("dragOver marca la clase drag-over y dragLeave la quita", async () => {
    const w = mount(FileInput);
    await container(w).trigger("dragover");
    expect(container(w).classes()).toContain("cu-file-input--drag-over");

    await container(w).trigger("dragleave");
    expect(container(w).classes()).not.toContain("cu-file-input--drag-over");
  });

  it("no dispara el selector si está disabled", () => {
    const w = mount(FileInput, { props: { disabled: true } });
    const input = w.find("input.cu-file-input-hidden").element as HTMLInputElement;
    const click = vi.spyOn(input, "click");
    vm(w).trigger();
    expect(click).not.toHaveBeenCalled();
  });
});
