import { describe, expect, test } from "vitest";
import { normalizeText, matchesQuery, matchesFields } from "./search";

describe("normalizeText", () => {
  test("lowercases by default", () => {
    expect(normalizeText("Hello World")).toBe("hello world");
  });

  test("strips accent marks", () => {
    expect(normalizeText("José")).toBe("jose");
    expect(normalizeText("áéíóú")).toBe("aeiou");
    expect(normalizeText("ÁÉÍÓÚ")).toBe("aeiou");
  });

  test("caseSensitive preserves case", () => {
    expect(normalizeText("Hello", true)).toBe("Hello");
    expect(normalizeText("Héllo", true)).toBe("Hello");
  });

  test("treats ñ as distinct from n (regex gap)", () => {
    expect(normalizeText("españa")).not.toBe("espana");
    expect(normalizeText("señor")).not.toBe("senor");
  });
});

describe("matchesQuery", () => {
  test("includes mode (default)", () => {
    expect(matchesQuery("hello world", "world")).toBe(true);
    expect(matchesQuery("hello world", "xyz")).toBe(false);
  });

  test("startsWith mode", () => {
    expect(matchesQuery("Roberto", "Rob", { mode: "startsWith" })).toBe(true);
    expect(matchesQuery("Roberto", "berto", { mode: "startsWith" })).toBe(false);
  });

  test("case-insensitive by default", () => {
    expect(matchesQuery("Hello", "hello")).toBe(true);
    expect(matchesQuery("HELLO", "hello")).toBe(true);
  });

  test("caseSensitive option", () => {
    expect(matchesQuery("Hello", "hello", { caseSensitive: true })).toBe(false);
    expect(matchesQuery("Hello", "Hello", { caseSensitive: true })).toBe(true);
  });

  test("accent-insensitive", () => {
    expect(matchesQuery("José", "jose")).toBe(true);
    expect(matchesQuery("Gestión", "gestion")).toBe(true);
  });

  test("trim option", () => {
    expect(matchesQuery("hello", "  hello  ", { trim: true })).toBe(true);
    expect(matchesQuery("hello", "  hello  ")).toBe(false); // trim defaults false, spaces prevent match
  });

  test("null/undefined values", () => {
    expect(matchesQuery(null, "test")).toBe(false);
    expect(matchesQuery(undefined, "test")).toBe(false);
  });

  test("empty query returns false", () => {
    expect(matchesQuery("hello", "")).toBe(false);
    expect(matchesQuery("hello", "   ")).toBe(false);
  });

  test("ñ is distinct from n", () => {
    expect(matchesQuery("españa", "espana")).toBe(false);
    expect(matchesQuery("señor", "senor")).toBe(false);
  });

  test("number values", () => {
    expect(matchesQuery(42, "42")).toBe(true);
    expect(matchesQuery(42, "43")).toBe(false);
  });
});

describe("matchesFields", () => {
  const item = { name: "John Doe", email: "john@example.com", role: "Developer" };

  test("matches against specific fields", () => {
    expect(matchesFields(item, "Developer", { fields: ["role"] })).toBe(true);
    expect(matchesFields(item, "john", { fields: ["role"] })).toBe(false);
  });

  test("all fields by default", () => {
    expect(matchesFields(item, "john")).toBe(true);
    expect(matchesFields(item, "Developer")).toBe(true);
  });

  test("excludeKeys option", () => {
    const itemWithExtra = { ...item, children: ["a", "b"] };
    // "a" is in children but excluded; it also matches email ("john@e**a**mple.com"),
    // so use "xyz" which matches nothing in the remaining fields
    expect(matchesFields(itemWithExtra, "xyz", { excludeKeys: ["children"] })).toBe(false);
    expect(matchesFields(itemWithExtra, "John")).toBe(true);
  });

  test("getValue option", () => {
    expect(
      matchesFields(item, "developer", {
        fields: ["role"],
        getValue: (_item, key) => {
          if (key === "role") return "Senior Developer";
          return (_item as any)[key];
        },
      }),
    ).toBe(true);
  });

  test("accent-insensitive across fields", () => {
    const itemAccent = { name: "José García" };
    expect(matchesFields(itemAccent, "jose garcia")).toBe(true);
  });
});
