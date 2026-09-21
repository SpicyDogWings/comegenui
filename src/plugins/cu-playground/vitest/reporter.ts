import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { Reporter, TestCase, TestModule } from "vitest/node";

type Status = "passed" | "failed" | "skipped" | "pending";

interface StoryMeta {
  component?: string;
  section?: string;
  variant?: string;
  layer?: string;
}

interface CheckResult {
  layer: string;
  name: string;
  status: Status;
  error?: string;
}

interface VariantResult {
  status: Status;
  checks: CheckResult[];
}

interface SectionResult {
  status: Status;
  variants: Record<string, VariantResult>;
}

const OUTPUT = resolve(process.cwd(), "public/test-results.json");

function errorOf(test: TestCase): string | undefined {
  const result = test.result();
  if (result.state !== "failed" || !result.errors?.length) return undefined;
  return result.errors.map((e) => e.message || String(e)).join("\n");
}

/**
 * Escribe `public/test-results.json` con el resultado de los tests de stories,
 * indexado por componente → sección → variante. El playground lo consume para
 * pintar los badges ✅/❌ (no corre tests).
 */
export default class PlaygroundReporter implements Reporter {
  onTestRunEnd(testModules: ReadonlyArray<TestModule>): void {
    const components: Record<string, { tag: string; sections: Record<string, SectionResult> }> = {};
    let pass = 0;
    let fail = 0;

    for (const mod of testModules) {
      for (const test of mod.children.allTests()) {
        const meta = test.meta() as StoryMeta;
        if (!meta?.component || !meta.section || !meta.variant) continue;

        const status = test.result().state as Status;
        const component = (components[meta.component] ??= { tag: meta.component, sections: {} });
        const section = (component.sections[meta.section] ??= { status: "passed", variants: {} });
        const variant = (section.variants[meta.variant] ??= { status: "passed", checks: [] });

        variant.checks.push({
          layer: meta.layer ?? "l1",
          name: test.name,
          status,
          error: errorOf(test),
        });

        if (status === "failed") {
          variant.status = "failed";
          section.status = "failed";
          fail++;
        } else {
          pass++;
        }
      }
    }

    const payload = {
      generatedAt: new Date().toISOString(),
      totals: { pass, fail },
      components,
    };

    mkdirSync(dirname(OUTPUT), { recursive: true });
    writeFileSync(OUTPUT, JSON.stringify(payload, null, 2));
  }
}
