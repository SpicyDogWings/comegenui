import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Label from "./Label.vue";

describe("Label", () => {
  it("renderiza un label con el texto indicado", () => {
    const w = mount(Label, { props: { label: "Nombre completo" } });
    expect(w.find("label").exists()).toBe(true);
    expect(w.find("span").text()).toBe("Nombre completo");
  });

  it("no renderiza el span si no hay label", () => {
    const w = mount(Label, {});
    expect(w.find("span").exists()).toBe(false);
  });

  it("aplica el color como variable CSS --label-fg", () => {
    const w = mount(Label, { props: { color: "#ff0000" } });
    expect((w.find("label").attributes("style") || "").replace(/\s/g, "")).toContain(
      "--label-fg:#ff0000",
    );
  });

  it("acepta hightContrast sin romper el render", () => {
    const w = mount(Label, { props: { label: "Título", hightContrast: true } });
    expect(w.find("label").exists()).toBe(true);
  });

  it("hace render del slot y al hacer click en el texto enfoca el target", async () => {
    const target = document.createElement("input");
    target.id = "mi-input";
    document.body.appendChild(target);

    const w = mount(Label, {
      props: { label: "Campo", for: "mi-input" },
      slots: { default: "<input id='hijo' />" },
    });
    expect(w.find("input#hijo").exists()).toBe(true);

    await w.find("span").trigger("click");
    expect(document.activeElement).toBe(target);

    target.remove();
  });
});
