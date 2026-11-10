import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "./useTheme.ts";

const KEY = "comegen-theme";

beforeEach(() => {
  document.documentElement.removeAttribute("data-theme");
  localStorage.clear();
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useTheme", () => {
  it("resuelve el default y lo aplica en <html>", () => {
    const { theme } = useTheme({ themes: ["light", "dark"], defaultTheme: "light" });
    expect(theme.value).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("setTheme actualiza el DOM y persiste", () => {
    const { setTheme } = useTheme({ themes: ["light", "dark"], defaultTheme: "light" });
    setTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem(KEY)).toBe("dark");
  });

  it("rechaza un tema fuera de la lista", () => {
    const { setTheme } = useTheme({ themes: ["light", "dark"] });
    expect(() => setTheme("banana")).toThrow('Unknown theme "banana"');
  });

  it("toggleTheme cicla la lista", () => {
    const { theme, toggleTheme } = useTheme({ themes: ["light", "dark"], defaultTheme: "light" });
    toggleTheme();
    expect(theme.value).toBe("dark");
    toggleTheme();
    expect(theme.value).toBe("light");
  });

  it("respeta el tema guardado sobre el default", () => {
    localStorage.setItem(KEY, "dark");
    const { theme } = useTheme({ themes: ["light", "dark"], defaultTheme: "light" });
    expect(theme.value).toBe("dark");
  });

  it("persist: false no escribe localStorage", () => {
    const { setTheme } = useTheme({ themes: ["light", "dark"], defaultTheme: "light", persist: false });
    setTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem(KEY)).toBeNull();
  });
});
