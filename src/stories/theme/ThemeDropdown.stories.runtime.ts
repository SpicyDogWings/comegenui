import { createPinia } from "pinia";
import { init, registerTheme, setTheme } from "@/plugins/cu-tokens";

function stubMatchMedia(): void {
  if (typeof window.matchMedia === "function") return;
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as never;
}

export async function setup(): Promise<void> {
  // Mismo setup que ToggleColorSheme: tokens + Pinia para el theme store.
  stubMatchMedia();
  await init();
  registerTheme("dark", {});
  setTheme("light");
}

export function global() {
  return { plugins: [createPinia()] };
}
