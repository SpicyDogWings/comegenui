# Nota 01 — `build-libs.ts` no excluye carpetas

**Fecha:** 2026-06-18
**Severidad:** Media
**Estado:** Pendiente

## Problema

El script `build-libs.ts` (en la raíz del proyecto) compila a UMD **todos** los `.ts` que encuentre bajo `src/components/`, sin filtrar:

```ts
// build-libs.ts (extracto)
const files = fg.sync("./src/components/**/*.ts");
```

Esto causa que se distribuyan dos archivos no deseados:

### 1. `cu-select-native` desde `archived/`

`src/components/archived/SelectNative.ts` registra el tag `cu-select-native`. La carpeta `archived/` sugiere que **no debería buildearse**, pero el glob no respeta la convención.

- **Archivo generado:** `dist/CuSelectNative.umd.js`
- **Tag:** `cu-select-native`
- **Conflicto:** ninguno (tag distinto a `cu-select`), pero se está distribuyendo algo marcado como archivado.

### 2. `data/index.ts` como artifact

`src/components/data/index.ts` es un barrel de re-exports de componentes Vue internos (`AdvancedTable`, `EditableTableCell`). **No es un Custom Element**, pero el script lo procesa como si lo fuera.

- **Archivo generado:** `dist/Cuindex.umd.js` (notar la mayúscula rara: `Cu` + `index`)
- **Tag:** ninguno (no llama a `customElements.define`), pero igual genera un bundle.
- **Riesgo:** si alguien lo importa, no hace nada útil y ocupa espacio.

## Archivos `.ts` que se compilan actualmente

| Archivo `.ts` | Tag | ¿Debería compilarse? |
|---|---|---|
| `components/Alert.ts` | `cu-alert` | Sí |
| `components/Badge.ts` | `cu-badge` | Sí |
| `components/Button.ts` | `cu-button` | Sí |
| `components/DropdownMenu.ts` | `cu-dropdown-menu` | Sí |
| `components/Modal.ts` | `cu-modal` | Sí |
| `components/Pagination.ts` | `cu-pagination` | Sí |
| `components/form/Autocomplete.ts` | `cu-autocomplete` | Sí |
| `components/form/Checkbox.ts` | `cu-checkbox` | Sí |
| `components/form/Input.ts` | `cu-input` | Sí |
| `components/form/Label.ts` | `cu-label` | Sí |
| `components/form/Switch.ts` | `cu-switch` | Sí |
| `components/form/Textarea.ts` | `cu-textarea` | Sí |
| `components/data/Table.ts` | `cu-table` | Sí |
| `components/labs/Select.ts` | `cu-select` | Sí (registrado, llamado "labs" por organización, no por estado) |
| `components/data/index.ts` | — | **No** |
| `components/archived/SelectNative.ts` | `cu-select-native` | **No** |

## Solución sugerida

Editar `build-libs.ts` para excluir las carpetas no deseadas. Dos opciones:

### Opción A — Ignorar por patrón

```ts
const files = fg.sync("./src/components/**/*.ts", {
  ignore: [
    "./src/components/archived/**",
    "./src/components/**/index.ts",
  ],
});
```

### Opción B — Solo Custom Elements explícitos

Hacer que cada `.ts` exporte un flag `isCustomElement` o un array de CE definidos, y filtrar:

```ts
const files = fg.sync("./src/components/**/*.ts", {
  ignore: ["./src/components/archived/**", "./src/components/**/index.ts"],
});
```

(Preferir Opción A por simplicidad.)

## Verificación

Después del fix, `dist/` debería contener exactamente 14 UMD (uno por componente oficial) y ningún `Cuindex.umd.js` ni `CuSelectNative.umd.js`.

## Impacto en la documentación

- Si se elimina `cu-select-native` de la build, la línea en `SKILL.md` que dice "No hay un tag `cu-select-native` documentado como oficial" se vuelve trivialmente cierta. No requiere cambios.
- Si se elimina el artifact `Cuindex.umd.js`, ningún cambio.
