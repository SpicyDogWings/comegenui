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

/** Espía el `value` del input nativo (jsdom prohíbe asignarle una ruta real). */
function trackInputValue(input: HTMLInputElement) {
  let stored = "C:\\fakepath\\elegido.txt";
  Object.defineProperty(input, "value", {
    configurable: true,
    get: () => stored,
    set: (v: string) => {
      stored = v;
    },
  });
  return {
    get value() {
      return stored;
    },
  };
}

function dispatchDragLeave(el: Element, relatedTarget: Node | null) {
  const event = new Event("dragleave", { bubbles: true, cancelable: true });
  Object.defineProperty(event, "relatedTarget", { value: relatedTarget });
  el.dispatchEvent(event);
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

  it("cruzar un hijo del propio campo no apaga el resaltado; salir sí", async () => {
    const w = mount(FileInput, { props: { placeholder: "Elige" } });
    await container(w).trigger("dragover");
    const child = w.find(".cu-file-input-placeholder").element;

    dispatchDragLeave(container(w).element, child);
    await flushPromises();
    expect(container(w).classes()).toContain("cu-file-input--drag-over");

    dispatchDragLeave(container(w).element, document.body);
    await flushPromises();
    expect(container(w).classes()).not.toContain("cu-file-input--drag-over");
  });

  it("no dispara el selector si está disabled", () => {
    const w = mount(FileInput, { props: { disabled: true } });
    const input = w.find("input.cu-file-input-hidden").element as HTMLInputElement;
    const click = vi.spyOn(input, "click");
    vm(w).trigger();
    expect(click).not.toHaveBeenCalled();
  });

  it("con disabled el nombre del archivo no es un link navegable", () => {
    const w = mount(FileInput, {
      props: { modelValue: makeFile("x.txt", { type: "text/plain" }), disabled: true },
    });
    expect(w.find(".cu-file-input-link").attributes("href")).toBeUndefined();
  });
});

describe("FileInput — teclado", () => {
  it("Enter y Espacio sobre el campo abren el selector", async () => {
    const w = mount(FileInput);
    const input = w.find("input.cu-file-input-hidden").element as HTMLInputElement;
    const click = vi.spyOn(input, "click");

    await container(w).trigger("keydown", { key: "Enter" });
    expect(click).toHaveBeenCalled();

    click.mockClear();
    const space = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    container(w).element.dispatchEvent(space);
    expect(click).toHaveBeenCalled();
    expect(space.defaultPrevented).toBe(true);
  });

  it("Enter o Espacio sobre el botón de quitar no abren el selector", async () => {
    const w = mount(FileInput, {
      props: { modelValue: makeFile("x.txt", { type: "text/plain" }) },
    });
    await flushPromises();
    const input = w.find("input.cu-file-input-hidden").element as HTMLInputElement;
    const click = vi.spyOn(input, "click");
    const remove = w.find(".cu-file-input-remove");

    await remove.trigger("keydown", { key: "Enter" });
    const space = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    remove.element.dispatchEvent(space);

    expect(click).not.toHaveBeenCalled();
    expect(space.defaultPrevented).toBe(false);
  });

  it("el botón de quitar tiene nombre accesible", async () => {
    const w = mount(FileInput, {
      props: { modelValue: makeFile("informe.pdf", { type: "application/pdf" }) },
    });
    await flushPromises();
    expect(w.find(".cu-file-input-remove").attributes("aria-label")).toBe("Quitar informe.pdf");
  });
});

describe("FileInput — input nativo", () => {
  it("se vacía al procesar la selección, para poder volver a elegir el mismo archivo", async () => {
    const w = mount(FileInput, { props: { accept: ".pdf" } });
    const input = selectFiles(w, [makeFile("foto.png", { type: "image/png" })]);
    // El navegador deja `C:\fakepath\…` en el input cuando el usuario elige un archivo.
    const state = trackInputValue(input);

    input.dispatchEvent(new Event("change"));
    await flushPromises();

    expect(state.value).toBe("");
    expect(w.find(".cu-file-input-reject").text()).toContain("Formato no permitido");
  });
});
