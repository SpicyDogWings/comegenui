import { ref } from "vue";

export type TestStatus = "passed" | "failed" | "skipped" | "pending";

export interface TestCheckResult {
  layer: string;
  name: string;
  status: TestStatus;
  error?: string;
}

export interface TestVariantResult {
  status: TestStatus;
  checks: TestCheckResult[];
}

export interface TestSectionResult {
  status: TestStatus;
  variants: Record<string, TestVariantResult>;
}

export interface TestResults {
  generatedAt: string;
  totals: { pass: number; fail: number };
  components: Record<string, { tag: string; sections: Record<string, TestSectionResult> }>;
}

const results = ref<TestResults | null>(null);
const loaded = ref(false);
const available = ref(false);
let started = false;

async function load(): Promise<void> {
  if (started) return;
  started = true;
  try {
    const response = await fetch("/test-results.json", { cache: "no-store" });
    if (response.ok) {
      results.value = (await response.json()) as TestResults;
      available.value = true;
    }
  } catch {
    // Sin resultados: el playground sigue funcionando (badge "sin correr").
  } finally {
    loaded.value = true;
  }
}

/** Lee `public/test-results.json`, generado por el reporter de vitest. */
export function useTestResults() {
  void load();
  return { results, loaded, available };
}