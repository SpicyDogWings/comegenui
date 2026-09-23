// Datos de Khadgar para el sitio (el mismo `khadgar.json` que consumen las fichas).
import type { KhadgarComponent, KhadgarIndex } from "@/plugins/khadgar/api";
import index from "#khadgar-data";

export const components = (index as KhadgarIndex).components;
export const byName = new Map<string, KhadgarComponent>(
  components.map((component) => [component.name, component]),
);
