export type SearchMode = "includes" | "startsWith";

export interface NormalizeOptions {
  caseSensitive?: boolean;
}

export interface MatchOptions {
  mode?: SearchMode;
  trim?: boolean;
  caseSensitive?: boolean;
}

export interface FieldsMatchOptions extends MatchOptions {
  fields?: string[];
  excludeKeys?: string[];
  getValue?: (item: Record<string, unknown>, key: string) => unknown;
}

const ACCENT_RE = /[\u0300-\u0302\u0304-\u036f]/g;

export function normalizeText(s: string, caseSensitive = false) {
  const normalized = s.normalize("NFD").replace(ACCENT_RE, "");
  return caseSensitive ? normalized : normalized.toLowerCase();
}

export function matchesQuery(text: unknown, q: string, opts: MatchOptions = {}) {
  const { mode = "includes", trim = false, caseSensitive = false } = opts;
  if (text == null) return false;
  const query = trim ? q.trim() : q;
  if (!query) return false;
  const value = normalizeText(String(text), caseSensitive);
  const needle = normalizeText(query, caseSensitive);
  return mode === "startsWith" ? value.startsWith(needle) : value.includes(needle);
}

export function matchesFields(item: Record<string, unknown>, q: string, opts: FieldsMatchOptions = {}) {
  const { fields, excludeKeys = [], getValue, ...match } = opts;
  if (typeof item !== "object" || item === null) return false;
  const keys = fields?.length
    ? fields
    : Object.keys(item).filter((k) => !excludeKeys.includes(k));
  return keys.some((key) =>
    matchesQuery(getValue ? getValue(item, key) : item[key], q, match),
  );
}
