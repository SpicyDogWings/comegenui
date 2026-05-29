import { ref } from "vue";

const currentTheme = ref("light");

function findThemeInDocument(): string {
  const themed = document.querySelector("[data-theme]");
  if (themed) return themed.getAttribute("data-theme") || "light";
  return "light";
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
}

export function getHostTheme(fallback = "light"): string {
  return currentTheme.value || fallback;
}
