// src/utils/uniqueId.ts — id único por instancia para atributos ARIA que se referencian
// entre sí (`aria-controls`, `aria-activedescendant`, `aria-labelledby`).
//
// `useId()` de Vue es único **por app**, y cada custom element monta su propia app: dos
// `<cu-select>` en la misma página recibirían el mismo id. El contador vive en el módulo
// (fuera del `setup`, que corre por instancia) y se suma al de `useId`.
import { useId } from "vue";

let sequence = 0;

/** Identificador estable mientras la instancia viva: `<prefijo>-<useId>-<n>`. */
export function useUniqueId(prefix: string): string {
  return `${prefix}-${useId()}-${++sequence}`;
}
