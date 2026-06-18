# Nota 03 — Interface `Column` de `<cu-table>` no incluye los campos extendidos

**Fecha:** 2026-06-18
**Severidad:** Info (no es bug, es discrepancia entre tipado y runtime)
**Estado:** Documentado en `componentes/cu-table.md`, sin acción pendiente

## Problema

La prop `columns` del `<cu-table>` está tipada en `src/components/data/Table.ce.vue` con una interface `Column` **mínima**:

```ts
interface Column {
  key: string;
  label?: string;
  cell?: (row) => string | string[];
  editable?: boolean | RegExp | ((row) => boolean);
  inputType?: "input" | "textarea" | "select";
  selectOptions?: { value: string; label: string }[] | ((row) => { value: string; label: string }[]);
  validator?: (value, row) => boolean;
  singleClick?: boolean;
  badges?: (row) => BadgeConfig[];
  buttons?: (row) => ButtonConfig[];
}
```

Sin embargo, `Table.ce.vue` pasa `columns` **tal cual** al `AdvancedTable.vue` interno, que sí acepta campos adicionales:

```ts
// AdvancedTable.vue (extracto de su interface Column)
interface Column {
  // ... los mismos del .ce.vue, más:
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean | "string" | "number" | "boolean";
}
```

## Consecuencia

Un usuario que pase `width`, `align` o `sortable` en una columna:

- ✅ **Funciona en runtime** (porque `AdvancedTable.vue` los lee).
- ❌ **Genera error de TypeScript** si usa la skill desde un proyecto con bundler y types.

## Cómo se documenta actualmente

En `componentes/cu-table.md`, los campos `width`, `align` y `sortable` están listados en una sección separada "Campos extendidos (forwarded)" con la advertencia explícita:

> **No están tipados en el `.ce.vue`** pero funcionan porque se reenvían al `AdvancedTable.vue` interno.

## Posibles mejoras (no urgentes)

### A. Ampliar la interface en el `.ce.vue`

```ts
// Table.ce.vue
interface Column {
  key: string;
  label?: string;
  cell?: (row) => string | string[];
  editable?: boolean | RegExp | ((row) => boolean);
  inputType?: "input" | "textarea" | "select";
  selectOptions?: ...;
  validator?: (value, row) => boolean;
  singleClick?: boolean;
  badges?: (row) => BadgeConfig[];
  buttons?: (row) => ButtonConfig[];

  // Campos extendidos (forwarded a AdvancedTable.vue):
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean | "string" | "number" | "boolean";
}
```

Costo: bajo. Beneficio: tipado correcto en proyectos TS que consuman el bundle.

### B. Usar `// @ts-ignore` en el binding

```html
<Table
  :columns="props.columns as any"
  ...
/>
```

Mala idea: pierde toda la información de tipos en cascada.

### C. Re-exportar la interface desde el `.ce.vue`

```ts
export type Column = {
  // ... completa
};
```

Útil si el componente se importa desde un proyecto con bundler, pero no afecta a la build UMD.

## Recomendación

Si en algún momento se decide generar tipos `.d.ts` para la distribución UMD, **aplicar Opción A** al mismo tiempo.
