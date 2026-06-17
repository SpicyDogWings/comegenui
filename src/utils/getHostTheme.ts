import { ref } from "vue";

const currentTheme = ref("light");

function getSystemTheme(): string {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function findThemeInDocument(): string {
  const themed = document.querySelector("[data-theme]");
  if (themed) return themed.getAttribute("data-theme") || "light";
  return getSystemTheme();
}

if (typeof document !== "undefined") {
  currentTheme.value = findThemeInDocument();

  const observer = new MutationObserver(() => {
    currentTheme.value = findThemeInDocument();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    subtree: true,
    attributeFilter: ["data-theme"],
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!document.querySelector("[data-theme]")) {
      currentTheme.value = getSystemTheme();
    }
  });
}

export function getHostTheme(fallback = "light"): string {
  return currentTheme.value || fallback;
}
