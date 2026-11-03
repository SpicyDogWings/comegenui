// Comportamiento de `sanitizeIcon` según el contrato de `icon` de las fichas:
// string HTML que se inyecta con `v-html` y que debe ser **SVG inline**.
import { describe, it, expect } from "vitest";
import { sanitizeIcon } from "./sanitizeIcon";

const SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" class="mi-icon" aria-hidden="true">',
  '<defs><linearGradient id="g" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="red"/></linearGradient></defs>',
  '<g transform="translate(2 2)"><path d="m3 9 9-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></g>',
  '<circle cx="12" cy="12" r="9"/><rect x="1" y="1" width="2" height="2" rx="1"/>',
  "</svg>",
].join("");

describe("sanitizeIcon — SVG inline", () => {
  it("sin HTML devuelve undefined (el v-if no pinta wrappers vacíos)", () => {
    expect(sanitizeIcon()).toBeUndefined();
    expect(sanitizeIcon("")).toBeUndefined();
  });

  it("conserva el SVG completo con sus atributos presentacionales", () => {
    const out = sanitizeIcon(SVG)!;
    expect(out).toContain("<svg");
    expect(out).toContain('viewBox="0 0 24 24"');
    expect(out).toContain('class="mi-icon"');
    expect(out).toContain("<linearGradient");
    expect(out).toContain('stop-color="red"');
    expect(out).toContain('stroke-linecap="round"');
    expect(out).toContain("<circle");
    expect(out).toContain("<rect");
    expect(out).toContain("<g transform=");
  });
});

describe("sanitizeIcon — sólo dibujo: sin interactivos ni recursos externos", () => {
  it("elimina `<a>` sin dejar su texto (no anida un enlace dentro del otro)", () => {
    const out = sanitizeIcon('<svg class="x"></svg><a href="/hack">LINK</a>')!;
    expect(out).not.toContain("<a");
    expect(out).not.toContain("LINK");
    expect(out).toContain("<svg");
  });

  it("elimina `<img>`, `<script>` y handlers `on*`", () => {
    type XssWindow = Window & { __xss?: number };
    const probe = window as XssWindow;
    delete probe.__xss;

    const out = sanitizeIcon(
      '<img src=x onerror="window.__xss=1"><script>window.__xss=2</script><svg onload="window.__xss=3"><path d="M0 0" onmouseover="window.__xss=4"/></svg>',
    )!;
    expect(out).not.toContain("<img");
    expect(out).not.toContain("<script");
    expect(out).not.toContain("onerror");
    expect(out).not.toContain("onload");
    expect(out).not.toContain("onmouseover");
    expect(out).toContain("<path");
    expect(probe.__xss).toBeUndefined();
  });

  it("elimina HTML no-SVG y elementos que referencian recursos externos", () => {
    const out = sanitizeIcon(
      '<div class="x">hola</div><svg><use href="https://evil/x.svg#p"/><foreignObject><div>x</div></foreignObject><style>*{fill:red}</style><path d="M0 0"/></svg>',
    )!;
    expect(out).not.toContain("<div");
    expect(out).not.toContain("hola");
    expect(out).not.toContain("<use");
    expect(out).not.toContain("evil");
    expect(out).not.toContain("foreignObject");
    expect(out).not.toContain("<style");
    expect(out).toContain('<path d="M0 0"');
  });
});
