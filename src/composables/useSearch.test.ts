import { describe, expect, test } from "vitest";
import { ref } from "vue";
import { useSearch } from "./useSearch";

describe("useSearch", () => {
  const testData = [
    { id: 1, name: "John Doe", email: "john@example.com", age: 28, role: "Developer" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", age: 32, role: "Designer" },
    { id: 3, name: "Bob Miller", email: "bob@example.com", age: 45, role: "Manager" },
    { id: 4, name: "Alice Williams", email: "alice@example.com", age: 27, role: "QA Engineer" },
    { id: 5, name: "Charlie Brown", email: "charlie@example.com", age: 31, role: "DevOps" },
  ];

  test("should return all data when search query is empty", () => {
    const searchQuery = ref("");
    const { filteredData } = useSearch(testData, { searchQuery });
    
    expect(filteredData.value.length).toBe(5);
    expect(filteredData.value).toEqual(testData);
  });

  test("should filter data based on search query (case-insensitive)", () => {
    const searchQuery = ref("john");
    const { filteredData } = useSearch(testData, { searchQuery, searchFields: ["name"] });
    
    expect(filteredData.value.length).toBe(1);
    expect(filteredData.value[0].name).toBe("John Doe");
  });

  test("should search across all fields by default", () => {
    const searchQuery = ref("example.com");
    const { filteredData } = useSearch(testData, { searchQuery });
    
    expect(filteredData.value.length).toBe(5); // All have example.com in email
  });

  test("should search only in specified fields", () => {
    const searchQuery = ref("example.com");
    const { filteredData } = useSearch(testData, { 
      searchQuery, 
      searchFields: ["name", "role"]
    });
    
    expect(filteredData.value.length).toBe(0); // example.com not in name or role
  });

  test("should find matches in specified fields", () => {
    const searchQuery = ref("Developer");
    const { filteredData } = useSearch(testData, { 
      searchQuery, 
      searchFields: ["role"]
    });
    
    expect(filteredData.value.length).toBe(1);
    expect(filteredData.value[0].role).toBe("Developer");
  });

  test("should handle case-sensitive search when enabled", () => {
    const searchQuery = ref("john");
    const { filteredData } = useSearch(testData, { 
      searchQuery, 
      caseSensitive: true,
      searchFields: ["name"]
    });
    
    expect(filteredData.value.length).toBe(0); // "john" != "John"
    
    searchQuery.value = "John";
    expect(filteredData.value.length).toBe(1); // "John" == "John"
  });

  test("should handle number fields", () => {
    const searchQuery = ref("28");
    const { filteredData } = useSearch(testData, { searchQuery });
    
    expect(filteredData.value.length).toBe(1);
    expect(filteredData.value[0].age).toBe(28);
  });

  test("should handle partial matches", () => {
    const searchQuery = ref("Smith");
    const { filteredData } = useSearch(testData, { searchQuery });
    
    expect(filteredData.value.length).toBe(1);
    expect(filteredData.value[0].name).toBe("Jane Smith");
  });

  test("should handle no matches", () => {
    const searchQuery = ref("Nonexistent");
    const { filteredData } = useSearch(testData, { searchQuery });
    
    expect(filteredData.value.length).toBe(0);
  });

  test("should handle whitespace in search query", () => {
    const searchQuery = ref("  John  ");
    const { filteredData } = useSearch(testData, { searchQuery, searchFields: ["name"] });
    
    expect(filteredData.value.length).toBe(1);
    expect(filteredData.value[0].name).toBe("John Doe");
  });

  test("should handle empty search fields array", () => {
    const searchQuery = ref("Developer");
    const { filteredData } = useSearch(testData, { 
      searchQuery, 
      searchFields: []
    });
    
    // Should search all fields
    expect(filteredData.value.length).toBe(1);
  });

  test("should treat ñ as distinct from n", () => {
    const dataWithÑ = [
      { id: 1, name: "Señor Lopez", role: "Manager" },
      { id: 2, name: "Nose Smith", role: "Developer" },
      { id: 3, name: "Año Nuevo", role: "Designer" },
    ];

    // ñ matches only names with ñ (Señor Lopez and Año Nuevo)
    const searchQuery = ref("ñ");
    const { filteredData } = useSearch(dataWithÑ, { searchQuery, searchFields: ["name"] });
    expect(filteredData.value.length).toBe(2);
    expect(filteredData.value.map(d => d.name)).toContain("Señor Lopez");
    expect(filteredData.value.map(d => d.name)).toContain("Año Nuevo");

    // n matches only names with n but no ñ (Nose Smith)
    searchQuery.value = "nose";
    expect(filteredData.value.length).toBe(1);
    expect(filteredData.value[0].name).toBe("Nose Smith");

    // año matches only Año Nuevo
    searchQuery.value = "año";
    expect(filteredData.value.length).toBe(1);
    expect(filteredData.value[0].name).toBe("Año Nuevo");

    // ano does NOT match año (ñ is distinct from n)
    searchQuery.value = "ano";
    expect(filteredData.value.length).toBe(0);
  });

  test("should handle data with null values", () => {
    const dataWithNull = [
      { id: 1, name: "John Doe", email: null },
      { id: 2, name: null, email: "jane@example.com" },
    ];
    const searchQuery = ref("John");
    const { filteredData } = useSearch(dataWithNull, { searchQuery });
    
    expect(filteredData.value.length).toBe(1);
    expect(filteredData.value[0].name).toBe("John Doe");
  });
});